import type { Recipe, Product } from '../types';

const API_KEY = 'c2f3a9ae0053418ea39ae46091a276ba';
const BASE_URL = 'https://api.spoonacular.com';

const handleResponse = async (response: Response) => {
    if (response.status === 402) {
        throw new Error("API limit reached. Please try again later.");
    }
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'An error occurred with the API.');
    }
    return response.json();
};

export const spoonacularService = {
  searchRecipes: async (query: string): Promise<{ results: Recipe[] }> => {
    const response = await fetch(`${BASE_URL}/recipes/complexSearch?query=${query}&apiKey=${API_KEY}&number=12&addRecipeInformation=true`);
    return handleResponse(response);
  },

  searchProducts: async (query: string): Promise<{ products: Product[] }> => {
    const response = await fetch(`${BASE_URL}/food/products/search?query=${query}&apiKey=${API_KEY}&number=12`);
    return handleResponse(response);
  },
  
  findRecipesByIngredients: async (ingredients: string[]): Promise<Recipe[]> => {
    const ingredientsString = ingredients.join(',');
    const response = await fetch(`${BASE_URL}/recipes/findByIngredients?ingredients=${ingredientsString}&apiKey=${API_KEY}&number=12&ranking=1`);
    // This endpoint doesn't return full recipe info, so we'd need to fetch each one.
    // For simplicity, we'll return what we get.
    const recipesSummaries = await handleResponse(response);
    // In a real app, you'd fetch full details for each.
    return recipesSummaries.map((r: any) => ({ ...r, readyInMinutes: 0, servings: 0 }));
  },

  getRecipeDetails: async (id: string): Promise<Recipe> => {
    const response = await fetch(`${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=false`);
    return handleResponse(response);
  },

  getRandomRecipes: async (number: number = 6): Promise<{ recipes: Recipe[] }> => {
    const response = await fetch(`${BASE_URL}/recipes/random?apiKey=${API_KEY}&number=${number}`);
    return handleResponse(response);
  },
  
  findRecipesByCriteria: async (params: {
    ingredients?: string;
    diet?: string;
    cuisine?: string;
  }): Promise<{ results: Recipe[] }> => {
    const queryParams = new URLSearchParams({
        apiKey: API_KEY,
        number: '12',
        addRecipeInformation: 'true',
        ranking: '1', // Maximize ingredients used
    });

    if (params.ingredients) queryParams.append('includeIngredients', params.ingredients);
    if (params.diet) queryParams.append('diet', params.diet);
    if (params.cuisine) queryParams.append('cuisine', params.cuisine);
    
    const response = await fetch(`${BASE_URL}/recipes/complexSearch?${queryParams.toString()}`);
    return handleResponse(response);
  },
};