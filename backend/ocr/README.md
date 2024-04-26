# OCR Serverless Function

This is a serverless function that uses the Tesseract OCR engine to extract text from images. The function is written in Node.js and uses the Google Cloud Functions framework.

## Local Testing
1. `npm i && npm start`

## Deployment
Still manual for now. Will automate later if time permits.

## Spec
- **Input**: 
  - Body: Image file base64 encoded
  - Query: 
     - `lang` (optional) - Language code for OCR. Default is `eng`.
	 - `format` (optional) - Output format. Default is `hocr`.

- **Output**:
  - Body: Text extracted from the image

