function Toast({ message, type = "error", onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>

      <button onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
}

export default Toast;