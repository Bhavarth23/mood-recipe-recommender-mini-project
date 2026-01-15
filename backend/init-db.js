const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'recipes.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
  // Create recipes table
  db.run(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mood TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL
    )
  `);

  // Clear existing recipes to avoid duplicates
  db.run('DELETE FROM recipes', (err) => {
    if (err) {
      console.error('Error clearing recipes:', err);
    } else {
      console.log('Cleared existing recipes');
    }
  });

  // Insert sample recipes for different moods
  const recipes = [
    // Happy mood recipes
    {
      mood: 'happy',
      name: 'Chocolate Chip Cookies',
      description: 'Classic homemade chocolate chip cookies that bring joy with every bite.',
      ingredients: '2 cups flour, 1 cup butter, 3/4 cup sugar, 3/4 cup brown sugar, 2 eggs, 2 tsp vanilla, 1 tsp baking soda, 2 cups chocolate chips',
      instructions: '1. Preheat oven to 375°F. 2. Mix butter and sugars until creamy. 3. Add eggs and vanilla. 4. Mix in flour and baking soda. 5. Stir in chocolate chips. 6. Drop onto baking sheet and bake for 9-11 minutes.'
    },
    {
      mood: 'happy',
      name: 'Rainbow Smoothie Bowl',
      description: 'A vibrant and colorful smoothie bowl topped with fresh fruits.',
      ingredients: '1 banana, 1 cup frozen berries, 1/2 cup yogurt, 1/4 cup milk, fresh fruits for topping (strawberries, blueberries, kiwi, mango)',
      instructions: '1. Blend banana, berries, yogurt, and milk until smooth. 2. Pour into a bowl. 3. Top with fresh fruits in a rainbow pattern. 4. Enjoy immediately.'
    },
    {
      mood: 'happy',
      name: 'Mac and Cheese',
      description: 'Creamy, cheesy comfort food that never fails to bring a smile.',
      ingredients: '2 cups macaroni, 2 cups cheddar cheese, 2 cups milk, 3 tbsp butter, 3 tbsp flour, salt, pepper',
      instructions: '1. Cook macaroni according to package. 2. Melt butter, add flour to make roux. 3. Gradually add milk, then cheese. 4. Mix with cooked pasta. 5. Season and serve hot.'
    },
    
    // Sad mood recipes (comfort food)
    {
      mood: 'sad',
      name: 'Chicken Soup',
      description: 'Warm, comforting chicken soup that soothes the soul.',
      ingredients: '1 whole chicken, 8 cups water, 2 carrots, 2 celery stalks, 1 onion, 2 cloves garlic, salt, pepper, noodles',
      instructions: '1. Boil chicken in water for 1 hour. 2. Remove chicken and shred. 3. Add chopped vegetables and garlic. 4. Simmer for 30 minutes. 5. Add noodles and shredded chicken. 6. Season and serve warm.'
    },
    {
      mood: 'sad',
      name: 'Warm Apple Pie',
      description: 'A classic dessert that brings comfort and warmth.',
      ingredients: '6 apples, pie crust, 1/2 cup sugar, 1 tsp cinnamon, 2 tbsp butter, 1 egg for glaze',
      instructions: '1. Preheat oven to 425°F. 2. Slice apples and mix with sugar and cinnamon. 3. Fill pie crust with apples. 4. Cover with top crust. 5. Brush with egg wash. 6. Bake for 45 minutes.'
    },
    {
      mood: 'sad',
      name: 'Mashed Potatoes',
      description: 'Creamy, buttery mashed potatoes - pure comfort food.',
      ingredients: '4 large potatoes, 1/2 cup butter, 1/2 cup milk, salt, pepper',
      instructions: '1. Boil potatoes until tender. 2. Drain and mash. 3. Add butter and warm milk. 4. Season with salt and pepper. 5. Mix until creamy. 6. Serve warm.'
    },
    
    // Stressed mood recipes (quick and easy)
    {
      mood: 'stressed',
      name: '5-Minute Pasta',
      description: 'Quick and simple pasta dish for when you need something fast.',
      ingredients: '8 oz pasta, 2 tbsp olive oil, 2 cloves garlic, 1/4 cup parmesan, salt, pepper, fresh basil',
      instructions: '1. Cook pasta according to package. 2. Heat olive oil and garlic. 3. Toss pasta with oil and garlic. 4. Add parmesan and basil. 5. Season and serve.'
    },
    {
      mood: 'stressed',
      name: 'Avocado Toast',
      description: 'Simple, healthy, and ready in minutes.',
      ingredients: '2 slices bread, 1 avocado, salt, pepper, lemon juice, red pepper flakes',
      instructions: '1. Toast bread. 2. Mash avocado with salt, pepper, and lemon juice. 3. Spread on toast. 4. Sprinkle with red pepper flakes. 5. Enjoy immediately.'
    },
    {
      mood: 'stressed',
      name: 'Quick Stir Fry',
      description: 'Fast and nutritious stir fry with your favorite vegetables.',
      ingredients: '2 cups mixed vegetables, 1 tbsp oil, 2 tbsp soy sauce, 1 tsp ginger, garlic',
      instructions: '1. Heat oil in pan. 2. Add vegetables and stir fry for 5 minutes. 3. Add ginger and garlic. 4. Add soy sauce. 5. Cook for 2 more minutes. 6. Serve hot.'
    },
    
    // Energetic mood recipes (healthy and energizing)
    {
      mood: 'energetic',
      name: 'Power Smoothie',
      description: 'Energizing smoothie packed with protein and vitamins.',
      ingredients: '1 banana, 1 cup spinach, 1/2 cup Greek yogurt, 1 tbsp protein powder, 1 cup almond milk, 1 tbsp honey',
      instructions: '1. Blend all ingredients until smooth. 2. Pour into glass. 3. Enjoy as a power-packed breakfast or snack.'
    },
    {
      mood: 'energetic',
      name: 'Quinoa Salad Bowl',
      description: 'Nutritious and energizing quinoa salad with fresh vegetables.',
      ingredients: '1 cup quinoa, 2 cups water, cucumber, tomatoes, bell peppers, feta cheese, olive oil, lemon juice',
      instructions: '1. Cook quinoa in water for 15 minutes. 2. Let cool. 3. Mix with chopped vegetables. 4. Add feta cheese. 5. Dress with olive oil and lemon juice. 6. Serve chilled.'
    },
    {
      mood: 'energetic',
      name: 'Overnight Oats',
      description: 'Prepare the night before for an energizing morning meal.',
      ingredients: '1/2 cup oats, 1/2 cup milk, 1/2 cup yogurt, 1 tbsp chia seeds, berries, honey',
      instructions: '1. Mix oats, milk, yogurt, and chia seeds. 2. Refrigerate overnight. 3. Top with berries and honey. 4. Enjoy cold.'
    },
    
    // Relaxed mood recipes (light and easy)
    {
      mood: 'relaxed',
      name: 'Herbal Tea and Light Salad',
      description: 'A refreshing salad perfect for a relaxed afternoon.',
      ingredients: 'Mixed greens, cherry tomatoes, cucumber, avocado, olive oil, balsamic vinegar, fresh herbs',
      instructions: '1. Wash and prepare all vegetables. 2. Arrange on a plate. 3. Drizzle with olive oil and balsamic. 4. Garnish with fresh herbs. 5. Serve with your favorite herbal tea.'
    },
    {
      mood: 'relaxed',
      name: 'Caprese Salad',
      description: 'Simple Italian classic with fresh mozzarella and tomatoes.',
      ingredients: 'Fresh mozzarella, ripe tomatoes, fresh basil, olive oil, balsamic glaze, salt, pepper',
      instructions: '1. Slice mozzarella and tomatoes. 2. Arrange alternating slices. 3. Top with fresh basil. 4. Drizzle with olive oil and balsamic. 5. Season and serve.'
    },
    {
      mood: 'relaxed',
      name: 'Yogurt Parfait',
      description: 'Light and refreshing layered yogurt parfait.',
      ingredients: 'Greek yogurt, granola, fresh berries, honey',
      instructions: '1. Layer yogurt in a glass. 2. Add granola. 3. Add berries. 4. Repeat layers. 5. Drizzle with honey. 6. Serve chilled.'
    },
    
    // Indian Cuisine Recipes
    
    // Happy mood - Indian recipes
    {
      mood: 'happy',
      name: 'Gulab Jamun',
      description: 'Sweet, soft, and syrupy Indian dessert that brings instant joy.',
      ingredients: '1 cup milk powder, 1/4 cup all-purpose flour, 2 tbsp ghee, 1/4 cup milk, 1 cup sugar, 1 cup water, 2-3 cardamom pods, oil for frying',
      instructions: '1. Mix milk powder, flour, and ghee. 2. Add milk gradually to make soft dough. 3. Shape into small balls. 4. Deep fry until golden brown. 5. Make sugar syrup with water, sugar, and cardamom. 6. Soak fried balls in warm syrup for 30 minutes. 7. Serve warm or cold.'
    },
    {
      mood: 'happy',
      name: 'Chicken Biryani',
      description: 'Aromatic and flavorful one-pot rice dish that celebrates Indian cuisine.',
      ingredients: '2 cups basmati rice, 500g chicken, 2 onions, 2 tomatoes, 1/2 cup yogurt, ginger-garlic paste, biryani masala, saffron, mint leaves, cilantro, ghee',
      instructions: '1. Soak rice for 30 minutes. 2. Marinate chicken with yogurt and spices. 3. Cook chicken until tender. 4. Partially cook rice. 5. Layer rice and chicken in a pot. 6. Add saffron, mint, and cilantro. 7. Cook on dum (steam) for 20 minutes. 8. Serve hot with raita.'
    },
    {
      mood: 'happy',
      name: 'Jalebi',
      description: 'Crispy, sweet, and tangy spiral-shaped dessert that brightens any day.',
      ingredients: '1 cup all-purpose flour, 2 tbsp rice flour, 1/2 cup yogurt, 1 cup sugar, 1/2 cup water, saffron, cardamom powder, oil for frying',
      instructions: '1. Mix flours and yogurt to make batter. 2. Ferment for 8-10 hours. 3. Make sugar syrup with water, sugar, saffron, and cardamom. 4. Heat oil. 5. Pour batter in spiral shapes. 6. Fry until crispy. 7. Soak in warm syrup. 8. Serve immediately.'
    },
    
    // Sad mood - Indian comfort recipes
    {
      mood: 'sad',
      name: 'Dal Khichdi',
      description: 'Warm, comforting, and easy-to-digest one-pot meal that soothes the soul.',
      ingredients: '1 cup rice, 1/2 cup yellow moong dal, 4 cups water, 1 onion, 1 tsp turmeric, 1 tsp cumin seeds, ghee, salt',
      instructions: '1. Wash rice and dal together. 2. Heat ghee, add cumin seeds. 3. Add chopped onion and sauté. 4. Add rice-dal mix, turmeric, and water. 5. Cook until soft and mushy. 6. Season with salt. 7. Serve hot with ghee and pickle.'
    },
    {
      mood: 'sad',
      name: 'Tomato Rasam',
      description: 'Warm, tangy, and comforting South Indian soup that heals from within.',
      ingredients: '2 tomatoes, 1/2 cup tamarind water, 2 cups water, 1 tsp rasam powder, 1/2 tsp turmeric, curry leaves, mustard seeds, cumin seeds, coriander leaves, salt',
      instructions: '1. Boil tomatoes until soft. 2. Mash and strain. 3. Add tamarind water and spices. 4. Boil for 5 minutes. 5. Temper with mustard and cumin seeds. 6. Add curry leaves and coriander. 7. Serve hot with rice or drink as soup.'
    },
    {
      mood: 'sad',
      name: 'Aloo Paratha',
      description: 'Soft, warm flatbreads stuffed with spiced potatoes - pure comfort food.',
      ingredients: '2 cups whole wheat flour, 3 boiled potatoes, 1 onion, green chilies, coriander leaves, garam masala, salt, ghee',
      instructions: '1. Mash potatoes and mix with spices, onion, and herbs. 2. Make dough from flour and water. 3. Roll small roti, add filling, seal and roll again. 4. Cook on tawa with ghee until golden. 5. Serve hot with yogurt and pickle.'
    },
    
    // Stressed mood - Quick Indian recipes
    {
      mood: 'stressed',
      name: 'Poha',
      description: 'Quick and easy flattened rice breakfast that takes just 10 minutes.',
      ingredients: '2 cups poha (flattened rice), 1 onion, 1 potato, green chilies, curry leaves, mustard seeds, turmeric, lemon juice, coriander leaves, salt',
      instructions: '1. Rinse poha and drain. 2. Heat oil, add mustard seeds and curry leaves. 3. Add chopped onion and potato, cook until soft. 4. Add turmeric and poha. 5. Mix gently and cook for 2 minutes. 6. Add lemon juice and coriander. 7. Serve hot.'
    },
    {
      mood: 'stressed',
      name: 'Maggi Noodles',
      description: 'Instant comfort food that every Indian knows and loves.',
      ingredients: '1 packet Maggi noodles, 1 cup water, 1/2 onion, 1/2 tomato, green chilies, Maggi masala (included), oil',
      instructions: '1. Heat oil in pan. 2. Sauté onion, tomato, and chilies. 3. Add water and bring to boil. 4. Add noodles and masala. 5. Cook for 2 minutes until water is absorbed. 6. Serve hot.'
    },
    {
      mood: 'stressed',
      name: 'Quick Dal Tadka',
      description: 'Simple and quick lentil curry ready in 15 minutes.',
      ingredients: '1 cup yellow dal, 3 cups water, 1 onion, 2 tomatoes, turmeric, red chili powder, cumin seeds, garlic, ghee, salt',
      instructions: '1. Pressure cook dal with turmeric until soft. 2. Heat ghee, add cumin and garlic. 3. Add chopped onion and tomatoes. 4. Add spices and cook until tomatoes are soft. 5. Add cooked dal and simmer. 6. Season and serve with rice or roti.'
    },
    
    // Energetic mood - Indian protein recipes
    {
      mood: 'energetic',
      name: 'Chana Masala',
      description: 'Protein-packed chickpea curry that energizes and satisfies.',
      ingredients: '2 cups chickpeas (cooked), 2 onions, 2 tomatoes, ginger-garlic paste, chana masala powder, turmeric, cumin seeds, coriander leaves, oil',
      instructions: '1. Heat oil, add cumin seeds. 2. Add chopped onions and cook until golden. 3. Add ginger-garlic paste and tomatoes. 4. Add spices and cook until oil separates. 5. Add chickpeas and water. 6. Simmer for 10 minutes. 7. Garnish with coriander. 8. Serve with rice or roti.'
    },
    {
      mood: 'energetic',
      name: 'Rajma (Kidney Bean Curry)',
      description: 'Hearty and nutritious North Indian curry perfect for energy boost.',
      ingredients: '2 cups kidney beans (soaked overnight), 2 onions, 2 tomatoes, ginger-garlic paste, rajma masala, turmeric, cumin, coriander powder, oil',
      instructions: '1. Pressure cook beans until soft. 2. Heat oil, add cumin. 3. Add onions and cook until brown. 4. Add ginger-garlic paste and tomatoes. 5. Add all spices and cook. 6. Add cooked beans with water. 7. Simmer for 15 minutes. 8. Serve with rice.'
    },
    {
      mood: 'energetic',
      name: 'Masala Dosa',
      description: 'Crispy South Indian crepe with spiced potato filling - energizing breakfast.',
      ingredients: '2 cups dosa batter, 3 boiled potatoes, 1 onion, mustard seeds, curry leaves, turmeric, green chilies, oil',
      instructions: '1. Make potato filling: heat oil, add mustard seeds and curry leaves. 2. Add onion and chilies, then potatoes and spices. 3. Heat dosa tawa, pour batter and spread. 4. Add filling in center, fold dosa. 5. Serve hot with sambar and chutney.'
    },
    
    // Relaxed mood - Light Indian recipes
    {
      mood: 'relaxed',
      name: 'Raita',
      description: 'Cool and refreshing yogurt side dish perfect for a relaxed meal.',
      ingredients: '2 cups yogurt, 1 cucumber, 1/2 onion, cumin powder, roasted cumin seeds, coriander leaves, salt, black salt (optional)',
      instructions: '1. Whisk yogurt until smooth. 2. Grate or finely chop cucumber. 3. Squeeze out excess water from cucumber. 4. Mix cucumber and onion with yogurt. 5. Add spices and mix well. 6. Garnish with coriander and cumin seeds. 7. Chill and serve.'
    },
    {
      mood: 'relaxed',
      name: 'Kachumber Salad',
      description: 'Fresh and light Indian vegetable salad with tangy dressing.',
      ingredients: '1 cucumber, 2 tomatoes, 1 onion, 1/2 green chili, coriander leaves, lemon juice, salt, black pepper',
      instructions: '1. Finely chop all vegetables. 2. Mix cucumber, tomatoes, and onion. 3. Add chopped green chili and coriander. 4. Add lemon juice, salt, and pepper. 5. Toss well. 6. Serve immediately as a refreshing side.'
    },
    {
      mood: 'relaxed',
      name: 'Masala Chai',
      description: 'Warm, spiced Indian tea that helps you unwind and relax.',
      ingredients: '2 cups water, 2 cups milk, 2 tsp tea leaves, 1 inch ginger, 2-3 cardamom pods, 1 cinnamon stick, 2-3 cloves, sugar to taste',
      instructions: '1. Crush ginger and spices. 2. Boil water with spices for 5 minutes. 3. Add tea leaves and boil for 2 minutes. 4. Add milk and bring to boil. 5. Simmer for 2-3 minutes. 6. Strain and add sugar. 7. Serve hot.'
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO recipes (mood, name, description, ingredients, instructions)
    VALUES (?, ?, ?, ?, ?)
  `);

  recipes.forEach(recipe => {
    stmt.run(
      recipe.mood,
      recipe.name,
      recipe.description,
      recipe.ingredients,
      recipe.instructions
    );
  });

  stmt.finalize((err) => {
    if (err) {
      console.error('Error inserting recipes:', err);
    } else {
      console.log('Database initialized successfully with recipes!');
    }
    db.close();
  });
});
