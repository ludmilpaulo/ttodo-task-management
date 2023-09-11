import Link from "next/link";
import { MdContacts } from "react-icons/md";
import { useState } from "react";

import TodosList from "./TodosList";

type Todo = { id: number; completed?: boolean; title?: string };

const Sidebar: React.FC = () => {
  const [showTodoList, setShowTodoList] = useState(false);
  const [showCompletedTodos, setShowCompletedTodos] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex h-screen">
      <nav className="h-screen w-64 bg-gray-800 text-white p-4">
        <ul className="space-y-4">
         
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
              //  setShowTodoList(true); // Set showProducts to true when "Produtos" is clicked
            }}
          >
            <Link className="flex items-center space-x-3" href={""}>
              <MdContacts className="text-lg" />
              <span>Todo List</span>
            </Link>
          </li>

        </ul>
      </nav>

      <div className="max-w-xl mx-auto mt-8 p-4">
        <div>
          <>
            <TodosList />
          </>
          {showTodoList && (
            <>
              <TodosList />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
