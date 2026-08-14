const API_BASE_URL = "http://127.0.0.1:8000/api";

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      let message = "Something went wrong.";

      try {
        const data = await response.json();
        message = data.detail || message;
      } catch {
        // Ignore invalid error response
      }

      throw new Error(message);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the TaskFlow server."
      );
    }

    throw error;
  }
}

export async function getBoard(boardId = 1) {
  return request(`/boards/${boardId}`);
}

export async function createTask(columnId, task) {
  return request(`/columns/${columnId}/tasks`, {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export async function updateTask(taskId, task) {
  return request(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
}

export async function deleteTask(taskId) {
  return request(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}

export async function moveTask(taskId, columnId) {
  return request(`/tasks/${taskId}/move`, {
    method: "PATCH",
    body: JSON.stringify({
      column_id: columnId,
    }),
  });
}

export async function getTasks(boardId = 1, priority = "") {
  const query = priority
    ? `?priority=${encodeURIComponent(priority)}`
    : "";

  return request(`/boards/${boardId}/tasks${query}`);
}