import * as React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { Text, View } from "native-base";

export default function CreateItem() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View
        // Use a separate css file when implementing
        /* eslint-disable-next-line react-native/no-inline-styles */
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Edit Item</Text>
      </View>
    </SafeAreaView>
  );
}
