import "react-native-gesture-handler";
import React from "react";
import { NativeBaseProvider } from "native-base";
import GlobalStateProvider from "./components/StateManagement/GlobalState";
import ScreenManager from "./components/ScreenManager";

export default function App() {
  return (
    <GlobalStateProvider>
      <NativeBaseProvider>
        <ScreenManager />
      </NativeBaseProvider>
    </GlobalStateProvider>
  );
}
