import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { spoonacularService } from '../services/spoonacularService';
import type { Recipe } from '../types';
import RecipeCard from '../components/RecipeCard';
import Loader from '../components/Loader';
import { BookOpenIcon, CalendarIcon, PriceTagIcon, CubeIcon } from '../components/icons/NavIcons';

const Home = () => {
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await spoonacularService.getRandomRecipes(4);
        setRecentRecipes(data.recipes);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch recipes.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <div className="grid grid-cols-4 gap-2 md:gap-4 text-center">
          <ActionButton to="/recipes" title="Recipes" icon={BookOpenIcon} />
          <ActionButton to="/ingredients" title="Ingredients" icon={PriceTagIcon} />
          <ActionButton to="/products" title="Products" icon={CubeIcon} />
          <ActionButton to="/planner" title="Meal Planning" icon={CalendarIcon} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Recent recipes</h2>
        {loading && <Loader />}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-2 gap-4">
            {recentRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const ActionButton = ({ to, title, icon: Icon }: { to: string; title: string; icon: React.ElementType; }) => (
    <Link to={to} className="flex flex-col items-center justify-center p-2 space-y-2 group">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl group-hover:bg-emerald-100 transition-colors duration-300">
            <Icon className="h-8 w-8 text-gray-600 group-hover:text-primary transition-colors duration-300" />
        </div>
        <span className="text-sm font-medium text-gray-700">{title}</span>
    </Link>
);

export default Home;