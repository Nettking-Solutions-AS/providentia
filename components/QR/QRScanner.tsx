import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Platform } from "react-native";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import firebase from "../../firebase/config";
import { Item } from "../../lib/Types";
import { createPushNotification } from "../Notifications/save";
// import sendEmail from "../Notifications/EmailNotification";

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    sendPush();
    sendEmailNotification();
=======

    // Send push notification
=======

<<<<<<< HEAD
>>>>>>> 0fe9c33 (Push notifications)
=======
    // Send push notification
>>>>>>> 2a37a3d (Email notifications)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 2a37a3d (Email notifications)

    const email = firebase.auth().currentUser?.email;
    const name = firebase.auth().currentUser?.displayName;

<<<<<<< HEAD
    // Send email notification
<<<<<<< HEAD
>>>>>>> be9f6cc (Push notifications)
=======
    sendEmail(
      `${email}`,
      "En av dine savnede gjenstander ble nylig funnet!",
      `Hei ${name}! Vi anbefaler på at du betaler en dusør til den som fant gjenstanden din.`,
      { cc: "admin@providentia.no" }
    ).then(() => {
      // eslint-disable-next-line no-console
      console.log("Your message was successfully sent!");
    });
>>>>>>> 976b3c9 (Email notifications)
=======
>>>>>>> c3dfaeb (Temp removal)
=======
    // Send push notification
    // Send email notification
>>>>>>> 0fe9c33 (Push notifications)
=======
    // Send email notification
    sendEmail(
      `${email}`,
      "En av dine savnede gjenstander ble nylig funnet!",
      `Hei ${name}! Vi anbefaler på at du betaler en dusør til den som fant gjenstanden din.`,
      { cc: "admin@providentia.no" }
    ).then(() => {
      // eslint-disable-next-line no-console
      console.log("Your message was successfully sent!");
    });
>>>>>>> 2a37a3d (Email notifications)
=======
>>>>>>> a3b8514 (Temp removal)
=======
    sendPush();
    sendEmailNotification();
>>>>>>> d81b270 (final touches on notificationProvider)
=======
    createPushNotification("default", "Title", "Body", "Data");
>>>>>>> f2fd5ff (Midlertidig push for å rebase)
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
