const functions = require("@google-cloud/functions-framework");
const Tesseract = require("tesseract.js");
const cheerio = require("cheerio");

// Define constants for the different OCR formats
const OCR_FORMATS = {
    TEXT: "text",
    HOCR: "hocr",
    WORDS: "words",
};

functions.http("ocr", async (req, res) => {
    try {
        const base64Image = req.body.image;
        if (!base64Image) {
            return res.status(400).send("No image provided");
        }

        const ocrLanguage = req.query.lang || "eng";
        const ocrFormat = req.query.format || OCR_FORMATS.HOCR;

        const imageBuffer = Buffer.from(base64Image, "base64");

        const result = await Tesseract.recognize(imageBuffer, ocrLanguage);

        switch (ocrFormat) {
            case OCR_FORMATS.TEXT:
                return res.status(200).send(result.data.text);
            case OCR_FORMATS.HOCR:
                return res.status(200).send(result.data.hocr);
            case OCR_FORMATS.WORDS:
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
                return res.status(200).send(words);
            default:
                return res.status(400).send("Invalid format");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error processing image");
    }
});
