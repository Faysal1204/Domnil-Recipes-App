
export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  extendedIngredients: Ingredient[];
  analyzedInstructions: AnalyzedInstruction[];
  aggregateLikes: number;
  healthScore: number;
}

export interface RecipeSummary {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
}

export interface Product {
  id: number;
  title: string;
  image: string;
}

export interface Ingredient {
  id: number;
  aisle: string;
  image: string;
  consistency: string;
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  amount: number;
  unit: string;
  meta: string[];
}

export interface AnalyzedInstruction {
  name: string;
  steps: Step[];
}

export interface Step {
  number: number;
  step: string;
  ingredients: { id: number; name: string; localizedName: string; image: string }[];
  equipment: { id: number; name: string; localizedName: string; image: string }[];
  length?: { number: number; unit: string };
}

export enum MealType {
    Breakfast = 'Breakfast',
    Lunch = 'Lunch',
    Dinner = 'Dinner',
}

export enum DayOfWeek {
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
    Sunday = 'Sunday',
}

export interface PlannedMeal {
  day: DayOfWeek;
  mealType: MealType;
  recipe: RecipeSummary;
}

export type PlannerState = {
    [key in DayOfWeek]?: {
        [key in MealType]?: RecipeSummary;
    }
};

export interface GroceryItem {
  id: number;
  name: string;
  amount: number;
  unit: string;
  aisle: string;
  original: string;
  checked: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}