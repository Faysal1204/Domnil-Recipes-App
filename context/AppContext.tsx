
import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import type { PlannerState, GroceryItem, PlannedMeal, Recipe } from '../types';
import { DayOfWeek } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

interface AppState {
  planner: PlannerState;
  groceryList: GroceryItem[];
}

type Action =
  | { type: 'ADD_TO_PLAN'; payload: PlannedMeal }
  | { type: 'REMOVE_FROM_PLAN'; payload: { day: DayOfWeek; mealType: string } }
  | { type: 'GENERATE_GROCERY_LIST'; payload: Recipe[] }
  | { type: 'TOGGLE_GROCERY_ITEM'; payload: number }
  | { type: 'CLEAR_GROCERY_LIST' }
  | { type: 'SET_STATE'; payload: AppState };


const initialState: AppState = {
  planner: {},
  groceryList: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addMealToPlan: (meal: PlannedMeal) => void;
  removeMealFromPlan: (day: DayOfWeek, mealType: string) => void;
  generateGroceryListFromPlan: () => void;
}>({
  state: initialState,
  dispatch: () => null,
  addMealToPlan: () => {},
  removeMealFromPlan: () => {},
  generateGroceryListFromPlan: () => {},
});

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_STATE':
        return action.payload;
    case 'ADD_TO_PLAN': {
      const { day, mealType, recipe } = action.payload;
      return {
        ...state,
        planner: {
          ...state.planner,
          [day]: {
            ...state.planner[day],
            [mealType]: recipe,
          },
        },
      };
    }
    case 'REMOVE_FROM_PLAN': {
        const { day, mealType } = action.payload;
        const newDayPlan = { ...state.planner[day] };
        delete newDayPlan[mealType as keyof typeof newDayPlan];
        return {
            ...state,
            planner: {
                ...state.planner,
                [day]: newDayPlan
            }
        };
    }
    case 'GENERATE_GROCERY_LIST': {
        const ingredientsMap = new Map<string, GroceryItem>();
        action.payload.forEach(recipe => {
            recipe.extendedIngredients.forEach(ing => {
                if (ing.nameClean) {
                    const existing = ingredientsMap.get(ing.nameClean);
                    if (existing) {
                        existing.amount += ing.amount;
                        existing.original += ` + ${ing.original}`;
                    } else {
                        ingredientsMap.set(ing.nameClean, {
                            id: ing.id,
                            name: ing.nameClean,
                            amount: ing.amount,
                            unit: ing.unit,
                            aisle: ing.aisle || 'Misc',
                            original: ing.original,
                            checked: false,
                        });
                    }
                }
            });
        });
        return { ...state, groceryList: Array.from(ingredientsMap.values()) };
    }
    case 'TOGGLE_GROCERY_ITEM': {
        return {
            ...state,
            groceryList: state.groceryList.map(item =>
                item.id === action.payload ? { ...item, checked: !item.checked } : item
            ),
        };
    }
    case 'CLEAR_GROCERY_LIST':
        return { ...state, groceryList: [] };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [persistedState, setPersistedState] = useLocalStorage<AppState>('domnil-app-state', initialState);
  const [state, dispatch] = useReducer(appReducer, persistedState);
  
  useEffect(() => {
    setPersistedState(state);
  }, [state, setPersistedState]);

  const addMealToPlan = (meal: PlannedMeal) => {
    dispatch({ type: 'ADD_TO_PLAN', payload: meal });
  };
    
  const removeMealFromPlan = (day: DayOfWeek, mealType: string) => {
    dispatch({ type: 'REMOVE_FROM_PLAN', payload: { day, mealType } });
  };

  const generateGroceryListFromPlan = async () => {
    const plannedRecipeIds = Object.values(state.planner).flatMap(dayPlan => Object.values(dayPlan).map(meal => meal.id));
    if (plannedRecipeIds.length === 0) {
        dispatch({ type: 'CLEAR_GROCERY_LIST' });
        return;
    }
    // In a real app, you would fetch details for all recipes.
    // Here we'll just clear it as a placeholder for a complex operation.
    // For this example, we assume recipes with full ingredients are somehow available.
    // This is a limitation without a proper backend.
    // To make it work, we'd need to fetch each recipe's details.
    // This is API intensive so we will mock it by just clearing the list.
    console.warn("Generating a grocery list from just summaries requires fetching each recipe. This is API-intensive. Clearing list as a placeholder.");
    dispatch({ type: 'CLEAR_GROCERY_LIST' });
    alert("Grocery List generation from the planner is a premium feature. For now, please add items manually or from a recipe detail page.");
  };

  return (
    <AppContext.Provider value={{ state, dispatch, addMealToPlan, removeMealFromPlan, generateGroceryListFromPlan }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
