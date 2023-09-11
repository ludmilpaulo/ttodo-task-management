// pages/index.tsx

import { apiEndPoint, token } from '@/config/variable';
import { useState, useEffect } from 'react';
import { Transition } from "@headlessui/react"; 
import TodosList from '@/components/TodosList';
import SearchBar from '@/components/SearchBar';
import Sidebar from '@/components/Sidebar';



export default function Home() {
 

  return (
    <>
     <Sidebar/>
    </>
  );
}
