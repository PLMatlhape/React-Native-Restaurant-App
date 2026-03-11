// Cart Screen - view and manage cart items with edit customizations
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { CartItem, useCart } from "../../context/CartContext";
import {
    COFFEE_SIZES,
    COLORS,
    ExtraOption,
    EXTRAS,
    MILK_OPTIONS,
    MilkOption,
    SizeOption,
} from "../../utils/constants";

interface CartScreenProps {
  navigation: any;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    updateCartItem,
    clearCart,
    getCartTotal,
    getCartCount,
  } = useCart();

  // Edit modal state
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [editSize, setEditSize] = useState<SizeOption>(COFFEE_SIZES[0]);
  const [editMilk, setEditMilk] = useState<MilkOption>(MILK_OPTIONS[0]);
  const [editExtras, setEditExtras] = useState<ExtraOption[]>([]);

  const handleRemove = (cartItemId: string, name: string) => {
    Alert.alert("Remove Item", `Remove ${name} from cart?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeFromCart(cartItemId),
      },
    ]);
  };

  const handleClearCart = () => {
    Alert.alert("Clear Cart", "Remove all items from your cart?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", style: "destructive", onPress: clearCart },
    ]);
  };

  // Open edit modal with current customizations
  const handleEditItem = (item: CartItem) => {
    const currentSize =
      COFFEE_SIZES.find((s) => s.name === item.customizations?.size) ||
      COFFEE_SIZES[0];
    const currentMilk =
      MILK_OPTIONS.find((m) => m.name === item.customizations?.milk) ||
      MILK_OPTIONS[0];
    const currentExtras = (item.customizations?.extras || [])
      .map((eName: string) => EXTRAS.find((e) => e.name === eName))
      .filter(Boolean) as ExtraOption[];

    setEditSize(currentSize);
    setEditMilk(currentMilk);
    setEditExtras(currentExtras);
    setEditingItem(item);
  };

  const toggleEditExtra = (extra: ExtraOption) => {
    setEditExtras((prev) => {
      const exists = prev.find((e) => e.id === extra.id);
      if (exists) return prev.filter((e) => e.id !== extra.id);
      return [...prev, extra];
    });
  };

  // Calculate the new unit price based on base price + new customizations
  const calculateEditPrice = (): number => {
    if (!editingItem) return 0;
    // Reverse-engineer base price from current stored unit price
    const oldSize = COFFEE_SIZES.find(
      (s) => s.name === editingItem.customizations?.size,
    );
    const oldMilk = MILK_OPTIONS.find(
      (m) => m.name === editingItem.customizations?.milk,
    );
    const oldExtrasPrice = (editingItem.customizations?.extras || []).reduce(
      (sum: number, eName: string) => {
        const e = EXTRAS.find((ex) => ex.name === eName);
        return sum + (e?.price || 0);
      },
      0,
    );
    const basePrice =
      editingItem.price -
      (oldSize?.price || 0) -
      (oldMilk?.price || 0) -
      oldExtrasPrice;

    return (
      basePrice +
      editSize.price +
      editMilk.price +
      editExtras.reduce((sum, e) => sum + e.price, 0)
    );
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    const newPrice = calculateEditPrice();
    const newCustomizations = {
      size: editSize.name,
      milk: editMilk.name,
      extras: editExtras.map((e) => e.name),
    };

    updateCartItem(editingItem.cartItemId, {
      price: newPrice,
      customizations: newCustomizations,
    });

    setEditingItem(null);
  };

  // Check if item has coffee customizations (size/milk)
  const isCoffeeItem = (item: CartItem): boolean => {
    return !!(item.customizations?.size || item.customizations?.milk);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImageWrap}>
        {item.image ? (
          <Image
            source={item.image}
            style={styles.itemImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.itemImage, styles.itemImagePlaceholder]}>
            <Text style={{ fontSize: 24 }}>🍽️</Text>
          </View>
        )}
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        {item.customizations && (
          <Text style={styles.itemCustom} numberOfLines={1}>
            {[
              item.customizations.size,
              item.customizations.milk,
              ...(item.customizations.extras || []),
            ]
              .filter(Boolean)
              .join(" · ")}
          </Text>
        )}
        <Text style={styles.itemPrice}>
          R{(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
      <View style={styles.itemActions}>
        <View style={styles.topActions}>
          {isCoffeeItem(item) && (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => handleEditItem(item)}
            >
              <Text style={styles.editBtnText}>✎</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => handleRemove(item.cartItemId, item.name)}
          >
            <Text style={styles.removeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.cartItemId, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Text
              style={[
                styles.qtyBtnText,
                item.quantity <= 1 && { opacity: 0.3 },
              ]}
            >
              −
            </Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.cartItemId, item.quantity + 1)}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Edit Customizations Modal
  const renderEditModal = () => {
    if (!editingItem) return null;
    const newPrice = calculateEditPrice();
    const priceDiff = newPrice - editingItem.price;

    return (
      <Modal
        visible={!!editingItem}
        animationType="slide"
        transparent
        onRequestClose={() => setEditingItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Edit Customizations</Text>
                <Text style={styles.modalSubtitle}>{editingItem.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setEditingItem(null)}
              >
                <Text style={styles.modalCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.modalScroll}
            >
              {/* Size Selection */}
              <View style={styles.optionSection}>
                <Text style={styles.optionTitle}>Size</Text>
                <View style={styles.optionRow}>
                  {COFFEE_SIZES.map((size) => (
                    <TouchableOpacity
                      key={size.id}
                      style={[
                        styles.optionChip,
                        editSize.id === size.id && styles.optionChipActive,
                      ]}
                      onPress={() => setEditSize(size)}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          editSize.id === size.id &&
                            styles.optionChipTextActive,
                        ]}
                      >
                        {size.name}
                      </Text>
                      {size.price > 0 && (
                        <Text
                          style={[
                            styles.optionChipPrice,
                            editSize.id === size.id &&
                              styles.optionChipPriceActive,
                          ]}
                        >
                          +R{size.price}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Milk Selection */}
              <View style={styles.optionSection}>
                <Text style={styles.optionTitle}>Milk</Text>
                <View style={styles.optionRow}>
                  {MILK_OPTIONS.map((milk) => (
                    <TouchableOpacity
                      key={milk.id}
                      style={[
                        styles.optionChip,
                        editMilk.id === milk.id && styles.optionChipActive,
                      ]}
                      onPress={() => setEditMilk(milk)}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          editMilk.id === milk.id &&
                            styles.optionChipTextActive,
                        ]}
                      >
                        {milk.name}
                      </Text>
                      {milk.price > 0 && (
                        <Text
                          style={[
                            styles.optionChipPrice,
                            editMilk.id === milk.id &&
                              styles.optionChipPriceActive,
                          ]}
                        >
                          +R{milk.price}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Extras Selection */}
              <View style={styles.optionSection}>
                <Text style={styles.optionTitle}>Extras</Text>
                <View style={styles.extrasGrid}>
                  {EXTRAS.map((extra) => {
                    const isSelected = editExtras.some(
                      (e) => e.id === extra.id,
                    );
                    return (
                      <TouchableOpacity
                        key={extra.id}
                        style={[
                          styles.extraChip,
                          isSelected && styles.extraChipActive,
                        ]}
                        onPress={() => toggleEditExtra(extra)}
                      >
                        <Text
                          style={[
                            styles.extraChipText,
                            isSelected && styles.extraChipTextActive,
                          ]}
                        >
                          {extra.name}
                        </Text>
                        <Text
                          style={[
                            styles.extraChipPrice,
                            isSelected && styles.extraChipPriceActive,
                          ]}
                        >
                          +R{extra.price}
                        </Text>
                        {isSelected && (
                          <View style={styles.extraCheck}>
                            <Text style={styles.extraCheckText}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Price Preview */}
              <View style={styles.pricePreview}>
                <View style={styles.priceRow}>
                  <Text style={styles.pricePreviewLabel}>New unit price</Text>
                  <Text style={styles.pricePreviewValue}>
                    R{newPrice.toFixed(2)}
                  </Text>
                </View>
                {priceDiff !== 0 && (
                  <Text
                    style={[
                      styles.priceDiff,
                      {
                        color: priceDiff > 0 ? COLORS.warning : COLORS.success,
                      },
                    ]}
                  >
                    {priceDiff > 0 ? "+" : ""}R{priceDiff.toFixed(2)} per item
                  </Text>
                )}
                <View style={styles.priceRow}>
                  <Text style={styles.pricePreviewLabel}>
                    Total ({editingItem.quantity}x)
                  </Text>
                  <Text style={styles.pricePreviewTotal}>
                    R{(newPrice * editingItem.quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Save / Cancel */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelEditBtn}
                onPress={() => setEditingItem(null)}
              >
                <Text style={styles.cancelEditBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveEditBtn}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveEditBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Browse our menu and add some delicious items!
        </Text>
        <TouchableOpacity
          style={styles.browseBtn}
          onPress={() => navigation.navigate("HomeTab")}
          activeOpacity={0.8}
        >
          <Text style={styles.browseBtnText}>Browse Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>
          {getCartCount()} {getCartCount() === 1 ? "item" : "items"} in cart
        </Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.cartItemId}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomBar}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>R{getCartTotal().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>R15.00</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            R{(getCartTotal() + 15).toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate("Checkout")}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>

      {renderEditModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  clearText: { fontSize: 14, color: COLORS.error, fontWeight: "600" },
  listContent: { paddingHorizontal: 16, paddingBottom: 16 },
  cartItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImageWrap: { marginRight: 12 },
  itemImage: { width: 70, height: 70, borderRadius: 12 },
  itemImagePlaceholder: {
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  itemDetails: { flex: 1, justifyContent: "center" },
  itemName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 3,
  },
  itemCustom: { fontSize: 11, color: COLORS.textLight, marginBottom: 4 },
  itemPrice: { fontSize: 16, fontWeight: "bold", color: COLORS.primary },
  itemActions: { alignItems: "flex-end", justifyContent: "space-between" },
  topActions: { flexDirection: "row", alignItems: "center", gap: 6 },
  editBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  editBtnText: { fontSize: 13, color: COLORS.primary, fontWeight: "bold" },
  removeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtnText: { fontSize: 12, color: COLORS.error, fontWeight: "bold" },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 2,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  qtyValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    marginHorizontal: 10,
  },
  bottomBar: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 14, color: COLORS.textLight },
  summaryValue: { fontSize: 14, color: COLORS.text, fontWeight: "500" },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 12,
    marginBottom: 16,
  },
  totalLabel: { fontSize: 17, fontWeight: "700", color: COLORS.text },
  totalValue: { fontSize: 20, fontWeight: "bold", color: COLORS.primary },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  checkoutBtnText: { fontSize: 16, fontWeight: "700", color: COLORS.white },
  // Empty state
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 28,
  },
  browseBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  browseBtnText: { fontSize: 16, fontWeight: "700", color: COLORS.white },
  // =========== EDIT MODAL STYLES ===========
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  modalSubtitle: { fontSize: 14, color: COLORS.textLight, marginTop: 2 },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseBtnText: { fontSize: 14, color: COLORS.text, fontWeight: "bold" },
  modalScroll: { paddingHorizontal: 20 },
  optionSection: { marginTop: 18 },
  optionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 10,
  },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  optionChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionChipActive: { backgroundColor: "#FAF5F0", borderColor: COLORS.primary },
  optionChipText: { fontSize: 13, fontWeight: "600", color: COLORS.text },
  optionChipTextActive: { color: COLORS.primary },
  optionChipPrice: { fontSize: 11, color: COLORS.textLight, marginLeft: 6 },
  optionChipPriceActive: { color: COLORS.primary },
  extrasGrid: { gap: 8 },
  extraChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: "transparent",
  },
  extraChipActive: { backgroundColor: "#FAF5F0", borderColor: COLORS.primary },
  extraChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  extraChipTextActive: { color: COLORS.primary },
  extraChipPrice: { fontSize: 12, color: COLORS.textLight, fontWeight: "500" },
  extraChipPriceActive: { color: COLORS.primary },
  extraCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  extraCheckText: { fontSize: 11, color: COLORS.white, fontWeight: "bold" },
  pricePreview: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  pricePreviewLabel: { fontSize: 14, color: COLORS.textLight },
  pricePreviewValue: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  priceDiff: { fontSize: 12, fontWeight: "600", marginBottom: 6 },
  pricePreviewTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  cancelEditBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelEditBtnText: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  saveEditBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  saveEditBtnText: { fontSize: 15, fontWeight: "700", color: COLORS.white },
});

export default CartScreen;
