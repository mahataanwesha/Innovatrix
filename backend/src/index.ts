import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import analysisRoutes from './routes/analysisRoutes';
import reportRoutes from './routes/reportRoutes';
import verificationRoutes from './routes/verificationRoutes';
import collegeRoutes from './routes/collegeRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/analyze', analysisRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/college', collegeRoutes);

// Root Route to prevent "Cannot GET /"
app.get('/', (req, res) => {
  res.status(200).send(`
    <html>
      <body style="font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f9;">
        <div style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h1 style="color: #333; margin-bottom: 1rem;">TrustLayer API is Online 🚀</h1>
          <p style="color: #666; margin-bottom: 2rem;">The backend server is running successfully.</p>
          <a href="/api/health" style="padding: 10px 20px; background: #0070f3; color: white; text-decoration: none; border-radius: 6px;">Check API Health</a>
        </div>
      </body>
    </html>
  `);
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'TrustLayer API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
