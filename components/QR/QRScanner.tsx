import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import { fetchItem } from "../../lib/requests";
import { Item } from "../../lib/Types";

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
    const itemID = Number(matcher[1]);
    let item = await fetchItem(itemID);
    if (!item) {
      if (!createItem) {
        // eslint-disable-next-line no-alert
        alert("Fant ikke gjenstand!");
        return;
      }
      item = { id: itemID } as Item;
    }
    setScanned(true);
    setItem(item);
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
