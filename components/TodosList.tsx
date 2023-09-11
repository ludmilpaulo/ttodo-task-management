// components/TodosList.tsx

import { apiEndPoint, token } from '@/config/variable';
import { Transition } from '@headlessui/react';
import React, { useState } from 'react';

type Todo = { id: number; completed?: boolean; title?: string; };
type InsertTodo = { completed?: boolean; title?: string; };

const TodosList = ({ todos }: { todos: Todo[] }) => {
  const [newTodo, setNewTodo] = useState<InsertTodo>({ completed: false, title: '' });
  const [loading, setLoading] = useState(false);
  const [todosList, setTodos] = useState<Todo[]>(todos)

  const handleToggleTodo = (id: number) => {
    setLoading(true);
    // Send a PATCH request to toggle the completion status of a todo
    fetch(`${apiEndPoint}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((updatedTodo) => {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
          )
        );
        setLoading(false);
      })
      .catch((error) => console.error('Error toggling todo:', error));
  };

  const handleDeleteTodo = (id: number) => {
    setLoading(true);
    // Send a DELETE request to remove a todo
    fetch(`${apiEndPoint}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        setLoading(false);
      })
      .catch((error) => console.error('Error deleting todo:', error));
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`${apiEndPoint}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        const data = await response.json();
    
        setNewTodo({ completed: false, title: '' }); // Reset the newTodo state
      } else {
        alert("Failed to add todo. Please try again.");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("An error occurred while trying to add the todo. Please try again.");
    } finally {
      setLoading(false); // Set loading state to false when adding is done
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4">
     
    
      <Transition
        show={loading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Transition>
      {!loading && todos && todos.length > 0 ? (
        <ul className="list-disc pl-4">
          {todosList.map((todo) => (
            <li key={todo.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={todo?.completed || false}
                onChange={() => handleToggleTodo(todo.id)}
                className="mr-2"
              />
              <span className={todo?.completed ? 'line-through text-gray-500' : ''}>
                {todo?.title}
              </span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No todos available.</p>
      )}
    </div>
  );
};

export default TodosList;
