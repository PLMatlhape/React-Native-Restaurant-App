// Home Screen - categories, featured items, search, clean layout
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import {
    Category,
    dataService,
    FoodItem,
} from "../../services/local/dataService";
import { COLORS } from "../../utils/constants";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 56) / 2;

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
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

  // Derived data from the loaded items
  const featuredItems = useMemo(() => {
    return [...allItems].sort((a, b) => b.rating - a.rating).slice(0, 8);
  }, [allItems]);

  const popularItems = useMemo(() => {
    return [...allItems].sort((a, b) => b.reviews - a.reviews).slice(0, 6);
  }, [allItems]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const lowerQuery = searchQuery.toLowerCase();
    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery),
    );
  }, [searchQuery, allItems]);

  const navigateToFood = useCallback(
    (item: FoodItem) => {
      navigation.navigate("FoodDetail", { item });
    },
    [navigation],
  );

  const navigateToCategory = useCallback(
    (category: string) => {
      navigation.navigate("Menu", { category });
    },
    [navigation],
  );

  // ============================================
  // RENDER COMPONENTS
  // ============================================

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => navigateToCategory(item.name)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryIconContainer}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.categoryName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.categoryCount}>{item.itemCount} items</Text>
    </TouchableOpacity>
  );

  const renderFoodCard = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.foodCard}
      onPress={() => navigateToFood(item)}
      activeOpacity={0.7}
    >
      <View style={styles.foodImageContainer}>
        {item.image ? (
          <Image
            source={item.image}
            style={styles.foodImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.foodImagePlaceholder}>
            <Text style={styles.foodImageEmoji}>🍽️</Text>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {item.rating}</Text>
        </View>
      </View>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.foodCategory}>{item.category}</Text>
        <View style={styles.foodPriceRow}>
          <Text style={styles.foodPrice}>R{item.price}</Text>
          <Text style={styles.foodTime}>⏱ {item.preparationTime}min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPopularItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.popularCard}
      onPress={() => navigateToFood(item)}
      activeOpacity={0.7}
    >
      {item.image ? (
        <Image
          source={item.image}
          style={styles.popularImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.popularImage, styles.foodImagePlaceholder]}>
          <Text style={styles.foodImageEmoji}>🍽️</Text>
        </View>
      )}
      <View style={styles.popularInfo}>
        <Text style={styles.popularName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.popularDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.popularBottom}>
          <Text style={styles.popularPrice}>R{item.price}</Text>
          <Text style={styles.popularRating}>⭐ {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.searchResultCard}
      onPress={() => navigateToFood(item)}
      activeOpacity={0.7}
    >
      {item.image ? (
        <Image
          source={item.image}
          style={styles.searchResultImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.searchResultImage, styles.foodImagePlaceholder]}>
          <Text style={{ fontSize: 22 }}>🍽️</Text>
        </View>
      )}
      <View style={styles.searchResultInfo}>
        <Text style={styles.searchResultName}>{item.name}</Text>
        <Text style={styles.searchResultCategory}>{item.category}</Text>
        <Text style={styles.searchResultPrice}>R{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>
              Good{" "}
              {new Date().getHours() < 12
                ? "Morning"
                : new Date().getHours() < 18
                  ? "Afternoon"
                  : "Evening"}
              ! ☀️
            </Text>
            <Text style={styles.userName}>{user?.name || "Coffee Lover"}</Text>
          </View>
          <TouchableOpacity style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {(user?.name?.[0] || "C").toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search coffee, pastries, treats..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* SEARCH RESULTS */}
      {searchResults ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.searchResultsList}
          ListEmptyComponent={
            <View style={styles.emptySearch}>
              <Text style={styles.emptySearchEmoji}>🔍</Text>
              <Text style={styles.emptySearchText}>
                No results found for "{searchQuery}"
              </Text>
            </View>
          }
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* CATEGORIES */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Menu", {})}>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            />
          </View>

          {/* FEATURED */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⭐ Top Rated</Text>
            </View>
            <FlatList
              data={featuredItems}
              renderItem={renderFoodCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.foodList}
              snapToInterval={CARD_WIDTH + 14}
              decelerationRate="fast"
            />
          </View>

          {/* POPULAR */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Popular Now</Text>
            </View>
            {popularItems.map((item) => (
              <View key={item.id}>{renderPopularItem({ item })}</View>
            ))}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  greeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.white,
  },
  clearSearch: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    paddingLeft: 8,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  // Categories
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    alignItems: "center",
    marginHorizontal: 6,
    width: 80,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  categoryCount: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 2,
  },
  // Food Cards (horizontal)
  foodList: {
    paddingHorizontal: 16,
  },
  foodCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  foodImageContainer: {
    position: "relative",
  },
  foodImage: {
    width: "100%",
    height: CARD_WIDTH * 0.7,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  foodImagePlaceholder: {
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  foodImageEmoji: {
    fontSize: 40,
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600",
  },
  foodInfo: {
    padding: 12,
  },
  foodName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  foodCategory: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  foodPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  foodTime: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  // Popular Items (vertical list)
  popularCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  popularImage: {
    width: 100,
    height: 100,
  },
  popularInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  popularName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  popularDesc: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 17,
  },
  popularBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  popularPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  popularRating: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  // Search Results
  searchResultsList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchResultCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchResultImage: {
    width: 80,
    height: 80,
  },
  searchResultInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  searchResultName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  searchResultCategory: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  searchResultPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  emptySearch: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptySearchEmoji: {
    fontSize: 50,
    marginBottom: 16,
  },
  emptySearchText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
  },
});

export default HomeScreen;
