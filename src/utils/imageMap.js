/**
 * Image Map for Local Assets
 * 
 * Since React Native requires static require statements for local images,
 * this module provides a centralized mapping of food categories to their images.
 * 
 * Usage:
 * import { getLocalImage, PLACEHOLDER_IMAGE } from '../utils/imageMap';
 * 
 * const imageSource = getLocalImage('Coffee', 'Espresso') || PLACEHOLDER_IMAGE;
 */

// Placeholder image for missing images
export const PLACEHOLDER_IMAGE = require('../../assets/icon/icons8-coffee-cup-64.png');

// Category image mappings
export const CATEGORY_IMAGES = {
  Coffee: {
    default: require('../../assets/Coffee/Coffe.jpeg'),
    images: [
      require('../../assets/Coffee/Coffe.jpeg'),
      require('../../assets/Coffee/download (4).jpeg'),
      require('../../assets/Coffee/download (5).jpeg'),
      require('../../assets/Coffee/download (6).jpeg'),
    ]
  },
  Tea: {
    default: require('../../assets/Coffee/download (7).jpeg'),
    images: [
      require('../../assets/Coffee/download (7).jpeg'),
      require('../../assets/Coffee/download (8).jpeg'),
      require('../../assets/Coffee/download (9).jpeg'),
    ]
  },
  Cappuccino: {
    default: require('../../assets/Coffee/download (10).jpeg'),
    images: [
      require('../../assets/Coffee/download (10).jpeg'),
      require('../../assets/Coffee/download (11).jpeg'),
      require('../../assets/Coffee/download (12).jpeg'),
    ]
  },
  Waffles: {
    default: require('../../assets/Waffles/download (14).jpeg'),
    images: [
      require('../../assets/Waffles/download (14).jpeg'),
      require('../../assets/Waffles/download (15).jpeg'),
      require('../../assets/Waffles/download (16).jpeg'),
    ]
  },
  Cakes: {
    default: require('../../assets/Cake/download (8).jpg'),
    images: [
      require('../../assets/Cake/download (8).jpg'),
      require('../../assets/Cake/download (9).jpg'),
      require('../../assets/Cake/download (10).jpg'),
    ]
  },
  Churros: {
    default: require('../../assets/Churros/Cinnamon churros with coffee chocolate sauce that\'s easy, indulgent, and completely delicious! 🍩🍫.jpeg'),
    images: [
      require('../../assets/Churros/Cinnamon churros with coffee chocolate sauce that\'s easy, indulgent, and completely delicious! 🍩🍫.jpeg'),
    ]
  },
  Croissants: {
    default: require('../../assets/croissants/Breakfast croissant.jpeg'),
    images: [
      require('../../assets/croissants/Breakfast croissant.jpeg'),
      require('../../assets/croissants/download (32).jpeg'),
    ]
  },
  Crepes: {
    default: require('../../assets/Crepes/Nutella Crepe Rolls.jpg'),
    images: [
      require('../../assets/Crepes/Nutella Crepe Rolls.jpg'),
      require('../../assets/Crepes/Chocolate-Filled Crepes with Chocolate Drizzle.jpg'),
    ]
  },
  Muffins: {
    default: require('../../assets/Muffins/download (13).jpg'),
    images: [
      require('../../assets/Muffins/download (13).jpg'),
      require('../../assets/Muffins/download (14).jpg'),
      require('../../assets/Muffins/download (15).jpg'),
    ]
  },
  Donuts: {
    default: require('../../assets/Donuts/Chocolate Doughnuts.jpeg'),
    images: [
      require('../../assets/Donuts/Chocolate Doughnuts.jpeg'),
      require('../../assets/Donuts/download (13).jpeg'),
    ]
  },
  Oreos: {
    default: require('../../assets/Oreos/download (11).jpg'),
    images: [
      require('../../assets/Oreos/download (11).jpg'),
      require('../../assets/Oreos/download (16).jpeg'),
    ]
  },
  Pancakes: {
    default: require('../../assets/Pan-cake/Pancakes.jpg'),
    images: [
      require('../../assets/Pan-cake/Pancakes.jpg'),
      require('../../assets/Pan-cake/download (3).jpg'),
    ]
  },
  'Cake Rolls': {
    default: require('../../assets/Roller/Red Velvet Cake Roll.jpg'),
    images: [
      require('../../assets/Roller/Red Velvet Cake Roll.jpg'),
      require('../../assets/Roller/download (12).jpg'),
    ]
  },
};

/**
 * Get a local image for a food item
 * @param {string} category - The food category
 * @param {number} index - Optional index for variety
 * @returns {number} - Required image source
 */
export const getLocalImage = (category, index = 0) => {
  const categoryData = CATEGORY_IMAGES[category];
  
  if (!categoryData) {
    return PLACEHOLDER_IMAGE;
  }
  
  const images = categoryData.images;
  const imageIndex = Math.abs(index) % images.length;
  
  return images[imageIndex] || categoryData.default || PLACEHOLDER_IMAGE;
};

/**
 * Get default image for a category
 * @param {string} category - The food category
 * @returns {number} - Required image source
 */
export const getCategoryDefaultImage = (category) => {
  const categoryData = CATEGORY_IMAGES[category];
  return categoryData?.default || PLACEHOLDER_IMAGE;
};

export default {
  PLACEHOLDER_IMAGE,
  CATEGORY_IMAGES,
  getLocalImage,
  getCategoryDefaultImage
};
