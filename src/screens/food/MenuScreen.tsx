// Menu Screen - browse by category with filtering
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Category,
    dataService,
    FoodItem,
} from "../../services/local/dataService";
import { COLORS } from "../../utils/constants";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2;

interface MenuScreenProps {
  navigation: any;
  route: any;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ navigation, route }) => {
  const initialCategory = route?.params?.category || null;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [allItems, setAllItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Reload data from AsyncStorage every time this screen gains focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const loadData = async () => {
        const [items, cats] = await Promise.all([
          dataService.getAllFoodItemsAsync(),
          dataService.getCategoriesAsync(),
        ]);
        if (isActive) {
          setAllItems(items);
          setCategories(cats);
        }
      };
      loadData();
      return () => {
        isActive = false;
      };
    }, []),
  );

  const filteredItems = useMemo(() => {
    let items = selectedCategory
      ? allItems.filter((item) => item.category === selectedCategory)
      : allItems;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }

    return items;
  }, [selectedCategory, searchQuery, allItems]);

  const navigateToFood = useCallback(
    (item: FoodItem) => {
      navigation.navigate("FoodDetail", { item });
    },
    [navigation],
  );

  const renderCategoryChip = ({
    item,
  }: {
    item: Category | { id: string; name: string; icon: string };
  }) => {
    const isSelected =
      selectedCategory === item.name ||
      (item.id === "all" && !selectedCategory);
    return (
      <TouchableOpacity
        style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
        onPress={() =>
          setSelectedCategory(item.id === "all" ? null : item.name)
        }
        activeOpacity={0.7}
      >
        <Text style={styles.categoryChipIcon}>{item.icon}</Text>
        <Text
          style={[
            styles.categoryChipText,
            isSelected && styles.categoryChipTextActive,
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.foodCard}
      onPress={() => navigateToFood(item)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image
            source={item.image}
            style={styles.foodImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.foodImage, styles.imagePlaceholder]}>
            <Text style={{ fontSize: 36 }}>🍽️</Text>
          </View>
        )}
        {!item.isAvailable && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Sold Out</Text>
          </View>
        )}
      </View>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.foodDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.foodBottom}>
          <Text style={styles.foodPrice}>R{item.price}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStar}>⭐</Text>
            <Text style={styles.ratingValue}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const allCategory = { id: "all", name: "All", icon: "🍴" };
  const categoryData = [allCategory, ...categories];

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search menu items..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <FlatList
        data={categoryData}
        renderItem={renderCategoryChip}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        style={styles.categoryScroll}
      />

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
          {selectedCategory ? ` in ${selectedCategory}` : ""}
        </Text>
      </View>

      {/* Food Grid */}
      <FlatList
        data={filteredItems}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.foodGrid}
        columnWrapperStyle={styles.foodRow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySubtext}>
              Try a different search or category
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  clearSearch: {
    fontSize: 16,
    color: COLORS.textLight,
    paddingLeft: 8,
  },
  categoryScroll: {
    maxHeight: 60,
  },
  categoryList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 42,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    lineHeight: 18,
  },
  categoryChipTextActive: {
    color: COLORS.white,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  resultsCount: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  foodGrid: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  foodRow: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  foodCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  foodImage: {
    width: "100%",
    height: CARD_WIDTH * 0.68,
  },
  imagePlaceholder: {
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  unavailableBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  unavailableText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  foodInfo: {
    padding: 10,
  },
  foodName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  foodDesc: {
    fontSize: 11,
    color: COLORS.textLight,
    lineHeight: 15,
    marginBottom: 8,
  },
  foodBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingStar: {
    fontSize: 12,
    marginRight: 2,
  },
  ratingValue: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 50,
    marginBottom: 14,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default MenuScreen;
