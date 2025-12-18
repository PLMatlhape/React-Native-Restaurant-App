import { StyleSheet, Platform } from 'react-native';
import colors from './colors';
import { fontSize, fontWeight } from './typography';

export const commonStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  containerPadded: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },

  contentContainer: {
    padding: 20,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  // Card styles
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  cardFlat: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },

  // Button styles
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },

  buttonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  buttonSecondaryText: {
    color: colors.primary,
  },

  buttonDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },

  buttonSmall: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  buttonLarge: {
    paddingVertical: 18,
    paddingHorizontal: 40,
  },

  // Input styles
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 15,
    fontSize: fontSize.md,
    color: colors.text,
  },

  inputError: {
    borderColor: colors.error,
  },

  inputDisabled: {
    backgroundColor: colors.backgroundDark,
    color: colors.textDisabled,
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // Text styles
  textCenter: {
    textAlign: 'center',
  },

  textRight: {
    textAlign: 'right',
  },

  textBold: {
    fontWeight: fontWeight.bold,
  },

  textSemibold: {
    fontWeight: fontWeight.semibold,
  },

  textPrimary: {
    color: colors.primary,
  },

  textSecondary: {
    color: colors.textSecondary,
  },

  textError: {
    color: colors.error,
    fontSize: fontSize.sm,
    marginTop: 5,
  },

  // Layout styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  column: {
    flexDirection: 'column',
  },

  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Spacing
  marginBottom: {
    marginBottom: 15,
  },

  marginTop: {
    marginTop: 15,
  },

  marginVertical: {
    marginVertical: 15,
  },

  marginHorizontal: {
    marginHorizontal: 15,
  },

  paddingBottom: {
    paddingBottom: 15,
  },

  paddingTop: {
    paddingTop: 15,
  },

  paddingVertical: {
    paddingVertical: 15,
  },

  paddingHorizontal: {
    paddingHorizontal: 15,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 15,
  },

  dividerVertical: {
    width: 1,
    backgroundColor: colors.divider,
    marginHorizontal: 15,
  },

  // Shadow
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  shadowLarge: {
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  // Badge
  badge: {
    backgroundColor: colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  badgeText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },

  // Icon container
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
  },

  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },

  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  // List
  listContainer: {
    padding: 15,
  },

  listItem: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  listItemSeparator: {
    height: 1,
    backgroundColor: colors.divider,
  },

  // Image
  imageContainer: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 8,
    overflow: 'hidden',
  },

  imagePlaceholder: {
    backgroundColor: colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Price tag
  priceTag: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  priceTagText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },

  // Status badge
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  statusBadgeText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },

  modalHeader: {
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
  },

  // Tab bar
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },

  // Chip
  chip: {
    backgroundColor: colors.backgroundDark,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },

  chipActive: {
    backgroundColor: colors.primary,
  },

  chipText: {
    fontSize: fontSize.base,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },

  chipTextActive: {
    color: colors.white,
  }
});

export default commonStyles;