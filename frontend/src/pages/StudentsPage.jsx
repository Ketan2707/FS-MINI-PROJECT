import { useState, useEffect } from 'react';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../api/studentApi';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiFilter, FiX } from 'react-icons/fi';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { DEPARTMENTS, SEMESTERS } from '../utils/constants';
import { getInitials, getRatingColor } from '../utils/helpers';
import './StudentsPage.css';

const StudentsPage = () => {
  const { isAdmin } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', rollNumber: '', department: '', semester: '', profileImageUrl: '' });
  const [formError, setFormError] = useState('');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    fetchStudents();
  }, [page, debouncedSearch, department, semester]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = { page, size: 8, sortBy: 'id', sortDir: 'asc' };
      if (debouncedSearch) params.search = debouncedSearch;
      if (department) params.department = department;
      if (semester) params.semester = semester;
      const res = await getStudents(params);
      setStudents(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditStudent(null);
    setForm({ firstName: '', lastName: '', rollNumber: '', department: 'Computer Science', semester: 3, profileImageUrl: '' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditStudent(student);
    setForm({
      firstName: student.firstName, lastName: student.lastName,
      rollNumber: student.rollNumber, department: student.department,
      semester: student.semester, profileImageUrl: student.profileImageUrl || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editStudent) {
        await updateStudent(editStudent.id, { ...form, semester: Number(form.semester) });
      } else {
        await createStudent({ ...form, semester: Number(form.semester) });
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setDepartment('');
    setSemester('');
    setPage(0);
  };

  return (
    <div className="students-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">Manage student profiles and view ratings</p>
        </div>
        {isAdmin && (
          <button id="add-student-btn" className="btn btn-primary" onClick={openCreateModal}>
            <FiPlus /> Add Student
          </button>
        )}
      </div>

      <div className="filters-bar card">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input id="student-search" type="text" className="form-input search-input"
            placeholder="Search by name or roll number..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
        </div>
        <select className="form-select filter-select" value={department}
          onChange={(e) => { setDepartment(e.target.value); setPage(0); }}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="form-select filter-select" value={semester}
          onChange={(e) => { setSemester(e.target.value); setPage(0); }}>
          <option value="">All Semesters</option>
          {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>
        {(search || department || semester) && (
          <button className="btn btn-ghost btn-sm" onClick={clearFilters}><FiX /> Clear</button>
        )}
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <motion.div className="students-grid" initial="hidden" animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
            {students.map((student) => (
              <motion.div key={student.id} className="student-card card"
                variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}>
                <div className="student-card-header">
                  <div className="student-avatar" style={{ background: `linear-gradient(135deg, ${getRatingColor(student.averageRating)}, var(--primary))` }}>
                    {getInitials(student.firstName, student.lastName)}
                  </div>
                  {isAdmin && (
                    <div className="student-actions">
                      <button className="action-btn" onClick={() => openEditModal(student)} title="Edit"><FiEdit2 /></button>
                      <button className="action-btn danger" onClick={() => handleDelete(student.id)} title="Delete"><FiTrash2 /></button>
                    </div>
                  )}
                </div>
                <h3 className="student-name">{student.firstName} {student.lastName}</h3>
                <p className="student-roll">{student.rollNumber}</p>
                <div className="student-tags">
                  <span className="badge badge-primary">{student.department}</span>
                  <span className="badge badge-accent">Sem {student.semester}</span>
                </div>
                <div className="student-rating-bar">
                  <StarRating rating={student.averageRating} readonly size={16} />
                  <span className="feedback-count-sm">{student.totalFeedbacks} feedbacks</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {students.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🎓</div>
              <p>No students found</p>
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
        {showModal && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{editStudent ? 'Edit Student' : 'Add Student'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}><FiX /></button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                {formError && <div className="error-alert">{formError}</div>}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input className="form-input" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input className="form-input" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input className="form-input" value={form.rollNumber} onChange={e => setForm({ ...form, rollNumber: e.target.value })} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select className="form-select" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} required>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Semester</label>
                    <select className="form-select" value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} required>
                      {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editStudent ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentsPage;
