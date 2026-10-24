const input = document.getElementById("input");
const button = document.getElementById("button");
const listContainer = document.getElementById("listContainer");

let todos = [];

button.addEventListener("click", function () {
  const newTodo = {
    id: Date.now(),
    todoName: input.value,
    isCompleted: false,
    isEditing: false,
    delete: false,
  };

  todos.push(newTodo);

  //   renderTodos();
});

