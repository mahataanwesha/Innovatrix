import { Request, Response } from 'express';
import { analyzeInput } from '../services/analyzer';
import Report from '../models/Report';
import Tesseract from 'tesseract.js';

import fs from 'fs';
const pdfParse = require('pdf-parse');

export const analyzeData = async (req: Request, res: Response) => {
  try {
    let inputType = req.body.inputType;
    let content = req.body.content;

    if (req.file) {
      inputType = 'file';
      const filePath = req.file.path;
      const fileExt = filePath.toLowerCase();
      
      if (fileExt.endsWith('.png') || fileExt.endsWith('.jpg') || fileExt.endsWith('.jpeg')) {
        // Use OCR to extract text from the image
        try {
          const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
          content = text;
        } catch (ocrError) {
          console.error("OCR Error:", ocrError);
          // Fallback if Tesseract crashes
          content = `Image uploaded: ${req.file.originalname}. Size: ${req.file.size} bytes. (Text extraction failed). Random ID: ${Math.random().toString(36).substring(7)}`;
        }
      } else if (fileExt.endsWith('.pdf')) {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        content = data.text;
      } else {
        content = filePath; // Handle PDFs differently if needed
      }
    }

    if (!content || !inputType) {
      return res.status(400).json({ status: 'error', message: 'Missing inputType or content' });
    }

    const analysisResult = await analyzeInput(inputType, content);

    const report = await Report.create({
      userId: (req as any).user ? (req as any).user._id : '64f1b2c3e4d5a6b7c8d9e0f1', // placeholder
      inputType,
      content: content.length > 500 ? content.substring(0, 500) + '...' : content,
      trustScore: analysisResult.trustScore,
      riskLevel: analysisResult.riskLevel,
      factors: analysisResult.factors,
      recommendation: analysisResult.recommendation,
    });

    res.status(200).json({
      status: 'success',
      data: {
        reportId: report._id,
        ...analysisResult,
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
