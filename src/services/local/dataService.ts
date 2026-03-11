// Local data service - serves food items from static data
// Supports admin CRUD with AsyncStorage persistence
// No Firebase needed - everything is local

import AsyncStorage from "@react-native-async-storage/async-storage";
import { categoryImages, getImageForFood } from "../../utils/imageMap";

const MENU_STORAGE_KEY = "coffee_shop_custom_menu";
const DELETED_ITEMS_KEY = "coffee_shop_deleted_items";
const UPDATED_ITEMS_KEY = "coffee_shop_updated_items";

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: any;
  rating: number;
  reviews: number;
  preparationTime: number;
  isAvailable: boolean;
  calories?: number;
  ingredients?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: any;
  itemCount: number;
}

// ============================================
// STATIC FOOD DATA (from SAMPLE_DATA.Json + imageMap)
// ============================================

const RAW_FOOD_DATA: Omit<FoodItem, "id" | "image">[] = [
  // Coffee
  {
    name: "Espresso",
    description: "Strong and bold coffee shot made from finely ground beans",
    price: 25,
    category: "Coffee",
    rating: 4.8,
    reviews: 124,
    preparationTime: 3,
    isAvailable: true,
    calories: 5,
  },
  {
    name: "Americano",
    description: "Espresso diluted with hot water for a smooth taste",
    price: 28,
    category: "Coffee",
    rating: 4.5,
    reviews: 98,
    preparationTime: 4,
    isAvailable: true,
    calories: 10,
  },
  {
    name: "Latte",
    description: "Espresso with steamed milk and light foam",
    price: 32,
    category: "Coffee",
    rating: 4.7,
    reviews: 210,
    preparationTime: 5,
    isAvailable: true,
    calories: 120,
  },
  {
    name: "Cappuccino",
    description: "Equal parts espresso, steamed milk, and foam",
    price: 35,
    category: "Coffee",
    rating: 4.9,
    reviews: 305,
    preparationTime: 5,
    isAvailable: true,
    calories: 80,
  },
  {
    name: "Mocha",
    description: "Espresso with chocolate and steamed milk",
    price: 38,
    category: "Coffee",
    rating: 4.6,
    reviews: 178,
    preparationTime: 6,
    isAvailable: true,
    calories: 250,
  },
  {
    name: "Macchiato",
    description: "Espresso stained with a small amount of milk",
    price: 30,
    category: "Coffee",
    rating: 4.4,
    reviews: 89,
    preparationTime: 3,
    isAvailable: true,
    calories: 15,
  },
  {
    name: "Flat White",
    description: "Double espresso with velvety steamed milk",
    price: 35,
    category: "Coffee",
    rating: 4.7,
    reviews: 156,
    preparationTime: 5,
    isAvailable: true,
    calories: 110,
  },
  {
    name: "Cold Brew",
    description: "Coffee steeped cold for 12+ hours, smooth and bold",
    price: 32,
    category: "Coffee",
    rating: 4.5,
    reviews: 134,
    preparationTime: 2,
    isAvailable: true,
    calories: 5,
  },
  {
    name: "Iced Coffee",
    description: "Chilled brewed coffee served over ice",
    price: 28,
    category: "Coffee",
    rating: 4.3,
    reviews: 201,
    preparationTime: 3,
    isAvailable: true,
    calories: 10,
  },

  // Waffles
  {
    name: "Belgian Waffle",
    description: "Classic Belgian style waffle, light and crispy",
    price: 45,
    category: "Waffles",
    rating: 4.8,
    reviews: 167,
    preparationTime: 8,
    isAvailable: true,
    calories: 310,
  },
  {
    name: "Chocolate Waffle",
    description: "Waffle topped with rich chocolate sauce",
    price: 50,
    category: "Waffles",
    rating: 4.7,
    reviews: 143,
    preparationTime: 10,
    isAvailable: true,
    calories: 420,
  },
  {
    name: "Nutella Waffle",
    description: "Waffle generously spread with Nutella",
    price: 52,
    category: "Waffles",
    rating: 4.9,
    reviews: 198,
    preparationTime: 10,
    isAvailable: true,
    calories: 450,
  },
  {
    name: "Classic Waffle",
    description: "Traditional waffle with butter and maple syrup",
    price: 40,
    category: "Waffles",
    rating: 4.5,
    reviews: 120,
    preparationTime: 8,
    isAvailable: true,
    calories: 290,
  },

  // Cakes
  {
    name: "Chocolate Cake",
    description: "Rich chocolate layer cake with chocolate frosting",
    price: 40,
    category: "Cakes",
    rating: 4.9,
    reviews: 234,
    preparationTime: 5,
    isAvailable: true,
    calories: 380,
  },
  {
    name: "Red Velvet Cake",
    description: "Classic red velvet with cream cheese frosting",
    price: 45,
    category: "Cakes",
    rating: 4.8,
    reviews: 189,
    preparationTime: 5,
    isAvailable: true,
    calories: 350,
  },
  {
    name: "Cheesecake",
    description: "Creamy New York style cheesecake",
    price: 48,
    category: "Cakes",
    rating: 4.7,
    reviews: 156,
    preparationTime: 5,
    isAvailable: true,
    calories: 400,
  },
  {
    name: "Blueberry Cake",
    description: "Moist cake with fresh blueberry compote",
    price: 42,
    category: "Cakes",
    rating: 4.6,
    reviews: 98,
    preparationTime: 5,
    isAvailable: true,
    calories: 320,
  },
  {
    name: "Lavender Cake",
    description: "Elegant cake with delicate lavender flavor",
    price: 50,
    category: "Cakes",
    rating: 4.5,
    reviews: 76,
    preparationTime: 5,
    isAvailable: true,
    calories: 300,
  },
  {
    name: "Coffee Cake",
    description: "Moist cake infused with rich coffee flavor",
    price: 38,
    category: "Cakes",
    rating: 4.6,
    reviews: 112,
    preparationTime: 5,
    isAvailable: true,
    calories: 340,
  },

  // Churros
  {
    name: "Classic Churros",
    description: "Crispy churros coated with cinnamon sugar",
    price: 35,
    category: "Churros",
    rating: 4.7,
    reviews: 145,
    preparationTime: 8,
    isAvailable: true,
    calories: 230,
  },
  {
    name: "Chocolate Churros",
    description: "Churros with chocolate dipping sauce",
    price: 38,
    category: "Churros",
    rating: 4.8,
    reviews: 178,
    preparationTime: 8,
    isAvailable: true,
    calories: 280,
  },
  {
    name: "Cinnamon Churros",
    description: "Extra cinnamon sugar-coated churros",
    price: 35,
    category: "Churros",
    rating: 4.6,
    reviews: 112,
    preparationTime: 8,
    isAvailable: true,
    calories: 240,
  },

  // Croissants
  {
    name: "Plain Croissant",
    description: "Flaky French butter croissant",
    price: 25,
    category: "Croissants",
    rating: 4.7,
    reviews: 198,
    preparationTime: 3,
    isAvailable: true,
    calories: 230,
  },
  {
    name: "Chocolate Croissant",
    description: "Croissant filled with rich chocolate",
    price: 30,
    category: "Croissants",
    rating: 4.8,
    reviews: 234,
    preparationTime: 3,
    isAvailable: true,
    calories: 300,
  },
  {
    name: "Almond Croissant",
    description: "Croissant with almond cream filling",
    price: 32,
    category: "Croissants",
    rating: 4.6,
    reviews: 145,
    preparationTime: 3,
    isAvailable: true,
    calories: 310,
  },
  {
    name: "Breakfast Croissant",
    description: "Croissant with egg, cheese and ham",
    price: 35,
    category: "Croissants",
    rating: 4.5,
    reviews: 167,
    preparationTime: 5,
    isAvailable: true,
    calories: 350,
  },
  {
    name: "Berry Croissant",
    description: "Croissant filled with mixed berry compote",
    price: 32,
    category: "Croissants",
    rating: 4.4,
    reviews: 89,
    preparationTime: 3,
    isAvailable: true,
    calories: 270,
  },

  // Crepes
  {
    name: "Nutella Crepe",
    description: "Thin crepe spread with Nutella",
    price: 38,
    category: "Crepes",
    rating: 4.8,
    reviews: 210,
    preparationTime: 7,
    isAvailable: true,
    calories: 350,
  },
  {
    name: "Chocolate Crepe",
    description: "Crepe with melted chocolate filling",
    price: 40,
    category: "Crepes",
    rating: 4.7,
    reviews: 178,
    preparationTime: 7,
    isAvailable: true,
    calories: 340,
  },
  {
    name: "Classic Crepe",
    description: "Traditional crepe with butter and sugar",
    price: 30,
    category: "Crepes",
    rating: 4.5,
    reviews: 134,
    preparationTime: 6,
    isAvailable: true,
    calories: 220,
  },
  {
    name: "Strawberry Crepe",
    description: "Crepe with fresh strawberries and cream",
    price: 42,
    category: "Crepes",
    rating: 4.6,
    reviews: 156,
    preparationTime: 7,
    isAvailable: true,
    calories: 300,
  },

  // Muffins
  {
    name: "Chocolate Muffin",
    description: "Rich double chocolate chip muffin",
    price: 28,
    category: "Muffins",
    rating: 4.7,
    reviews: 189,
    preparationTime: 3,
    isAvailable: true,
    calories: 380,
  },
  {
    name: "Blueberry Muffin",
    description: "Moist muffin packed with fresh blueberries",
    price: 28,
    category: "Muffins",
    rating: 4.8,
    reviews: 212,
    preparationTime: 3,
    isAvailable: true,
    calories: 290,
  },
  {
    name: "Vanilla Muffin",
    description: "Classic vanilla muffin with sugar topping",
    price: 25,
    category: "Muffins",
    rating: 4.5,
    reviews: 134,
    preparationTime: 3,
    isAvailable: true,
    calories: 270,
  },
  {
    name: "Chocolate Cupcake",
    description: "Chocolate cupcake with hazelnut frosting",
    price: 32,
    category: "Muffins",
    rating: 4.6,
    reviews: 145,
    preparationTime: 3,
    isAvailable: true,
    calories: 340,
  },
  {
    name: "Hazelnut Cupcake",
    description: "Hazelnut-flavored cupcake with chocolate drizzle",
    price: 35,
    category: "Muffins",
    rating: 4.7,
    reviews: 98,
    preparationTime: 3,
    isAvailable: true,
    calories: 350,
  },

  // Donuts
  {
    name: "Chocolate Donut",
    description: "Donut with chocolate frosting",
    price: 25,
    category: "Donuts",
    rating: 4.7,
    reviews: 234,
    preparationTime: 3,
    isAvailable: true,
    calories: 350,
  },
  {
    name: "Glazed Donut",
    description: "Classic glazed ring donut",
    price: 22,
    category: "Donuts",
    rating: 4.6,
    reviews: 198,
    preparationTime: 3,
    isAvailable: true,
    calories: 260,
  },

  // Oreos
  {
    name: "Oreo Milkshake",
    description: "Creamy milkshake blended with Oreo cookies",
    price: 35,
    category: "Oreos",
    rating: 4.8,
    reviews: 178,
    preparationTime: 5,
    isAvailable: true,
    calories: 450,
  },
  {
    name: "Oreo Cheesecake",
    description: "Cheesecake with Oreo cookie crust",
    price: 45,
    category: "Oreos",
    rating: 4.9,
    reviews: 167,
    preparationTime: 5,
    isAvailable: true,
    calories: 480,
  },
  {
    name: "Oreo Cookie",
    description: "Giant Oreo cookie freshly baked",
    price: 20,
    category: "Oreos",
    rating: 4.5,
    reviews: 123,
    preparationTime: 3,
    isAvailable: true,
    calories: 280,
  },
  {
    name: "Oreo Brownie",
    description: "Fudgy brownie with Oreo pieces",
    price: 30,
    category: "Oreos",
    rating: 4.7,
    reviews: 145,
    preparationTime: 3,
    isAvailable: true,
    calories: 400,
  },

  // Pancakes
  {
    name: "Buttermilk Pancakes",
    description: "Stack of fluffy buttermilk pancakes",
    price: 40,
    category: "Pancakes",
    rating: 4.7,
    reviews: 189,
    preparationTime: 10,
    isAvailable: true,
    calories: 350,
  },
  {
    name: "Chocolate Pancakes",
    description: "Pancakes with chocolate chips and syrup",
    price: 45,
    category: "Pancakes",
    rating: 4.8,
    reviews: 156,
    preparationTime: 10,
    isAvailable: true,
    calories: 420,
  },
  {
    name: "Classic Pancakes",
    description: "Traditional pancakes with butter and syrup",
    price: 38,
    category: "Pancakes",
    rating: 4.5,
    reviews: 134,
    preparationTime: 10,
    isAvailable: true,
    calories: 320,
  },
  {
    name: "Fluffy Pancakes",
    description: "Extra fluffy Japanese-style pancakes",
    price: 48,
    category: "Pancakes",
    rating: 4.9,
    reviews: 210,
    preparationTime: 12,
    isAvailable: true,
    calories: 300,
  },

  // Roller Cakes
  {
    name: "Red Velvet Roll",
    description: "Red velvet sponge with cream cheese filling",
    price: 38,
    category: "Cake Rolls",
    rating: 4.8,
    reviews: 145,
    preparationTime: 5,
    isAvailable: true,
    calories: 320,
  },
  {
    name: "Blue Velvet Roll",
    description: "Blue velvet cake roll with vanilla cream",
    price: 40,
    category: "Cake Rolls",
    rating: 4.6,
    reviews: 89,
    preparationTime: 5,
    isAvailable: true,
    calories: 310,
  },
  {
    name: "Chocolate Roll",
    description: "Chocolate sponge roll with chocolate cream",
    price: 38,
    category: "Cake Rolls",
    rating: 4.7,
    reviews: 134,
    preparationTime: 5,
    isAvailable: true,
    calories: 340,
  },
  {
    name: "Classic Roll",
    description: "Vanilla sponge roll with fresh cream",
    price: 35,
    category: "Cake Rolls",
    rating: 4.5,
    reviews: 112,
    preparationTime: 5,
    isAvailable: true,
    calories: 280,
  },
];

