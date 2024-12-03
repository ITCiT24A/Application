// Base Task class representing a task
class Task {
    constructor(taskText) {
        this.taskText = taskText;
        this.timestamp = new Date().toLocaleString();
        this.completed = false;
    }

    // Toggle task completion status
    toggleCompletion() {
        this.completed = !this.completed;
    }

    // Get task's HTML representation
    getTaskHTML() {
        return `
            <span class="task-text">${this.taskText}</span>
            <div class="timestamp" style="margin-top: 0.5rem; color: gray;">Date Added: ${this.timestamp}</div>
            <div style="margin-top: 0.5rem;">
                <button class="btn btn-success btn-sm doneButton">Done</button>
                <button class="btn btn-warning btn-sm editButton">Edit</button>
                <button class="btn btn-danger btn-sm removeButton">Remove</button>
            </div>
        `;
    }
}

// Extended TodoTask class (inherits from Task class) to manage individual task behaviors
class TodoTask extends Task {
    constructor(taskText) {
        super(taskText);
    }

    // Overriding to provide a customized HTML output with task-specific behavior
    getTaskHTML() {
        const taskHTML = super.getTaskHTML();
        return `<li class="list-group-item todo-item">${taskHTML}</li>`;
    }

    // Toggle the completion of the task and return updated HTML
    toggleCompletion() {
        super.toggleCompletion();
        return this.getTaskHTML(); // Return the updated HTML for the task
    }
}

// Main TodoList class
class TodoList {
    constructor() {
        this.editingIndex = -1;
        this.tasks = [];

        this.addButton = document.getElementById('addButton');
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');

        this.addButton.addEventListener('click', () => this.addOrUpdateTask());
        this.todoList.addEventListener('click', (e) => {
            const action = e.target.classList.contains('removeButton') ? 'remove' : 
                           e.target.classList.contains('editButton') ? 'edit' : 
                           e.target.classList.contains('doneButton') ? 'done' : null;
            if (action) this[action + 'Task'](e);
        });
    }

    // Add or update task (using polymorphism)
    addOrUpdateTask() {
        const taskText = this.todoInput.value.trim();
        if (taskText) {
            if (this.editingIndex === -1) {
                this.addTask(taskText);
            } else {
                this.updateTask(taskText);
            }
            this.todoInput.value = '';
        }
    }

    // Add a new task to the list (encapsulation)
    addTask(taskText) {
        const newTask = new TodoTask(taskText);
        this.tasks.push(newTask);
        this.renderTasks();
    }

    // Update an existing task in the list
    updateTask(taskText) {
        const task = this.tasks[this.editingIndex];
        task.taskText = taskText;  // Update the task text
        this.renderTasks();
        this.resetEditing();
    }

    // Mark task as done (polymorphism: toggles completion state of the task)
    doneTask(event) {
        const taskItem = event.target.closest('.todo-item');
        const taskIndex = Array.from(this.todoList.children).indexOf(taskItem);
        const task = this.tasks[taskIndex];
        task.toggleCompletion();
        this.renderTasks();
    }

    // Remove a task from the list
    removeTask(event) {
        const taskItem = event.target.closest('.todo-item');
        const taskIndex = Array.from(this.todoList.children).indexOf(taskItem);
        this.tasks.splice(taskIndex, 1);
        this.renderTasks();
    }

    // Edit a task's text
    editTask(event) {
        const taskItem = event.target.closest('.todo-item');
        const taskIndex = Array.from(this.todoList.children).indexOf(taskItem);
        const task = this.tasks[taskIndex];

        this.todoInput.value = task.taskText;
        this.editingIndex = taskIndex;
        this.addButton.textContent = 'Update';
    }

    // Render all tasks in the todo list (encapsulation)
    renderTasks() {
        this.todoList.innerHTML = ''; // Clear current list
        this.tasks.forEach(task => {
            const taskHTML = task.getTaskHTML();
            this.todoList.insertAdjacentHTML('beforeend', taskHTML);
        });
    }

    // Reset editing mode
    resetEditing() {
        this.editingIndex = -1;
        this.addButton.textContent = 'Add';
    }
}

// Initialize the Todo List
document.addEventListener('DOMContentLoaded', () => new TodoList());
