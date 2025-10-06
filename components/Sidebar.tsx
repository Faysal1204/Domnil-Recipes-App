import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, CalendarIcon, ShoppingCartIcon, SparklesIcon, PriceTagIcon, CubeIcon } from './icons/NavIcons';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Recipes', href: '/recipes', icon: BookOpenIcon },
  { name: 'Ingredients', href: '/ingredients', icon: PriceTagIcon },
  { name: 'Products', href: '/products', icon: CubeIcon },
  { name: 'Planner', href: '/planner', icon: CalendarIcon },
  { name: 'Grocery List', href: '/grocery-list', icon: ShoppingCartIcon },
  { name: 'AI Assistant', href: '/assistant', icon: SparklesIcon },
];

const Sidebar = () => {
  const NavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-emerald-100 hover:text-gray-900'
    }`;

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex items-center h-20 px-6 border-b">
        <h1 className="text-2xl font-bold text-primary">Domnil</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink key={item.name} to={item.href} className={NavLinkClasses} end>
            <item.icon className="h-6 w-6 mr-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;