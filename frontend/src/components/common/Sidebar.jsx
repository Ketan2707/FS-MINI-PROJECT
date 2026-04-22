import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiUsers, FiMessageSquare, FiLogOut, FiBook, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: <FiGrid />, label: 'Dashboard' },
    ...(!isStudent ? [{ path: '/students', icon: <FiUsers />, label: 'Students' }] : []),
    ...(!isStudent ? [{ path: '/feedback', icon: <FiMessageSquare />, label: 'Student Feedback' }] : []),
    { path: '/teacher-feedback', icon: <FiBook />, label: 'Teacher Feedback' }
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-brand">
            <div className="brand-icon">🎓</div>
            <span className="brand-text">FeedbackHub</span>
          </div>
        )}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
            title={label}
          >
            <span className="nav-icon">{icon}</span>
            {!collapsed && <span className="nav-label">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
        )}
        <button className="nav-item logout-btn" onClick={handleLogout} title="Logout">
          <span className="nav-icon"><FiLogOut /></span>
          {!collapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
