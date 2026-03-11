// Register Screen - simple local registration
import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../utils/constants";

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!name.trim() || !surname.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    const result = await register(email.trim(), password, {
      name: name.trim(),
      surname: surname.trim(),
      contactNumber: phone.trim(),
      address: address.trim(),
    });
    setLoading(false);

    if (!result.success) {
      Alert.alert("Registration Failed", result.error || "Please try again");
    }
    // If success, AuthContext auto-navigates to main app
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Image
                source={require("../../../assets/icon/icons8-back-button.png")}
                style={{ width: 24, height: 24, tintColor: COLORS.primary }}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join Coffee Shop and start ordering
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John"
                  placeholderTextColor={COLORS.textLight}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Doe"
                  placeholderTextColor={COLORS.textLight}
                  value={surname}
                  onChangeText={setSurname}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="0123456789"
                placeholderTextColor={COLORS.textLight}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Delivery Address</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Your delivery address"
                placeholderTextColor={COLORS.textLight}
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Min 6 characters"
                  placeholderTextColor={COLORS.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Image
                    source={
                      showPassword
                        ? require("../../../assets/icon/icons8-eye-48.png")
                        : require("../../../assets/icon/icons8-invisible-48.png")
                    }
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter password"
                placeholderTextColor={COLORS.textLight}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.registerButtonText}>
                {loading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 16,
    padding: 4,
    alignSelf: "flex-start",
  },
  backText: {
    fontSize: 28,
    color: COLORS.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
  },
  form: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    top: 12,
    padding: 4,
  },
  eyeIcon: {
    width: 22,
    height: 22,
    tintColor: COLORS.textLight,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
});

export default RegisterScreen;
