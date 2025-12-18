import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    Image,
    RefreshControl,
    SectionList,
    SectionListData,
    SectionListRenderItemInfo,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { firestoreService } from '../../services/firebase/firestoreService';
import type { FoodItem, HomeStackParamList } from '../../types';
import { COLORS, SCREEN_NAMES } from '../../utils/constants';
import { helpers } from '../../utils/helpers';

type MenuScreenProps = NativeStackScreenProps<HomeStackParamList, 'Menu'>;

interface MenuSection {
  title: string;
  data: FoodItem[];
}

const MenuScreen: React.FC<MenuScreenProps> = ({ navigation, route }) => {
  const category = route.params?.category;
  const [menuData, setMenuData] = useState<MenuSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async (): Promise<void> => {
    setLoading(true);
    const result = await firestoreService.getFoodItems();
    if (result.success && result.data) {
      const groupedData = groupItemsByCategory(result.data);
      setMenuData(groupedData);
    }
    setLoading(false);
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadMenuData();
    setRefreshing(false);
  };

  const groupItemsByCategory = (items: FoodItem[]): MenuSection[] => {
    const grouped = helpers.groupBy(items, 'category');
    return Object.keys(grouped).map(cat => ({
      title: cat,
      data: grouped[cat]
    }));
  };

  const renderMenuItem = ({ item }: SectionListRenderItemInfo<FoodItem, MenuSection>): React.ReactElement => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => navigation.navigate(SCREEN_NAMES.FOOD_DETAIL as any, { item })}
    >
      <View style={styles.itemImageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🍴</Text>
          </View>
        )}
      </View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.itemPrice}>{helpers.formatCurrency(item.price)}</Text>
      </View>

      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: SectionListData<FoodItem, MenuSection> }): React.ReactElement => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  if (loading && menuData.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={menuData}
        renderItem={renderMenuItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No menu items available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  listContent: {
    padding: 15,
  },
  sectionHeader: {
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    paddingHorizontal: 5,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  menuItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  itemImage: {
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
    fontSize: 30,
  },
  itemDetails: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
  arrow: {
    fontSize: 28,
    color: COLORS.textLight,
    fontWeight: '300',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default MenuScreen;
