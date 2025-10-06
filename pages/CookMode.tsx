
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { spoonacularService } from '../services/spoonacularService';
import type { Step } from '../types';
import Loader from '../components/Loader';

const CookMode = () => {
  const { id } = useParams<{ id: string }>();
  const [steps, setSteps] = useState<Step[]>([]);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructions = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await spoonacularService.getRecipeDetails(id);
        if (data.analyzedInstructions.length > 0 && data.analyzedInstructions[0].steps.length > 0) {
          setSteps(data.analyzedInstructions[0].steps);
          setRecipeTitle(data.title);
        } else {
          setError('No instructions available for this recipe.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch instructions.');
      } finally {
        setLoading(false);
      }
    };
    fetchInstructions();
  }, [id]);

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader /></div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  const currentStep = steps[currentStepIndex];
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="p-4 border-b flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 truncate">{recipeTitle}</h1>
        <Link to={`/recipe/${id}`} className="text-sm font-semibold text-primary hover:underline">Exit Cook Mode</Link>
      </header>

      <div className="w-full bg-gray-200 h-2">
        <div className="bg-primary h-2" style={{ width: `${progressPercentage}%`, transition: 'width 0.3s ease-in-out' }}></div>
      </div>
      
      <main className="flex-1 flex flex-col justify-center items-center p-4 md:p-8 text-center">
        <div className="max-w-prose">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Step {currentStep.number} of {steps.length}</h2>
            <p className="text-3xl md:text-5xl leading-tight font-light text-gray-900">{currentStep.step}</p>
        </div>
      </main>

      <footer className="p-4 border-t flex justify-between items-center">
        <button 
          onClick={goToPrevStep} 
          disabled={currentStepIndex === 0}
          className="px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
        >
          Previous
        </button>
        <button 
          onClick={goToNextStep} 
          disabled={currentStepIndex === steps.length - 1}
          className="px-8 py-3 bg-primary text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
        >
          Next
        </button>
      </footer>
    </div>
  );
};

export default CookMode;
