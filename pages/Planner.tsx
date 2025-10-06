import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { DayOfWeek, MealType, RecipeSummary } from '../types';
import { ClockIcon, UserGroupIcon } from '../components/icons/NavIcons';

const Planner = () => {
  const { state, generateGroceryListFromPlan, removeMealFromPlan } = useAppContext();
  const days = Object.values(DayOfWeek);
  const mealTypes = Object.values(MealType);
  const hasMeals = Object.values(state.planner).some(dayPlan => dayPlan && Object.keys(dayPlan).length > 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Meal Planner</h1>
            <p className="mt-1 text-gray-600">Organize your meals for the week.</p>
        </div>
        <button 
            onClick={generateGroceryListFromPlan}
            className="mt-4 sm:mt-0 bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-accent-dark transition-colors duration-300"
        >
          Generate Grocery List
        </button>
      </header>

      { !hasMeals ? (
        <div className="text-center bg-white p-8 rounded-xl shadow-md">
          <p className="text-gray-500">Your meal planner is empty.</p>
          <p className="text-sm text-gray-400 mt-2">Find a recipe and add it to your plan to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {days.map(day => (
            <div key={day} className="bg-white rounded-xl shadow-sm p-3 flex flex-col space-y-3 min-h-[300px]">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-sm md:text-base">{day}</h3>
                <div className="flex space-x-1">
                  {state.planner[day]?.[MealType.Breakfast] && <div className="h-2 w-2 bg-blue-400 rounded-full" title="Breakfast"></div>}
                  {state.planner[day]?.[MealType.Lunch] && <div className="h-2 w-2 bg-orange-400 rounded-full" title="Lunch"></div>}
                  {state.planner[day]?.[MealType.Dinner] && <div className="h-2 w-2 bg-purple-400 rounded-full" title="Dinner"></div>}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {mealTypes.map(mealType => (
                  <div key={mealType}>
                    {state.planner[day]?.[mealType] ? (
                      <PlannerMealCard 
                        mealType={mealType}
                        recipe={state.planner[day]?.[mealType]!} 
                        onRemove={() => removeMealFromPlan(day, mealType)}
                      />
                    ) : (
                      <EmptyMealSlot mealType={mealType} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PlannerMealCard = ({ mealType, recipe, onRemove }: { mealType: MealType, recipe: RecipeSummary, onRemove: () => void }) => {
  const mealTypeColors: { [key in MealType]: string } = {
    [MealType.Breakfast]: 'border-blue-400',
    [MealType.Lunch]: 'border-orange-400',
    [MealType.Dinner]: 'border-purple-400',
  };

  return (
    <div className={`relative group border-l-4 ${mealTypeColors[mealType]} rounded overflow-hidden shadow-sm bg-gray-50`}>
       <Link to={`/recipe/${recipe.id}`} className="block pl-3 py-2 pr-1">
          <div className="flex items-center space-x-2">
            <img src={recipe.image} alt={recipe.title} className="h-14 w-14 rounded-md object-cover flex-shrink-0" />
            <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate" title={recipe.title}>{recipe.title}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                  {recipe.readyInMinutes && (
                    <span className="flex items-center"><ClockIcon className="h-3 w-3 mr-0.5" />{recipe.readyInMinutes}m</span>
                  )}
                  {recipe.servings && (
                    <span className="flex items-center"><UserGroupIcon className="h-3 w-3 mr-0.5" />{recipe.servings}</span>
                  )}
                </div>
            </div>
          </div>
       </Link>
        <button 
            onClick={(e) => { e.preventDefault(); onRemove(); }}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
            aria-label="Remove meal"
        >
            &times;
        </button>
    </div>
  );
};

const EmptyMealSlot = ({ mealType }: { mealType: MealType }) => (
  <div className="h-[76px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-md">
    <span className="text-xs text-gray-400">{mealType}</span>
  </div>
);

export default Planner;