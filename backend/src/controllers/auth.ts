import { User } from "@/models/user.js";
import { AuthJwtPayload, IUser } from "@/types/user";
import { TryCatch } from "@/utils/asyncHandler.js";
import ErrorHandler from "@/utils/errorHandler.js";
import jwt from "jsonwebtoken";

// Constants
const ACCESS_TOKEN_EXPIRY = 60 * 15; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 * 7; // 7 days

export const registerUser = TryCatch<IUser>(async (req, res, next) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return next(
      new ErrorHandler(
        400,
        "Username already exists. Please try again with different one."
      )
    );
  }

  const user = new User({ username, password });
  await user.save();

  const accessToken = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET!,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET!,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: REFRESH_TOKEN_EXPIRY * 1000,
  });

  return res.json({
    success: true,
    message: "User registered successfully",
    data: {
      id: user.id,
      username: user.username,
      accessToken,
    },
  });
});

// Login user
export const loginUser = TryCatch<IUser>(async (req, res, next) => {
  const { username, password } = req.body;

  // Find user
  const user = await User.findOne({ username });
  if (!user) {
    return next(new ErrorHandler(401, "Invalid credentials"));
  }

  // Validate password using comparePassword method
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorHandler(400, "Invalid credentials"));
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET!,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET!,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: REFRESH_TOKEN_EXPIRY * 1000,
  });

  return res.json({
    success: true,
    message: "Login successful",
    data: {
      id: user.id,
      username: user.username,
      accessToken,
    },
  });
});

// Refresh access token
export const refreshToken = TryCatch<{}, {}, {}, { refresh_token: string }>(
  async (req, res, next) => {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return next(new ErrorHandler(401, "Unauthorized!"));
    }

    let payload;
    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET!
      ) as AuthJwtPayload;
    } catch (err) {
      return next(new ErrorHandler(403, "Forbidden"));
    }

    if (!payload || !payload.userId) {
      return next(new ErrorHandler(401, "Unauthorized!"));
    }

    // Find user
    const user = await User.findById(payload?.userId);
    if (!user) {
      return next(new ErrorHandler(401, "Unauthorized!"));
    }

    const newAccessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    return res.json({
      success: true,
      message: "Access token refreshed successfully",
      data: {
        id: user.id,
        username: user.username,
        accessToken: newAccessToken,
      },
    });
  }
);

export const logoutUser = TryCatch(async (req, res) => {
  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.json({
    success: true,
    message: "Logout successful",
    data: null,
  });
});
