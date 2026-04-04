// Profile Screen - view/edit profile + logout
import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../utils/constants";

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [surname, setSurname] = useState(user?.surname || "");
  const [phone, setPhone] = useState(user?.contactNumber || "");
  const [address, setAddress] = useState(user?.address || "");

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }
    setSaving(true);
    try {
      const result = await updateProfile({
        name: name.trim(),
        surname: surname.trim(),
        contactNumber: phone.trim(),
        address: address.trim(),
      });
      if (result.success) {
        setEditing(false);
        Alert.alert("Saved", "Profile updated successfully.");
      } else {
        Alert.alert("Error", result.error || "Failed to update profile.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setSurname(user?.surname || "");
    setPhone(user?.contactNumber || "");
    setAddress(user?.address || "");
    setEditing(false);
  };

  const initials =
    `${(user?.name || "?")[0]}${(user?.surname || "")[0] || ""}`.toUpperCase();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.fullName}>
            {user?.name} {user?.surname}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Profile Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Profile Details</Text>
            {!editing && (
              <TouchableOpacity
                onPress={() => setEditing(true)}
                style={styles.editBtnRow}
              >
                <Text style={styles.editBtn}>Edit</Text>
                <Image
                  source={require("../../../assets/icon/icons8-pen-64.png")}
                  style={styles.editBtnIcon}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>First Name</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="First name"
                placeholderTextColor={COLORS.border}
              />
            ) : (
              <Text style={styles.value}>{user?.name || "—"}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Last Name</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={surname}
                onChangeText={setSurname}
                placeholder="Last name"
                placeholderTextColor={COLORS.border}
              />
            ) : (
              <Text style={styles.value}>{user?.surname || "—"}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <Text style={[styles.value, styles.readOnly]}>{user?.email}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Phone</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone number"
                placeholderTextColor={COLORS.border}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.value}>{user?.contactNumber || "—"}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Address</Text>
            {editing ? (
              <TextInput
                style={[styles.input, styles.addressInput]}
                value={address}
                onChangeText={setAddress}
                placeholder="Delivery address"
                placeholderTextColor={COLORS.border}
                multiline
              />
            ) : (
              <Text style={styles.value}>{user?.address || "—"}</Text>
            )}
          </View>

          {/* Edit Action Buttons */}
          {editing && (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveBtnText}>
                  {saving ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* App Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>App</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Theme</Text>
            <Text style={styles.infoValue}>Coffee Shop</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: 16,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    width: "100%",
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.white,
  },
  fullName: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    width: "100%",
    flexShrink: 0,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },
  editBtn: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  editBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  editBtnIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.primary,
    resizeMode: "contain",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  readOnly: {
    opacity: 0.6,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addressInput: {
    minHeight: 50,
    textAlignVertical: "top",
  },
  editActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  logoutBtn: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.error,
  },
  logoutBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.error,
  },
});

export default ProfileScreen;
