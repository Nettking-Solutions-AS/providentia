import "react-native-gesture-handler";
import React from "react";
import { NativeBaseProvider } from "native-base";
import Login from "./components/Login";

export default function App() {
  return (
    <NativeBaseProvider>
      <Login />
    </NativeBaseProvider>
  );
}
