import { Router, Request, Response } from "express";
import { TasksRepository } from "../repositories/tasksRepository";

const router = Router();
const tasksRepository = new TasksRepository();

// POST: Cria uma tarefa e solicita resumo ao serviço Python
router.post("/", async (req: Request, res: Response) => {
  try {
    const { text, lang } = req.body;

    if (!text || !lang) {
      return res
        .status(400)
        .json({ error: 'Campos "text" e "lang" são obrigatórios.' });
    }

    const supportedLanguages = ["pt", "en", "es"];
    if (!supportedLanguages.includes(lang)) {
      return res.status(400).json({ error: "Language not supported" });
    }

    // Cria a "tarefa"
    const task = tasksRepository.createTask(text, lang);

    // Solicita o resumo ao serviço Python
    const response = await fetch("http://localhost:8000/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang }),
    });

    if (!response.ok) {
      throw new Error("Erro ao comunicar com o serviço Python.");
    }

    const { summary } = await response.json();

    // Atualiza a tarefa com o resumo
    tasksRepository.updateTask(task.id, summary);

    return res.status(201).json({
      message: "Tarefa criada com sucesso!",
      task: tasksRepository.getTaskById(task.id),
      lang,
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao criar a tarefa." });
  }
});

// GET: Lista todas as tarefas
router.get("/", (req, res) => {
  const tasks = tasksRepository.getAllTasks();
  return res.json(tasks);
});

// GET: Obtém tarefa por ID
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const task = tasksRepository.getTaskById(Number(id));
  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }
  return res.json(task);
});

// DELETE: Remove tarefa por ID
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const task = tasksRepository.getTaskById(Number(id));
  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }
  tasksRepository.deleteTask(Number(id));
  return res.json({ message: "Tarefa removida com sucesso!" });
});

export default router;
