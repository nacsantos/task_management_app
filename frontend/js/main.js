// Function to fetch all tasks from the backend API
async function fetchTasks() {
  try {
    const response = await fetch("http://localhost:3001/api/tasks");
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();
    console.log("Fetched tasks response:", data); // Log the raw response

    // Access the 'tasks' array inside the response object
    if (Array.isArray(data.tasks)) {
      displayTasks(data.tasks); // Pass the array of tasks to displayTasks
    } else {
      console.error("Expected an array but got:", data.tasks);
      alert("Failed to load tasks. Invalid response format.");
    }
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
  }
}

function displayTasks(tasks) {
  const pendingTaskList = document.getElementById("pending-task-list");
  const completedTaskList = document.getElementById("completed-task-list");
  pendingTaskList.innerHTML = ""; // Clear the pending list
  completedTaskList.innerHTML = ""; // Clear the completed list

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = "list-group-item";
    taskItem.innerHTML = `
      <strong>${task.title}</strong> - ${task.description}
      <span class="task-details">
        <span class="badge bg-${task.status === "completed" ? "success" : "warning"}">${task.status}</span>
        <span class="badge bg-info mr-2">${new Date(task.date).toLocaleDateString()}</span>
      </span>
      <div class="btn-group btn-group-sm float-right">
        <button class="btn btn-info" onclick="openEditModal(${task.id}, '${task.title}', '${task.description}', '${
      task.status
    }', '${task.date}')">Editar</button>
        <button class="btn btn-danger" onclick="deleteTask(${task.id})">Apagar</button>
      </div>
    `;

    // Append task to the appropriate list based on its status
    if (task.status === "pending") {
      pendingTaskList.appendChild(taskItem);
    } else if (task.status === "completed") {
      completedTaskList.appendChild(taskItem);
    }
  });
}

function openEditModal(id, title, description, status, date) {
  document.getElementById("task-id").value = id; // Set the hidden task ID
  document.getElementById("task-title").value = title;
  document.getElementById("task-desc").value = description;
  document.getElementById("task-status").value = status;
  document.getElementById("task-date").value = date;

  // Change the form submit action to edit mode
  document.getElementById("task-form").onsubmit = function (event) {
    event.preventDefault();
    updateTask(id);
  };

  // Open the modal using Bootstrap 5 API
  const taskModal = new bootstrap.Modal(document.getElementById("taskModal"));
  taskModal.show();
}

// Function to add a new task
async function addTask() {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;
  const status = document.getElementById("task-status").value;
  const date = document.getElementById("task-date").value;

  if (!title || !description || !date) {
    alert("Please fill in all fields.");
    return;
  }

  const newTask = {
    title: title,
    description: description,
    status: status,
    date: date,
  };

  try {
    const response = await fetch("http://localhost:3001/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    document.getElementById("task-form").reset(); // Clear the form
    fetchTasks(); // Refresh the task list
    const taskModal = bootstrap.Modal.getInstance(document.getElementById("taskModal"));
    taskModal.hide(); // Close the modal
  } catch (error) {
    console.error("Failed to add task:", error);
  }
}

// Function to delete a task
async function deleteTask(id) {
  try {
    const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    fetchTasks(); // Refresh the task list
  } catch (error) {
    console.error("Failed to delete task:", error);
  }
}

// Function to update an existing task
async function updateTask(id) {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;
  const status = document.getElementById("task-status").value;
  const date = document.getElementById("task-date").value;

  if (!title || !description || !date) {
    alert("Please fill in all fields.");
    return;
  }

  const updatedTask = {
    title: title,
    description: description,
    status: status,
    date: date,
  };

  try {
    const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) {
      throw new Error("Failed to update task.");
    }

    document.getElementById("task-form").reset(); // Clear the form
    fetchTasks(); // Refresh the task list
    const taskModal = bootstrap.Modal.getInstance(document.getElementById("taskModal"));
    taskModal.hide(); // Close the modal
  } catch (error) {
    console.error("Failed to update task:", error);
  }
}

// Fetch and display tasks on page load
window.onload = fetchTasks;
