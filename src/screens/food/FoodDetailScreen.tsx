// Food Detail Screen - view item details and add to cart
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { FoodItem } from "../../services/local/dataService";
import {
    COFFEE_SIZES,
    COLORS,
    ExtraOption,
    EXTRAS,
    MILK_OPTIONS,
    MilkOption,
    SizeOption,
} from "../../utils/constants";

const { width } = Dimensions.get("window");

interface FoodDetailScreenProps {
  navigation: any;
  route: {
    params: {
      item: FoodItem;
    };
  };
}

const COFFEE_CATEGORIES = ["Coffee", "Cappuccino", "Tea"];

const FoodDetailScreen: React.FC<FoodDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { item } = route.params;
  const { addToCart } = useCart();

  const isCoffeeType = COFFEE_CATEGORIES.includes(item.category);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<SizeOption>(COFFEE_SIZES[0]);
  const [selectedMilk, setSelectedMilk] = useState<MilkOption>(MILK_OPTIONS[0]);
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);

  const toggleExtra = (extra: ExtraOption) => {
    setSelectedExtras((prev) => {
      const exists = prev.find((e) => e.id === extra.id);
      if (exists) return prev.filter((e) => e.id !== extra.id);
      return [...prev, extra];
    });
  };

  const calculateTotal = () => {
    let total = item.price;
    if (isCoffeeType) {
      total += selectedSize.price;
      total += selectedMilk.price;
      total += selectedExtras.reduce((sum, e) => sum + e.price, 0);
    }
    return total * quantity;
  };

  const handleAddToCart = () => {
    const customizations = isCoffeeType
      ? {
          size: selectedSize.name,
          milk: selectedMilk.name,
          extras: selectedExtras.map((e) => e.name),
        }
      : undefined;

    addToCart({
      id: item.id,
      foodId: item.id,
      name: item.name,
      price: calculateTotal() / quantity,
      quantity,
      image: item.image,
      customizations,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Image */}
        <View style={styles.imageWrapper}>
          {item.image ? (
            <Image
              source={item.image}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.heroImage, styles.placeholderImage]}>
              <Text style={{ fontSize: 64 }}>🍽️</Text>
            </View>
          )}
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require("../../../assets/icon/icons8-back-button.png")}
              style={{ width: 22, height: 22, tintColor: COLORS.text }}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceLabel}>R{item.price}</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <View style={styles.statIconCircle}>
                <Text style={styles.statIconText}>⭐</Text>
              </View>
              <Text style={styles.statValue}>{item.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <View
                style={[styles.statIconCircle, { backgroundColor: "#FFF3E0" }]}
              >
                <Image
                  source={require("../../../assets/icon/icons8-time-50.png")}
                  style={{ width: 22, height: 22, tintColor: "#EF6C00" }}
                />
              </View>
              <Text style={styles.statValue}>{item.preparationTime} min</Text>
              <Text style={styles.statLabel}>Prep time</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <View
                style={[
                  styles.statIconCircle,
                  {
                    backgroundColor: item.isAvailable ? "#E8F5E9" : "#FFEBEE",
                  },
                ]}
              >
                {item.isAvailable ? (
                  <Image
                    source={require("../../../assets/icon/icons8-done-50.png")}
                    style={{ width: 22, height: 22, tintColor: "#388E3C" }}
                  />
                ) : (
                  <Text style={[styles.statIconText, { color: "#D32F2F" }]}>
                    ✕
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.statValue,
                  {
                    color: item.isAvailable ? "#388E3C" : "#D32F2F",
                  },
                ]}
              >
                {item.isAvailable ? "Available" : "Sold Out"}
              </Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          {/* Size Selection (coffee only) */}
          {isCoffeeType && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Size</Text>
              <View style={styles.optionRow}>
                {COFFEE_SIZES.map((size) => (
                  <TouchableOpacity
                    key={size.id}
                    style={[
                      styles.optionChip,
                      selectedSize.id === size.id && styles.optionChipActive,
                    ]}
                    onPress={() => setSelectedSize(size)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        selectedSize.id === size.id &&
                          styles.optionChipTextActive,
                      ]}
                    >
                      {size.name}
                    </Text>
                    {size.price > 0 && (
                      <Text
                        style={[
                          styles.optionPrice,
                          selectedSize.id === size.id &&
                            styles.optionPriceActive,
                        ]}
                      >
                        +R{size.price}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Milk Selection (coffee only) */}
          {isCoffeeType && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Milk</Text>
              <View style={styles.optionRow}>
                {MILK_OPTIONS.map((milk) => (
                  <TouchableOpacity
                    key={milk.id}
                    style={[
                      styles.optionChip,
                      selectedMilk.id === milk.id && styles.optionChipActive,
                    ]}
                    onPress={() => setSelectedMilk(milk)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        selectedMilk.id === milk.id &&
                          styles.optionChipTextActive,
                      ]}
                    >
                      {milk.name}
                    </Text>
                    {milk.price > 0 && (
                      <Text
                        style={[
                          styles.optionPrice,
                          selectedMilk.id === milk.id &&
                            styles.optionPriceActive,
                        ]}
                      >
                        +R{milk.price}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Extras (coffee only) */}
          {isCoffeeType && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Extras</Text>
              <View style={styles.optionRow}>
                {EXTRAS.map((extra) => {
                  const isSelected = selectedExtras.some(
                    (e) => e.id === extra.id,
                  );
                  return (
                    <TouchableOpacity
                      key={extra.id}
                      style={[
                        styles.optionChip,
                        isSelected && styles.optionChipActive,
                      ]}
                      onPress={() => toggleExtra(extra)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          isSelected && styles.optionChipTextActive,
                        ]}
                      >
                        {extra.name}
                      </Text>
                      <Text
                        style={[
                          styles.optionPrice,
                          isSelected && styles.optionPriceActive,
                        ]}
                      >
                        +R{extra.price}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Quantity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Text
                  style={[
                    styles.quantityBtnText,
                    quantity <= 1 && { opacity: 0.3 },
                  ]}
                >
                  −
                </Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => setQuantity((q) => Math.min(10, q + 1))}
              >
                <Text style={styles.quantityBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Spacer for bottom bar */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Add to Cart Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>R{calculateTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addToCartBtn,
            !item.isAvailable && styles.addToCartBtnDisabled,
          ]}
          onPress={handleAddToCart}
          disabled={!item.isAvailable}
          activeOpacity={0.7}
        >
          <Text style={styles.addToCartBtnText}>
            {item.isAvailable ? "Add to Cart" : "Sold Out"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageWrapper: {
    position: "relative",
  },
  heroImage: {
    width,
    height: width * 0.7,
  },
  placeholderImage: {
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    top: 46,
    left: 16,
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: "600",
  },
  content: {
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  category: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.text,
  },
  priceTag: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF8E1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statIconText: {
    fontSize: 22,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.divider,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionChip: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  optionChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },
  optionChipTextActive: {
    color: COLORS.white,
  },
  optionPrice: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  optionPriceActive: {
    color: "rgba(255,255,255,0.8)",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 4,
  },
  quantityBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityBtnText: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.text,
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginHorizontal: 24,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  totalSection: {
    marginRight: 20,
  },
  totalLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  addToCartBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  addToCartBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
});

export default FoodDetailScreen;
