import express from "express";
import cors, { CorsOptions } from "cors";
import { errorMiddleware } from "@/middlewares/error.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { connectDB } from "./db/init.js";
import { authRoutes } from "./routes/auth.js";
import { discussionRoutes } from "./routes/discussion.js";

dotenv.config({ path: "./.env" });
export const envMode = process.env.NODE_ENV?.trim() || "development";
const port = process.env.PORT || 4000;

// App init
const app = express();

///Db connection
const mongoURI = (process.env.DB_URI as string) || "mongodb://localhost:27017";
connectDB(mongoURI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
export const allowedOrigins: string[] =
  process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) || [];
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS!"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Ip rate limit
const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, /// 10 min.
  max: 100,
  message: "Limit exceeded!",
});
app.use(rateLimiter);

// Routes ---
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/discussions", discussionRoutes);
// ---

// All other routes
app.all("/{*any}", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Not found!",
  });
});

// Global error middleware
app.use(errorMiddleware);

app.listen(port, () =>
  console.log("Server is working on Port:" + port + " in " + envMode + " Mode.")
);
