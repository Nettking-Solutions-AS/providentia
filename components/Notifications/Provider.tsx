/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef, ReactNode } from "react";
import * as Notifications from "expo-notifications";
import { NotificationResponse } from "expo-notifications";
import { Subscription } from "@unimodules/core";
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from "./PushNotification";
import { storePushToken } from "../../lib/helpers";

interface Props {
  children: ReactNode;
}

interface PushNotificationContextValues {
  token: string | undefined;
  notification: Notifications.Notification | undefined;
  sendPushNotification: (
    title: string,
    body: string,
    sound: boolean
  ) => Promise<void>;
}

export const PushNotificationContext =
  React.createContext<PushNotificationContextValues>({
    token: undefined,
    notification: undefined,
    sendPushNotification: () =>
      new Promise(() => console.error("Funksjonen er ikke initialisert")),
  });

PushNotificationContext.displayName = "PushNotifikasjonKontekst";

export const PushNotificationProvider = ({ children }: Props) => {
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    if (expoPushToken !== "") {
      try {
        storePushToken(expoPushToken);
        console.log(`La til push notifikasjons token '${expoPushToken}'`);
      } catch (error) {
        console.error(error.message);
      }
    }
  }, [expoPushToken]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token ?? "")
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        });
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        (response: NotificationResponse) => {
          console.log(response);
        }
      );

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const notify = (title: string, body: string, sound: boolean) =>
    sendPushNotification(expoPushToken, title, body, sound, true);

  const value: PushNotificationContextValues = {
    token: expoPushToken,
    notification,
    sendPushNotification: notify,
  };

  return (
    <PushNotificationContext.Provider value={value}>
      {children}
    </PushNotificationContext.Provider>
  );
};


