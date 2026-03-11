// Image mapping for food items
// Maps food item names/categories to their local image assets

type ImageMap = {
  [key: string]: any;
};

export const imageMap: ImageMap = {
  // Cakes
  "Chocolate Cake": require("../../assets/Cake/cake-3493.jpeg"),
  "Blueberry Cake": require("../../assets/Cake/Blueberry Bliss Layer Cake – A Berry Dream!.jpg"),
  "Lavender Cake": require("../../assets/Cake/Blueberry Lavender Cake – Elegant, Floral & Delicious!.jpg"),
  "Red Velvet Cake": require("../../assets/Cake/Kitchen Cookbook.jpeg"),
  "Coffee Cake": require("../../assets/Cake/coffee-cup-cozy.jpeg"),
  Cheesecake: require("../../assets/Cake/download (10).jpg"),

  // Coffee
  Espresso: require("../../assets/Coffee/coffee-4155.jpeg"),
  Cappuccino: require("../../assets/Coffee/Coffe.jpeg"),
  Latte: require("../../assets/Coffee/download (4).jpeg"),
  Americano: require("../../assets/Coffee/download (5).jpeg"),
  Mocha: require("../../assets/Coffee/download (6).jpeg"),
  Macchiato: require("../../assets/Coffee/download (7).jpeg"),
  "Flat White": require("../../assets/Coffee/download (8).jpeg"),
  "Cold Brew": require("../../assets/Coffee/download (9).jpeg"),
  "Iced Coffee": require("../../assets/Coffee/download (10).jpeg"),
  "Coffee Loophole": require("../../assets/Coffee/Coffee Loophole.jpeg"),

  // Croissants
  "Plain Croissant": require("../../assets/croissants/croissants-1175.jpeg"),
  "Breakfast Croissant": require("../../assets/croissants/Breakfast croissant.jpeg"),
  "Berry Croissant": require("../../assets/croissants/Mini Berries and Cream Croissants.jpeg"),
  "Chocolate Croissant": require("../../assets/croissants/download (32).jpeg"),
  "Almond Croissant": require("../../assets/croissants/Why is this so satisfying for zero effort.jpeg"),

  // Donuts
  "Chocolate Donut": require("../../assets/Donuts/Chocolate Doughnuts.jpeg"),
  "Glazed Donut": require("../../assets/Donuts/download (13).jpeg"),

  // Muffins
  "Chocolate Muffin": require("../../assets/Muffins/muffins-3200.jpg"),
  "Blueberry Muffin": require("../../assets/Muffins/muffins-4950.jpg"),
  "Vanilla Muffin": require("../../assets/Muffins/muffins-6926.jpg"),
  "Chocolate Cupcake": require("../../assets/Muffins/Chocolate Hazelnut Cupcake – Rich Swirl Indulgence.jpg"),
  "Hazelnut Cupcake": require("../../assets/Muffins/download (13).jpg"),

  // Waffles
  "Belgian Waffle": require("../../assets/Waffles/waffles-8902.jpeg"),
  "Chocolate Waffle": require("../../assets/Waffles/Double Chocolate Waffle Delight.jpeg"),
  "Nutella Waffle": require("../../assets/Waffles/Nutella Triple Chocolate Nutella Bliss.jpeg"),
  "Classic Waffle": require("../../assets/Waffles/download (14).jpeg"),

  // Pancakes
  "Buttermilk Pancakes": require("../../assets/Pan-cake/Pancakes.jpg"),
  "Chocolate Pancakes": require("../../assets/Pan-cake/download (3).jpg"),
  "Classic Pancakes": require("../../assets/Pan-cake/download (6).jpg"),
  "Fluffy Pancakes": require("../../assets/Pan-cake/download (7).jpg"),

  // Churros
  "Classic Churros": require("../../assets/Churros/churros-281.jpeg"),
  "Chocolate Churros": require("../../assets/Churros/churros-4876.jpeg"),
  "Cinnamon Churros": require("../../assets/Churros/churros-5249.jpeg"),

  // Crepes
  "Nutella Crepe": require("../../assets/Crepes/Nutella Crepe Rolls.jpg"),
  "Chocolate Crepe": require("../../assets/Crepes/Chocolate-Filled Crepes with Chocolate Drizzle.jpg"),
  "Classic Crepe": require("../../assets/Crepes/Dreamy Chocolate Crepes_ Thin & Perfect!.jpeg"),
  "Strawberry Crepe": require("../../assets/Crepes/download (33).jpeg"),

  // Oreos
  "Oreo Milkshake": require("../../assets/Oreos/download (11).jpg"),
  "Oreo Cheesecake": require("../../assets/Oreos/download (16).jpeg"),
  "Oreo Cookie": require("../../assets/Oreos/download (17).jpeg"),
  "Oreo Brownie": require("../../assets/Oreos/download (18).jpeg"),

  // Roller Cakes
  "Red Velvet Roll": require("../../assets/Roller/Red Velvet Cake Roll.jpg"),
  "Blue Velvet Roll": require("../../assets/Roller/Heavenly Blue Velvet Roll Cake.jpg"),
  "Chocolate Roll": require("../../assets/Roller/roller-2281.jpg"),
  "Classic Roll": require("../../assets/Roller/roller-8677.jpg"),
};

// Category default images
export const categoryImages: ImageMap = {
  Cakes: require("../../assets/Cake/cake-3493.jpeg"),
  Coffee: require("../../assets/Coffee/coffee-4155.jpeg"),
  Croissants: require("../../assets/croissants/croissants-1175.jpeg"),
  Donuts: require("../../assets/Donuts/Chocolate Doughnuts.jpeg"),
  Muffins: require("../../assets/Muffins/muffins-3200.jpg"),
  Waffles: require("../../assets/Waffles/waffles-8902.jpeg"),
  Pancakes: require("../../assets/Pan-cake/Pancakes.jpg"),
  Churros: require("../../assets/Churros/churros-281.jpeg"),
  Crepes: require("../../assets/Crepes/Nutella Crepe Rolls.jpg"),
  Oreos: require("../../assets/Oreos/download (11).jpg"),
  "Cake Rolls": require("../../assets/Roller/roller-2281.jpg"),
};

// Get image for a food item by name, with category fallback
export const getImageForFood = (name: string, category?: string): any => {
  // Try exact match first
  if (imageMap[name]) return imageMap[name];

  // Try partial match
  const lowerName = name.toLowerCase();
  for (const [key, value] of Object.entries(imageMap)) {
    if (
      key.toLowerCase().includes(lowerName) ||
      lowerName.includes(key.toLowerCase())
    ) {
      return value;
    }
  }

  // Fall back to category image
  if (category && categoryImages[category]) {
    return categoryImages[category];
  }

  return null;
};

export default imageMap;
