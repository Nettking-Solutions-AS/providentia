import { Button, Image, Text, useTheme } from "native-base";
import { Share } from "react-native";
import * as React from "react";

export default function QRGenerator({
  hideQRGenerator,
}: {
  hideQRGenerator: () => void;
}) {
  const baseUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=www.nettking.no/";

  const randomID = Math.random().toString(36).substring(7);

  const randomURL = baseUrl + randomID;

  const openShareDialogAsync = async () => {
    await Share.share({
      message: randomURL,
    });
  };

  return (
    <>
      <Image
        size={150}
        resizeMode="contain"
        source={{
          uri: randomURL,
        }}
        alt="Ny QR-kode"
      />
      <Text textAlign="center" mb={5} mt={5}>
        Print ut denne QR-koden, og lim den på din gjenstand
      </Text>
      <Button mb={5} onPress={openShareDialogAsync}>
        Del / Skriv ut
      </Button>
      <Button
        backgroundColor={useTheme().colors.red[400]}
        onPress={hideQRGenerator}
      >
        Tilbake
      </Button>
    </>
  );
}
