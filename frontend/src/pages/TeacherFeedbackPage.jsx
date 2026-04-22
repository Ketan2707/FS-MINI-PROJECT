import { useState, useEffect } from 'react';
import { submitTeacherFeedback, getTeacherFeedbacks, getMyTeacherFeedbacks, deleteTeacherFeedback, getTeachers } from '../api/teacherFeedbackApi';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiFilter, FiTrash2, FiX, FiMessageSquare } from 'react-icons/fi';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { TEACHER_FEEDBACK_CATEGORIES } from '../utils/constants';
import { formatDateTime } from '../utils/helpers';
import '../pages/FeedbackPage.css'; // Reusing FeedbackPage CSS for similar layout

const TeacherFeedbackPage = () => {
  const { isAdmin, isStudent } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [form, setForm] = useState({ teacherId: '', rating: 0, comment: '', category: 'TEACHING_QUALITY' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, [page, categoryFilter]);

  useEffect(() => {
    if (isStudent) {
      fetchTeachers();
    }
  }, [isStudent]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (categoryFilter) params.category = categoryFilter;
      
      const res = isStudent 
        ? await getMyTeacherFeedbacks(params)
        : await getTeacherFeedbacks(params);
        
      setFeedbacks(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await getTeachers();
      setTeachers(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) { setFormError('Please select a rating'); return; }
    if (!form.teacherId) { setFormError('Please select a teacher'); return; }
    setFormError('');
    setSubmitting(true);
    try {
      await submitTeacherFeedback({ ...form, teacherId: Number(form.teacherId) });
      setShowModal(false);
      setForm({ teacherId: '', rating: 0, comment: '', category: 'TEACHING_QUALITY' });
      fetchFeedbacks();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await deleteTeacherFeedback(id);
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryColor = (cat) => {
    const map = { 
        TEACHING_QUALITY: 'badge-primary', 
        COMMUNICATION: 'badge-accent', 
        KNOWLEDGE: 'badge-warning', 
        PUNCTUALITY: 'badge-success',
        HELPFULNESS: 'badge-info',
        OTHER: 'badge-danger' 
    };
    return map[cat] || 'badge-primary';
  };

  return (
    <div className="feedback-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Rate Teachers</h1>
          <p className="page-subtitle">
            {isStudent ? 'Submit feedback for your teachers' : 'View feedback submitted for teachers'}
          </p>
        </div>
        {isStudent && (
          <button className="btn btn-primary" onClick={() => {
            setFormError('');
            setForm({ teacherId: '', rating: 0, comment: '', category: 'TEACHING_QUALITY' });
            setShowModal(true);
          }}>
            <FiPlus /> Submit Feedback
          </button>
        )}
      </div>

      <div className="feedback-filter-bar card">
        <FiFilter className="filter-icon" />
        <select className="form-select filter-select" value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}>
          <option value="">All Categories</option>
          {TEACHER_FEEDBACK_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <motion.div className="feedback-list" initial="hidden" animate="show"
            variants={{ show: { transition: { staggerChildren: 0.04 } } }}>
            {feedbacks.map((fb) => (
              <motion.div key={fb.id} className="feedback-card card"
                variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}>
                <div className="feedback-card-top">
                  <div className="feedback-author">
                    <div className="feedback-avatar" style={{ background: `linear-gradient(135deg, var(--primary), var(--accent))` }}>
                      {fb.teacherName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="feedback-meta">
                      <span className="feedback-student-name">{fb.teacherName} (Teacher)</span>
                      {!isStudent && <span className="feedback-subject">By: {fb.studentName}</span>}
                    </div>
                  </div>
                  <div className="feedback-right">
                    <span className={`badge ${getCategoryColor(fb.category)}`}>{fb.category}</span>
                    {isAdmin && (
                      <button className="action-btn danger" onClick={() => handleDelete(fb.id)} title="Delete">
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </div>
                <StarRating rating={fb.rating} readonly size={18} />
                {fb.comment && <p className="feedback-comment">{fb.comment}</p>}
                <div className="feedback-footer">
                  <span className="feedback-date">{formatDateTime(fb.createdAt)}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {feedbacks.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon"><FiMessageSquare /></div>
              <p>No feedback found</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`pagination-btn ${page === i ? 'active' : ''}`} onClick={() => setPage(i)}>{i + 1}</button>
              ))}
              <button className="pagination-btn" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {showModal && isStudent && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
              <div className="modal-header">
                <h2 className="modal-title">Rate Teacher</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}><FiX /></button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                {formError && <div className="error-alert">{formError}</div>}
                <div className="form-group">
                  <label className="form-label">Teacher</label>
                  <select className="form-select" value={form.teacherId}
                    onChange={e => setForm({ ...form, teacherId: e.target.value })} required>
                    <option value="">Select a teacher</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.username}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <div className="rating-input">
                    <StarRating rating={form.rating} onRate={(r) => setForm({ ...form, rating: r })} size={32} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}>
                    {TEACHER_FEEDBACK_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Comment</label>
                  <textarea className="form-textarea" value={form.comment}
                    onChange={e => setForm({ ...form, comment: e.target.value })}
                    placeholder="Provide your feedback here..." rows={4} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherFeedbackPage;
