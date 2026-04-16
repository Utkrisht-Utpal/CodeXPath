const express = require("express");
const cors = require("cors");
const { analyzeRepository } = require("./services/analyzer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allows all origins. For strict security, specify `origin: "https://yourfrontend.vercel.app"`
app.use(express.json());

app.post("/analyze", async (req, res) => {
    const { repoUrl } = req.body;
    if (typeof repoUrl !== "string" || !repoUrl.trim()) {
        return res.status(400).json({ error: "repoUrl is required" });
    }

    try {
        const result = await analyzeRepository(repoUrl);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            error: "Failed to analyze repository",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});