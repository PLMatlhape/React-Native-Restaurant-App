// Admin Menu Management Screen - CRUD operations for food items
import * as ImagePicker from "expo-image-picker";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { dataService, FoodItem } from "../../services/local/dataService";
import { COLORS } from "../../utils/constants";
import { categoryImages, getImageForFood } from "../../utils/imageMap";

// ============================================
// TYPES
// ============================================

type FormData = {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUri?: string;
  rating: string;
  reviews: string;
  preparationTime: string;
  isAvailable: boolean;
  calories: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  description: "",
  price: "",
  category: "Coffee",
  imageUri: undefined,
  rating: "4.5",
  reviews: "0",
  preparationTime: "5",
  isAvailable: true,
  calories: "",
};

const AVAILABLE_CATEGORIES = [
  "Coffee",
  "Waffles",
  "Cakes",
  "Churros",
  "Croissants",
  "Crepes",
  "Muffins",
  "Donuts",
  "Oreos",
  "Pancakes",
  "Cake Rolls",
];

// ============================================
// COMPONENT
// ============================================

const AdminMenuScreen: React.FC = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const menuListRef = useRef<FlatList<FoodItem> | null>(null);

  // ---- LOAD DATA ----
  const loadItems = useCallback(async () => {
    try {
      const allItems = await dataService.getAllFoodItemsAsync();
      setItems(allItems);
    } catch (err) {
      Alert.alert("Error", "Failed to load menu items");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadItems();
  }, [loadItems]);

  // ---- FILTER + SEARCH ----
  const filteredItems = useMemo(() => {
    let result = items;
    if (filterCategory !== "All") {
      result = result.filter((item) => item.category === filterCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [items, filterCategory, search]);

  const categories = useMemo(() => {
    const cats = [...new Set(items.map((i) => i.category))];
    return ["All", ...cats.sort()];
  }, [items]);

  useEffect(() => {
    requestAnimationFrame(() => {
      menuListRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
  }, [filterCategory, search]);

  // ---- FORM HELPERS ----
  const openAddModal = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setModalVisible(true);
  };

  const openEditModal = (item: FoodItem) => {
    const itemImageUri =
      item.image && typeof item.image === "object" && item.image.uri
        ? item.image.uri
        : item.imageUri;

    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      imageUri: itemImageUri,
      rating: item.rating.toString(),
      reviews: item.reviews.toString(),
      preparationTime: item.preparationTime.toString(),
      isAvailable: item.isAvailable,
      calories: item.calories?.toString() || "",
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingItem(null);
    setForm(EMPTY_FORM);
  };

  const getFormPreviewImage = () => {
    if (form.imageUri && form.imageUri.trim().length > 0) {
      return { uri: form.imageUri.trim() };
    }

    const nameMatch = form.name.trim().length
      ? getImageForFood(form.name.trim(), form.category)
      : null;

    return nameMatch || categoryImages[form.category] || null;
  };

  const handlePickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow photo library access to select an item image.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length) {
        setForm((f) => ({ ...f, imageUri: result.assets[0].uri }));
      }
    } catch {
      Alert.alert("Error", "Could not open image library");
    }
  };

  const handleUseCategoryImage = () => {
    setForm((f) => ({ ...f, imageUri: undefined }));
  };

  const validateForm = (): string | null => {
    if (!form.name.trim()) return "Name is required";
    if (!form.description.trim()) return "Description is required";
    if (
      !form.price.trim() ||
      isNaN(Number(form.price)) ||
      Number(form.price) <= 0
    )
      return "Valid price is required";
    if (!form.category) return "Category is required";
    if (form.rating && (Number(form.rating) < 0 || Number(form.rating) > 5))
      return "Rating must be between 0 and 5";
    if (form.preparationTime && Number(form.preparationTime) < 0)
      return "Preparation time must be positive";
    return null;
  };

  // ---- SAVE (CREATE / UPDATE) ----
  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert("Validation Error", error);
      return;
    }

    setSaving(true);
    try {
      const itemData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        imageUri: form.imageUri?.trim() || undefined,
        rating: Number(form.rating) || 4.5,
        reviews: Number(form.reviews) || 0,
        preparationTime: Number(form.preparationTime) || 5,
        isAvailable: form.isAvailable,
        calories: form.calories ? Number(form.calories) : undefined,
      };

      if (editingItem) {
        // UPDATE
        const result = await dataService.updateFoodItem(
          editingItem.id,
          itemData,
        );
        if (!result.success) {
          Alert.alert("Error", result.error || "Failed to update item");
          return;
        }
        Alert.alert("Success", `"${itemData.name}" updated successfully`);
      } else {
        // CREATE
        const result = await dataService.addFoodItem(
          itemData as Omit<FoodItem, "id" | "image">,
        );
        if (!result.success) {
          Alert.alert("Error", result.error || "Failed to add item");
          return;
        }
        Alert.alert("Success", `"${itemData.name}" added to menu`);
      }

      closeModal();
      await loadItems();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ---- DELETE ----
  const handleDelete = (item: FoodItem) => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${item.name}"?\n\nThis action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await dataService.deleteFoodItem(item.id);
            if (result.success) {
              await loadItems();
            } else {
              Alert.alert("Error", result.error || "Failed to delete item");
            }
          },
        },
      ],
    );
  };

  // ---- TOGGLE AVAILABILITY ----
  const handleToggleAvailability = async (item: FoodItem) => {
    const result = await dataService.toggleAvailability(item.id);
    if (result.success) {
      await loadItems();
    } else {
      Alert.alert("Error", result.error || "Failed to toggle availability");
    }
  };

  // ---- RESET ----
  const handleReset = () => {
    Alert.alert(
      "Reset Menu",
      "This will remove all custom items and restore the default menu. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await dataService.resetMenuToDefaults();
            await loadItems();
            Alert.alert("Done", "Menu has been reset to defaults.");
          },
        },
      ],
    );
  };

  // ============================================
  // RENDER ITEM
  // ============================================

  const renderItem = ({ item }: { item: FoodItem }) => (
    <View
      style={[styles.itemCard, !item.isAvailable && styles.itemCardUnavailable]}
    >
      <View style={styles.itemRow}>
        {item.image ? (
          <Image source={item.image} style={styles.itemImage} />
        ) : (
          <View style={[styles.itemImage, styles.itemImagePlaceholder]}>
            <Text style={styles.itemImagePlaceholderText}>
              {item.name.charAt(0)}
            </Text>
          </View>
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <View style={styles.itemMeta}>
            <Text style={styles.itemPrice}>R{item.price.toFixed(2)}</Text>
            <Text style={styles.itemRating}>★ {item.rating}</Text>
            <Text style={styles.itemTime}>{item.preparationTime}min</Text>
          </View>
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              item.isAvailable
                ? styles.availableBtn
                : styles.unavailableActionBtn,
            ]}
            onPress={() => handleToggleAvailability(item)}
            activeOpacity={0.7}
          >
            <Image
              source={require("../../../assets/icon/icons8-check-mark-48.png")}
              style={[
                styles.actionIcon,
                {
                  tintColor: item.isAvailable ? COLORS.success : COLORS.primary,
                },
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.editBtn]}
            onPress={() => openEditModal(item)}
            activeOpacity={0.7}
          >
            <Image
              source={require("../../../assets/icon/icons8-pen-64.png")}
              style={[styles.actionIcon, { tintColor: COLORS.primary }]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => handleDelete(item)}
            activeOpacity={0.7}
          >
            <Image
              source={require("../../../assets/icon/icons8-bin-48.png")}
              style={[styles.actionIcon, { tintColor: COLORS.error }]}
            />
          </TouchableOpacity>
        </View>
      </View>
      {!item.isAvailable && (
        <View style={styles.unavailableBadge}>
          <Text style={styles.unavailableBadgeText}>Unavailable</Text>
        </View>
      )}
    </View>
  );

  // ============================================
  // FORM MODAL
  // ============================================

  const renderFormModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closeModal}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={closeModal} activeOpacity={0.7}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {editingItem ? "Edit Item" : "Add New Item"}
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.7}
          >
            <Text style={[styles.modalSave, saving && { opacity: 0.5 }]}>
              {saving ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={styles.modalScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Name */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Item Name *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Caramel Latte"
              placeholderTextColor={COLORS.border}
              value={form.name}
              onChangeText={(text) => setForm((f) => ({ ...f, name: text }))}
              autoCapitalize="words"
            />
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description *</Text>
            <TextInput
              style={[styles.formInput, styles.formTextArea]}
              placeholder="Describe this item..."
              placeholderTextColor={COLORS.border}
              value={form.description}
              onChangeText={(text) =>
                setForm((f) => ({ ...f, description: text }))
              }
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Price & Category Row */}
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.formLabel}>Price (R) *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="0.00"
                placeholderTextColor={COLORS.border}
                value={form.price}
                onChangeText={(text) =>
                  setForm((f) => ({
                    ...f,
                    price: text.replace(/[^0-9.]/g, ""),
                  }))
                }
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.formLabel}>Calories</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Optional"
                placeholderTextColor={COLORS.border}
                value={form.calories}
                onChangeText={(text) =>
                  setForm((f) => ({
                    ...f,
                    calories: text.replace(/[^0-9]/g, ""),
                  }))
                }
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Category Picker */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Category *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryPicker}
            >
              {AVAILABLE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    form.category === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => setForm((f) => ({ ...f, category: cat }))}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      form.category === cat && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Image Picker */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Item Image</Text>
            <View style={styles.imagePickerCard}>
              {getFormPreviewImage() ? (
                <Image
                  source={getFormPreviewImage()}
                  style={styles.imagePreview}
                />
              ) : (
                <View
                  style={[styles.imagePreview, styles.imagePreviewPlaceholder]}
                >
                  <Text style={styles.imagePreviewPlaceholderText}>
                    No image
                  </Text>
                </View>
              )}
              <View style={styles.imagePickerActions}>
                <TouchableOpacity
                  style={styles.imagePickerButton}
                  onPress={handlePickImage}
                  activeOpacity={0.7}
                >
                  <Text style={styles.imagePickerButtonText}>
                    Choose from gallery
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.imagePickerButton,
                    styles.imagePickerButtonSecondary,
                  ]}
                  onPress={handleUseCategoryImage}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.imagePickerButtonText,
                      styles.imagePickerButtonSecondaryText,
                    ]}
                  >
                    Use category image
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Rating & Prep Time */}
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.formLabel}>Rating (0-5)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="4.5"
                placeholderTextColor={COLORS.border}
                value={form.rating}
                onChangeText={(text) =>
                  setForm((f) => ({
                    ...f,
                    rating: text.replace(/[^0-9.]/g, ""),
                  }))
                }
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.formLabel}>Prep Time (min)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="5"
                placeholderTextColor={COLORS.border}
                value={form.preparationTime}
                onChangeText={(text) =>
                  setForm((f) => ({
                    ...f,
                    preparationTime: text.replace(/[^0-9]/g, ""),
                  }))
                }
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.formLabel}>Reviews</Text>
              <TextInput
                style={styles.formInput}
                placeholder="0"
                placeholderTextColor={COLORS.border}
                value={form.reviews}
                onChangeText={(text) =>
                  setForm((f) => ({
                    ...f,
                    reviews: text.replace(/[^0-9]/g, ""),
                  }))
                }
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Available Toggle */}
          <View style={styles.formGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.formLabel}>Available</Text>
              <Switch
                value={form.isAvailable}
                onValueChange={(val) =>
                  setForm((f) => ({ ...f, isAvailable: val }))
                }
                trackColor={{ false: COLORS.border, true: COLORS.success }}
                thumbColor={COLORS.white}
              />
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

  if (loading) {
    return (
      <View style={styles.centered}>
        <Image
          source={require("../../../assets/icon/icons8-list-50 (1).png")}
          style={{
            width: 40,
            height: 40,
            tintColor: COLORS.primary,
            marginBottom: 12,
          }}
        />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{items.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: COLORS.success }]}>
            {items.filter((i) => i.isAvailable).length}
          </Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: COLORS.error }]}>
            {items.filter((i) => !i.isAvailable).length}
          </Text>
          <Text style={styles.statLabel}>Unavailable</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>
            {new Set(items.map((i) => i.category)).size}
          </Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
      </View>

      {/* Search + Actions */}
      <View style={styles.toolbar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search menu items..."
          placeholderTextColor={COLORS.textLight}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={openAddModal}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterChip,
              filterCategory === cat && styles.filterChipActive,
            ]}
            onPress={() => setFilterCategory(cat)}
            activeOpacity={0.7}
          >
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={[
                styles.filterChipText,
                filterCategory === cat && styles.filterChipTextActive,
              ]}
            >
              {`${cat} (${cat === "All" ? items.length : items.filter((i) => i.category === cat).length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Item List */}
      <FlatList
        ref={menuListRef}
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<View style={styles.listTopSpacer} />}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Items Found</Text>
            <Text style={styles.emptySubtitle}>
              {search
                ? "Try a different search term"
                : "Tap '+ Add' to create your first menu item"}
            </Text>
          </View>
        }
      />

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Text style={styles.resetButtonText}>Reset to Defaults</Text>
        </TouchableOpacity>
        <Text style={styles.itemCount}>
          {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Form Modal */}
      {renderFormModal()}
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textLight,
  },

  // Stats Bar
  statsBar: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },

  // Toolbar
  toolbar: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },

  // Category Filter
  filterScroll: {
    minHeight: 46,
    maxHeight: 46,
    marginTop: 2,
    marginBottom: 12,
  },
  filterRow: {
    paddingHorizontal: 12,
    gap: 8,
    alignItems: "center",
  },
  filterChip: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 0,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    lineHeight: 17,
    includeFontPadding: false,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },

  // Item Card
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 0,
    paddingBottom: 80,
  },
  listTopSpacer: {
    height: 12,
  },
  itemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  itemCardUnavailable: {
    opacity: 0.65,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },
  itemImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
  },
  itemImagePlaceholderText: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  itemCategory: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 10,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  itemRating: {
    fontSize: 12,
    color: COLORS.warning,
  },
  itemTime: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  itemActions: {
    flexDirection: "column",
    gap: 4,
    marginLeft: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  availableBtn: {
    backgroundColor: COLORS.cream,
  },
  unavailableActionBtn: {
    backgroundColor: COLORS.lightBrown,
  },
  editBtn: {
    backgroundColor: COLORS.cream,
  },
  deleteBtn: {
    backgroundColor: "#FFEBEE",
  },
  actionBtnText: {
    fontSize: 14,
  },
  actionIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  availabilityDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  unavailableBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: COLORS.error,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unavailableBadgeText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: "700",
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 20,
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  resetButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.error,
  },
  itemCount: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: "500",
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingTop:
      Platform.OS === "ios" ? 56 : (StatusBar.currentHeight || 40) + 10,
  },
  modalCancel: {
    fontSize: 15,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.text,
  },
  modalSave: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "700",
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 16,
  },

  // Form
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formTextArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  formRow: {
    flexDirection: "row",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Category Picker
  categoryPicker: {
    gap: 8,
  },
  categoryChip: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },
  categoryChipTextActive: {
    color: COLORS.white,
  },
  imagePickerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    gap: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },
  imagePreviewPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreviewPlaceholderText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  imagePickerActions: {
    flexDirection: "row",
    gap: 8,
  },
  imagePickerButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  imagePickerButtonSecondary: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imagePickerButtonText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "700",
  },
  imagePickerButtonSecondaryText: {
    color: COLORS.text,
  },
});

export default AdminMenuScreen;
