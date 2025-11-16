import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BlogWriter from './pages/BlogWriter';
import SocialPosts from './pages/SocialPosts';
import MySocialPosts from './pages/MySocialPosts';
import PricingPage from './pages/Pricing';
import MyBlogs from './pages/MyBlogs';
import BlogDetail from './pages/BlogDetail';
import EmailCreator from './pages/EmailCreator';
import Analytics from './pages/Analytics';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blog-writer"
        element={
          <ProtectedRoute>
            <BlogWriter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/social-posts"
        element={
          <ProtectedRoute>
            <SocialPosts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-social-posts"
        element={
          <ProtectedRoute>
            <MySocialPosts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-blogs"
        element={
          <ProtectedRoute>
            <MyBlogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blog/:id"
        element={
          <ProtectedRoute>
            <BlogDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/email-creator"
        element={
          <ProtectedRoute>
            <EmailCreator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
