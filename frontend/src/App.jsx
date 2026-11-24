import { useEffect, useMemo, useState } from "react";
import {
  GraduationCap, LayoutDashboard, Users, BookOpen, Search, Plus,
  Pencil, Trash2, X, Menu, RefreshCw, Mail, Phone, CalendarDays,
  TrendingUp, AlertCircle, CheckCircle2
} from "lucide-react";
import { api } from "./api/api";

const emptyForm = { name: "", email: "", phone: "", course: "" };

function App() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0, courseGroups: [] });
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const loadData = async (query = search) => {
    try {
      setLoading(true);
      setError("");
      const [studentResponse, statsResponse] = await Promise.all([
        api.get("/students", { params: query ? { search: query } : {} }),
        api.get("/students/stats")
      ]);
      setStudents(studentResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not connect to the server. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(""); }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadData(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
    setNotice("");
  };

  const openEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course
    });
    setEditingId(student._id);
    setModalOpen(true);
    setNotice("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      if (editingId) {
        await api.put(`/students/${editingId}`, form);
        setNotice("Student updated successfully.");
      } else {
        await api.post("/students", form);
        setNotice("Student added successfully.");
      }
      closeModal();
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save student.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete ${student.name}?`)) return;
    try {
      await api.delete(`/students/${student._id}`);
      setNotice("Student deleted successfully.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete student.");
    }
  };

  const initials = (name) => name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  const courseList = useMemo(() => stats.courseGroups || [], [stats.courseGroups]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><GraduationCap size={23} /></div>
          <div><strong>Campus</strong><span>STUDENT PORTAL</span></div>
          <button className="mobile-close" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={20} /></button>
        </div>
        <div className="nav-label">MENU</div>
        <button className="nav-item active"><LayoutDashboard size={18} /> Dashboard</button>
        <button className="nav-item" onClick={() => document.getElementById("students-section")?.scrollIntoView({ behavior: "smooth" })}><Users size={18} /> Students</button>
        <button className="nav-item" onClick={() => document.getElementById("courses-section")?.scrollIntoView({ behavior: "smooth" })}><BookOpen size={18} /> Courses</button>
        <div className="sidebar-bottom">
          <div className="sidebar-note"><div className="note-icon"><GraduationCap size={18} /></div><strong>Keep learning!</strong><p>Manage your student records in one place.</p></div>
          <div className="profile"><div className="profile-avatar">AD</div><div><strong>Administrator</strong><span>Admin account</span></div></div>
        </div>
      </aside>

      {mobileMenu && <button className="mobile-overlay" onClick={() => setMobileMenu(false)} aria-label="Close navigation" />}

      <main className="main-content">
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={21} /></button>
          <div><span className="breadcrumb">Pages /</span> <strong>Dashboard</strong></div>
          <div className="topbar-right"><span className="status-dot" /> System online</div>
        </header>

        <section className="page-heading">
          <div><p className="eyebrow">OVERVIEW</p><h1>Dashboard</h1><p className="subheading">Welcome back! Here's what's happening with your students.</p></div>
          <button className="primary-button" onClick={openAdd}><Plus size={18} /> Add Student</button>
        </section>

        {notice && <div className="alert success"><CheckCircle2 size={17} />{notice}<button onClick={() => setNotice("")}><X size={16} /></button></div>}
        {error && <div className="alert error"><AlertCircle size={17} />{error}<button onClick={() => setError("")}><X size={16} /></button></div>}

        <section className="stats-grid">
          <StatCard icon={<Users />} label="Total Students" value={stats.totalStudents} hint="Registered students" />
          <StatCard icon={<BookOpen />} label="Total Courses" value={stats.totalCourses} hint="Courses represented" />
          <StatCard icon={<TrendingUp />} label="Filtered Results" value={students.length} hint="Students in this view" />
        </section>

        <section className="content-grid">
          <div className="panel students-panel" id="students-section">
            <div className="panel-heading">
              <div><h2>All Students</h2><p>Manage your student records</p></div>
              <button className="icon-button" onClick={() => loadData()} title="Refresh"><RefreshCw size={17} /></button>
            </div>
            <div className="table-toolbar">
              <div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students..." /></div>
              <span className="result-count">{students.length} records</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>STUDENT</th><th>COURSE</th><th>PHONE</th><th>ENROLLED</th><th className="actions-heading">ACTIONS</th></tr></thead>
                <tbody>
                  {loading ? <tr><td colSpan="5" className="empty-state">Loading students...</td></tr> :
                    students.length === 0 ? <tr><td colSpan="5" className="empty-state">No students found. Add your first student to get started.</td></tr> :
                    students.map((student) => (
                      <tr key={student._id}>
                        <td><div className="student-cell"><div className="student-avatar">{initials(student.name)}</div><div><strong>{student.name}</strong><span>{student.email}</span></div></div></td>
                        <td><span className="course-tag">{student.course}</span></td>
                        <td className="muted-cell">{student.phone}</td>
                        <td className="muted-cell">{new Date(student.enrollmentDate).toLocaleDateString()}</td>
                        <td><div className="row-actions"><button className="edit-action" onClick={() => openEdit(student)} title="Edit"><Pencil size={16} /></button><button className="delete-action" onClick={() => handleDelete(student)} title="Delete"><Trash2 size={16} /></button></div></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel courses-panel" id="courses-section">
            <div className="panel-heading"><div><h2>Courses</h2><p>Student distribution</p></div><BookOpen size={19} className="panel-icon" /></div>
            {courseList.length === 0 ? <div className="course-empty">Course statistics will appear when students are added.</div> :
              <div className="course-list">{courseList.map((course) => (
                <div className="course-item" key={course._id}><div className="course-info"><span>{course._id}</span><strong>{course.count}</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${stats.totalStudents ? (course.count / stats.totalStudents) * 100 : 0}%` }} /></div></div>
              ))}</div>}
            <div className="course-footer"><CalendarDays size={16} /><span>Course totals update automatically</span></div>
          </div>
        </section>
        <footer className="footer">© {new Date().getFullYear()} Campus Student Management System <span>Built with MERN Stack</span></footer>
      </main>

      {modalOpen && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        <div className="modal">
          <div className="modal-header"><div><h2>{editingId ? "Edit Student" : "Add New Student"}</h2><p>Enter the student information below</p></div><button className="icon-button" onClick={closeModal}><X size={19} /></button></div>
          <form onSubmit={handleSubmit}>
            <label>Full Name<input required maxLength="80" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Alex Johnson" /></label>
            <label>Email Address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="alex@example.com" /></label>
            <label>Phone Number<input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 0771234567" /></label>
            <label>Course<select required value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}><option value="">Select a course</option><option>Software Engineering</option><option>Information Technology</option><option>Computer Science</option><option>Business Management</option><option>Data Science</option><option>Cyber Security</option><option>Other</option></select></label>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={closeModal}>Cancel</button><button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving..." : editingId ? "Update Student" : "Save Student"}</button></div>
          </form>
        </div>
      </div>}
    </div>
  );
}

function StatCard({ icon, label, value, hint }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className="stat-icon">{icon}</div></div><div className="stat-value">{value}</div><p>{hint}</p></div>;
}

export default App;
