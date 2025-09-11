import { IUserDoc, User } from "@/models/user.js";
import { AuthJwtPayload } from "@/types/user";
import { TryCatch } from "@/utils/asyncHandler.js";
import ErrorHandler from "@/utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const verifyAuth = TryCatch(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // header has Bearer token
  if (typeof authHeader === "string" && authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      async (err, decoded) => {
        if (err) return next(new ErrorHandler(403, "Forbidden"));

        const { userId } = decoded as AuthJwtPayload;

        // verify if user exists
        const user = await User.findById(userId);

        if (!user) {
          return next(new ErrorHandler(404, "User not found!"));
        }

        req.user = user;
        next();
      }
    );
  } else {
    return next(new ErrorHandler(403, "Unauthorized. Bearer token required."));
  }
});
