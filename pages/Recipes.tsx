import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { spoonacularService } from '../services/spoonacularService';
import type { RecipeSummary } from '../types';
import RecipeCard from '../components/RecipeCard';
import Loader from '../components/Loader';

const Recipes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [ingredients, setIngredients] = useState('');
  const [searchType, setSearchType] = useState<'keyword' | 'ingredients'>('keyword');
  
  // State for search results
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(!!searchParams.get('q'));
  
  // State for initial suggested recipes
  const [suggestedRecipes, setSuggestedRecipes] = useState<RecipeSummary[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const performSearch = useCallback(async (searchTerm: string, type: 'keyword' | 'ingredients') => {
    setLoading(true);
    setError(null);
    setSearched(true);
    setRecipes([]);

    try {
      if (type === 'keyword') {
        if (!searchTerm.trim()) {
          setError("Please enter a keyword to search.");
          setLoading(false);
          return;
        }
        const data = await spoonacularService.searchRecipes(searchTerm);
        setRecipes(data.results);
      } else {
        if (!searchTerm.trim()) {
          setError("Please enter ingredients to search.");
          setLoading(false);
          return;
        }
        const ingredientsArray = searchTerm.split(',').map(i => i.trim());
        const data = await spoonacularService.findRecipesByIngredients(ingredientsArray);
        setRecipes(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recipes.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for handling search from URL query params
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      setSearchType('keyword');
      performSearch(q, 'keyword');
    }
  }, [searchParams, performSearch]);

  // Effect for fetching initial suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searched) {
        setSuggestionsLoading(true);
        try {
          const data = await spoonacularService.getRandomRecipes(4);
          setSuggestedRecipes(data.recipes);
        } catch (err) {
          console.error("Failed to fetch suggested recipes:", err);
          // Not setting a user-facing error for this non-critical feature
        } finally {
          setSuggestionsLoading(false);
        }
      }
    };
    fetchSuggestions();
  }, [searched]);
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchType === 'keyword') {
      if (query.trim()) {
        setSearchParams({ q: query.trim() });
      }
    } else {
      performSearch(ingredients, 'ingredients');
    }
  };
  
  const recipeGridClasses = "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Discover Recipes</h1>
        <p className="mt-1 text-gray-600">Find your next favorite meal.</p>
      </header>
      
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex border-b mb-4">
            <button onClick={() => setSearchType('keyword')} className={`px-4 py-2 font-semibold ${searchType === 'keyword' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>By Keyword</button>
            <button onClick={() => setSearchType('ingredients')} className={`px-4 py-2 font-semibold ${searchType === 'ingredients' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>By Ingredients</button>
        </div>
        
        <form onSubmit={handleFormSubmit}>
          {searchType === 'keyword' ? (
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., pasta, chicken stir-fry..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          ) : (
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g., flour, sugar, eggs..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          )}
          <button type="submit" className="mt-3 w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300" disabled={loading}>
            {loading ? 'Searching...' : 'Find Recipes'}
          </button>
        </form>
      </div>

      {loading && <Loader />}
      {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
      
      {!loading && !error && (
        <>
          {searched ? (
            recipes.length === 0 ? (
              <p className="text-center text-gray-600 mt-8">No recipes found. Try a different search!</p>
            ) : (
              <div className={recipeGridClasses}>
                {recipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )
          ) : (
            suggestionsLoading ? <Loader /> : (
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4">Or try one of these</h2>
                <div className={recipeGridClasses}>
                  {suggestedRecipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default Recipes;