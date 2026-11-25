// MIKROSERVIS 2: COURSES
// Lokalno na port 5002, na Vercel posebna serverless funkcija

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connect } = require("../db");
const Course = require("../models/Course");

const app = express();

// Dozvoluvame pristap samo od nasite frontend-i
const allowedOrigins = ["http://localhost:5173"];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({ origin: allowedOrigins }));

// Ni ovozmozuva da citame JSON od req.body
app.use(express.json());

// GET /courses - gi vrakja site kursevi od bazata
app.get("/courses", async (req, res) => {
    try {
        await connect();

        const courses = await Course.find();
        return res.json(courses);

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});

// POST /courses - dodava nov kurs vo bazata
app.post("/courses", async (req, res) => {
    try {
        await connect();

        const course = await Course.create({
            name: req.body.name
        });

        return res.status(201).json(course);

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});

// Na Vercel ne ni treba app.listen
if (!process.env.VERCEL) {
    const PORT = 5002;

    app.listen(PORT, () => {
        console.log(`Courses service is running at http://localhost:${PORT}`);
    });
}

module.exports = app;