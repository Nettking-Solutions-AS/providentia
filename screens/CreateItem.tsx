import * as React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import CreateItem from "../components/CreateItem";
import { Item } from "../lib/Types";

export default function CreateItemScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <CreateItem
        initialItem={route.params ?? ({} as Item)}
        displayItemOverview={() => navigation.navigate("Mine gjenstander")}
      />
    </SafeAreaView>
  );
}
