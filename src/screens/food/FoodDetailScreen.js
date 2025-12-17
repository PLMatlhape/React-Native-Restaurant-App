import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { 
  COLORS, 
  COFFEE_SIZES, 
  MILK_OPTIONS, 
  EXTRAS, 
  SIDE_OPTIONS 
} from '../../utils/constants';

const FoodDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(COFFEE_SIZES[0]);
  const [selectedMilk, setSelectedMilk] = useState(MILK_OPTIONS[0]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedSides, setSelectedSides] = useState([]);

  const calculateTotal = () => {
    let total = item.price;
    
    if (selectedSize) total += selectedSize.price;
    if (selectedMilk) total += selectedMilk.price;
    
    selectedExtras.forEach(extra => {
      total += extra.price;
    });
    
    selectedSides.forEach(side => {
      total += side.price;
    });
    
    return total;
  };

  const toggleExtra = (extra) => {
    if (selectedExtras.find(e => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter(e => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const toggleSide = (side) => {
    if (selectedSides.find(s => s.id === side.id)) {
      setSelectedSides(selectedSides.filter(s => s.id !== side.id));
    } else {
      if (selectedSides.length < 2) {
        setSelectedSides([...selectedSides, side]);
      } else {
        Alert.alert('Maximum Selection', 'You can select up to 2 sides only');
      }
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: item.id,
      name: item.name,
      basePrice: item.price,
      imageUrl: item.imageUrl,
      quantity: quantity,
      totalPrice: calculateTotal(),
      customizations: {
        size: selectedSize,
        milk: selectedMilk,
        extras: selectedExtras,
        sides: selectedSides
      }
    };

    addToCart(cartItem);
    Alert.alert(
      'Added to Cart',
      `${quantity}x ${item.name} added to your cart`,
      [
        { text: 'Continue Shopping', onPress: () => navigation.goBack() },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Image */}
        <View style={styles.imageContainer}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>🖼️</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Basic Info */}
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.basePrice}>Base Price: R{item.price.toFixed(2)}</Text>

          {/* Size Selection (for beverages) */}
          {item.category === 'Coffee' || item.category === 'Beverages' ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Size</Text>
              <View style={styles.optionsRow}>
                {COFFEE_SIZES.map((size) => (
                  <TouchableOpacity
                    key={size.id}
                    style={[
                      styles.optionButton,
                      selectedSize?.id === size.id && styles.optionButtonActive
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedSize?.id === size.id && styles.optionTextActive
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
          ) : null}

          {/* Milk Options (for coffee) */}
          {item.category === 'Coffee' ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Milk Options</Text>
              <View style={styles.optionsColumn}>
                {MILK_OPTIONS.map((milk) => (
                  <TouchableOpacity
                    key={milk.id}
                    style={[
                      styles.optionButtonLarge,
                      selectedMilk?.id === milk.id && styles.optionButtonActive
                    ]}
                    onPress={() => setSelectedMilk(milk)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedMilk?.id === milk.id && styles.optionTextActive
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
          ) : null}

          {/* Sides (for food items) */}
          {item.category !== 'Coffee' && item.category !== 'Beverages' ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sides (Select up to 2)</Text>
              <View style={styles.optionsColumn}>
                {SIDE_OPTIONS.map((side) => (
                  <TouchableOpacity
                    key={side.id}
                    style={[
                      styles.optionButtonLarge,
                      selectedSides.find(s => s.id === side.id) && styles.optionButtonActive
                    ]}
                    onPress={() => toggleSide(side)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedSides.find(s => s.id === side.id) && styles.optionTextActive
                      ]}
                    >
                      {side.name}
                    </Text>
                    {side.price > 0 && (
                      <Text style={styles.optionPrice}>+R{side.price}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          {/* Extras */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Extras (Optional)</Text>
            <View style={styles.optionsColumn}>
              {EXTRAS.map((extra) => (
                <TouchableOpacity
                  key={extra.id}
                  style={[
                    styles.optionButtonLarge,
                    selectedExtras.find(e => e.id === extra.id) && styles.optionButtonActive
                  ]}
                  onPress={() => toggleExtra(extra)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedExtras.find(e => e.id === extra.id) && styles.optionTextActive
                    ]}
                  >
                    {extra.name}
                  </Text>
                  <Text style={styles.optionPrice}>+R{extra.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>
            R{(calculateTotal() * quantity).toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
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
  imageContainer: {
    width: '100%',
    height: 300,
  },
  image: {
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
    fontSize: 80,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
    marginBottom: 15,
  },
  basePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionsColumn: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  optionButtonLarge: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  optionTextActive: {
    color: COLORS.white,
  },
  optionPrice: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FoodDetailScreen;