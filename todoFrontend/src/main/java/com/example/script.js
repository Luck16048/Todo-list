const API_BASE = 'http://localhost:8081/todo';

const listEl = document.getElementById('todo-list');
const formEl = document.getElementById('add-form');
const inputEl = document.getElementById('add-input');
const emptyStateEl = document.getElementById('empty-state');
const errorBannerEl = document.getElementById('error-banner');
const countEl = document.getElementById('todo-count');
const dateEl = document.getElementById('docket-date');
const itemTemplate = document.getElementById('todo-item-template');

dateEl.textContent = new Date()
  .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  .toUpperCase();


function renderList(todos) {
  listEl.innerHTML = '';

  if (todos.length === 0) {
    emptyStateEl.hidden = false;
  } else {
    emptyStateEl.hidden = true;
    todos.forEach(renderItem);
  }

  updateCount(todos);
}

function renderItem(todo) {
  const node = itemTemplate.content.cloneNode(true);
  const li = node.querySelector('.todo');

  li.dataset.id = todo.id;
  if (todo.completed) li.classList.add('completed');

  const titleEl = li.querySelector('.todo__title');
  const editInputEl = li.querySelector('.todo__edit-input');
  titleEl.textContent = todo.title;


  li.querySelector('.todo__check').addEventListener('click', () => {
    toggleCompleted(todo.id, !todo.completed);
  });

  li.querySelector('.icon-btn--edit').addEventListener('click', () => {
    titleEl.hidden = true;
    editInputEl.hidden = false;
    editInputEl.value = todo.title;
    editInputEl.focus();
    editInputEl.select();
  });

  const commitEdit = () => {
    const newTitle = editInputEl.value.trim();
    titleEl.hidden = false;
    editInputEl.hidden = true;
    if (newTitle && newTitle !== todo.title) {
      updateTitle(todo.id, newTitle);
    }
  };

  editInputEl.addEventListener('blur', commitEdit);
  editInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') editInputEl.blur();
    if (e.key === 'Escape') {
      editInputEl.value = todo.title;
      editInputEl.blur();
    }
  });

  li.querySelector('.icon-btn--delete').addEventListener('click', () => {
    removeTodo(todo.id, li);
  });

  listEl.appendChild(node);
}

function updateCount(todos) {
  const open = todos.filter((t) => !t.completed).length;
  const done = todos.length - open;
  countEl.textContent = todos.length === 0 ? '—' : `${open} open · ${done} done`;
}

function showError(show) {
  errorBannerEl.hidden = !show;
}

async function loadTodos() {
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error(`GET /todo failed: ${response.status}`);
    const todos = await response.json();
    showError(false);
    renderList(todos);
  } catch (err) {
    console.error('Failed to load tasks:', err);
    showError(true);
  }
}

async function addTodo(title) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) throw new Error(`POST /todo failed: ${response.status}`);
    showError(false);
    await loadTodos();
  } catch (err) {
    console.error('Failed to add task:', err);
    showError(true);
  }
}

async function toggleCompleted(id, completed) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!response.ok) throw new Error(`PATCH /todo/${id} failed: ${response.status}`);
    showError(false);
    await loadTodos();
  } catch (err) {
    console.error('Failed to update status:', err);
    showError(true);
  }
}

async function updateTitle(id, title) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) throw new Error(`PATCH /todo/${id} failed: ${response.status}`);
    showError(false);
    await loadTodos();
  } catch (err) {
    console.error('Failed to update task text:', err);
    showError(true);
  }
}

async function removeTodo(id, li) {
  li.classList.add('removing');
  try {
    const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`DELETE /todo/${id} failed: ${response.status}`);
    showError(false);
    setTimeout(() => loadTodos(), 200);
  } catch (err) {
    console.error('Could not delete task:', err);
    li.classList.remove('removing');
    showError(true);
  }
}


formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = inputEl.value.trim();

  if (!title) {
    inputEl.classList.add('shake');
    setTimeout(() => inputEl.classList.remove('shake'), 350);
    return;
  }

  addTodo(title);
  inputEl.value = '';
});

loadTodos();