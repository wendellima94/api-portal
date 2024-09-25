import { isTokenValid, attachCookiesToResponse } from "../utils/index.js";
// import { attachCookiesToResponse } from "../utils";
import config from "../config.json" assert { type: "json" };
import jwt from "jsonwebtoken";
import Token from "../models/TokenModel.js";
import User from "../models/UserModel.js";

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);

      // Verificar se o usuário ainda existe
      const user = await User.findById(payload.user.userId);
      if (!user) {
        throw new Error("Authentication Invalid");
      }

      req.user = payload.user;
      return next();
    }

    if (refreshToken) {
      const payload = isTokenValid(refreshToken);

      const existingToken = await Token.findOne({
        user: payload.user.userId,
        refreshToken: payload.refreshToken,
      });

      if (!existingToken || !existingToken.isValid) {
        throw new Error("Authentication Invalid");
      }

      // Verificar se o usuário ainda existe
      const user = await User.findById(payload.user.userId);
      if (!user) {
        throw new Error("Authentication Invalid");
      }

      const newAccessToken = jwt.sign(
        { user: payload.user },
        config.jwtSecretKey,
        { expiresIn: config.jwtLifetime }
      );

      attachCookiesToResponse({
        res,
        user: payload.user,
        refreshToken: existingToken.refreshToken,
        accessToken: newAccessToken,
      });

      req.user = payload.user;
      return next();
    }

    throw new Error("Authentication Invalid");
  } catch (error) {
    throw new Error("Authentication Invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new Error("Unauthorized to access this route");
    }
    next();
  };
};

export { authenticateUser, authorizePermissions };
