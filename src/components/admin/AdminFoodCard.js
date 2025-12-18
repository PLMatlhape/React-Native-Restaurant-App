import {
    Alert,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { COLORS } from '../../utils/constants';

/**
 * AdminFoodCard Component
 * 
 * Displays a food item card for admin management with edit and delete capabilities.
 * Shows item image, name, category, price, and availability status.
 * 
 * @param {Object} props
 * @param {Object} props.item - The food item data
 * @param {Function} props.onEdit - Callback when edit button is pressed
 * @param {Function} props.onDelete - Callback when delete button is pressed
 * @param {Function} props.onToggleAvailability - Callback to toggle item availability
 * @param {Object} props.style - Additional styles
 */
const AdminFoodCard = ({ 
  item, 
  onEdit, 
  onDelete, 
  onToggleAvailability,
  style 
}) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete && onDelete(item.id)
        }
      ]
    );
  };

  const handleToggleAvailability = () => {
    const newStatus = !item.isAvailable;
    Alert.alert(
      'Change Availability',
      `Mark "${item.name}" as ${newStatus ? 'available' : 'unavailable'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm',
          onPress: () => onToggleAvailability && onToggleAvailability(item.id, newStatus)
        }
      ]
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderIcon}>🍽️</Text>
          </View>
        )}
        
        {/* Availability Badge */}
        <TouchableOpacity 
          style={[
            styles.availabilityBadge,
            item.isAvailable !== false ? styles.availableBadge : styles.unavailableBadge
          ]}
          onPress={handleToggleAvailability}
        >
          <Text style={styles.availabilityText}>
            {item.isAvailable !== false ? '✓ Available' : '✕ Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Category Tag */}
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{item.category || 'Uncategorized'}</Text>
        </View>

        {/* Item Name */}
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>

        {/* Price and Stats */}
        <View style={styles.statsRow}>
          <Text style={styles.price}>R{parseFloat(item.price || 0).toFixed(2)}</Text>
          {item.ordersCount !== undefined && (
            <Text style={styles.ordersCount}>
              📦 {item.ordersCount} orders
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit && onEdit(item)}
          >
            <Text style={styles.editButtonText}>✏️ Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
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
    fontSize: 48,
  },
  availabilityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  availableBadge: {
    backgroundColor: COLORS.success,
  },
  unavailableBadge: {
    backgroundColor: COLORS.error,
  },
  availabilityText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  categoryTag: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  ordersCount: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: COLORS.secondary,
  },
  editButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  deleteButtonText: {
    color: COLORS.error,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default AdminFoodCard;