// Build food items with IDs and images
export const FOOD_ITEMS: FoodItem[] = RAW_FOOD_DATA.map((item, index) => ({
  ...item,
  id: `food_${index + 1}`,
  image:
    getImageForFood(item.name, item.category) ||
    categoryImages[item.category] ||
    null,
}));

// Build categories from food data
const categoryNames = [...new Set(RAW_FOOD_DATA.map((item) => item.category))];

const CATEGORY_ICONS: Record<string, string> = {
  Coffee: "☕",
  Waffles: "🧇",
  Cakes: "🍰",
  Churros: "🥨",
  Croissants: "🥐",
  Crepes: "🥞",
  Muffins: "🧁",
  Donuts: "🍩",
  Oreos: "🍪",
  Pancakes: "🥞",
  "Cake Rolls": "🍥",
};

export const CATEGORIES: Category[] = categoryNames.map((name, index) => ({
  id: `cat_${index + 1}`,
  name,
  icon: CATEGORY_ICONS[name] || "🍴",
  image: categoryImages[name] || categoryImages[name.replace(" ", "")] || null,
  itemCount: RAW_FOOD_DATA.filter((item) => item.category === name).length,
}));

// ============================================
// DATA SERVICE FUNCTIONS
// ============================================

// Helper: load custom items from AsyncStorage
const loadCustomItems = async (): Promise<FoodItem[]> => {
  try {
    const json = await AsyncStorage.getItem(MENU_STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
};

// Helper: save custom items to AsyncStorage
const saveCustomItems = async (items: FoodItem[]): Promise<void> => {
  await AsyncStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
};

// Helper: load deleted item IDs
const loadDeletedIds = async (): Promise<string[]> => {
  try {
    const json = await AsyncStorage.getItem(DELETED_ITEMS_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
};

// Helper: save deleted item IDs
const saveDeletedIds = async (ids: string[]): Promise<void> => {
  await AsyncStorage.setItem(DELETED_ITEMS_KEY, JSON.stringify(ids));
};

// Helper: load updated items (overrides for static items)
const loadUpdatedItems = async (): Promise<
  Record<string, Partial<FoodItem>>
> => {
  try {
    const json = await AsyncStorage.getItem(UPDATED_ITEMS_KEY);
    return json ? JSON.parse(json) : {};
  } catch {
    return {};
  }
};

// Helper: save updated items
const saveUpdatedItems = async (
  updates: Record<string, Partial<FoodItem>>,
): Promise<void> => {
  await AsyncStorage.setItem(UPDATED_ITEMS_KEY, JSON.stringify(updates));
};

export const dataService = {
  // ---- READ ----
  getAllFoodItems: (): FoodItem[] => {
    return FOOD_ITEMS;
  },

  // Async version that merges static + custom items and applies edits/deletes
  getAllFoodItemsAsync: async (): Promise<FoodItem[]> => {
    const [customItems, deletedIds, updatedItems] = await Promise.all([
      loadCustomItems(),
      loadDeletedIds(),
      loadUpdatedItems(),
    ]);

    // Start with static items, apply updates and filter deletes
    const staticItems = FOOD_ITEMS.filter(
      (item) => !deletedIds.includes(item.id),
    ).map((item) => {
      if (updatedItems[item.id]) {
        return { ...item, ...updatedItems[item.id], id: item.id };
      }
      return item;
    });

    // Merge with custom items (also filter deleted custom items)
    const allItems = [
      ...staticItems,
      ...customItems.filter((item) => !deletedIds.includes(item.id)),
    ];

    return allItems;
  },

  getFoodItemsByCategory: (category: string): FoodItem[] => {
    return FOOD_ITEMS.filter((item) => item.category === category);
  },

  getFoodItemsByCategoryAsync: async (
    category: string,
  ): Promise<FoodItem[]> => {
    const allItems = await dataService.getAllFoodItemsAsync();
    return allItems.filter((item) => item.category === category);
  },

  getFoodItemById: (id: string): FoodItem | undefined => {
    return FOOD_ITEMS.find((item) => item.id === id);
  },

  getFoodItemByIdAsync: async (id: string): Promise<FoodItem | undefined> => {
    const allItems = await dataService.getAllFoodItemsAsync();
    return allItems.find((item) => item.id === id);
  },

  searchFoodItems: (query: string): FoodItem[] => {
    const lowerQuery = query.toLowerCase();
    return FOOD_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery),
    );
  },

  searchFoodItemsAsync: async (query: string): Promise<FoodItem[]> => {
    const allItems = await dataService.getAllFoodItemsAsync();
    const lowerQuery = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery),
    );
  },

  getCategories: (): Category[] => {
    return CATEGORIES;
  },

  getCategoriesAsync: async (): Promise<Category[]> => {
    const allItems = await dataService.getAllFoodItemsAsync();
    const categoryNames = [...new Set(allItems.map((item) => item.category))];
    return categoryNames.map((name, index) => ({
      id: `cat_${index + 1}`,
      name,
      icon: CATEGORY_ICONS[name] || "🍴",
      image:
        categoryImages[name] || categoryImages[name.replace(" ", "")] || null,
      itemCount: allItems.filter((item) => item.category === name).length,
    }));
  },

  getFeaturedItems: (): FoodItem[] => {
    // Top rated items
    return [...FOOD_ITEMS].sort((a, b) => b.rating - a.rating).slice(0, 8);
  },

  getPopularItems: (): FoodItem[] => {
    // Most reviewed items
    return [...FOOD_ITEMS].sort((a, b) => b.reviews - a.reviews).slice(0, 6);
  },

  // ---- CREATE ----
  addFoodItem: async (
    item: Omit<FoodItem, "id" | "image">,
  ): Promise<{ success: boolean; item?: FoodItem; error?: string }> => {
    try {
      const customItems = await loadCustomItems();
      const newId = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newItem: FoodItem = {
        ...item,
        id: newId,
        image:
          getImageForFood(item.name, item.category) ||
          categoryImages[item.category] ||
          null,
      };
      customItems.push(newItem);
      await saveCustomItems(customItems);
      return { success: true, item: newItem };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to add item" };
    }
  },

  // ---- UPDATE ----
  updateFoodItem: async (
    id: string,
    updates: Partial<Omit<FoodItem, "id">>,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if it's a custom item
      const customItems = await loadCustomItems();
      const customIndex = customItems.findIndex((item) => item.id === id);

      if (customIndex >= 0) {
        // Update custom item directly
        customItems[customIndex] = {
          ...customItems[customIndex],
          ...updates,
          id, // preserve id
          image:
            updates.name || updates.category
              ? getImageForFood(
                  updates.name || customItems[customIndex].name,
                  updates.category || customItems[customIndex].category,
                ) ||
                categoryImages[
                  updates.category || customItems[customIndex].category
                ] ||
                customItems[customIndex].image
              : customItems[customIndex].image,
        };
        await saveCustomItems(customItems);
      } else {
        // It's a static item - save override
        const updatedItems = await loadUpdatedItems();
        updatedItems[id] = {
          ...(updatedItems[id] || {}),
          ...updates,
        };
        // Re-map image if name/category changed
        if (updates.name || updates.category) {
          const staticItem = FOOD_ITEMS.find((item) => item.id === id);
          if (staticItem) {
            updatedItems[id].image =
              getImageForFood(
                updates.name || staticItem.name,
                updates.category || staticItem.category,
              ) ||
              categoryImages[updates.category || staticItem.category] ||
              staticItem.image;
          }
        }
        await saveUpdatedItems(updatedItems);
      }
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to update item",
      };
    }
  },

  // ---- DELETE ----
  deleteFoodItem: async (
    id: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if it's a custom item - remove from custom storage
      const customItems = await loadCustomItems();
      const customIndex = customItems.findIndex((item) => item.id === id);

      if (customIndex >= 0) {
        customItems.splice(customIndex, 1);
        await saveCustomItems(customItems);
      } else {
        // It's a static item - add to deleted list
        const deletedIds = await loadDeletedIds();
        if (!deletedIds.includes(id)) {
          deletedIds.push(id);
          await saveDeletedIds(deletedIds);
        }
      }
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to delete item",
      };
    }
  },

  // ---- TOGGLE AVAILABILITY ----
  toggleAvailability: async (
    id: string,
  ): Promise<{ success: boolean; isAvailable?: boolean; error?: string }> => {
    try {
      // Check custom items first
      const customItems = await loadCustomItems();
      const customIndex = customItems.findIndex((item) => item.id === id);

      if (customIndex >= 0) {
        customItems[customIndex].isAvailable =
          !customItems[customIndex].isAvailable;
        await saveCustomItems(customItems);
        return {
          success: true,
          isAvailable: customItems[customIndex].isAvailable,
        };
      }

      // Static item - use updates
      const updatedItems = await loadUpdatedItems();
      const staticItem = FOOD_ITEMS.find((item) => item.id === id);
      if (!staticItem) return { success: false, error: "Item not found" };

      const currentAvailability =
        updatedItems[id]?.isAvailable ?? staticItem.isAvailable;
      updatedItems[id] = {
        ...(updatedItems[id] || {}),
        isAvailable: !currentAvailability,
      };
      await saveUpdatedItems(updatedItems);
      return { success: true, isAvailable: !currentAvailability };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to toggle availability",
      };
    }
  },

  // ---- RESET ----
  resetMenuToDefaults: async (): Promise<void> => {
    await Promise.all([
      AsyncStorage.removeItem(MENU_STORAGE_KEY),
      AsyncStorage.removeItem(DELETED_ITEMS_KEY),
      AsyncStorage.removeItem(UPDATED_ITEMS_KEY),
    ]);
  },
};

export default dataService;
