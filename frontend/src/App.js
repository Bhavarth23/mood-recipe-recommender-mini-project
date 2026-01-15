import React, { useState, useEffect, useRef } from "react";

const API_BASE_URL = "http://localhost:3001/api";

const moods = [
  {
    id: "happy",
    label: "Happy",
    emoji: "😊",
    gradient: "from-yellow-400 via-amber-400 to-orange-400",
    hoverGradient: "from-yellow-500 via-amber-500 to-orange-500",
    shadow: "shadow-yellow-200",
  },
  {
    id: "sad",
    label: "Sad",
    emoji: "😢",
    gradient: "from-blue-400 via-indigo-400 to-purple-400",
    hoverGradient: "from-blue-500 via-indigo-500 to-purple-500",
    shadow: "shadow-blue-200",
  },
  {
    id: "stressed",
    label: "Stressed",
    emoji: "😰",
    gradient: "from-red-400 via-rose-400 to-pink-400",
    hoverGradient: "from-red-500 via-rose-500 to-pink-500",
    shadow: "shadow-red-200",
  },
  {
    id: "energetic",
    label: "Energetic",
    emoji: "⚡",
    gradient: "from-green-400 via-emerald-400 to-teal-400",
    hoverGradient: "from-green-500 via-emerald-500 to-teal-500",
    shadow: "shadow-green-200",
  },
  {
    id: "relaxed",
    label: "Relaxed",
    emoji: "😌",
    gradient: "from-purple-400 via-violet-400 to-fuchsia-400",
    hoverGradient: "from-purple-500 via-violet-500 to-fuchsia-500",
    shadow: "shadow-purple-200",
  },
];

