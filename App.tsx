import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import setPushNotification from "./components/Notifications/RegisterForPushNotifications";
import GlobalStateProvider from "./components/StateManagement/GlobalState";
import ScreenManager from "./components/ScreenManager";

export default function App() {
  const theme = extendTheme({
    colors: {
      // Farger
      primary: {
        50: "#1ed760", // Lys grønn
        100: "#aaa", // Lys grå
        150: "#121212", // Svart
        200: "#fff", // Hvit
        250: "#e22134", // Rød
        300: "#2e77d0", // Blå
        green: "#16a34a",
      },
    },
  });

  useEffect(() => {
    setPushNotification();
  });

  return (
    <GlobalStateProvider>
      <NativeBaseProvider theme={theme}>
        <ScreenManager />
      </NativeBaseProvider>
    </GlobalStateProvider>
  );
}
