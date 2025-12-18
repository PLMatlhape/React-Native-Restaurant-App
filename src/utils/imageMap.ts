// Image mapping for food items
// Maps food item names to their local image assets

type ImageMap = {
  [key: string]: any;
};

export const imageMap: ImageMap = {
  // Cakes
  'Chocolate Cake': require('../../assets/Cake/chocolate-cake.jpg'),
  'Red Velvet': require('../../assets/Cake/red-velvet.jpg'),
  'Cheesecake': require('../../assets/Cake/cheesecake.jpg'),
  
  // Coffee
  'Espresso': require('../../assets/Coffee/espresso.jpg'),
  'Cappuccino': require('../../assets/Coffee/cappuccino.jpg'),
  'Latte': require('../../assets/Coffee/latte.jpg'),
  'Americano': require('../../assets/Coffee/americano.jpg'),
  'Mocha': require('../../assets/Coffee/mocha.jpg'),
  
  // Croissants
  'Plain Croissant': require('../../assets/croissants/plain-croissant.jpg'),
  'Chocolate Croissant': require('../../assets/croissants/chocolate-croissant.jpg'),
  'Almond Croissant': require('../../assets/croissants/almond-croissant.jpg'),
  
  // Donuts
  'Glazed Donut': require('../../assets/Donuts/glazed-donut.jpg'),
  'Chocolate Donut': require('../../assets/Donuts/chocolate-donut.jpg'),
  'Strawberry Donut': require('../../assets/Donuts/strawberry-donut.jpg'),
  
  // Muffins
  'Blueberry Muffin': require('../../assets/Muffins/blueberry-muffin.jpg'),
  'Chocolate Muffin': require('../../assets/Muffins/chocolate-muffin.jpg'),
  
  // Waffles
  'Belgian Waffle': require('../../assets/Waffles/belgian-waffle.jpg'),
  'Chocolate Waffle': require('../../assets/Waffles/chocolate-waffle.jpg'),
  
  // Pancakes
  'Buttermilk Pancakes': require('../../assets/Pan-cake/buttermilk-pancakes.jpg'),
  'Chocolate Pancakes': require('../../assets/Pan-cake/chocolate-pancakes.jpg'),
  
  // Churros
  'Classic Churros': require('../../assets/Churros/classic-churros.jpg'),
  'Chocolate Churros': require('../../assets/Churros/chocolate-churros.jpg'),
  
  // Crepes
  'Nutella Crepe': require('../../assets/Crepes/nutella-crepe.jpg'),
  'Strawberry Crepe': require('../../assets/Crepes/strawberry-crepe.jpg'),
};

// Get image for a food item by name
export const getImageForFood = (name: string): any => {
  return imageMap[name] || null;
};

export default imageMap;