function App() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usedRecipeIds, setUsedRecipeIds] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const recipeContentRef = useRef(null);

  const fetchRecipe = async (mood) => {
    setLoading(true);
    setError(null);

    try {
      let recipesToUse = allRecipes;

      // First, fetch all recipes for this mood if we haven't already
      if (allRecipes.length === 0 || selectedMood !== mood) {
        console.log(`Fetching recipes for mood: ${mood}`);
        const allResponse = await fetch(`${API_BASE_URL}/recipes/${mood}/all`);
        if (!allResponse.ok) {
          const errorData = await allResponse.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `HTTP ${allResponse.status}: Failed to fetch recipes`
          );
        }
        const recipes = await allResponse.json();
        console.log(`Received ${recipes.length} recipes`);
        if (recipes.length === 0) {
          throw new Error(
            "No recipes found for this mood. Please initialize the database."
          );
        }
        setAllRecipes(recipes);
        setUsedRecipeIds([]);
        recipesToUse = recipes; // Use the freshly fetched recipes
      }

      // Filter out used recipes
      const availableRecipes = recipesToUse.filter(
        (r) => r && r.id && !usedRecipeIds.includes(r.id)
      );

      if (availableRecipes.length === 0) {
        // Reset if we've used all recipes
        setUsedRecipeIds([]);
        const randomRecipe =
          recipesToUse[Math.floor(Math.random() * recipesToUse.length)];
        if (!randomRecipe || !randomRecipe.id) {
          throw new Error("Invalid recipe data received from server");
        }
        setRecipe(randomRecipe);
        setUsedRecipeIds([randomRecipe.id]);
      } else {
        // Pick a random recipe from available ones
        const randomRecipe =
          availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
        if (!randomRecipe || !randomRecipe.id) {
          throw new Error("Invalid recipe data received from server");
        }
        setRecipe(randomRecipe);
        setUsedRecipeIds([...usedRecipeIds, randomRecipe.id]);
      }
    } catch (err) {
      console.error("Error fetching recipe:", err);
      setError(
        err.message ||
          "Failed to fetch recipe. Please make sure the backend server is running on http://localhost:3001"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    setRecipe(null);
    setAllRecipes([]);
    setUsedRecipeIds([]);
    fetchRecipe(moodId);
  };

  const handleNewRecipe = () => {
    if (selectedMood) {
      fetchRecipe(selectedMood);
    }
  };

  // Auto-scroll to recipe content when mood is selected or recipe is loaded
  useEffect(() => {
    if (selectedMood && recipeContentRef.current) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        recipeContentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [selectedMood, recipe, loading, error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 40% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)`,
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="text-6xl md:text-7xl mb-4 animate-bounce-slow">
              🍳
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Mood Recipe Recommender
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">
            Select your mood and discover the perfect recipe tailored just for
            you
          </p>
        </header>

        {!selectedMood ? (
          <div className="max-w-5xl mx-auto animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 md:mb-12 text-center">
              How are you feeling today?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {moods.map((mood, index) => {
                const gradientClasses = {
                  happy:
                    "bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 hover:from-yellow-500 hover:via-amber-500 hover:to-orange-500 shadow-yellow-200",
                  sad: "bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-blue-200",
                  stressed:
                    "bg-gradient-to-br from-red-400 via-rose-400 to-pink-400 hover:from-red-500 hover:via-rose-500 hover:to-pink-500 shadow-red-200",
                  energetic:
                    "bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 shadow-green-200",
                  relaxed:
                    "bg-gradient-to-br from-purple-400 via-violet-400 to-fuchsia-400 hover:from-purple-500 hover:via-violet-500 hover:to-fuchsia-500 shadow-purple-200",
                };

                return (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.id)}
                    className={`group relative ${
                      gradientClasses[mood.id]
                    } text-white font-semibold py-8 px-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 overflow-hidden`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-5xl md:text-6xl mb-3 transform group-hover:scale-125 transition-transform duration-300">
                        {mood.emoji}
                      </div>
                      <div className="text-lg md:text-xl font-bold">
                        {mood.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => {
                  setSelectedMood(null);
                  setRecipe(null);
                  setAllRecipes([]);
                  setUsedRecipeIds([]);
                }}
                className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20 hover:border-white/40"
              >
                <span className="transform group-hover:-translate-x-1 transition-transform">
                  ←
                </span>
                <span>Back to Moods</span>
              </button>
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/20">
                <span className="text-3xl">
                  {moods.find((m) => m.id === selectedMood)?.emoji}
                </span>
                <span className="text-xl font-bold text-gray-800">
                  {moods.find((m) => m.id === selectedMood)?.label}
                </span>
              </div>
            </div>

            <div ref={recipeContentRef}>
              {loading ? (
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-12 text-center border border-white/30">
                  <div className="inline-block animate-spin text-6xl mb-6">
                    🍳
                  </div>
                  <p className="text-gray-600 text-lg font-medium">
                    Finding the perfect recipe for you...
                  </p>
                  <div className="mt-4 flex justify-center gap-1">
                    <div
                      className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl shadow-xl p-8 md:p-12 text-center">
                  <div className="text-6xl mb-6 animate-pulse">⚠️</div>
                  <p className="text-red-700 font-semibold text-lg">{error}</p>
                </div>
              ) : recipe ? (
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/30 animate-slide-up">
                  {/* Recipe Header */}
                  <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
                      {recipe.name}
                    </h2>
                    <p className="text-indigo-50 text-lg md:text-xl leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>

                  <div className="p-8">
                    {/* Ingredients Section */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-indigo-100 p-3 rounded-xl">
                          <span className="text-2xl">📝</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          Ingredients
                        </h3>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-6 border border-gray-200">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base md:text-lg">
                          {recipe.ingredients}
                        </p>
                      </div>
                    </div>

                    {/* Instructions Section */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-purple-100 p-3 rounded-xl">
                          <span className="text-2xl">👨‍🍳</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          Instructions
                        </h3>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-6 border border-gray-200">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base md:text-lg">
                          {recipe.instructions}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={handleNewRecipe}
                      className="w-full group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                    >
                      <span className="text-xl transform group-hover:rotate-180 transition-transform duration-300">
                        🔄
                      </span>
                      <span className="text-lg">Get Another Recipe</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
