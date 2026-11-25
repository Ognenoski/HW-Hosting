const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const STUDENTS_URL = "http://localhost:5001";
const COURSES_URL = "http://localhost:5002";

const forwardTo = (serviceUrl) => async (req, res) => {
    console.log(
        `Proxy: ${req.method} ${req.originalUrl} -> ${serviceUrl}${req.originalUrl}`
    );

    try {
        const response = await fetch(
            `${serviceUrl}${req.originalUrl}`,
            {
                method: req.method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: ["GET", "HEAD"].includes(req.method)
                    ? undefined
                    : JSON.stringify(req.body),
            }
        );

        const data = await response.text();

        res.status(response.status);

        const contentType = response.headers.get("content-type");

        if (contentType) {
            res.set("Content-Type", contentType);
        }

        return res.send(data);

    } catch (err) {
        return res.status(502).json({
            message: `Servisot ${serviceUrl} ne e dostapen!`
        });
    }
};

app.use("/students", forwardTo(STUDENTS_URL));
app.use("/courses", forwardTo(COURSES_URL));

const PORT = 5005;

app.listen(PORT, () => {
    console.log(`Proxy is running on port ${PORT}`);
});