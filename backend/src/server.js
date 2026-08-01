import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./database/connectDB.js";

dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
const PORT = process.env.PORT;

await connectDB();

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
