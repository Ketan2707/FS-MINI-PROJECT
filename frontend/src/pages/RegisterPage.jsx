import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiMail, FiUserPlus, FiHash, FiBookOpen } from 'react-icons/fi';
import { DEPARTMENTS, SEMESTERS } from '../utils/constants';
import './LoginPage.css';

const RegisterPage = () => {
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    role: 'TEACHER',
    firstName: '',
    lastName: '',
    rollNumber: '',
    department: '',
    semester: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, registerStudent } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (form.role === 'STUDENT') {
        const studentPayload = {
          ...form,
          semester: Number(form.semester)
        };
        await registerStudent(studentPayload);
      } else {
        await register({
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role
        });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const isStudent = form.role === 'STUDENT';

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
        transition={{ duration: 0.6 }}
      >
        <div className="login-header">
          <div className="login-icon">📝</div>
          <h1 className="login-title">Create Account</h1>
          <p className="login-subtitle">Join FeedbackHub today</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <motion.div className="error-alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {error}
            </motion.div>
          )}

          <div className="form-group row-group">
             <div className="input-half">
                <label className="form-label">Role</label>
                <select id="register-role" className="form-select"
                  value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="TEACHER">Teacher</option>
                  <option value="STUDENT">Student</option>
                  <option value="ADMIN">Admin</option>
                </select>
             </div>
          </div>

          <div className="form-group">
             <label className="form-label">Username</label>
             <div className="input-wrapper">
               <FiUser className="input-icon" />
               <input id="register-username" type="text" className="form-input" placeholder="Choose a username"
                 value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
             </div>
          </div>

          <div className="form-group">
             <label className="form-label">Email</label>
             <div className="input-wrapper">
               <FiMail className="input-icon" />
               <input id="register-email" type="email" className="form-input" placeholder="Enter your email"
                 value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
             </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input id="register-password" type="password" className="form-input" placeholder="Min. 6 characters"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
          </div>

          {isStudent && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="student-fields">
               <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-input" placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required={isStudent} />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-input" placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required={isStudent} />
                  </div>
               </div>
               <div className="form-group" style={{marginBottom: '1rem'}}>
                 <label className="form-label">Roll Number</label>
                 <div className="input-wrapper">
                   <FiHash className="input-icon" />
                   <input type="text" className="form-input" placeholder="Roll Number" value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} required={isStudent} />
                 </div>
               </div>
               <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label className="form-label">Department</label>
                    <select className="form-select" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required={isStudent}>
                      <option value="">Select Dept</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label className="form-label">Semester</label>
                    <select className="form-select" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} required={isStudent}>
                      <option value="">Select Sem</option>
                      {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
               </div>
            </motion.div>
          )}

          <button id="register-submit" type="submit" className="btn btn-primary btn-lg login-btn" disabled={loading}>
            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div>
              : <><FiUserPlus /> Create Account</>}
          </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <Link to="/login" className="link-accent">Sign in</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
