function Header({
  searchTerm,
  onSearchChange,
  priority,
  onPriorityChange,
  onCreateTask,
}) {
  return (
    <header className="header">
      <div className="header-title">
        <div>
          <span className="eyebrow">WORKSPACE</span>
          <h2>TaskFlow Board</h2>
        </div>
      </div>

      <div className="header-actions">
        <div className="search-box">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
          />
        </div>

        <select
          className="priority-filter"
          value={priority}
          onChange={(event) =>
            onPriorityChange(event.target.value)
          }
        >
          <option value="">All priorities</option>
          <option value="High">High priority</option>
          <option value="Medium">Medium priority</option>
          <option value="Low">Low priority</option>
        </select>

        <button
          className="create-task-button"
          onClick={onCreateTask}
        >
          <span>+</span>
          New task
        </button>
      </div>
    </header>
  );
}

export default Header;