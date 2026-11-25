// MIKROSERVIS 1: STUDENTI
// Lokalno na port 5001, na Vercel posebna serverless funkcija

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connect } = require("../db");
const Student = require("../models/Student");

const app = express();

// Dozvoluvame pristap samo od nasite frontend-i
const allowedOrigins = ["http://localhost:5173"];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({ origin: allowedOrigins }));

// Ni ovozmozuva da citame JSON od req.body
app.use(express.json());

// GET /students - gi vrakja site studenti od bazata
app.get("/students", async (req, res) => {
    try {
        await connect();

        const students = await Student.find();
        return res.json(students);

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});

// POST /students - dodava nov student vo bazata
app.post("/students", async (req, res) => {
    try {
        await connect();

        const student = await Student.create({
            name: req.body.name
        });

        return res.status(201).json(student);

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});

// Na Vercel ne ni treba app.listen
if (!process.env.VERCEL) {
    const PORT = 5001;

    app.listen(PORT, () => {
        console.log(`Students service is running at http://localhost:${PORT}`);
    });
}

module.exports = app;