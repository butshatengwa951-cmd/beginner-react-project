import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  createTask,
  deleteTask,
  getTasksForUser,
  updateTask,
} from "../services/googleSheets.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (request, response, next) => {
  try {
    const tasks = await getTasksForUser(request.user.uid);
    response.json({ tasks });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const body = request.body || {};
    const title = typeof body.title === "string" ? body.title.trim() : "";

    if (!title || title.length > 120) {
      return response.status(400).json({
        message: "Task title is required and must be 120 characters or fewer.",
      });
    }

    const task = await createTask(request.user.uid, {
      title,
      category: cleanText(body.category, 40) || "Other",
      dueDate: cleanText(body.dueDate, 10),
    });

    response.status(201).json({ task });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (request, response, next) => {
  try {
    const body = request.body || {};
    const allowedStatuses = ["Not started", "In progress", "Completed"];
    const changes = {};

    if (typeof body.title === "string") {
      const title = body.title.trim();
      if (!title || title.length > 120) {
        return response.status(400).json({ message: "Invalid task title." });
      }
      changes.title = title;
    }

    if (typeof body.category === "string") {
      changes.category = cleanText(body.category, 40);
    }
    if (typeof body.dueDate === "string") {
      changes.dueDate = cleanText(body.dueDate, 10);
    }
    if (typeof body.status === "string") {
      if (!allowedStatuses.includes(body.status)) {
        return response.status(400).json({ message: "Invalid task status." });
      }
      changes.status = body.status;
    }

    if (Object.keys(changes).length === 0) {
      return response.status(400).json({ message: "No valid changes were provided." });
    }

    const task = await updateTask(request.user.uid, request.params.id, changes);
    if (!task) {
      return response.status(404).json({ message: "Task not found." });
    }

    response.json({ task });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (request, response, next) => {
  try {
    const deleted = await deleteTask(request.user.uid, request.params.id);
    if (!deleted) {
      return response.status(404).json({ message: "Task not found." });
    }
    response.json({ message: "Task deleted." });
  } catch (error) {
    next(error);
  }
});

function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export default router;
