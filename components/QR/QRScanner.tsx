import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Platform } from "react-native";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import Constants from "expo-constants";
import firebase from "../../firebase/config";
import { Item } from "../../lib/Types";
import { sendPushNotification } from "../Notifications/PushNotification";
import { readPushToken } from "../../lib/helpers";
import sendEmail from "../Notifications/EmailNotification";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },
});

export default function QRScanner({
  setItem,
  createItem,
}: {
  // eslint-disable-next-line no-unused-vars
  setItem: (item: Item) => void;
  createItem: boolean;
}) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const sendPush = async () => {
    if (Constants.isDevice) {
      const pushToken = await readPushToken();
      sendPushNotification(
        pushToken,
        "Savnet gjenstand funnet!",
        "En gjenstand du har satt som savnet har nå blitt funnet.",
        true,
        true
      );
    }
  };

  const sendEmailNotification = async () => {
    const email = firebase.auth().currentUser?.email;
    const name = firebase.auth().currentUser?.displayName;

    sendEmail(
      `${email}`,
      "En av dine savnede gjenstander ble nylig funnet!",
      `Hei ${name}! Vi anbefaler på at du betaler en dusør til den som fant gjenstanden din.`,
      { cc: "admin@providentia.no" }
    ).then(() => {
      // eslint-disable-next-line no-console
      console.log("Your message was successfully sent!");
    });
  };

  const handleBarCodeScanned = async ({ data }: BarCodeScannerResult) => {
    const matcher = data.match(/\/(\S+)/);
    if (!matcher) {
      // eslint-disable-next-line no-alert
      alert("Ugyldig lenke!");
      return;
    }
    const itemID = matcher[1];
    const item: Item = {
      id: itemID,
      ...(
        await firebase.firestore().collection("items").doc(itemID).get()
      ).data(),
    } as Item;
    if (!item.name) {
      if (!createItem) {
        // eslint-disable-next-line no-alert
        alert("Fant ikke gjenstand!");
        return;
      }
    }
    setScanned(true);
    setItem(item);
<<<<<<< HEAD
    sendPush();
    sendEmailNotification();
=======

    if (Constants.isDevice) {
      const pushToken = await readPushToken();
      sendPushNotification(
        pushToken,
        "Savnet gjenstand funnet!",
        "En gjenstand du har satt som savnet har nå blitt funnet.",
        true,
        true
      );
    }
    // Send push notification
    // Send email notification
>>>>>>> be9f6cc (Push notifications)
  };

  if (hasPermission === null) {
    return <Text>Forespør kamera-tilgang...</Text>;
  }

  if (!hasPermission) {
    if (Platform.OS === "web" && !scanned) {
      // eslint-disable-next-line no-alert
      const id = prompt("Skriv inn scannet ID");
      handleBarCodeScanned({ data: `/${id}`, type: "256" });
    }
    return <Text>Ingen tilgang til kamera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}
