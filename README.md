# SmartContent AI - Full Stack Application

A modern AI-powered content creation platform with user authentication, built with React, TypeScript, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **AI Assistant**: Interactive chat interface for content help
- **Protected Routes**: Secure user-specific content
- **MongoDB Integration**: Persistent data storage
- **Real-time Updates**: Dynamic user experience

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository and install frontend dependencies

```bash
npm install
```

### 2. Set up the backend

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

**Frontend (.env in root directory):**
```
VITE_API_URL=http://localhost:5000/api
```

**Backend (backend/.env):**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

### Start Frontend Development Server

In a new terminal, from the root directory:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
Ai saas/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── .env             # Backend environment variables
│   ├── server.js        # Express server
│   └── package.json
├── src/
│   ├── components/      # React components
│   ├── context/         # React context (Auth)
│   ├── pages/           # Page components
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── .env                 # Frontend environment variables
├── package.json
└── README.md
```

## 🔑 Key Technologies

**Frontend:**
- React 18
- TypeScript
- React Router DOM
- Tailwind CSS
- Axios
- Lucide React (icons)

**Backend:**
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt.js for password hashing
- CORS
- Cookie Parser

## 🔐 Authentication Flow

1. User registers with name, email, and password
2. Password is hashed with bcrypt before saving to database
3. JWT token is generated and sent to client
4. Token is stored in localStorage and HTTP-only cookies
5. Protected routes check for valid token
6. User can logout to clear token and session

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (protected)
- `GET /api/auth/me` - Get current user (protected)

### Health Check

- `GET /api/health` - Server health status

## 🎨 Pages

- **Home (/)** - Landing page with features, pricing, testimonials
- **Login (/login)** - User login page
- **Register (/register)** - User registration page

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies
- CORS protection
- Input validation
- Protected routes
- Secure password requirements (min 6 characters)

## 🚀 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Ensure MongoDB Atlas whitelist includes your server IP
3. Deploy backend to platforms like Heroku, Railway, or Render

### Frontend Deployment

1. Update `VITE_API_URL` to your production backend URL
2. Build the frontend: `npm run build`
3. Deploy to Vercel, Netlify, or similar platforms

## 📝 Usage

1. Visit the homepage
2. Click "Start Free Trial" or "Sign Up"
3. Create an account with your details
4. Login with your credentials
5. Access protected features as authenticated user
6. Logout when done

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

**Backend won't connect to MongoDB:**
- Check your MongoDB URI is correct
- Ensure IP whitelist in MongoDB Atlas
- Verify network connection

**Frontend can't reach backend:**
- Ensure backend is running on port 5000
- Check CORS settings
- Verify API URL in .env file

**Authentication not working:**
- Clear browser cookies and localStorage
- Check JWT_SECRET is set
- Verify token is being sent in requests

## 📧 Support

For support, please open an issue in the repository.
