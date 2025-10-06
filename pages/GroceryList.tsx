
import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

const GroceryList = () => {
  const { state, dispatch } = useAppContext();
  const { groceryList } = state;

  const toggleItem = (id: number) => {
    dispatch({ type: 'TOGGLE_GROCERY_ITEM', payload: id });
  };
  
  const clearList = () => {
    dispatch({ type: 'CLEAR_GROCERY_LIST' });
  };

  const groupedList = useMemo(() => {
    return groceryList.reduce((acc, item) => {
      const aisle = item.aisle || 'Miscellaneous';
      if (!acc[aisle]) {
        acc[aisle] = [];
      }
      acc[aisle].push(item);
      return acc;
    }, {} as Record<string, typeof groceryList>);
  }, [groceryList]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Grocery List</h1>
            <p className="mt-1 text-gray-600">Your shopping list, ready to go.</p>
        </div>
        <button 
          onClick={clearList}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
        >
          Clear List
        </button>
      </header>

      {groceryList.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-xl shadow-md">
          <p className="text-gray-500">Your grocery list is empty.</p>
          <p className="text-sm text-gray-400 mt-2">Add recipes to your planner or from a recipe's detail page to generate a list.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedList).sort(([a], [b]) => a.localeCompare(b)).map(([aisle, items]) => (
            <div key={aisle} className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-700 border-b pb-2 mb-3">{aisle}</h2>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`item-${item.id}`}
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={`item-${item.id}`} className={`ml-3 text-gray-800 ${item.checked ? 'line-through text-gray-400' : ''}`}>
                      {item.original}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroceryList;
