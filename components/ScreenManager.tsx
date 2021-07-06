import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import QR from "../screens/QR";
import CreateItem from "../screens/CreateItem";
import ItemOverview from "../screens/ItemOverview";
import Profile from "../screens/Profile";
import { useGlobalState } from "./StateManagement/GlobalState";
import UserRegistration from "../screens/UserRegistration";

export default function ScreenManager() {
  const screenOptions = (route: { name: string }) => ({
    tabBarIcon: ({
      focused,
      color,
      size,
    }: {
      focused: boolean;
      color: string;
      size: number;
    }) => {
      let iconName;

      if (route.name === "QR") {
        iconName = focused ? "qr-code" : "qr-code-outline";
      } else if (route.name === "Ny gjenstand") {
        iconName = focused ? "add" : "add-outline";
      } else if (route.name === "Mine gjenstander") {
        iconName = focused ? "desktop" : "desktop-outline";
      } else if (route.name === "Profil") {
        iconName = focused ? "person" : "person-outline";
      }

      // @ts-ignore
      return <Ionicons name={iconName} size={size} color={color} />;
    },
  });
  const { state } = useGlobalState();
  const Tab = createBottomTabNavigator();

  return state.currentUser ? (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => screenOptions(route)}
        tabBarOptions={{
          activeTintColor: "blue",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="QR" component={QR} />
        <Tab.Screen name="Ny gjenstand" component={CreateItem} />
        <Tab.Screen name="Mine gjenstander" component={ItemOverview} />
        <Tab.Screen name="Profil" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  ) : (
    <UserRegistration />
  );
}