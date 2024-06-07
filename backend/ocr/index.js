const functions = require("@google-cloud/functions-framework");
const Tesseract = require("tesseract.js");
const cheerio = require("cheerio");
const dotenv = require("dotenv");
const fs = require("fs");
const { jsonrepair } = require("jsonrepair");

dotenv.config();

// Define constants for the different OCR formats
const OCR_FORMATS = {
    TEXT: "text",
    HOCR: "hocr",
    WORDS: "words",
    CHATGPT: "chatgpt",
    GOOGLEAI: "googleai",
};

functions.http("ocr", async (req, res) => {
    try {
        const base64Image = req.body.image;
        if (!base64Image) {
            return res.status(400).send("No image provided");
        }

        const ocrLanguage = req.query.lang || "eng";
        const ocrFormat = req.query.format || OCR_FORMATS.HOCR;

        // const imageBuffer = Buffer.from(base64Image, "base64");
        // const base64Data = base64Image.replace(/^data:image\/jpeg;base64,/, "");
        // fs.writeFileSync("out.png", base64Data, "base64", function (err) {
        //     console.log(err);
        // });

        const result = await Tesseract.recognize(base64Image, ocrLanguage);

        switch (ocrFormat) {
            case OCR_FORMATS.TEXT:
                return res.status(200).send(result.data.text);
            case OCR_FORMATS.HOCR:
                return res.status(200).send(result.data.hocr);
            case OCR_FORMATS.WORDS:
                const doc = cheerio.load(result.data.hocr);
                const rows = [];
                doc(".ocr_line").each((i, line) => {
                    const lineWords = [];
                    doc(line)
                        .find(".ocrx_word")
                        .each((j, word) => {
                            lineWords.push(doc(word).text());
                        });
                    rows.push(lineWords);
                });

                return res.status(200).send(rows);
            //case OCR_FORMATS.CHATGPT:
            //    const $ = cheerio.load(result.data.hocr);
            //    const words = [];
            //    $(".ocr_line").each((i, line) => {
            //        const lineWords = [];
            //        $(line)
            //            .find(".ocrx_word")
            //            .each((j, word) => {
            //                lineWords.push($(word).text());
            //            });
            //        words.push(lineWords);
            //    });
            //    // process the words to get the final result
            //    // convert to string and send to chatgpt
            //    const text = words.flat().join(" ");
            //    console.log(text);
            //    const response = await chatgptPostProcess(text);
            //    console.log(response);
            //    // parse the response to JSON
            //    const json = JSON.parse(response);
            //    return res.status(200).json(json);

            case OCR_FORMATS.GOOGLEAI:
                const $ = cheerio.load(result.data.hocr);
                const words = [];
                $(".ocr_line").each((i, line) => {
                    const lineWords = [];
                    $(line)
                        .find(".ocrx_word")
                        .each((j, word) => {
                            lineWords.push($(word).text());
                        });
                    words.push(lineWords);
                });
                // process the words to get the final result
                // convert to string and send to googleAI
                const text = words.flat().join(" ");
                // console.log(text);
                const response = await googleAiProcessor(text);
                return res.status(200).json(response);

            default:
                return res.status(400).send("Invalid format");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error processing image");
    }
});

const chatgptPostProcess = async (text) => {
    const prompt = `Infer the correct items and prices from this groceries bill OCR generated text that have been transformed to be a 2D array of words,. Provide the result in JSON of this format: 
	{result: [{item, price}]}
	
	Provide only the final result.`;

    const OpenAI = require("openai");
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [
            { role: "system", content: "You are a friendly assistant." },
            { role: "user", content: text },
            { role: "assistant", content: prompt },
        ],
        response_format: { type: "json_object" },
    });

    return completion.choices[0].message.content;
};

const googleAiProcessor = async (text) => {
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    const MODEL_NAME = "gemini-1.0-pro-001";
    const API_KEY = process.env.GOOGLE_AI_API_KEY;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const parts = [
        {
            text: 'Infer the correct items and prices from this groceries bill OCR generated text that have been transformed to be a 2D array of words,. Provide the result in JSON of this format: { "result": [{item, price}]}. Do not include json markdown notation. Provide only the final raw JSON result. If price of an item is not found, set null.',
        },
        { text: `input: ${text}` },
    ];

    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
    });

    const response = result.response;

    const responseText = jsonrepair(response.text());
    console.log(responseText);
    const jsonNotationRegex = /```json([\s\S]*?)```/g;
    const jsonMatch = jsonNotationRegex.exec(responseText);

    // if (jsonMatch && jsonMatch[1]) {
    //     const jsonStr = jsonMatch[1].trim();
    //     const jsonObj = JSON.parse(jsonStr);
    //     return jsonObj;
    // } else {
    //     throw new Error("Invalid JSON response");
    // }

    try {
        const jsonObj = JSON.parse(responseText);
        return jsonObj;
    } catch (error) {
        console.error(error);
        throw new Error("Invalid JSON response");
    }
};
