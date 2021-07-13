import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import firebase from "../firebase/config";
import QR from "../screens/QR";
import CreateItem from "../screens/CreateItem";
import ItemOverview from "../screens/ItemOverview";
import Profile from "../screens/Profile";
import { useGlobalState } from "./StateManagement/GlobalState";
import UserRegistration from "../screens/UserRegistration";
import { isAdmin } from "../lib/helpers";
import { Item, User } from "../lib/Types";

export default function ScreenManager() {
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useGlobalState();

  useEffect(() => {
    const usersRef = firebase.firestore().collection("users");
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data();
            setLoading(false);
            dispatch({ type: "SET_CURRENT_USER", payload: userData });
            if (userData && isAdmin(userData as User)) {
              firebase
                .firestore()
                .collection("items")
                .get()
                .then((querySnapshot) => {
                  const items: Item[] = [];
                  querySnapshot.forEach((doc) => {
                    items.push({ id: doc.id, ...doc.data() } as Item);
                  });
                  dispatch({ type: "SET_ITEMS", payload: items });
                })
                .catch((error) => {
                  // eslint-disable-next-line no-alert
                  alert(error);
                });
            } else {
              firebase
                .firestore()
                .collection("items")
                .where("ownerIDs", "array-contains", user.uid)
                .get()
                .then((querySnapshot) => {
                  const items: Item[] = [];
                  querySnapshot.forEach((doc) => {
                    items.push({ id: doc.id, ...doc.data() } as Item);
                  });
                  dispatch({ type: "SET_ITEMS", payload: items });
                })
                .catch((error) => {
                  // eslint-disable-next-line no-alert
                  alert(error);
                });
            }
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <></>;
  }
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
  const Tab = createBottomTabNavigator();

  return state.currentUser ? (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => screenOptions(route)}
        tabBarOptions={{
          activeTintColor: "blue",
          inactiveTintColor: "gray",
        }}
        initialRouteName="Mine gjenstander"
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
