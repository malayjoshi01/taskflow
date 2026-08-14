import { useEffect, useState } from "react";

function TaskModal({
  isOpen,
  task,
  defaultColumnId,
  onClose,
  onSubmit,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setPriority(task?.priority || "Medium");
  }, [isOpen, task]);

  if (!isOpen) {
    return null;
  }

  const isEditing = Boolean(task);

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    onSubmit({
      title: trimmedTitle,
      description: description.trim(),
      priority,
      ...(isEditing
        ? {}
        : { column_id: defaultColumnId }),
    });
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="task-modal">
        <div className="modal-header">
          <div>
            <span className="eyebrow">
              {isEditing ? "EDIT TASK" : "NEW TASK"}
            </span>

            <h2>
              {isEditing
                ? "Update task"
                : "Create a new task"}
            </h2>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">
              Title <span>*</span>
            </label>

            <input
              id="task-title"
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">
              Description
            </label>

            <textarea
              id="task-description"
              rows="4"
              placeholder="Add some details..."
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-priority">
              Priority
            </label>

            <select
              id="task-priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
            >
              {isEditing ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;