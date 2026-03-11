// Notification Service - local push notifications for order status updates
import * as Notifications from "expo-notifications";

const STATUS_MESSAGES: Record<string, { title: string; body: string }> = {
  confirmed: {
    title: "Order Confirmed! ✅",
    body: "Great news! Your order has been confirmed and will be prepared shortly.",
  },
  preparing: {
    title: "Order Being Prepared 👨‍🍳",
    body: "Your order is now being prepared by our baristas. Hang tight!",
  },
  ready: {
    title: "Order Ready! 📦",
    body: "Your order is ready and will be on its way to you soon.",
  },
  delivered: {
    title: "Order Delivered! 🎉",
    body: "Your order has been delivered. Enjoy your meal!",
  },
  cancelled: {
    title: "Order Cancelled ❌",
    body: "Unfortunately, your order has been cancelled. Please contact us for more info.",
  },
};

export const notificationService = {
  /**
   * Send a local push notification when order status changes
   */
  sendOrderStatusNotification: async (
    orderId: string,
    newStatus: string,
    orderTotal?: number,
  ): Promise<void> => {
    try {
      const message = STATUS_MESSAGES[newStatus];
      if (!message) return;

      const bodyWithOrder = `${message.body}\n\nOrder: ${orderId}${
        orderTotal ? ` · R${orderTotal.toFixed(2)}` : ""
      }`;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: message.title,
          body: bodyWithOrder,
          sound: "default",
          data: { orderId, status: newStatus },
          ...(require("react-native").Platform.OS === "android"
            ? { channelId: "orders" }
            : {}),
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  },

  /**
   * Send a custom notification
   */
  sendCustomNotification: async (
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<void> => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: "default",
          data: data || {},
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Failed to send custom notification:", error);
    }
  },

  /**
   * Get the notification permission status
   */
  getPermissionStatus: async (): Promise<string> => {
    const perms = await Notifications.getPermissionsAsync();
    return perms.granted ? "granted" : "denied";
  },

  /**
   * Request notification permissions if not already granted
   */
  requestPermissions: async (): Promise<boolean> => {
    const existingPerms = await Notifications.getPermissionsAsync();
    if (existingPerms.granted) return true;

    const newPerms = await Notifications.requestPermissionsAsync();
    return newPerms.granted;
  },
};
