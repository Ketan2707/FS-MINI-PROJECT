import { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/dashboardApi';
import { motion } from 'framer-motion';
import { FiUsers, FiMessageSquare, FiStar, FiUserCheck, FiTrendingUp } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getRatingColor } from '../utils/helpers';
import './DashboardPage.css';

const COLORS = ['hsl(0,78%,55%)', 'hsl(25,92%,50%)', 'hsl(38,92%,50%)', 'hsl(199,89%,48%)', 'hsl(160,84%,44%)'];
const CATEGORY_COLORS = { ACADEMIC: 'hsl(230,80%,56%)', BEHAVIOR: 'hsl(160,84%,44%)', PARTICIPATION: 'hsl(38,92%,50%)', OTHER: 'hsl(280,80%,50%)' };

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats({ topStudentsLimit: 5 });
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!stats) return <div className="empty-state"><p>Failed to load dashboard</p></div>;

  const ratingData = Object.entries(stats.ratingDistribution || {}).map(([key, val]) => ({
    rating: `${key} ⭐`, count: val,
  }));

  const categoryData = Object.entries(stats.categoryBreakdown || {}).map(([key, val]) => ({
    name: key, value: val,
  }));

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: <FiUsers />, color: 'var(--primary)' },
    { label: 'Total Feedbacks', value: stats.totalFeedbacks, icon: <FiMessageSquare />, color: 'var(--accent)' },
    { label: 'Avg Rating', value: stats.averageRating?.toFixed(1), icon: <FiStar />, color: 'var(--warning)' },
    { label: 'Teachers', value: stats.totalTeachers, icon: <FiUserCheck />, color: 'var(--info)' },
    { label: 'This Month', value: stats.feedbacksThisMonth, icon: <FiTrendingUp />, color: 'hsl(280,80%,50%)' },
  ];

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of student feedback analytics</p>
        </div>
      </div>

      <motion.div className="stats-grid" variants={container} initial="hidden" animate="show">
        {statCards.map((card, i) => (
          <motion.div key={i} className="stat-card card" variants={item}>
            <div className="stat-icon" style={{ background: `${card.color}20`, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <span className="stat-value">{card.value}</span>
              <span className="stat-label">{card.label}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="charts-grid">
        <motion.div className="chart-card card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="chart-title">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="rating" stroke="var(--text-secondary)" fontSize={12} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {ratingData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="chart-card card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="chart-title">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[entry.name] || COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div className="top-students card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h3 className="chart-title">Top Rated Students</h3>
        {stats.topStudents?.length > 0 ? (
          <div className="top-students-list">
            {stats.topStudents.map((student, i) => (
              <div key={student.id} className="top-student-row">
                <div className="rank">#{i + 1}</div>
                <div className="student-avatar-sm" style={{ background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]})` }}>
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <div className="student-meta">
                  <span className="student-name-sm">{student.firstName} {student.lastName}</span>
                  <span className="feedback-count">{student.feedbackCount} feedbacks</span>
                </div>
                <div className="student-rating-sm">
                  <StarRating rating={student.averageRating} readonly size={16} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state"><p>No feedback data yet</p></div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;
