import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/auth.routes.js";
import "./config/passport.js";
 
dotenv.config();
 
const app = express();
 
// Middleware
app.use(helmet());
app.use(cors({
  origin: "http://localhost:3000", // allow frontend
  credentials: true,
}));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
 
// Routes
app.use("/auth", authRoutes);
 
export default app;