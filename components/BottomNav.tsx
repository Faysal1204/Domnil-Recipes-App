import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, CalendarIcon, ShoppingCartIcon, PlusIcon } from './icons/NavIcons';

const navLeft = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Recipes', href: '/recipes', icon: BookOpenIcon },
];

const navRight = [
  { name: 'Planner', href: '/planner', icon: CalendarIcon },
  { name: 'Groceries', href: '/grocery-list', icon: ShoppingCartIcon },
];

const BottomNav = () => {
  const NavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-lg flex justify-around items-center z-50">
      {navLeft.map((item) => (
        <NavLink key={item.name} to={item.href} className={NavLinkClasses} end>
          <item.icon className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">{item.name}</span>
        </NavLink>
      ))}
      
      <Link 
        to="/recipes" 
        className="flex items-center justify-center -mt-8 w-16 h-16 bg-primary rounded-full shadow-lg text-white hover:bg-primary-dark transition-transform duration-300 hover:scale-110"
        aria-label="Add Recipe"
      >
        <PlusIcon className="h-8 w-8" />
      </Link>

      {navRight.map((item) => (
        <NavLink key={item.name} to={item.href} className={NavLinkClasses} end>
          <item.icon className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
