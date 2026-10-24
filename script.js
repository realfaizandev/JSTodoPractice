const input = document.getElementById("input");
const button = document.getElementById("button");
const ul = document.getElementById("ul");

// LocalStorage se existing todos load karein agar maujood hon
let localTodos = JSON.parse(localStorage.getItem("todos")) || [];

// Initial render
render();

button.addEventListener("click", () => {
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
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
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
});

// Event delegation se delete aur edit handle karein
ul.addEventListener("click", (e) => {
  const target = e.target;
  const li = target.closest(".list-items");
  if (!li) return;

  const todoId = Number(li.dataset.id);

  // Delete button
  if (
    target.classList.contains("delete-icon") ||
    target.closest(".delete-icon")
  ) {
    localTodos = localTodos.filter((t) => t.id !== todoId);
    localStorage.setItem("todos", JSON.stringify(localTodos));
    render();
  }

  // Edit button
  if (target.classList.contains("edit-icon") || target.closest(".edit-icon")) {
    const todo = localTodos.find((t) => t.id === todoId);
    if (!todo) return;

    const newName = prompt("Edit your todo:", todo.todoName);
    if (newName !== null && newName.trim() !== "") {
      todo.todoName = newName.trim();
      localStorage.setItem("todos", JSON.stringify(localTodos));
      render();
    }
  }
});

function render() {
  ul.innerHTML = localTodos
    .map(
      (todo) => `
    <li class="list-items" data-id="${todo.id}">
      <span class="todo-text">${todo.todoName}</span>
      <div class="actions">
        <i class="bi bi-pencil-fill edit-icon"></i>
        <i class="bi bi-trash-fill delete-icon"></i>
      </div>
    </li>
  `,
    )
    .join("");
}
