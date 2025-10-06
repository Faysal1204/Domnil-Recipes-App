import React from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Ingredients from './pages/Ingredients';
import Products from './pages/Products';
import RecipeDetail from './pages/RecipeDetail';
import CookMode from './pages/CookMode';
import Planner from './pages/Planner';
import GroceryList from './pages/GroceryList';
import Assistant from './pages/Assistant';

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/products" element={<Products />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/cook/:id" element={<CookMode />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/grocery-list" element={<GroceryList />} />
            <Route path="/assistant" element={<Assistant />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
}

export default App;