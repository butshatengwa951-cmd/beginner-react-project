const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// This helper attaches the signed-in Firebase user's ID token to each API call.
async function apiRequest(path, user, options = {}) {
  if (!user) {
    throw new Error("You must be signed in to perform this action.");
  }

  const token = await user.getIdToken();
  const response = await fetch(API_BASE_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "The request could not be completed.");
  }
  return data;
}

export async function getTasks(user) {
  const data = await apiRequest("/api/tasks", user);
  return data.tasks;
}

export async function createTask(user, task) {
  const data = await apiRequest("/api/tasks", user, {
    method: "POST",
    body: JSON.stringify(task),
  });
  return data.task;
}

export async function updateTask(user, taskId, changes) {
  const data = await apiRequest("/api/tasks/" + encodeURIComponent(taskId), user, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
  return data.task;
}

export async function deleteTask(user, taskId) {
  return apiRequest("/api/tasks/" + encodeURIComponent(taskId), user, {
    method: "DELETE",
  });
}
