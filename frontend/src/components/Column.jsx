import TaskCard from "./TaskCard";

function Column({
  column,
  allColumns,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onAddTask,
}) {
  return (
    <section className="board-column">
      <div className="column-header">
        <div className="column-title">
          <span className="column-dot" />

          <h3>{column.name}</h3>

          <span className="task-count">
            {column.tasks?.length || 0}
          </span>
        </div>

        <button
          className="column-add-button"
          onClick={() => onAddTask(column.id)}
          aria-label={`Add task to ${column.name}`}
        >
          +
        </button>
      </div>

      <div className="column-tasks">
        {column.tasks?.length > 0 ? (
          column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columns={allColumns}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
            />
          ))
        ) : (
          <div className="empty-column">
            <span>No tasks here</span>

            <button onClick={() => onAddTask(column.id)}>
              Add a task
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Column;