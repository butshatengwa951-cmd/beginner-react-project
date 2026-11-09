import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/api.js";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadTasks() {
      setLoading(true);
      setError("");

      try {
        const savedTasks = await getTasks(user);
        if (isCurrent) setTasks(savedTasks);
      } catch (loadError) {
        if (isCurrent) setError(loadError.message);
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    loadTasks();

    // Prevent an old request from setting state after this page unmounts.
    return () => {
      isCurrent = false;
    };
  }, [user]);

  async function handleCreate(taskDetails) {
    setSubmitting(true);
    setError("");

    try {
      const savedTask = await createTask(user, taskDetails);
      setTasks((currentTasks) => [savedTask, ...currentTasks]);
      return true;
    } catch (createError) {
      setError(createError.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(taskId, status) {
    setBusyId(taskId);
    setError("");

    try {
      const updatedTask = await updateTask(user, taskId, { status });
      setTasks((currentTasks) =>
        currentTasks.map((task) => task.id === taskId ? updatedTask : task),
      );
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(taskId) {
    setBusyId(taskId);
    setError("");

    try {
      await deleteTask(user, taskId);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (logoutError) {
      setError(logoutError.message);
    }
  }

  const completedCount = tasks.filter((task) => task.status === "Completed").length;

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <Link className="wordmark" to="/">STUDY<span>TRACKER</span></Link>
        <div className="user-menu">
          <span className="user-email">{user?.email}</span>
          <button className="button button-quiet" type="button" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      <section className="welcome-block">
        <div>
          <p className="eyebrow">YOUR LEARNING DESK</p>
          <h1>Keep moving forward.</h1>
          <p className="muted">One focused task at a time.</p>
        </div>
        <div className="progress-stat">
          <strong>{completedCount}<span> / {tasks.length}</span></strong>
          <small>tasks completed</small>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel create-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">CAPTURE THE NEXT STEP</p>
              <h2>Add a learning task</h2>
            </div>
            <span className="panel-symbol">＋</span>
          </div>
          <TaskForm onCreate={handleCreate} submitting={submitting} />
        </div>

        <div className="panel list-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">YOUR CURRENT FOCUS</p>
              <h2>Learning tasks <span className="count-pill">{tasks.length}</span></h2>
            </div>
          </div>

          {error ? <p className="error-message" role="alert">{error}</p> : null}
          {loading ? (
            <p className="muted">Loading your tasks…</p>
          ) : (
            <TaskList
              tasks={tasks}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              busyId={busyId}
            />
          )}
        </div>
      </section>

      <footer className="dashboard-footer">
        React on the surface. Firebase for identity. Sheets for storage.
      </footer>
    </main>
  );
}
