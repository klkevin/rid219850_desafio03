const form = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");

let tasks = [];
let currentFilter = "";

const saved = localStorage.getItem("board-tarefas");
if (saved) {
  try {
    tasks = JSON.parse(saved);
  } catch {
    tasks = [];
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("task-name").value.trim();
  const label = document.getElementById("task-label").value.trim();
  if (!name) return;

  const task = {
    id: Date.now(),
    name,
    label,
    createdAt: new Date().toLocaleDateString("pt-BR"),
    done: false,
  };

  tasks.unshift(task);
  form.reset();
  renderTasks();
});

function renderTasks() {
  taskList.innerHTML = "";
  let completed = 0;

  const filteredTasks = currentFilter
    ? tasks.filter((t) => t.label === currentFilter)
    : tasks;

  filteredTasks.forEach((task) => {
    const card = document.createElement("div");
    card.className = "task-card" + (task.done ? " done" : "");

    const info = document.createElement("div");
    info.className = "task-info";

    const name = document.createElement("span");
    name.className = "task-name";
    name.textContent = task.name;

    const label = document.createElement("span");
    label.className = "task-label";
    label.textContent = task.label;
    label.style.cursor = "pointer";
    label.onclick = () => {
      currentFilter = task.label;
      renderTasks();
    };

    const date = document.createElement("span");
    date.className = "task-date";
    date.textContent = `Criado em: ${task.createdAt}`;

    info.appendChild(name);
    if (task.label) info.appendChild(label);
    info.appendChild(date);

    const actions = document.createElement("div");
    actions.className = "task-actions";

   if (task.done) {
  const undoBtn = document.createElement("button");
  undoBtn.className = "conclude-btn";
  undoBtn.textContent = "↩️ Desfazer";
  undoBtn.onclick = () => {
    task.done = false;
    renderTasks();
  };
  actions.appendChild(undoBtn);
} else {
  const btn = document.createElement("button");
  btn.className = "conclude-btn";
  btn.textContent = "✔️ Concluir";
  btn.onclick = () => {
    task.done = true;
    renderTasks();
  };
  actions.appendChild(btn);
}

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => editTask(task.id);
    actions.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.className = "remove-btn";
    deleteBtn.onclick = () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      renderTasks();
    };
    actions.appendChild(deleteBtn);

    card.appendChild(info);
    card.appendChild(actions);
    taskList.appendChild(card);

    if (task.done) completed++;
  });

 taskCount.innerHTML = `
  ${completed} tarefa${completed !== 1 ? "s" : ""} concluída
  ${currentFilter ? ` • filtro: <strong>${currentFilter}</strong> <button onclick="clearFilter()" class="clear-btn">Limpar filtro</button>` : ""}
  <br><button onclick="clearAll()" class="clear-btn">🧹 Limpar tudo</button>
`;

  localStorage.setItem("board-tarefas", JSON.stringify(tasks));
}

function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  const newName = prompt("Novo nome da tarefa:", task.name);
  const newLabel = prompt("Nova etiqueta:", task.label);
  if (newName !== null) task.name = newName.trim();
  if (newLabel !== null) task.label = newLabel.trim();
  renderTasks();
}

function clearFilter() {
  currentFilter = "";
  renderTasks();
}

function clearAll() {
  if (confirm("Tem certeza que deseja apagar todas as tarefas?")) {
    tasks = [];
    renderTasks();
  }
}

renderTasks();

undoBtn.className = "conclude-btn undo";