import { useEffect, useMemo, useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Board from "./components/Board";
import TaskModal from "./components/TaskModal";
import Toast from "./components/Toast";

import {
  createTask,
  deleteTask,
  getBoard,
  moveTask,
  updateTask,
} from "./services/api";

function App() {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [priority, setPriority] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedColumnId, setSelectedColumnId] = useState(null);

  const [toast, setToast] = useState({
    message: "",
    type: "error",
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("taskflow-theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem(
      "taskflow-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  function showToast(message, type = "error") {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        message: "",
        type: "error",
      });
    }, 3500);
  }

  async function loadBoard() {
    try {
      setLoading(true);

      const data = await getBoard(1);

      setBoard(data);
    } catch (error) {
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoard();
  }, []);

  function openCreateModal(columnId = null) {
    setEditingTask(null);

    const firstColumnId =
      board?.columns?.[0]?.id || null;

    setSelectedColumnId(
      columnId ?? firstColumnId
    );

    setModalOpen(true);
  }

  function openEditModal(task) {
    setEditingTask(task);
    setSelectedColumnId(task.column_id);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTask(null);
    setSelectedColumnId(null);
  }

  async function handleSubmitTask(data) {
    if (!data.title || !data.title.trim()) {
      showToast("Task title is required.", "error");
      return;
    }

    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          title: data.title.trim(),
          description: data.description,
          priority: data.priority,
        });

        showToast(
          "Task updated successfully.",
          "success"
        );
      } else {
        await createTask(selectedColumnId, {
          title: data.title.trim(),
          description: data.description,
          priority: data.priority,
        });

        showToast(
          "Task created successfully.",
          "success"
        );
      }

      closeModal();
      await loadBoard();
    } catch (error) {
      showToast(error.message);
    }
  }

  async function handleDeleteTask(task) {
    const confirmed = window.confirm(
      `Delete "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(task.id);

      showToast(
        "Task deleted successfully.",
        "success"
      );

      await loadBoard();
    } catch (error) {
      showToast(error.message);
    }
  }

  async function handleMoveTask(taskId, columnId) {
    try {
      await moveTask(taskId, columnId);

      showToast(
        "Task moved successfully.",
        "success"
      );

      await loadBoard();
    } catch (error) {
      showToast(error.message);
    }
  }

  const filteredBoard = useMemo(() => {
    if (!board) {
      return null;
    }

    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return {
      ...board,

      columns: board.columns.map((column) => ({
        ...column,

        tasks: column.tasks.filter((task) => {
          const matchesPriority =
            !priority ||
            task.priority === priority;

          const matchesSearch =
            !normalizedSearch ||
            task.title
              .toLowerCase()
              .includes(normalizedSearch);

          return (
            matchesPriority &&
            matchesSearch
          );
        }),
      })),
    };
  }, [board, priority, searchTerm]);

  return (
    <div
      className={`app-shell ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      <Sidebar
        darkMode={darkMode}
        onToggleDarkMode={() =>
          setDarkMode((current) => !current)
        }
      />

      <div className="main-content">
        <Header
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          priority={priority}
          onPriorityChange={setPriority}
          onCreateTask={() => openCreateModal()}
        />

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading your board...</p>
          </div>
        ) : filteredBoard ? (
          <Board
            board={filteredBoard}
            onEditTask={openEditModal}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
            onAddTask={openCreateModal}
          />
        ) : (
          <div className="error-state">
            <h2>Unable to load board</h2>

            <p>
              We couldn't retrieve your TaskFlow board.
            </p>

            <button onClick={loadBoard}>
              Try again
            </button>
          </div>
        )}
      </div>

      <TaskModal
        isOpen={modalOpen}
        task={editingTask}
        defaultColumnId={selectedColumnId}
        onClose={closeModal}
        onSubmit={handleSubmitTask}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "error",
          })
        }
      />
    </div>
  );
}

export default App;
