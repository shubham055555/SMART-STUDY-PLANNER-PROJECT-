const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const statsDiv = document.getElementById("stats");
const progressBar = document.getElementById("progressBar");
const timeline = document.getElementById("timeline");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save to local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks list
function renderTasks(filter = "") {
  taskList.innerHTML = "";
  let pending = 0, done = 0, high = 0;

  tasks
    .filter(t => t.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach((task, index) => {
      const div = document.createElement("div");
      div.className = `task ${task.priority.toLowerCase()}`;
      if (task.completed) div.classList.add("done");

      div.innerHTML = `
        <h4>${task.title}</h4>
        <p>${task.description || ""}</p>
        <small>Priority: ${task.priority} | Deadline: ${task.deadline} | Est. ${task.hours || 0}h</small>
        <div class="actions">
          <button onclick="toggleComplete(${index})">${task.completed ? "↩ Undo" : "✔ Done"}</button>
          <button onclick="deleteTask(${index})">🗑 Delete</button>
        </div>
      `;
      taskList.appendChild(div);

      if (!task.completed) pending++;
      if (task.completed) done++;
      if (task.priority === "High" && !task.completed) high++;
    });

  statsDiv.textContent = `Tasks: ${tasks.length} | Pending: ${pending} | High: ${high} | Done: ${done} | Progress: ${tasks.length ? Math.round((done / tasks.length) * 100) : 0}%`;
  progressBar.style.width = `${tasks.length ? (done / tasks.length) * 100 : 0}%`;

  renderTimeline();
}

// Render timeline
function renderTimeline() {
  timeline.innerHTML = "";
  const sorted = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  sorted.forEach(task => {
    const li = document.createElement("li");
    li.textContent = `${task.deadline} — ${task.title}`;
    if (task.completed) li.style.textDecoration = "line-through";
    timeline.appendChild(li);
  });
}

// Toggle complete
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks(searchInput.value);
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks(searchInput.value);
}

// Handle form submit
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  const newTask = {
    title: document.getElementById("title").value,
    priority: document.getElementById("priority").value,
    deadline: document.getElementById("deadline").value,
    hours: document.getElementById("hours").value,
    description: document.getElementById("description").value,
    completed: false
  };
  tasks.push(newTask);
  saveTasks();
  taskForm.reset();
  renderTasks();
});

// Search filter
searchInput.addEventListener("input", e => {
  renderTasks(e.target.value);
});

// Initial render
renderTasks();
