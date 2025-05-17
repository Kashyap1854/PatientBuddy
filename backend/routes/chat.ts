import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ reply: "No message provided." });
      return;
    }

    const sarvamApiKey = process.env.SARVAM_API_KEY;
    const sarvamApiUrl = "https://api.sarvam.ai/v1/completions";

    interface SarvamApiResponse {
      choices?: {
        message?: {
          content?: string;
        };
      }[];
    }

    const sarvamRes = await axios.post<SarvamApiResponse>(
      sarvamApiUrl,
      {
        model: "sarvam-llama-2-7b-chat-hf", // <-- updated model name
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sarvamApiKey}`,
        },
      }
    );

    const reply =
      sarvamRes.data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't process your request.";

    res.json({ reply });
  } catch (err: any) {
    console.error("Sarvam API error:", err?.response?.data || err);
    res.status(500).json({ reply: "Sorry, I couldn't process your request." });
  }
});

export default router;