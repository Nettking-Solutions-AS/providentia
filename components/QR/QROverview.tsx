import { Button, Text } from "native-base";
import * as React from "react";
import * as WebBrowser from "expo-web-browser";

export default function QROverview({
  displayQRGenerator,
}: {
  displayQRGenerator: () => void;
}) {
  const openBrowser = async () => {
    await WebBrowser.openBrowserAsync("https://nettking.no");
  };
  return (
    <>
      <Text>QR-koder brukes for å gjenkjenne gjenstander</Text>
      <Button mb={15} mt={5} onPress={() => displayQRGenerator()}>
        Generer QR-kode
      </Button>
      <Text>Eller</Text>
      <Button mt={15} onPress={openBrowser}>
        Bestill QR-koder
      </Button>
    </>
  );
}
