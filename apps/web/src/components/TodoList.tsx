"use client";

import React, { useState } from "react";
import { produce } from "immer";

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, title: "Buy milk" },
    { id: 2, title: "Call mom" },
  ]);

  const addTodo = () => {
    const newTodo = { id: Date.now(), title: "New todo" };

    setTodos(
      produce((draft) => {
        draft.push(newTodo);
      })
    );
  };

  const deleteTodo = (id) => {
    setTodos(
      produce((draft) => {
        const index = draft.findIndex((todo) => todo.id === id);
        if (index !== -1) {
          draft.splice(index, 1);
        }
      })
    );
  };

  return (
    <div>
      <button onClick={addTodo}>Add todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
