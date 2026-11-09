const statuses = ["Not started", "In progress", "Completed"];

export default function TaskList({ tasks, onStatusChange, onDelete, busyId }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">✦</span>
        <h3>No tasks yet</h3>
        <p>Add your first learning task above. It will appear here once saved.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <article className="task-card" key={task.id}>
          <div className="task-copy">
            <div className="task-meta">
              <span className="category-pill">{task.category}</span>
              {task.dueDate ? <span>Due {task.dueDate}</span> : null}
            </div>
            <h3 className={task.status === "Completed" ? "completed" : ""}>
              {task.title}
            </h3>
            <p className="task-created">
              Added {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="task-actions">
            <label className="visually-hidden" htmlFor={"status-" + task.id}>
              Status for {task.title}
            </label>
            <select
              id={"status-" + task.id}
              value={task.status}
              disabled={busyId === task.id}
              onChange={(event) => onStatusChange(task.id, event.target.value)}
            >
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <button
              className="button button-quiet"
              type="button"
              disabled={busyId === task.id}
              onClick={() => onDelete(task.id)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
