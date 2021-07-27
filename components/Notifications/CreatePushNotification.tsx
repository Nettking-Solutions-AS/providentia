import * as Notifications from "expo-notifications";

export const pushIds = {};
export const createPushNotification = (
  sound: string,
  title: string,
  body: string,
  data: string
) => {
  Notifications.scheduleNotificationAsync({
    content: {
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { someData: "goes here" },
    },
    trigger: {
      seconds: 1,
    },
  });
  // eslint-disable-next-line no-console
  console.log("saving push notification");
};
