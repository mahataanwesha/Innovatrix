import { Request, Response } from 'express';
import Scam from '../models/Scam';
import Report from '../models/Report';

export const reportScam = async (req: Request, res: Response) => {
  try {
    const { recruiterName, company, reason } = req.body;
    
    let scam = await Scam.findOne({ recruiterName, company });
    
    if (scam) {
      scam.reportsCount += 1;
      if (!scam.flaggedReasons.includes(reason)) {
        scam.flaggedReasons.push(reason);
      }
      await scam.save();
    } else {
      scam = await Scam.create({
        recruiterName,
        company,
        flaggedReasons: [reason]
      });
    }

    res.status(201).json({ status: 'success', data: scam });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getScamDatabase = async (req: Request, res: Response) => {
  try {
    const scams = await Scam.find().sort({ reportsCount: -1 });
    res.status(200).json({ status: 'success', data: scams });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getScamStats = async (req: Request, res: Response) => {
  try {
    // Mock heatmap data for now
    const stats = [
      { city: 'Delhi NCR', count: 1247 },
      { city: 'Mumbai', count: 892 },
      { city: 'Bangalore', count: 756 },
    ];
    res.status(200).json({ status: 'success', data: stats });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id).populate('userId', 'name email');
    
    if (!report) {
      return res.status(404).json({ status: 'error', message: 'Report not found' });
    }

    res.status(200).json({ status: 'success', data: report });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
