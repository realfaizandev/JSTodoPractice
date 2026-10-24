const input = document.getElementById("input");
const button = document.getElementById("button");
const ul = document.getElementById("ul");

// LocalStorage se existing todos load karein agar maujood hon
let localTodos = JSON.parse(localStorage.getItem("todos")) || [];
// Reload hone par kisi ka edit mode khula na reh jaye
localTodos.forEach((t) => (t.isEditing = false));

// Initial render
render();

// Todo add karne ka function (DRY)
function createTodo() {
  const text = input.value.trim();
  if (!text) return;

  const addTodo = {
    id: Date.now(),
    todoName: text,
    isCompleted: false,
    isEditing: false,
  };

  localTodos.push(addTodo);
  localStorage.setItem("todos", JSON.stringify(localTodos));
  render();

  // Clear input field
  input.value = "";
}

button.addEventListener("click", createTodo);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    createTodo();
  }
});

// Edit save karne ka helper function
function saveEdit(todoId, explicitValue) {
  const todo = localTodos.find((t) => t.id === todoId);
  if (!todo) return;

  let newName = explicitValue;
  if (newName === undefined) {
    const editInput = ul.querySelector(`[data-id="${todoId}"] .edit-input`);
    newName = editInput ? editInput.value : todo.todoName;
  }

  newName = newName.trim();
  if (newName !== "") {
    todo.todoName = newName;
  }

  todo.isEditing = false;
  localStorage.setItem("todos", JSON.stringify(localTodos));
  render();
}

// Event delegation se click actions (Delete, Edit, Save, Cancel)
ul.addEventListener("click", (e) => {
  const target = e.target;
  const li = target.closest(".list-items");
  if (!li) return;

  const todoId = Number(li.dataset.id);

  // 1. Delete button
  if (
    target.classList.contains("delete-icon") ||
    target.closest(".delete-icon")
  ) {
    localTodos = localTodos.filter((t) => t.id !== todoId);
    localStorage.setItem("todos", JSON.stringify(localTodos));
    render();
    return;
  }

  // 2. Edit button (pencil icon)
  if (target.classList.contains("edit-icon") || target.closest(".edit-icon")) {
    const todo = localTodos.find((t) => t.id === todoId);
    if (!todo) return;

    // Baqi sabhi todos ka edit mode false karein taake ek waqt me ek hi edit ho
    localTodos.forEach((t) => (t.isEditing = false));
    todo.isEditing = true;
    render();

    // Input par focus le aayein
    const editInput = ul.querySelector(`[data-id="${todoId}"] .edit-input`);
    if (editInput) {
      editInput.focus();
      editInput.selectionStart = editInput.selectionEnd =
        editInput.value.length;
    }
    return;
  }

  // 3. Save button (green check icon)
  if (target.classList.contains("save-icon") || target.closest(".save-icon")) {
    saveEdit(todoId);
    return;
  }

  // 4. Cancel button (cross icon)
  if (
    target.classList.contains("cancel-icon") ||
    target.closest(".cancel-icon")
  ) {
    const todo = localTodos.find((t) => t.id === todoId);
    if (todo) {
      todo.isEditing = false;
      render();
    }
    return;
  }
});

// Edit input mein keyboard Enter dabane se save aur Escape se cancel
ul.addEventListener("keydown", (e) => {
  if (e.target.classList.contains("edit-input")) {
    const li = e.target.closest(".list-items");
    const todoId = Number(li.dataset.id);

    if (e.key === "Enter") {
      saveEdit(todoId, e.target.value);
    } else if (e.key === "Escape") {
      const todo = localTodos.find((t) => t.id === todoId);
      if (todo) {
        todo.isEditing = false;
        render();
      }
    }
  }
});

function render() {
  ul.innerHTML = localTodos
    .map((todo) => {
      if (todo.isEditing) {
        return `
          <li class="list-items" data-id="${todo.id}">
            <input type="text" class="edit-input" value="${todo.todoName}" />
            <div class="actions">
              <i class="bi bi-check-lg save-icon" title="Save"></i>
              <i class="bi bi-x-lg cancel-icon" title="Cancel"></i>
            </div>
          </li>
        `;
      }
      return `
        <li class="list-items" data-id="${todo.id}">
          <span class="todo-text">${todo.todoName}</span>
          <div class="actions">
            <i class="bi bi-pencil-fill edit-icon" title="Edit"></i>
            <i class="bi bi-trash-fill delete-icon" title="Delete"></i>
          </div>
        </li>
      `;
    })
    .join("");
}
