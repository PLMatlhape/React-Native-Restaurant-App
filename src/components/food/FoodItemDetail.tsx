import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { FoodItem } from "../../types";
import {
    COFFEE_SIZES,
    COLORS,
    EXTRAS,
    MILK_OPTIONS,
    SIDE_OPTIONS,
} from "../../utils/constants";
import { getImageForFood } from "../../utils/imageMap";

interface Option {
  id: string;
  name: string;
  price: number;
}

interface Customizations {
  size: Option | null;
  milk: Option | null;
  extras: Option[];
  sides: Option[];
}

interface FoodItemDetailProps {
  item: FoodItem;
  onAddToCart: (
    item: FoodItem,
    quantity: number,
    totalPrice: number,
    customizations: Customizations,
  ) => void;
  onGoBack?: () => void;
}

const FoodItemDetail: React.FC<FoodItemDetailProps> = ({
  item,
  onAddToCart,
  onGoBack,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<Option | null>(
    COFFEE_SIZES?.[0] || null,
  );
  const [selectedMilk, setSelectedMilk] = useState<Option | null>(
    MILK_OPTIONS?.[0] || null,
  );
  const [selectedExtras, setSelectedExtras] = useState<Option[]>([]);
  const [selectedSides, setSelectedSides] = useState<Option[]>([]);

  const isBeverage =
    item.category === "Coffee" || item.category === "Beverages";
  const localImage = getImageForFood(item.name, item.category);

  const calculateTotal = (): number => {
    let total = item.price;

    if (isBeverage && selectedSize) total += selectedSize.price;
    if (isBeverage && selectedMilk) total += selectedMilk.price;

    selectedExtras.forEach((extra) => {
      total += extra.price;
    });

    selectedSides.forEach((side) => {
      total += side.price;
    });

    return total * quantity;
  };

  const toggleExtra = (extra: Option): void => {
    if (selectedExtras.find((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const toggleSide = (side: Option): void => {
    if (selectedSides.find((s) => s.id === side.id)) {
      setSelectedSides(selectedSides.filter((s) => s.id !== side.id));
    } else {
      if (selectedSides.length < 2) {
        setSelectedSides([...selectedSides, side]);
      } else {
        Alert.alert("Maximum Selection", "You can select up to 2 sides only");
      }
    }
  };

  const incrementQuantity = (): void => setQuantity((q) => q + 1);
  const decrementQuantity = (): void => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = (): void => {
    const customizations: Customizations = {
      size: isBeverage ? selectedSize : null,
      milk: isBeverage ? selectedMilk : null,
      extras: selectedExtras,
      sides: selectedSides,
    };
    onAddToCart(item, quantity, calculateTotal(), customizations);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image */}
      <View style={styles.imageContainer}>
        {localImage ? (
          <Image source={localImage} style={styles.image} resizeMode="cover" />
        ) : item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🖼️</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {/* Basic Info */}
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.basePrice}>
          Base Price: R{item.price.toFixed(2)}
        </Text>

        {/* Rating */}
        {item.rating !== undefined && (
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>⭐ {item.rating.toFixed(1)}</Text>
            {item.reviews !== undefined && (
              <Text style={styles.reviewsText}>({item.reviews} reviews)</Text>
            )}
          </View>
        )}

        {/* Preparation Time & Calories */}
        <View style={styles.infoRow}>
          {item.preparationTime !== undefined && (
            <Text style={styles.infoTag}>⏱️ {item.preparationTime} min</Text>
          )}
          {item.calories !== undefined && (
            <Text style={styles.infoTag}>🔥 {item.calories} cal</Text>
          )}
        </View>

        {/* Ingredients */}
        {item.ingredients && item.ingredients.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.tagsRow}>
              {item.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Allergens */}
        {item.allergens && item.allergens.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚠️ Allergens</Text>
            <View style={styles.tagsRow}>
              {item.allergens.map((allergen, index) => (
                <View key={index} style={[styles.tag, styles.allergenTag]}>
                  <Text style={styles.allergenTagText}>{allergen}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Size Selection (Beverages) */}
        {isBeverage && COFFEE_SIZES && COFFEE_SIZES.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Size</Text>
            <View style={styles.optionsRow}>
              {COFFEE_SIZES.map((size: Option) => (
                <TouchableOpacity
                  key={size.id}
                  style={[
                    styles.optionButton,
                    selectedSize?.id === size.id && styles.optionButtonActive,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedSize?.id === size.id && styles.optionTextActive,
                    ]}
                  >
                    {size.name}
                  </Text>
                  {size.price > 0 && (
                    <Text style={styles.optionPrice}>+R{size.price}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Milk Options (Coffee) */}
        {item.category === "Coffee" &&
          MILK_OPTIONS &&
          MILK_OPTIONS.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Milk Options</Text>
              <View style={styles.optionsColumn}>
                {MILK_OPTIONS.map((milk: Option) => (
                  <TouchableOpacity
                    key={milk.id}
                    style={[
                      styles.optionButtonLarge,
                      selectedMilk?.id === milk.id && styles.optionButtonActive,
                    ]}
                    onPress={() => setSelectedMilk(milk)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedMilk?.id === milk.id && styles.optionTextActive,
                      ]}
                    >
                      {milk.name}
                    </Text>
                    {milk.price > 0 && (
                      <Text style={styles.optionPrice}>+R{milk.price}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

        {/* Extras */}
        {EXTRAS && EXTRAS.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Extras</Text>
            <View style={styles.optionsColumn}>
              {EXTRAS.map((extra: Option) => (
                <TouchableOpacity
                  key={extra.id}
                  style={[
                    styles.optionButtonLarge,
                    selectedExtras.find((e) => e.id === extra.id) &&
                      styles.optionButtonActive,
                  ]}
                  onPress={() => toggleExtra(extra)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedExtras.find((e) => e.id === extra.id) &&
                        styles.optionTextActive,
                    ]}
                  >
                    {extra.name}
                  </Text>
                  <Text style={styles.optionPrice}>+R{extra.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Sides */}
        {SIDE_OPTIONS && SIDE_OPTIONS.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sides (max 2)</Text>
            <View style={styles.optionsColumn}>
              {SIDE_OPTIONS.map((side: Option) => (
                <TouchableOpacity
                  key={side.id}
                  style={[
                    styles.optionButtonLarge,
                    selectedSides.find((s) => s.id === side.id) &&
                      styles.optionButtonActive,
                  ]}
                  onPress={() => toggleSide(side)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedSides.find((s) => s.id === side.id) &&
                        styles.optionTextActive,
                    ]}
                  >
                    {side.name}
                  </Text>
                  <Text style={styles.optionPrice}>+R{side.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quantity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={decrementQuantity}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={incrementQuantity}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>R{calculateTotal().toFixed(2)}</Text>
        </View>

        {/* Add to Cart */}
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>
            Add {quantity} to Cart — R{calculateTotal().toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E6D3",
  },
  imageContainer: {
    width: "100%",
    height: 280,
    backgroundColor: "#E8D5C4",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8D5C4",
  },
  placeholderText: {
    fontSize: 60,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3E2723",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#5D4037",
    lineHeight: 22,
    marginBottom: 12,
  },
  basePrice: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3E2723",
    marginRight: 6,
  },
  reviewsText: {
    fontSize: 14,
    color: "#8D6E63",
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  infoTag: {
    fontSize: 13,
    color: "#5D4037",
    backgroundColor: "#E8D5C4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#3E2723",
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#E8D5C4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    color: "#5D4037",
  },
  allergenTag: {
    backgroundColor: "#FFECB3",
    borderWidth: 1,
    borderColor: "#FFB74D",
  },
  allergenTagText: {
    fontSize: 13,
    color: "#E65100",
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionsColumn: {
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D7CCC8",
    backgroundColor: COLORS.white,
    alignItems: "center",
    minWidth: 80,
  },
  optionButtonLarge: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D7CCC8",
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#F5E6D3",
  },
  optionText: {
    fontSize: 14,
    color: "#5D4037",
    fontWeight: "500",
  },
  optionTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  optionPrice: {
    fontSize: 12,
    color: "#8D6E63",
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginTop: 8,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 22,
    color: COLORS.white,
    fontWeight: "700",
  },
  quantityText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#3E2723",
    minWidth: 40,
    textAlign: "center",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#D7CCC8",
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3E2723",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primary,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
  },
});

export default FoodItemDetail;
