import { Platform, StyleSheet } from 'react-native';
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

  // Image styles
  imageRounded: {
    borderRadius: 12,
  },

  imageCircle: {
    borderRadius: 50,
  },

  // Badge styles
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },

  badgeText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },

  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },

  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 10,
  },

  emptySubtext: {
    fontSize: fontSize.base,
    color: colors.textLight,
    textAlign: 'center',
  },

  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 15,
    fontSize: fontSize.md,
    color: colors.textLight,
  },

  // Error state
  errorContainer: {
    padding: 20,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    marginBottom: 15,
  },

  errorText: {
    color: colors.error,
    fontSize: fontSize.base,
    textAlign: 'center',
  },

  // Form styles
  formGroup: {
    marginBottom: 20,
  },

  formLabel: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text,
    marginBottom: 8,
  },

  formHelper: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: 5,
  },

  // Section styles
  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: 15,
  },

  sectionSubtitle: {
    fontSize: fontSize.base,
    color: colors.textLight,
    marginTop: -10,
    marginBottom: 15,
  },

  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },

  // List styles
  listItem: {
    backgroundColor: colors.white,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },

  listItemText: {
    fontSize: fontSize.md,
    color: colors.text,
    flex: 1,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 25,
    width: '85%',
    maxHeight: '80%',
  },

  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },

  // Flex utilities
  flex1: {
    flex: 1,
  },

  flexGrow: {
    flexGrow: 1,
  },

  flexShrink: {
    flexShrink: 1,
  },

  // Width utilities
  fullWidth: {
    width: '100%',
  },

  halfWidth: {
    width: '50%',
  },
});

export default commonStyles;
