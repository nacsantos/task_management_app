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

// Function to display tasks in the HTML
function displayTasks(tasks) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = ""; // Clear the list

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = "list-group-item";
    taskItem.innerHTML = `
      <strong>${task.title}</strong> - ${task.description}
      <span class="badge badge-${task.status === "completed" ? "success" : "warning"}">${task.status}</span>
      <button class="btn btn-info btn-sm float-right mr-2" onclick="openEditModal(${task.id}, '${task.title}', '${
      task.description
    }', '${task.status}')">Edit</button>
      <button class="btn btn-danger btn-sm float-right mr-2" onclick="deleteTask(${task.id})">Delete</button>
    `;
    taskList.appendChild(taskItem);
  });
}

// Function to open the modal and populate it with the task's data for editing
function openEditModal(id, title, description, status) {
  // Set task ID as a hidden field or as a global variable
  document.getElementById("task-id").value = id; // Assuming you add a hidden field for task id

  // Populate form fields with current task data
  document.getElementById("task-title").value = title;
  document.getElementById("task-desc").value = description;
  document.getElementById("task-status").value = status;

  // Change the form submit action to edit mode
  document.getElementById("task-form").onsubmit = function (event) {
    event.preventDefault();
    updateTask(id);
  };

  // Open the modal
  $("#taskModal").modal("show");
}

// Function to add a new task
async function addTask() {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;
  const status = document.getElementById("task-status").value;

  if (!title || !description) {
    alert("Please fill in all fields.");
    return;
  }

  const newTask = {
    title: title,
    description: description,
    status: status, // Capturing the status as well
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

    // Close the modal after the task is added
    $("#taskModal").modal("hide");
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

  if (!title || !description) {
    alert("Please fill in all fields.");
    return;
  }

  const updatedTask = {
    title: title,
    description: description,
    status: status,
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

    // Close the modal after the task is updated
    $("#taskModal").modal("hide");
  } catch (error) {
    console.error("Failed to update task:", error);
  }
}

// Fetch and display tasks on page load
window.onload = fetchTasks;
