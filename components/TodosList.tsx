// components/TodosList.tsx

import { apiEndPoint, token } from "@/config/variable";
import { Transition } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";


type Todo = { id: number; completed?: boolean; title?: string };
type InsertTodo = { completed?: boolean; title?: string };

const TodosList = () => {
  const [newTodo, setNewTodo] = useState<InsertTodo>({
    completed: false,
    title: "",
  });
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [search, setSearch] = useState("");

  const [newTodoInputVisible, setNewTodoInputVisible] = useState(false);

  const fetchTodos = () => {
    setLoading(true);
    fetch(`${apiEndPoint}/todos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const todosArray = Array.isArray(data?.todos) ? data.todos : [];
        setTodos(todosArray);
      })
      .catch((error) => console.error("Error fetching todos:", error))
      .finally(() => setLoading(false));
  };

  const handleToggleTodo = (id: number) => {
    setLoading(true);
    console.log("Toggling todo with ID:", id);

    fetch(`${apiEndPoint}/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: true }),
    })
      .then((response) => response.json())
      .then((updatedTodo) => {
        console.log("Updated Todo:", updatedTodo);

        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id
              ? { ...todo, completed: updatedTodo.completed }
              : todo,
          ),
        );
        setLoading(false);
        fetchTodos();
      })
      .catch((error) => console.error("Error toggling todo:", error));
  };

  const handleDeleteTodo = (id: number) => {
    setLoading(true);
  
    fetch(`${apiEndPoint}/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        setLoading(false);
      })
      .catch((error) => console.error("Error deleting todo:", error));
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`${apiEndPoint}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        const data = await response.json();
       
        setNewTodo({ completed: false, title: "" });
      
        setTodos((prevTodos) => [...prevTodos, data.todo]);
       
        setNewTodoInputVisible(false);
        fetchTodos();
      } else {
        alert("Failed to add todo. Please try again.");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      alert(
        "An error occurred while trying to add the todo. Please try again.",
      );
    } finally {
      setLoading(false);
      setNewTodoInputVisible(false);
    }
  };

  useEffect(() => {
   
    fetchTodos();
  }, []);

  const searchFilterFunction = (e: string) => {
    if (e) {
      const newData = todos.filter(function (item) {
        const itemData = item.title
          ? item.title.toUpperCase()
          : "".toUpperCase();
        const textData = e.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setTodos(newData);
      setSearch(e);
    } else {
      setTodos(todos);
      setSearch(e);
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
        <div>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => searchFilterFunction(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg"
            />
          </div>

          <Modal
            isOpen={newTodoInputVisible}
            onRequestClose={() => setNewTodoInputVisible(false)}
            contentLabel="Add Todo Modal"
          >
            <div className="w-full h-full flex items-center justify-center bg-opacity-50 bg-gray-900 fixed top-0 left-0 z-50">
              <div className="w-96 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Add Todo</h2>
                <input
                  type="text"
                  placeholder="Enter a new todo"
                  className="w-full p-2 mb-4 border rounded-md"
                  value={newTodo.title}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, title: e.target.value })
                  }
                />
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 mr-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                    onClick={handleAdd}
                  >
                    Save
                  </button>
                  <button
                    className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                    onClick={() => setNewTodoInputVisible(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Modal>

          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300"></th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id} className="border-b border-gray-300">
                  <td className="px-6 py-4 whitespace-no-wrap">
                    <div className="flex items-center">
                      <div
                        className={`mr-2 ${
                          todo.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {todo.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    <input
                      type="checkbox"
                      checked={todo.completed || false}
                      onChange={() => handleToggleTodo(todo.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="bg-green-500 px-8 mx-24"
            onClick={() => setNewTodoInputVisible(true)}
          >
            Add Todo
          </button>
        </div>
      ) : (
        <p>No todos available.</p>
      )}
    </div>
  );
};

export default TodosList;
