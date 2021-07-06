import * as React from "react";

import { Text, View } from "native-base";

export default function QR() {
  return (
    <View
      // Use a separate css file when implementing
      /* eslint-disable-next-line react-native/no-inline-styles */
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>QR</Text>
    </View>
  );
}
