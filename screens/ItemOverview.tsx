import * as React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import {
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  ScrollView,
  VStack,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { useGlobalState } from "../components/StateManagement/GlobalState";
import ItemCard from "../components/Item/ItemCard";
import { isAdmin } from "../lib/helpers";
import QRScanner from "../components/QR/QRScanner";
import { Item } from "../lib/Types";

export default function ItemOverview({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  const { state } = useGlobalState();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedItem, setScannedItem] = useState<Item>();
  const setItem = (i: Item): void => {
    setScannerOpen(false);
    setScannedItem(i);
  };

  const scanQR = () => {
    setScannerOpen(true);
  };

  const getItemList = () => {
    const itemList = scannedItem ? [scannedItem] : state.items;
    return itemList?.map((i) => (
      <ItemCard
        key={i.id}
        item={i}
        editItem={(item: Item) => navigation.navigate("Ny gjenstand", item)}
      />
    ));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      width: "100%",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {scannerOpen && <QRScanner createItem={false} setItem={setItem} />}
      <ScrollView flex={1} p={2} overflow="scroll">
        <VStack space={2} alignItems="center">
          {!scannerOpen && (
            <Heading mb={5} size="2xl">
              {isAdmin(state.currentUser)
                ? "Alle gjenstander"
                : "Mine gjenstander"}
            </Heading>
          )}
          {!scannerOpen && !scannedItem && isAdmin(state.currentUser) && (
            <>
              <Heading size="lg">Finn gjenstand</Heading>
              <HStack mt={2} mb={5}>
                <Button mr={5} onPress={scanQR}>
                  QR
                </Button>
              </HStack>
            </>
          )}
          {scannedItem && (
            <Button onPress={() => setScannedItem(undefined)}>
              Fjern filter
            </Button>
          )}
          {!scannerOpen && getItemList()}
          {!scannerOpen && !isAdmin(state.currentUser) && (
            <IconButton
              onPress={() => navigation.navigate("Ny gjenstand")}
              icon={<Icon size="md" as={<AntDesign name="plus" />} />}
            />
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
