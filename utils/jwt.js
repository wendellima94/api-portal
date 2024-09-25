import jwt from "jsonwebtoken";
import config from "../config.json" assert { type: "json" };

// Função para criar um JWT
const createJwt = ({ payload }) => {
  const token = jwt.sign(payload, config.jwtSecretKey, {
    expiresIn: config.JWT_LIFETIME, // Adicionando tempo de expiração diretamente
  });
  return token;
};

// Função para verificar se o JWT é válido
const isTokenValid = (token) => jwt.verify(token, config.jwtSecretKey);

// Função para anexar os cookies de tokens na resposta
const attachCookiesToResponse = (res, user, refreshToken) => {
  const oneDay = 1000 * 60 * 60 * 24;

  // Criando o refresh token JWT
  const refreshTokenJWT = jwt.sign(
    { user, refreshToken },
    config.jwtSecretKey,
    {
      expiresIn: config.JWT_REFRESH_LIFETIME,
    }
  );

  // Criando o access token JWT
  const accessTokenJWT = jwt.sign({ user }, config.jwtSecretKey, {
    expiresIn: config.JWT_LIFETIME,
  });

  // Adicionando o cookie de access token
  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay), // Expira em um dia
  });

  // Adicionando o cookie de refresh token
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay * 30), // Expira em 30 dias
  });
};

export { createJwt, isTokenValid, attachCookiesToResponse };
