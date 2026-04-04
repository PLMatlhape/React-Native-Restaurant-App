import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle,
} from "react-native";
import { Category } from "../../types";
import { COLORS } from "../../utils/constants";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
  style?: ViewStyle;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  style,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
      contentContainerStyle={styles.content}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            selectedCategory === category.name && styles.categoryButtonActive,
          ]}
          onPress={() => onSelectCategory(category.name)}
          activeOpacity={0.7}
        >
          {category.icon && <Text style={styles.icon}>{category.icon}</Text>}
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={[
              styles.categoryText,
              selectedCategory === category.name && styles.categoryTextActive,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    maxHeight: 50,
    marginTop: 10,
    marginBottom: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 0,
    alignItems: "center",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 0,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 40,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  icon: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: COLORS.white,
  },
});

export default CategoryFilter;
