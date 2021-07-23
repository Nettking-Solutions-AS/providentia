import * as React from "react";
import { Button, Heading, View } from "native-base";
import { StyleSheet, SafeAreaView } from "react-native";
import firebase from "../firebase/config";
import { useGlobalState } from "../components/StateManagement/GlobalState";

export default function Profile() {
  const { state, dispatch } = useGlobalState();
  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: "SET_CURRENT_USER", payload: null });
      })
      .catch((error) => {
        // eslint-disable-next-line no-alert
        alert(error);
      });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View flex={1} p={2} alignItems="center">
        <Heading textAlign="center" color="primary.500" size="2xl" mb={150}>
          Profil
        </Heading>
        <Heading>{state.currentUser?.name}</Heading>
        <Heading size="md" mt={2} mb={5}>
          {state.currentUser?.email}
        </Heading>
        <Button
          size="md"
          colorScheme="cyan"
          _text={{ color: "primary.200" }}
          onPress={logout}
        >
          Logg ut
        </Button>
      </View>
    </SafeAreaView>
  );
}
