import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuIcon, SearchIcon } from './icons/NavIcons';

const MobileHeader = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/recipes?q=${encodeURIComponent(query.trim())}`);
      setQuery(''); 
    }
  };

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
      <div className="h-16 grid grid-cols-3 items-center px-4">
        <div className="justify-self-start">
            <button className="p-2 text-gray-600" aria-label="Menu">
                <MenuIcon className="h-6 w-6" />
            </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 text-center">Domnil</h1>
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            name="search"
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full bg-gray-100 border border-transparent rounded-lg py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:bg-white focus:border-primary focus:ring-primary transition-colors"
            placeholder="Quick find: tags, recipes & more"
          />
        </form>
      </div>
    </header>
  );
};

export default MobileHeader;
