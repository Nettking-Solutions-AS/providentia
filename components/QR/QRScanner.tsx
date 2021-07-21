import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import Constants from "expo-constants";
import { sendPushNotification } from "../Notifications/PushNotification";
import firebase from "../../firebase/config";
import { Item } from "../../lib/Types";
import { readPushToken } from "../../lib/helpers";

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
  };

  if (hasPermission === null) {
    return <Text>Forespør kamera-tilgang...</Text>;
  }

  if (!hasPermission) {
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
