import { Request, Response } from 'express';
import VerifiedRecruiter from '../models/VerifiedRecruiter';

export const verifyRecruiter = async (req: Request, res: Response) => {
  try {
    const { name, company, emailDomain } = req.body;
    const adminId = (req as any).user._id;

    const recruiter = await VerifiedRecruiter.create({
      name,
      company,
      emailDomain,
      verifiedBy: adminId
    });

    res.status(201).json({ status: 'success', data: recruiter });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getVerifiedRecruiters = async (req: Request, res: Response) => {
  try {
    const recruiters = await VerifiedRecruiter.find().populate('verifiedBy', 'name email');
    res.status(200).json({ status: 'success', data: recruiters });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
