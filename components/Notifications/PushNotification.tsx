/* eslint-disable no-console */
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";

export const sendPushNotification = async (
  expoPushToken: string | undefined,
  title: string,
  body: string,
  sound: boolean,
  displayInForeground: boolean
) => {
  // Message fields: https://docs.expo.io/push-notifications/sending-notifications/#message-request-format
  const message = {
    to: expoPushToken,
    sound: sound ? "default" : null,
    title,
    body,
    ios: { _displayInForeground: displayInForeground },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};

export const registerForPushNotificationsAsync = async () => {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert(
        "Push notifikasjoner er skrudd av",
        "Vennligst skru på push notifikasjoner i innstillingene for at appen skal fungere skikkelig." +
          "Vi kommer ikke til å spamme deg med unødvendige notifikasjoner."
      );
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log(
      "Push notifikasjoner er skrudd av. Du må bruke en fysisk enhet for denne funksjonen."
    );
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  // eslint-disable-next-line consistent-return
  return token;
};
