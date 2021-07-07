import { Button, Image, Text, useTheme } from "native-base";
import { svgAsDataUri } from "save-svg-as-png";
import * as React from "react";
import * as Sharing from "expo-sharing";
import { useRef } from "react";
import QRCode from "react-native-qrcode-svg";

export default function QRGenerator({
  hideQRGenerator,
}: {
  hideQRGenerator: () => void;
}) {
  let svg: any;

  let myRef = useRef<HTMLElement>();
  const openShareDialogAsync = async () => {
    const uri = svgAsDataUri(myRef);
    if (!(await Sharing.isAvailableAsync())) {
      // eslint-disable-next-line no-alert
      alert(`Fildeling er ikke aktivert på din platform!`);
      return;
    }

    await Sharing.shareAsync(uri);
  };
  return (
    <>
      <QRCode
        value="http://nettking.no"
        getRef={(c) => {
          myRef = c;
        }}
      />
      <Image alt="test" source={svg} />
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
