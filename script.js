document.addEventListener("DOMContentLoaded", function () {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const tasksContainer = document.getElementById("tasks");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => {
    addTaskToDOM(task.text, task.completed);
  });

  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
      addTask(taskText);
      taskInput.value = "";
    }
  });

  function addTaskToDOM(text, completed = false) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    if (completed) {
      taskDiv.classList.add("completed");
    }
    taskDiv.innerHTML = `
          <input type="checkbox" ${completed ? "checked" : ""}>
          <label>${text}</label>
          <input type="text" class="edit-input" value="${text}">
          <button class="edit-btn">Edit</button>
          <button class="save-btn" style="display: none;">Save</button>
          <button class="cancel-btn" style="display: none;">Cancel</button>
          <button class="delete-btn">Delete</button>
      `;
    tasksContainer.appendChild(taskDiv);

    const checkbox = taskDiv.querySelector("input[type='checkbox']");
    const editBtn = taskDiv.querySelector(".edit-btn");
    const saveBtn = taskDiv.querySelector(".save-btn");
    const cancelBtn = taskDiv.querySelector(".cancel-btn");
    const deleteBtn = taskDiv.querySelector(".delete-btn");
    const editInput = taskDiv.querySelector(".edit-input");
    const label = taskDiv.querySelector("label");

    checkbox.addEventListener("change", function () {
      taskDiv.classList.toggle("completed");
      updateTaskCompleted(text, checkbox.checked);
      updateLocalStorage();
    });

    editBtn.addEventListener("click", function () {
      editInput.style.display = "inline-block";
      editInput.focus();
      editBtn.style.display = "none";
      saveBtn.style.display = "inline-block";
      cancelBtn.style.display = "inline-block";
      label.style.display = "none";
    });

    saveBtn.addEventListener("click", function () {
      const newText = editInput.value.trim();
      if (newText !== "") {
        label.textContent = newText;
        editInput.style.display = "none";
        editBtn.style.display = "inline-block";
        saveBtn.style.display = "none";
        cancelBtn.style.display = "none";
        label.style.display = "inline";
        updateTaskText(text, newText);
        updateLocalStorage();
      }
    });

    cancelBtn.addEventListener("click", function () {
      editInput.style.display = "none";
      editBtn.style.display = "inline-block";
      saveBtn.style.display = "none";
      cancelBtn.style.display = "none";
      label.style.display = "inline";
    });

    deleteBtn.addEventListener("click", function () {
      taskDiv.remove();
      tasks = tasks.filter((task) => task.text !== text);
      updateLocalStorage();
    });
  }

  function addTask(text) {
    const task = {
      text: text,
      completed: false,
    };
    tasks.push(task);
    addTaskToDOM(task.text);
    updateLocalStorage();
  }

  function updateTaskText(oldText, newText) {
    tasks.forEach((task) => {
      if (task.text === oldText) {
        task.text = newText;
      }
    });
  }

  function updateTaskCompleted(text, completed) {
    tasks.forEach((task) => {
      if (task.text === text) {
        task.completed = completed;
      }
    });
  }

  function updateLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});
