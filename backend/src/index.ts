import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/authRoutes";
import formRoutes from "./routes/formRoutes";
import submissionRoutes from "./routes/submissionRoutes";

dotenv.config();

const app = express();

const corsOptions = {
  origin: `${process.env.FRONTEND_ORIGIN}`, // <--- SPECIFIC origin
  credentials: true,               // <--- Crucial for 'withCredentials: true' requests
  optionsSuccessStatus: 200        // Some legacy browsers
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/submissions",submissionRoutes);

app.get("/", (_, res) => res.send("TurbotechAssist API running ✅"));

mongoose.connect(process.env.MONGODB_URI || "")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB error:", err));

app.listen(process.env.PORT || 4000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 4000}`)
);
