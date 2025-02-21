import express, { Application } from "express";
import cors from "cors";
import mongoose from "mongoose";

const app: Application = express();

app.use(cors());
app.use(express.json());

const PORT = 8080;

// ✅ Properly closing the `app.listen` function
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
