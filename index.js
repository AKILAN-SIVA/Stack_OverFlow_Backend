import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js"
import questionRoutes from "./routes/Questions.js";
import answerRoutes from './routes/Answers.js';

const app = express();
app.use(express.json({ limit: "30mb", extebded: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
dotenv.config();

app.get("/", (req, res) => {
    res.send("This is a StackOverflow Clone API");
});

app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use('/answer', answerRoutes);

const PORT = process.env.PORT || 5000

const Database_URL = process.env.CONNECTION_URL;

mongoose.connect(Database_URL, { useNewURLParser: true, useUnifiedTopology: true })
    .then(() =>
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    )
    .catch((err) => {
        console.log(err.message);
    });

