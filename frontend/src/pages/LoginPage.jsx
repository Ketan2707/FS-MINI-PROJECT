import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import './LoginPage.css';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Try admin/password123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>

      <motion.div
        className="login-card glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="login-header">
          <div className="login-icon">🎓</div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to FeedbackHub</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <motion.div
              className="error-alert"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                id="login-username"
                type="text"
                className="form-input"
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary btn-lg login-btn"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div>
            ) : (
              <>
                <FiLogIn /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/register" className="link-accent">Register</Link></p>
        </div>

        <div className="demo-credentials">
          <p className="demo-title">Demo Credentials</p>
          <div className="demo-row">
            <span className="badge badge-primary">Admin</span>
            <code>admin / password123</code>
          </div>
          <div className="demo-row">
            <span className="badge badge-accent">Teacher</span>
            <code>teacher1 / password123</code>
          </div>
          <div className="demo-row">
            <span className="badge badge-success" style={{background: 'var(--success-light)', color: 'var(--success)', border: '1px solid var(--success)'}}>Student</span>
            <code>student1 / password123</code>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
