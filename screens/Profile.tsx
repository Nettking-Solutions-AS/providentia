import * as React from "react";
import { useState } from "react";
import { Button, Heading, View } from "native-base";
import { StyleSheet, SafeAreaView } from "react-native";
import firebase from "../firebase/config";
import { useGlobalState } from "../components/StateManagement/GlobalState";
import { User, InsuranceCompany, Error } from "../lib/Types.d";
import { validateInsurance } from "../lib/validation";

export default function Profile({ user }: { user: User }) {
  const { state, dispatch } = useGlobalState();
  const [insuranceCompany, setInsuranceCompany] = useState<InsuranceCompany>(
    user.insuranceCompany ?? ""
  );
  const [errors, setErrors] = useState<Error[]>([]);

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

  const getErrorsByType = (type: string) =>
    errors.filter((e) => e.type === type);

  const addInsurance = () => {
    const validationErrors = [
      ...validateInsurance(insuranceCompany),
    ];

    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      const user = firebase.auth().currentUser;

      user?.updateProfile({
        insuranceCompany: setInsuranceCompany;
      })
    }

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
        <Button
          size="md"
          colorScheme="cyan"
          _text={{ color: "primary.200" }}
          onPress={addInsurance}
        >
          Velg forsikringsselskap
        </Button>
      </View>
    </SafeAreaView>
  );
}
