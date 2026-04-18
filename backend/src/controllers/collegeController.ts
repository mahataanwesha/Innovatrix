import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import College from '../models/College';
import Recruiter from '../models/Recruiter';
import ScamReport from '../models/ScamReport';

export const loginCollege = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const college = await College.findOne({ email });
    if (college && (await (college as any).matchPassword(password))) {
      const token = jwt.sign({ id: college._id, role: 'college' }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
      });
      res.json({ token, role: 'college' });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalRecruiters = await Recruiter.countDocuments({ status: 'verified' });
    const pendingApprovals = await Recruiter.countDocuments({ status: 'pending' });
    const scamReportsCount = await ScamReport.countDocuments();
    
    res.json({
      totalRecruiters,
      pendingApprovals,
      scamReports: scamReportsCount,
      activeDrives: 12 // Mock data for active drives
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getVerifiedRecruiters = async (req: Request, res: Response) => {
  try {
    const recruiters = await Recruiter.find({ status: 'verified' });
    res.json(recruiters);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const verifyRecruiter = async (req: Request, res: Response) => {
  const { name, company, emailDomain } = req.body;
  try {
    const recruiter = new Recruiter({ name, company, emailDomain, status: 'verified' });
    await recruiter.save();
    res.status(201).json(recruiter);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const removeRecruiter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Recruiter.findByIdAndDelete(id);
    res.json({ message: 'Recruiter removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getPendingRequests = async (req: Request, res: Response) => {
  try {
    const requests = await Recruiter.find({ status: 'pending' });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const approveRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recruiter = await Recruiter.findByIdAndUpdate(id, { status: 'verified' }, { new: true });
    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const rejectRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recruiter = await Recruiter.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getScamReports = async (req: Request, res: Response) => {
  try {
    const reports = await ScamReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const flagHighRisk = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const report = await ScamReport.findByIdAndUpdate(id, { riskLevel: 'high' }, { new: true });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getHeatmapData = async (req: Request, res: Response) => {
  try {
    // Return mock heatmap data based on user request
    const heatmapData = [
      { city: "Kolkata", count: 25 },
      { city: "Bangalore", count: 40 },
      { city: "Mumbai", count: 18 },
      { city: "Delhi", count: 32 },
      { city: "Hyderabad", count: 12 }
    ];
    res.json(heatmapData);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
