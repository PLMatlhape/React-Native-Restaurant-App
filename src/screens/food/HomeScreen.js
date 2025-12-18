import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  TextInput
} from 'react-native';
import { firestoreService } from '../../services/firebase/firestoreService';
import { useCart } from '../../context/CartContext';
import { COLORS, CATEGORIES, SCREEN_NAMES } from '../../utils/constants';

const HomeScreen = ({ navigation }) => {
  const { getCartCount } = useCart();
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFoodItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [selectedCategory, searchQuery, foodItems]);

  const loadFoodItems = async () => {
    setLoading(true);
    const result = await firestoreService.getFoodItems();
    if (result.success) {
      setFoodItems(result.data);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFoodItems();
    setRefreshing(false);
  };

  const filterItems = () => {
    let items = foodItems;

    if (selectedCategory !== 'All') {
      items = items.filter(item => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(items);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.name && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(item.name)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.name && styles.categoryTextActive
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity
      style={styles.foodCard}
      onPress={() => navigation.navigate(SCREEN_NAMES.FOOD_DETAIL, { item })}
    >
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🖼️</Text>
          </View>
        )}
      </View>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.foodDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.foodPrice}>R{item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  const categories = [{ id: '0', name: 'All' }, ...CATEGORIES];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Day!</Text>
          <Text style={styles.headerTitle}>Coffee Shop</Text>
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate(SCREEN_NAMES.CART)}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {getCartCount() > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getCartCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for coffee, donuts, cakes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.textLight}
        />
      </View>

      {/* Categories */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        style={styles.categoriesList}
        contentContainerStyle={styles.categoriesContent}
      />

      {/* Food Items */}
      <FlatList
        data={filteredItems}
        renderItem={renderFoodItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.foodList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading...' : 'No items found'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: COLORS.primary,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.cream,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  cartButton: {
    position: 'relative',
    padding: 10,
  },
  cartIcon: {
    fontSize: 28,
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoriesList: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  foodList: {
    padding: 10,
  },
  foodCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    margin: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 120,
  },
  foodImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightBrown,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 40,
  },
  foodInfo: {
    padding: 12,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  foodDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});

export default HomeScreen;