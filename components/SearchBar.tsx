// components/SearchBar.tsx

import React, { useState } from 'react';

const SearchBar: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value); // Update the query state with the input value
    onSearch(event.target.value); // Call the onSearch callback with the updated query
  };

  return (
    <div className="flex mb-4">
        
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleSearch} 
        className="border border-gray-300 p-2 rounded-lg"
      />
    </div>
  );
};

export default SearchBar;
