import User from "../models/UserModel.js";
import Token from "../models/TokenModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { createTokenUser, attachCookiesToResponse } from "../utils/index.js";
import config from "../config.json" assert { type: "json" };

// Função para gerar um novo JWT
const generateAccessToken = (user) => {
  return jwt.sign(user, config.jwtSecretKey, {
    expiresIn: config.JWT_LIFETIME,
  });
};

// Função para gerar um novo refresh token
const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new Error("Email já cadastrado");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  const responseData = {
    id: user._id,
    user: user.name,
    email: user.email,
    token: verificationToken,
  };

  res.status(201).send(responseData);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);
  const refreshToken = generateRefreshToken(); // Gerar um novo refresh token

  // Atualiza ou cria o token de refresh no banco de dados
  await Token.findOneAndUpdate(
    { user: user._id },
    { refreshToken, ip: req.ip, userAgent: req.headers["user-agent"] },
    { upsert: true, new: true }
  );

  // Anexa os tokens na resposta
  attachCookiesToResponse(res, tokenUser, refreshToken);
  res.status(200).json({ user: tokenUser });
};


export { register, login };
