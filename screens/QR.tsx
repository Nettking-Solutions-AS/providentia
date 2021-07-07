import * as React from "react";
import { Heading, View } from "native-base";
import { useState } from "react";
import QRGenerator from "../components/QR/QRGenerator";
import QROverview from "../components/QR/QROverview";

export default function QR() {
  const [generateQR, setGenerateQR] = useState(false);
  const displayQRGenerator = () => setGenerateQR(true);
  const hideQRGenerator = () => setGenerateQR(false);
  return (
    <View flex={1} alignItems="center">
      <Heading>QR</Heading>
      {generateQR ? (
        <QRGenerator hideQRGenerator={hideQRGenerator} />
      ) : (
        <QROverview displayQRGenerator={displayQRGenerator} />
      )}
    </View>
  );
}
