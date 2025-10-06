import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { spoonacularService } from '../services/spoonacularService';
import { useAppContext } from '../context/AppContext';
import type { Recipe, PlannedMeal } from '../types';
import { DayOfWeek, MealType } from '../types';
import Loader from '../components/Loader';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { dispatch, addMealToPlan } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await spoonacularService.getRecipeDetails(id);
        setRecipe(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch recipe details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!recipe) return <p className="text-center">Recipe not found.</p>;

  const handleAddToPlanner = (day: DayOfWeek, mealType: MealType) => {
    const meal: PlannedMeal = {
      day,
      mealType,
      recipe: { 
        id: recipe.id, 
        title: recipe.title, 
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
      },
    };
    addMealToPlan(meal);
    setIsModalOpen(false);
  };
  
  const handleAddToGroceryList = () => {
    dispatch({ type: 'GENERATE_GROCERY_LIST', payload: [recipe] });
    navigate('/grocery-list');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <img className="w-full h-64 md:h-96 object-cover" src={recipe.image} alt={recipe.title} />
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{recipe.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: recipe.summary }} className="text-gray-700 mt-4 prose" />
          
          <div className="flex flex-wrap gap-4 my-6">
            <Link to={`/cook/${recipe.id}`} className="flex-1 text-center bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300 whitespace-nowrap">Start Cooking</Link>
            <button onClick={() => setIsModalOpen(true)} className="flex-1 bg-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-accent-dark transition-colors duration-300 whitespace-nowrap">Save to Planner</button>
            <button onClick={handleAddToGroceryList} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300 whitespace-nowrap">Add to Grocery List</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2 mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.extendedIngredients.map((ing) => (
                  <li key={ing.id} className="flex items-center">
                    <span className="text-primary mr-2">&#10003;</span>
                    <span>{ing.original}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2 mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.analyzedInstructions[0]?.steps.map((step) => (
                  <li key={step.number} className="flex">
                    <span className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">{step.number}</span>
                    <p className="text-gray-700">{step.step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && <AddToPlannerModal recipe={recipe} onAdd={handleAddToPlanner} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

const AddToPlannerModal = ({ recipe, onAdd, onClose }: { recipe: Recipe, onAdd: (day: DayOfWeek, mealType: MealType) => void, onClose: () => void }) => {
    const [day, setDay] = useState<DayOfWeek>(DayOfWeek.Monday);
    const [mealType, setMealType] = useState<MealType>(MealType.Dinner);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                <h2 className="text-xl font-bold mb-4">Add "{recipe.title}" to Planner</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="day-select" className="block text-sm font-medium text-gray-700">Day</label>
                        <select id="day-select" value={day} onChange={e => setDay(e.target.value as DayOfWeek)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                            {Object.values(DayOfWeek).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="meal-select" className="block text-sm font-medium text-gray-700">Meal</label>
                        <select id="meal-select" value={mealType} onChange={e => setMealType(e.target.value as MealType)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                            {Object.values(MealType).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={() => onAdd(day, mealType)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Add to Plan</button>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;