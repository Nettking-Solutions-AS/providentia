import * as React from "react";
import { Heading, View } from "native-base";
import { useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import QRGenerator from "../components/QR/QRGenerator";
import QROverview from "../components/QR/QROverview";

export default function QR() {
  const [generateQR, setGenerateQR] = useState(false);
  const displayQRGenerator = () => setGenerateQR(true);
  const hideQRGenerator = () => setGenerateQR(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View flex={1} p={2} alignItems="center">
        <Heading size="2xl">QR</Heading>
        {generateQR ? (
          <QRGenerator hideQRGenerator={hideQRGenerator} />
        ) : (
          <QROverview displayQRGenerator={displayQRGenerator} />
        )}
      </View>
    </SafeAreaView>
  );
}
