import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

// Manual .env parser since dotenv might not be installed
const parseEnv = () => {
    try {
        const envContent = fs.readFileSync('.env.local', 'utf-8');
        const env = {};
        envContent.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) env[key.trim()] = value.trim();
        });
        return env;
    } catch (e) {
        return {};
    }
};

const run = async () => {
    const env = parseEnv();
    const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("NO API KEY FOUND!");
        process.exit(1);
    }

    console.log("API Key found (length):", apiKey.length);

    const client = new GoogleGenAI({ apiKey });

    // Path to the user's uploaded image (UPDATED with actual path)
    const imagePath = "C:/Users/Administrator/.gemini/antigravity/brain/76b81118-721d-4b71-bf37-05263a85bb50/uploaded_image_1767801129531.jpg";

    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');

        console.log("Image read successfully. Sending to Gemini...");

        const response = await client.models.generateContent({
            model: 'gemini-2.0-flash-lite-preview-02-05',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: "Describe this image in one sentence." },
                        { inlineData: { mimeType: "image/jpeg", data: base64Image } }
                    ]
                }
            ]
        });

        console.log("Response received:");
        console.log(response.text);
    } catch (error) {
        console.error("API Call Failed:");
        console.error(error.message);
        if (error.response) {
            console.error("Response:", JSON.stringify(error.response, null, 2));
        }
    }
};

run();
