import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/constants';

const ProfileScreen = ({ navigation }) => {
  const { userData, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    contactNumber: '',
    address: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        surname: userData.surname || '',
        email: userData.email || '',
        contactNumber: userData.contactNumber || '',
        address: userData.address || '',
        cardNumber: userData.cardDetails?.cardNumber || '',
        cardHolder: userData.cardDetails?.cardHolder || '',
        expiryDate: userData.cardDetails?.expiryDate || '',
        cvv: userData.cardDetails?.cvv || ''
      });
    }
  }, [userData]);

  const handleSave = async () => {
    setLoading(true);
    const result = await updateProfile({
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      contactNumber: formData.contactNumber,
      address: formData.address,
      cardDetails: {
        cardNumber: formData.cardNumber,
        cardHolder: formData.cardHolder,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv
      }
    });
    setLoading(false);

    if (result.success) {
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.navigate('Auth');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
          {!editing && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Personal Information */}
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            editable={editing}
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Surname</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled]}
            value={formData.surname}
            onChangeText={(text) => setFormData({ ...formData, surname: text })}
            editable={editing}
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled]}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            editable={editing}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* Contact Information */}
        <Text style={styles.sectionTitle}>Contact Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled]}
            value={formData.contactNumber}
            onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
            editable={editing}
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.textArea, !editing && styles.inputDisabled]}
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            editable={editing}
            multiline
            numberOfLines={3}
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* Payment Information */}
        <Text style={styles.sectionTitle}>Payment Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled]}
            value={formData.cardNumber}
            onChangeText={(text) => setFormData({ ...formData, cardNumber: text })}
            editable={editing}
            keyboardType="numeric"
            maxLength={16}
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Card Holder Name</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled]}
            value={formData.cardHolder}
            onChangeText={(text) => setFormData({ ...formData, cardHolder: text })}
            editable={editing}
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={[styles.input, !editing && styles.inputDisabled]}
              value={formData.expiryDate}
              onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
              editable={editing}
              maxLength={5}
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={[styles.input, !editing && styles.inputDisabled]}
              value={formData.cvv}
              onChangeText={(text) => setFormData({ ...formData, cvv: text })}
              editable={editing}
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
              placeholderTextColor={COLORS.textLight}
            />
          </View>
        </View>

        {editing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setEditing(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!editing && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  editButton: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 20,
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: COLORS.text,
  },
  inputDisabled: {
    backgroundColor: COLORS.lightBrown,
    color: COLORS.textLight,
  },
  textArea: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: COLORS.text,
    textAlignVertical: 'top',
    height: 80,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.primary,
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
  buttonDisabled: {
    opacity: 0.6,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;