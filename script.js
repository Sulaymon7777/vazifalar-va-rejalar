// ==========================================================================
// Vazifalar va Rejalar Ro'yxati (To-Do List) - JavaScript Funksionalligi
// ==========================================================================

// Boshlang'ich default vazifalar (agar localStorage bo'sh bo'lsa)
const DEFAULT_TODOS = [
  { id: 1, text: "Kodni yozib tugatish", completed: true },
  { id: 2, text: "Loyiha dizaynini yaratish", completed: false },
  { id: 3, text: "Vazifalar funksionalini sinovdan o'tkazish", completed: false }
];

// DOM Elementlari
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const badgeCounter = document.getElementById("badgeCounter");
const completedCount = document.getElementById("completedCount");
const totalCount = document.getElementById("totalCount");
const footerStats = document.getElementById("footerStats");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

// LocalStorage'dan ma'lumotlarni olish
let todos = [];

function loadTodos() {
  const saved = localStorage.getItem("todos_data");
  if (saved) {
    try {
      todos = JSON.parse(saved);
    } catch (e) {
      todos = [...DEFAULT_TODOS];
    }
  } else {
    todos = [...DEFAULT_TODOS];
    saveTodos();
  }
}

// LocalStorage'ga saqlash
function saveTodos() {
  localStorage.setItem("todos_data", JSON.stringify(todos));
}

// Ro'yxatni sahifada chizish (Render)
function renderTodos() {
  todoList.innerHTML = "";

  if (todos.length === 0) {
    todoList.innerHTML = `
      <li class="empty-state">
        <span>✨</span>
        <p>Hozircha hech qanday vazifa yo'q. Yangi vazifa qo'shing!</p>
      </li>
    `;
  } else {
    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = `todo-item ${todo.completed ? "completed" : ""}`;
      li.dataset.id = todo.id;

      li.innerHTML = `
        <div class="todo-content-group">
          <button type="button" class="custom-checkbox" aria-label="${todo.completed ? "Bajarilmagan deb belgilash" : "Bajarilgan deb belgilash"}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
          <span class="todo-text">${escapeHtml(todo.text)}</span>
        </div>
        <button type="button" class="delete-btn" aria-label="Vazifani o'chirish" title="O'chirish">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      `;

      // Butun qator yoki checkbox bosilganda holatni o'zgartirish
      li.querySelector(".todo-content-group").addEventListener("click", () => {
        toggleTodo(todo.id);
      });

      // O'chirish tugmasi bosilganda
      const deleteBtn = li.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTodo(todo.id);
      });

      todoList.appendChild(li);
    });
  }

  updateCounters();
}

// Yangi vazifa qo'shish
function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const newTodo = {
    id: Date.now(),
    text: trimmed,
    completed: false
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();
  todoInput.value = "";
  todoInput.focus();
}

// Bajarilgan/bajarilmagan holatni almashtirish (Toggle)
function toggleTodo(id) {
  todos = todos.map((item) => {
    if (item.id === id) {
      return { ...item, completed: !item.completed };
    }
    return item;
  });

  saveTodos();
  renderTodos();
}

// Vazifani o'chirish
function deleteTodo(id) {
  todos = todos.filter((item) => item.id !== id);
  saveTodos();
  renderTodos();
}

// Bajarilganlarni barchasini tozalash
function clearCompleted() {
  const hasCompleted = todos.some((item) => item.completed);
  if (!hasCompleted) return;

  todos = todos.filter((item) => !item.completed);
  saveTodos();
  renderTodos();
}

// Hisoblagichlarni yangilash
function updateCounters() {
  const total = todos.length;
  const completed = todos.filter((item) => item.completed).length;

  if (completedCount) completedCount.textContent = completed;
  if (totalCount) totalCount.textContent = total;

  if (footerStats) {
    if (total === 0) {
      footerStats.textContent = "Vazifalar ro'yxati bo'sh";
    } else {
      footerStats.textContent = `${total} ta vazifadan ${completed} tasi bajarildi`;
    }
  }

  if (clearCompletedBtn) {
    clearCompletedBtn.style.visibility = completed > 0 ? "visible" : "hidden";
  }
}

// Xavfsiz matn uchun HTML escape funksiyasi
function escapeHtml(string) {
  const div = document.createElement("div");
  div.textContent = string;
  return div.innerHTML;
}

// Event Listeners
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo(todoInput.value);
});

if (clearCompletedBtn) {
  clearCompletedBtn.addEventListener("click", clearCompleted);
}

// Boshlang'ich yuklash
document.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  renderTodos();
});
