function Sidebar({
  darkMode,
  onToggleDarkMode,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">T</div>

        <div>
          <h1>TaskFlow</h1>
          <span>Task management</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item active">
          <span className="nav-icon">▦</span>
          <span>My Board</span>
        </button>
      </nav>

      <div className="sidebar-bottom">
        {/* Theme Toggle */}
        <div className="theme-toggle">
          <span>
            {darkMode ? "🌙" : "☀️"}
          </span>

          <div className="theme-toggle-text">
            <strong>
              {darkMode ? "Dark mode" : "Light mode"}
            </strong>

            <small>
              {darkMode
                ? "Switch to light"
                : "Switch to dark"}
            </small>
          </div>

          <button
            className={`theme-switch ${
              darkMode ? "active" : ""
            }`}
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
          >
            <span />
          </button>
        </div>

        {/* Workspace */}
        <div className="workspace">
          <div className="workspace-avatar">M</div>

          <div className="workspace-info">
            <strong>My Workspace</strong>
            <span>Personal board</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;