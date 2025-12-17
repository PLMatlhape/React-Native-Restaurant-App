import { useMemo, useState } from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {
    COFFEE_SIZES,
    COLORS,
    EXTRAS,
    MILK_OPTIONS,
    SIDE_OPTIONS
} from '../../utils/constants';

/**
 * FoodItemDetail Component
 * 
 * Displays detailed information about a food item with customization options.
 * This is a reusable component that can be used in different screens.
 * 
 * @param {Object} props
 * @param {Object} props.item - The food item data
 * @param {Object} props.customizations - Current customization selections
 * @param {Function} props.onCustomizationChange - Callback when customizations change
 * @param {number} props.quantity - Current quantity
 * @param {Function} props.onQuantityChange - Callback when quantity changes
 * @param {Object} props.style - Additional styles
 * @param {boolean} props.showImage - Whether to show the image (default: true)
 * @param {boolean} props.compact - Use compact layout (default: false)
 */
const FoodItemDetail = ({
  item,
  customizations = {},
  onCustomizationChange,
  quantity = 1,
  onQuantityChange,
  style,
  showImage = true,
  compact = false
}) => {
  // Local state for standalone usage
  const [localCustomizations, setLocalCustomizations] = useState({
    size: customizations.size || COFFEE_SIZES[0],
    milk: customizations.milk || MILK_OPTIONS[0],
    extras: customizations.extras || [],
    sides: customizations.sides || [],
    specialInstructions: customizations.specialInstructions || ''
  });

  const [localQuantity, setLocalQuantity] = useState(quantity);

  // Determine if component is controlled or uncontrolled
  const isControlled = onCustomizationChange !== undefined;
  const currentCustomizations = isControlled ? customizations : localCustomizations;
  const currentQuantity = onQuantityChange ? quantity : localQuantity;

  // Update customization handler
  const updateCustomization = (key, value) => {
    if (isControlled) {
      onCustomizationChange({ ...currentCustomizations, [key]: value });
    } else {
      setLocalCustomizations(prev => ({ ...prev, [key]: value }));
    }
  };

  // Update quantity handler
  const updateQuantity = (newQuantity) => {
    const validQuantity = Math.max(1, Math.min(99, newQuantity));
    if (onQuantityChange) {
      onQuantityChange(validQuantity);
    } else {
      setLocalQuantity(validQuantity);
    }
  };

  // Toggle extra selection
  const toggleExtra = (extra) => {
    const currentExtras = currentCustomizations.extras || [];
    const isSelected = currentExtras.find(e => e.id === extra.id);
    
    if (isSelected) {
      updateCustomization('extras', currentExtras.filter(e => e.id !== extra.id));
    } else {
      updateCustomization('extras', [...currentExtras, extra]);
    }
  };

  // Toggle side selection (max 2)
  const toggleSide = (side) => {
    const currentSides = currentCustomizations.sides || [];
    const isSelected = currentSides.find(s => s.id === side.id);
    
    if (isSelected) {
      updateCustomization('sides', currentSides.filter(s => s.id !== side.id));
    } else if (currentSides.length < 2) {
      updateCustomization('sides', [...currentSides, side]);
    }
  };

  // Calculate total price
  const totalPrice = useMemo(() => {
    let total = item?.price || 0;
    
    // Add size price
    if (currentCustomizations.size?.price) {
      total += currentCustomizations.size.price;
    }
    
    // Add milk price
    if (currentCustomizations.milk?.price) {
      total += currentCustomizations.milk.price;
    }
    
    // Add extras prices
    (currentCustomizations.extras || []).forEach(extra => {
      total += extra.price || 0;
    });
    
    // Add sides prices
    (currentCustomizations.sides || []).forEach(side => {
      total += side.price || 0;
    });
    
    return total * currentQuantity;
  }, [item, currentCustomizations, currentQuantity]);

  // Determine which options to show based on category
  const isBeverage = ['Coffee', 'Tea', 'Cappuccino', 'Beverages'].includes(item?.category);
  const showSizeOptions = isBeverage;
  const showMilkOptions = item?.category === 'Coffee' || item?.category === 'Cappuccino';
  const showSideOptions = !isBeverage;

  if (!item) {
    return (
      <View style={[styles.container, styles.emptyContainer, style]}>
        <Text style={styles.emptyText}>No item selected</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, compact && styles.compactContainer, style]}>
      {/* Item Image */}
      {showImage && (
        <View style={[styles.imageContainer, compact && styles.compactImageContainer]}>
          {item.imageUrl ? (
            <Image 
              source={{ uri: item.imageUrl }} 
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderIcon}>
                {isBeverage ? '☕' : '🍽️'}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Item Info */}
      <View style={styles.infoSection}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.basePrice}>Base Price: R{parseFloat(item.price).toFixed(2)}</Text>
      </View>

      {/* Size Options (for beverages) */}
      {showSizeOptions && (
        <View style={styles.optionSection}>
          <Text style={styles.sectionTitle}>☕ Select Size</Text>
          <View style={styles.optionsRow}>
            {COFFEE_SIZES.map((size) => (
              <TouchableOpacity
                key={size.id}
                style={[
                  styles.optionChip,
                  currentCustomizations.size?.id === size.id && styles.optionChipActive
                ]}
                onPress={() => updateCustomization('size', size)}
              >
                <Text style={[
                  styles.optionChipText,
                  currentCustomizations.size?.id === size.id && styles.optionChipTextActive
                ]}>
                  {size.name}
                </Text>
                {size.price > 0 && (
                  <Text style={[
                    styles.optionPrice,
                    currentCustomizations.size?.id === size.id && styles.optionPriceActive
                  ]}>
                    +R{size.price}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Milk Options (for coffee) */}
      {showMilkOptions && (
        <View style={styles.optionSection}>
          <Text style={styles.sectionTitle}>🥛 Milk Options</Text>
          <View style={styles.optionsColumn}>
            {MILK_OPTIONS.map((milk) => (
              <TouchableOpacity
                key={milk.id}
                style={[
                  styles.optionRow,
                  currentCustomizations.milk?.id === milk.id && styles.optionRowActive
                ]}
                onPress={() => updateCustomization('milk', milk)}
              >
                <View style={styles.radioButton}>
                  {currentCustomizations.milk?.id === milk.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={[
                  styles.optionRowText,
                  currentCustomizations.milk?.id === milk.id && styles.optionRowTextActive
                ]}>
                  {milk.name}
                </Text>
                {milk.price > 0 && (
                  <Text style={styles.optionRowPrice}>+R{milk.price}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Side Options (for food items) */}
      {showSideOptions && (
        <View style={styles.optionSection}>
          <Text style={styles.sectionTitle}>🍴 Sides (Select up to 2)</Text>
          <Text style={styles.sectionSubtitle}>
            Selected: {(currentCustomizations.sides || []).length}/2
          </Text>
          <View style={styles.optionsColumn}>
            {SIDE_OPTIONS.map((side) => {
              const isSelected = (currentCustomizations.sides || []).find(s => s.id === side.id);
              return (
                <TouchableOpacity
                  key={side.id}
                  style={[
                    styles.optionRow,
                    isSelected && styles.optionRowActive
                  ]}
                  onPress={() => toggleSide(side)}
                >
                  <View style={styles.checkbox}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[
                    styles.optionRowText,
                    isSelected && styles.optionRowTextActive
                  ]}>
                    {side.name}
                  </Text>
                  {side.price > 0 && (
                    <Text style={styles.optionRowPrice}>+R{side.price}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Extras */}
      <View style={styles.optionSection}>
        <Text style={styles.sectionTitle}>✨ Extras (Optional)</Text>
        <View style={styles.optionsColumn}>
          {EXTRAS.map((extra) => {
            const isSelected = (currentCustomizations.extras || []).find(e => e.id === extra.id);
            return (
              <TouchableOpacity
                key={extra.id}
                style={[
                  styles.optionRow,
                  isSelected && styles.optionRowActive
                ]}
                onPress={() => toggleExtra(extra)}
              >
                <View style={styles.checkbox}>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[
                  styles.optionRowText,
                  isSelected && styles.optionRowTextActive
                ]}>
                  {extra.name}
                </Text>
                <Text style={styles.optionRowPrice}>+R{extra.price}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Quantity Selector */}
      <View style={styles.quantitySection}>
        <Text style={styles.sectionTitle}>📦 Quantity</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, currentQuantity <= 1 && styles.quantityButtonDisabled]}
            onPress={() => updateQuantity(currentQuantity - 1)}
            disabled={currentQuantity <= 1}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <View style={styles.quantityDisplay}>
            <Text style={styles.quantityText}>{currentQuantity}</Text>
          </View>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(currentQuantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Price Summary */}
      <View style={styles.priceSummary}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Item Total</Text>
          <Text style={styles.priceValue}>R{totalPrice.toFixed(2)}</Text>
        </View>
        {currentQuantity > 1 && (
          <Text style={styles.pricePerItem}>
            R{(totalPrice / currentQuantity).toFixed(2)} each
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  compactContainer: {
    padding: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 16,
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  compactImageContainer: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightBrown,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 60,
  },
  infoSection: {
    padding: 16,
  },
  categoryBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 15,
    color: COLORS.textLight,
    lineHeight: 22,
    marginBottom: 12,
  },
  basePrice: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  optionSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionsColumn: {
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  optionChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  optionChipText: {
    fontSize: 14,
    fontWeight: '500',
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
    color: COLORS.cream,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.cream,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionRowActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF8E1',
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  optionRowText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  optionRowTextActive: {
    fontWeight: '600',
  },
  optionRowPrice: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  quantitySection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  quantityButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.white,
  },
  quantityDisplay: {
    minWidth: 60,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.cream,
    borderRadius: 8,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  priceSummary: {
    padding: 16,
    backgroundColor: COLORS.cream,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  pricePerItem: {
    textAlign: 'right',
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
});

export default FoodItemDetail;
