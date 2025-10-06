import React, { useState } from 'react';
import { spoonacularService } from '../services/spoonacularService';
import type { RecipeSummary } from '../types';
import RecipeCard from '../components/RecipeCard';
import Loader from '../components/Loader';

const diets = [ "Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal", "Low FODMAP", "Whole30" ];
const cuisines = [ "African", "Asian", "American", "British", "Cajun", "Caribbean", "Chinese", "Eastern European", "European", "French", "German", "Greek", "Indian", "Irish", "Italian", "Japanese", "Jewish", "Korean", "Latin American", "Mediterranean", "Mexican", "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese" ];

const Ingredients = () => {
    const [ingredients, setIngredients] = useState('');
    const [diet, setDiet] = useState('');
    const [cuisine, setCuisine] = useState('');
    
    const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!ingredients.trim()) {
            setError("Please enter at least one ingredient.");
            return;
        }

        setLoading(true);
        setError(null);
        setSearched(true);
        setRecipes([]);

        try {
            const ingredientsList = ingredients.split(',').map(i => i.trim()).join(',');
            const searchParams = {
                ingredients: ingredientsList,
                diet: diet || undefined,
                cuisine: cuisine || undefined,
            };
            const data = await spoonacularService.findRecipesByCriteria(searchParams);
            setRecipes(data.results);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch recipes.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-gray-800">Find by Ingredients</h1>
                <p className="mt-1 text-gray-600">Discover recipes you can make with what you have.</p>
            </header>
            
            <div className="bg-white p-4 rounded-xl shadow-md">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div>
                        <label htmlFor="ingredients-input" className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                        <input
                            id="ingredients-input"
                            type="text"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="e.g., chicken, broccoli, rice"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate ingredients with a comma.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="diet-select" className="block text-sm font-medium text-gray-700 mb-1">Diet (Optional)</label>
                            <select id="diet-select" value={diet} onChange={e => setDiet(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition">
                                <option value="">Any Diet</option>
                                {diets.map(d => <option key={d} value={d.toLowerCase()}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="cuisine-select" className="block text-sm font-medium text-gray-700 mb-1">Cuisine (Optional)</label>
                            <select id="cuisine-select" value={cuisine} onChange={e => setCuisine(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition">
                                <option value="">Any Cuisine</option>
                                {cuisines.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300" disabled={loading}>
                        {loading ? 'Searching...' : 'Find Recipes'}
                    </button>
                </form>
            </div>

            {loading && <Loader />}
            {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
            
            {!loading && !error && searched && recipes.length === 0 && (
                <p className="text-center text-gray-600 mt-8">No recipes found matching your criteria. Try removing some filters or adding more ingredients!</p>
            )}

            {!loading && !error && recipes.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {recipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Ingredients;