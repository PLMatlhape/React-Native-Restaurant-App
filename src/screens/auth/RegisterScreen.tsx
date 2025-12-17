import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, VALIDATION_MESSAGES } from '../../utils/constants';
import { RootStackNavigationProp, FormErrors, RegisterData } from '../../types';

interface RegisterScreenProps {
  navigation: RootStackNavigationProp;
}

interface FormData {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactNumber: string;
  address: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    address: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = VALIDATION_MESSAGES.REQUIRED;
    if (!formData.surname.trim()) newErrors.surname = VALIDATION_MESSAGES.REQUIRED;
    if (!formData.email.trim()) {
      newErrors.email = VALIDATION_MESSAGES.REQUIRED;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = VALIDATION_MESSAGES.INVALID_EMAIL;
    }
    if (!formData.password) {
      newErrors.password = VALIDATION_MESSAGES.REQUIRED;
    } else if (formData.password.length < 6) {
      newErrors.password = VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.PASSWORD_MISMATCH;
    }
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = VALIDATION_MESSAGES.REQUIRED;
    }
    if (!formData.address.trim()) newErrors.address = VALIDATION_MESSAGES.REQUIRED;
    if (!formData.cardNumber.trim()) newErrors.cardNumber = VALIDATION_MESSAGES.REQUIRED;
    if (!formData.cardHolder.trim()) newErrors.cardHolder = VALIDATION_MESSAGES.REQUIRED;
    if (!formData.expiryDate.trim()) newErrors.expiryDate = VALIDATION_MESSAGES.REQUIRED;
    if (!formData.cvv.trim()) newErrors.cvv = VALIDATION_MESSAGES.REQUIRED;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (): Promise<void> => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    setLoading(true);
    const result = await register(formData.email, formData.password, {
      name: formData.name,
      surname: formData.surname,
      contactNumber: formData.contactNumber,
      address: formData.address,
      cardNumber: formData.cardNumber,
      cardHolder: formData.cardHolder,
      expiryDate: formData.expiryDate,
      cvv: formData.cvv,
    });

    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('MainApp') },
      ]);
    } else {
      Alert.alert('Registration Failed', result.error || 'An error occurred');
    }
  };

  const updateField = (field: keyof FormData, value: string): void => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          {/* Personal Information */}
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Name"
            value={formData.name}
            onChangeText={(text) => updateField('name', text)}
            placeholderTextColor={COLORS.textLight}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <TextInput
            style={[styles.input, errors.surname && styles.inputError]}
            placeholder="Surname"
            value={formData.surname}
            onChangeText={(text) => updateField('surname', text)}
            placeholderTextColor={COLORS.textLight}
          />
          {errors.surname && <Text style={styles.errorText}>{errors.surname}</Text>}

          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={COLORS.textLight}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
            secureTextEntry
            placeholderTextColor={COLORS.textLight}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => updateField('confirmPassword', text)}
            secureTextEntry
            placeholderTextColor={COLORS.textLight}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          {/* Contact Information */}
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <TextInput
            style={[styles.input, errors.contactNumber && styles.inputError]}
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChangeText={(text) => updateField('contactNumber', text)}
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.textLight}
          />
          {errors.contactNumber && (
            <Text style={styles.errorText}>{errors.contactNumber}</Text>
          )}

          <TextInput
            style={[styles.input, styles.textArea, errors.address && styles.inputError]}
            placeholder="Address"
            value={formData.address}
            onChangeText={(text) => updateField('address', text)}
            multiline
            numberOfLines={3}
            placeholderTextColor={COLORS.textLight}
          />
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

          {/* Card Information */}
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <Text style={styles.note}>For testing purposes only</Text>

          <TextInput
            style={[styles.input, errors.cardNumber && styles.inputError]}
            placeholder="Card Number"
            value={formData.cardNumber}
            onChangeText={(text) => updateField('cardNumber', text)}
            keyboardType="numeric"
            maxLength={16}
            placeholderTextColor={COLORS.textLight}
          />
          {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}

          <TextInput
            style={[styles.input, errors.cardHolder && styles.inputError]}
            placeholder="Card Holder Name"
            value={formData.cardHolder}
            onChangeText={(text) => updateField('cardHolder', text)}
            placeholderTextColor={COLORS.textLight}
          />
          {errors.cardHolder && <Text style={styles.errorText}>{errors.cardHolder}</Text>}

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <TextInput
                style={[styles.input, errors.expiryDate && styles.inputError]}
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChangeText={(text) => updateField('expiryDate', text)}
                maxLength={5}
                placeholderTextColor={COLORS.textLight}
              />
              {errors.expiryDate && (
                <Text style={styles.errorText}>{errors.expiryDate}</Text>
              )}
            </View>
            <View style={styles.halfWidth}>
              <TextInput
                style={[styles.input, errors.cvv && styles.inputError]}
                placeholder="CVV"
                value={formData.cvv}
                onChangeText={(text) => updateField('cvv', text)}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
                placeholderTextColor={COLORS.textLight}
              />
              {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Extra padding for submit button visibility
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  form: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 20,
    marginBottom: 12,
  },
  note: {
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 14,
  },
  linkBold: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;
