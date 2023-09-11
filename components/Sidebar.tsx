import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import {
  MdLaptop,
  MdContacts,
  MdBarChart,
  MdTableBar,
  MdLogout,
} from "react-icons/md";
import { ReactNode, useEffect, useState } from "react";

import TodosList from "./TodosList";
import { apiEndPoint, token } from "@/config/variable";
import SearchBar from "./SearchBar";

type Todo = { id: number; completed?: boolean; title?: string; };


const Sidebar: React.FC = () => {
  const [showProducts, setShowProducts] = useState(false);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch todos from the API when the component mounts
    setLoading(true); // Set loading state to true while fetching
    fetch(`${apiEndPoint}/todos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const todosArray = Array.isArray(data?.todos) ? data.todos : [];
        setTodos(todosArray); // Update todos state with fetched data
      })
      .catch((error) => console.error('Error fetching todos:', error))
      .finally(() => setLoading(false)); // Set loading state to false when fetching is done
  }, []);

  const handleSearch = (query: string) => {
    // Implement your search logic here using the 'query' value.
    // You can filter 'todos' based on the search query.
    const filteredTodos = todos.filter((todo) =>
      todo.title?.toLowerCase().includes(query.toLowerCase())
    );
    setTodos(filteredTodos); // Update todos state with filtered data
  };

 

 


  return (
    <div className="flex h-screen">
      <nav className="h-screen w-64 bg-gray-800 text-white p-4">
        <ul className="space-y-4">
          {/* Profile Section */}
          <li className="flex items-center space-x-4">
           
            <div>
              <h5 className="font-semibold">Tdo App</h5>
              <span>Ludmil Avelino</span>
            </div>
          </li>

          <li className="uppercase font-semibold tracking-wide text-xs mt-4 mb-2">
            Painel
          </li>

          <li
            className="hover:bg-blue-500 p-2 rounded"
            onClick={() => {
              console.log("Produtos clicked!");
              setShowProducts(true); // Set showProducts to true when "Produtos" is clicked
            }}
          >
            <Link className="flex items-center space-x-3" href={""}>
              <MdContacts className="text-lg" />
              <span>Todo List</span>
            </Link>
          </li>

          <li
            className="hover:bg-blue-500 p-2 rounded"
            onClick={() => {
              console.log("Pedidos clicked!"); // Add this
             
            }}
          >
            <Link className="flex items-center space-x-3" href={""}>
              <MdLaptop className="text-lg" />
              <span>Todo Comlpeted</span>
            </Link>
          </li>

         

         

          {/* Menu Items */}

         
        </ul>
      </nav>

      <div className="max-w-xl mx-auto mt-8 p-4">
        {showProducts &&
     
         <><SearchBar onSearch={handleSearch} /><TodosList todos={todos} /></>
       }{" "}
        {/* Conditionally render Products based on showProducts state */}
      </div>
    </div>
  );
};

export default Sidebar;
