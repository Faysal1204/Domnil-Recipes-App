import React from 'react';
import { Link } from 'react-router-dom';
import type { RecipeSummary } from '../types';
import { HeartIcon, ClockIcon, UserGroupIcon } from './icons/NavIcons';

const RecipeCard = ({ recipe }: { recipe: RecipeSummary }) => {
  return (
    <Link to={`/recipe/${recipe.id}`} className="block group bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="relative">
            <img className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" src={recipe.image} alt={recipe.title} loading="lazy"/>
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-colors duration-300"></div>
            <button 
                className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-gray-700 hover:text-red-500 transition-colors duration-200" 
                onClick={(e) => { e.preventDefault(); alert('Added to favorites!'); }}
                aria-label="Add to favorites"
            >
                <HeartIcon className="h-5 w-5" />
            </button>
        </div>
        <div className="p-4">
            <h3 className="font-bold text-base md:text-lg text-gray-800 truncate group-hover:text-primary transition-colors duration-300">{recipe.title}</h3>
            {(recipe.readyInMinutes || recipe.servings) && (
            <div className="flex items-center text-sm text-gray-600 mt-2">
                {recipe.readyInMinutes && (
                    <div className="flex items-center mr-4">
                        <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{recipe.readyInMinutes} min</span>
                    </div>
                )}
                {recipe.servings && (
                    <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{recipe.servings} servings</span>
                    </div>
                )}
            </div>
            )}
        </div>
    </Link>
  );
};

export default RecipeCard;