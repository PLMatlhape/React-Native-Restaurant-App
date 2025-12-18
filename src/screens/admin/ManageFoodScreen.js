import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Modal,
  ScrollView
} from 'react-native';
import { firestoreService } from '../../services/firebase/firestoreService';
import { COLORS, CATEGORIES } from '../../utils/constants';

const ManageFoodScreen = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Coffee',
    imageUrl: ''
  });

  useEffect(() => {
    loadFoodItems();
  }, []);

  const loadFoodItems = async () => {
    setLoading(true);
    const result = await firestoreService.getFoodItems();
    if (result.success) {
      setFoodItems(result.data);
    }
    setLoading(false);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Coffee',
      imageUrl: ''
    });
    setModalVisible(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      imageUrl: item.imageUrl || ''
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      imageUrl: formData.imageUrl
    };

    let result;
    if (editingItem) {
      result = await firestoreService.updateFoodItem(editingItem.id, itemData);
    } else {
      result = await firestoreService.addFoodItem(itemData);
    }

    if (result.success) {
      setModalVisible(false);
      loadFoodItems();
      Alert.alert('Success', `Item ${editingItem ? 'updated' : 'added'} successfully`);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await firestoreService.deleteFoodItem(item.id);
            if (result.success) {
              loadFoodItems();
              Alert.alert('Success', 'Item deleted successfully');
            } else {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodCard}>
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>🖼️</Text>
          </View>
        )}
      </View>

      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemPrice}>R{item.price.toFixed(2)}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.actionButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.error }]}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.actionButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
        <Text style={styles.addButtonText}>+ Add New Item</Text>
      </TouchableOpacity>

      <FlatList
        data={foodItems}
        renderItem={renderFoodItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items yet</Text>
          </View>
        }
      />

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Item Name *"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholderTextColor={COLORS.textLight}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description *"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={3}
                placeholderTextColor={COLORS.textLight}
              />

              <TextInput
                style={styles.input}
                placeholder="Price *"
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                keyboardType="decimal-pad"
                placeholderTextColor={COLORS.textLight}
              />

              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryContainer}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      formData.category === cat.name && styles.categoryChipActive
                    ]}
                    onPress={() => setFormData({ ...formData, category: cat.name })}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        formData.category === cat.name && styles.categoryChipTextActive
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.input}
                placeholder="Image URL (optional)"
                value={formData.imageUrl}
                onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
                placeholderTextColor={COLORS.textLight}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    margin: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 10,
  },
  foodCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightBrown,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 25,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 18,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  categoryChip: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: COLORS.text,
  },
  categoryChipTextActive: {
    color: COLORS.white,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ManageFoodScreen;