import "dotenv/config";

import app from "./app.js";
import connectDB from "./database/connectDB.js";

const PORT = Number(process.env.PORT) || 5000;

await connectDB();

app.listen(PORT, () => {
  console.log(`CogniMart API listening on port ${PORT}`);
});
