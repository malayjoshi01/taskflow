function TaskCard({
  task,
  columns,
  onEdit,
  onDelete,
  onMove,
}) {
  function formatDate(dateValue) {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <article className="task-card">
      <div className="task-card-top">
        <span
          className={`priority-badge priority-${task.priority.toLowerCase()}`}
        >
          {task.priority}
        </span>

        <button
          className="task-menu-button"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.title}`}
        >
          ✎
        </button>
      </div>

      <h3>{task.title}</h3>

      {task.description && (
        <p className="task-description">
          {task.description}
        </p>
      )}

      <div className="task-meta">
        {task.created_at && (
          <span>
            Created {formatDate(task.created_at)}
          </span>
        )}
      </div>

      <div className="task-card-footer">
        <select
          value={task.column_id}
          onChange={(event) =>
            onMove(task.id, Number(event.target.value))
          }
          aria-label="Move task"
        >
          {columns.map((column) => (
            <option
              key={column.id}
              value={column.id}
            >
              {column.name}
            </option>
          ))}
        </select>

        <button
          className="delete-task-button"
          onClick={() => onDelete(task)}
          aria-label={`Delete ${task.title}`}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskCard;