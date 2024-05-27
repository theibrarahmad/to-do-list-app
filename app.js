const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

todoForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const newTask = todoInput.value;

  if (newTask === '') {
    alert('Please enter a task!');
    return;
  }
  todoInput.value = '';
  addTask(newTask);
});

function addTask(task, prepend = true) {
  const listItem = document.createElement('li');
  const taskText = document.createElement('span');
  taskText.textContent = task;
  listItem.appendChild(taskText);

  const checkBox = document.createElement('input');
  checkBox.setAttribute('type', 'checkbox');
  listItem.appendChild(checkBox);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  styleButton(deleteButton, '#ff3b30');

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  styleButton(editButton, '#5f9ea0');

  listItem.appendChild(deleteButton);
  listItem.appendChild(editButton);

  checkBox.addEventListener('change', function() {
    taskText.style.textDecoration = this.checked ? 'line-through' : 'none';
  });

  deleteButton.addEventListener('click', function() {
    todoList.removeChild(listItem);
    saveTasksToLocalStorage();
  });

  editButton.addEventListener('click', function() {
    const isEditing = listItem.classList.contains('editing');

    if (isEditing) {
      const inputElement = listItem.querySelector('input[type="text"]');
      taskText.textContent = inputElement.value;
      listItem.removeChild(inputElement);
      listItem.insertBefore(taskText, checkBox); // Move the taskText before the checkbox
      listItem.classList.remove('editing');
      editButton.textContent = 'Edit';
      taskText.disabled = true;
      saveTasksToLocalStorage();
    } else {
      const inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.value = taskText.textContent;
      listItem.insertBefore(inputElement, taskText);
      listItem.removeChild(taskText);
      listItem.classList.add('editing');
      editButton.textContent = 'Save';
      inputElement.focus();
    }
  });

  if (prepend) {
    todoList.insertBefore(listItem, todoList.firstChild);
  } else {
    todoList.appendChild(listItem);
  }

  saveTasksToLocalStorage();
}

function styleButton(button, backgroundColor) {
  button.style.padding = '10px 20px';
  button.style.backgroundColor = backgroundColor;
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  button.style.transition = 'background-color 0.3s';
  button.style.marginTop = '5px';
}

function saveTasksToLocalStorage() {
  const tasks = [];
  document.querySelectorAll('#todo-list li').forEach(task => {
    const taskText = task.querySelector('span') ? task.querySelector('span').textContent : task.querySelector('input[type="text"]').value;
    const isCompleted = task.querySelector('input[type="checkbox"]').checked;
    const isEditing = task.classList.contains('editing');

    tasks.push({
      text: taskText,
      completed: isCompleted,
      editing: isEditing
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

document.addEventListener('DOMContentLoaded', function() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
 savedTasks.forEach(task => {
    addTask(task.text, false);
    const listItem = todoList.firstChild;
    if (task.completed) {
      listItem.querySelector('input[type="checkbox"]').checked = true;
      listItem.querySelector('span').style.textDecoration = 'line-through';
    }
    if (task.editing) {
      const editButton = listItem.querySelector('button:last-of-type');
      const taskText = listItem.querySelector('span');
      const inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.value = task.text;
      listItem.insertBefore(inputElement, taskText);
      listItem.removeChild(taskText);
      listItem.classList.add('editing');
      editButton.textContent = 'Save';
    }
  });
});
