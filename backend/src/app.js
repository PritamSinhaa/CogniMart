import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "CogniMart API is running",
  });
});


export default app;
