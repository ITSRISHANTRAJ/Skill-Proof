# SkillProof

The Trust Infrastructure for Digital Skills. SkillProof is a web platform for verified professionals to showcase their portfolios, backed by manual auditing and cryptographic trust (mocked by JWT).

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, React Router, Axios
- **Backend**: Node.js, Express.js, JWT Auth, Mongoose
- **Database**: MongoDB

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017, or specify URL in `.env`)

### Backend Setup
1. `cd skillproof/server`
2. Configure `.env` if your MongoDB isn't running on `localhost:27017/skillproof`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the backend:
   ```bash
   npm start
   ```

*(An admin user will automatically be created on first launch: `admin@skillproof.com` / `admin123`)*

### Frontend Setup
1. `cd skillproof/client`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

Open `http://localhost:5173` in your browser.

## Features
- **Public**: Minimal aesthetics, Join/Login
- **Professional**: Dashboard to submit portfolios
- **Employer**: Directory of verified talent
- **Admin**: Approve or reject applications
