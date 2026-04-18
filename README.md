# TrustLayer (Innovatrix)

TrustLayer is an AI-powered document verification and risk analysis platform. It is designed to evaluate job offer letters, analyze potential risks, and detect scams using advanced document parsing, Optical Character Recognition (OCR), and intelligent risk scoring. The platform serves job seekers, college placement cells, and administrators to foster a safer hiring environment.

## 🌟 Features

- **Document Analysis & OCR:** Automatically extracts text from uploaded PDFs and image-based job offer letters using `pdf-parse` and `tesseract.js`.
- **Risk Assessment & Trust Scoring:** Evaluates documents for suspicious language, unverified domains, and payment requests to generate dynamic trust scores and risk levels (High Risk, Suspicious, Safe).
- **Scam Heatmap:** Provides a regional, data-driven visualization of reported scams and fraudulent recruiters.
- **Role-Based Access Control (RBAC):** Supports distinct dashboards and permissions for Administrators, College Placement Cells, and Verified Recruiters.
- **Real-Time Data Persistence:** Utilizes MongoDB for relational structured data (Users, Colleges, Recruiters) and Firebase for real-time document history and user-specific reports.
- **Modern UI/UX:** Built with Next.js, Tailwind CSS, Framer Motion, and Radix UI components for a highly interactive, dynamic, and responsive user experience.

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js (React 19)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Components:** Radix UI
- **Icons:** Lucide React

### Backend
- **Framework:** Node.js with Express
- **Database:** MongoDB (Mongoose) & Firebase Firestore
- **Authentication:** JWT & Firebase Admin
- **Document Processing:** Multer (Uploads), Tesseract.js (OCR), pdf-parse (PDFs)

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas URI
- Firebase Project with Firestore and Authentication configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mahataanwesha/Innovatrix.git
   cd Innovatrix
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

### Environment Variables

You will need to set up your environment variables. 

**Backend (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
*(Also ensure your Firebase Admin Service Account credentials are correctly referenced in the backend).*

**Frontend (`.env.local`):**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

### Running the Application

You need to run both the frontend and backend development servers concurrently.

**1. Start the Backend Server:**
Open a terminal, navigate to the `backend` directory, and run:
```bash
cd backend
npm run dev
```
*(The backend runs on port 5000 by default)*

**2. Start the Frontend Application:**
Open a new terminal in the root directory and run:
```bash
npm run dev
```
*(The Next.js frontend will run on port 3000)*

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📂 Project Structure

- `/app` & `/components` - Next.js frontend application and React components.
- `/backend` - Node.js/Express backend API, models, routes, and controllers.
- `/lib` - Frontend utility functions and Firebase configuration.

## 📄 License
This project is licensed under the MIT License.
