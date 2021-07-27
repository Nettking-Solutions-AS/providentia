import React, { useState } from "react";
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  HStack,
  Link,
  Select,
} from "native-base";
import { StyleSheet, SafeAreaView } from "react-native";
import * as Notifications from "expo-notifications";
import firebase from "../firebase/config";
import { InsuranceCompany, Error } from "../lib/Types.d";
import {
  validateEmail,
  validateInsuranceCompany,
  validateName,
  validatePassword,
} from "../lib/validation";
import setPushNotification from "./Notifications/RegisterForPushNotifications";

export default function Registration({ showLogin }: { showLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState<
    InsuranceCompany | ""
  >("");
  const [errors, setErrors] = useState<Error[]>([]);
  const [pushToken, setPushToken] = useState("");

  const getToken = async () => {
    setPushNotification();
    setPushToken((await Notifications.getExpoPushTokenAsync()).data);
  };

  const getErrorsByType = (type: string) =>
    errors.filter((e) => e.type === type);

  const onRegisterPress = () => {
    const validationErrors = [
      ...validateEmail(email),
      ...validatePassword(password, confirmPassword),
      ...validateName(name),
      ...validateInsuranceCompany(insuranceCompany),
    ];

    getToken();
    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          if (!response.user) {
            throw new Error("User is not defined");
          }
          const { uid } = response.user;
          const data = {
            id: uid,
            email,
            name,
            pushToken,
            insuranceCompany,
            role: "customer",
          };
          const usersRef = firebase.firestore().collection("users");
          usersRef
            .doc(uid)
            .set(data)
            .catch((error) => {
              // eslint-disable-next-line no-alert
              alert(error);
            });
        })
        .catch((error) => {
          // eslint-disable-next-line no-alert
          alert(error);
        });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <NativeBaseProvider>
        <Box flex={1} p={2} w="90%" mx="auto">
          <Heading size="2xl" color="primary.500">
            Velkommen!
          </Heading>
          <Heading color="#292929" size="md">
            Registrer deg for å fortsette!
          </Heading>

          <VStack space={2} mt={5}>
            <FormControl
              isRequired
              isInvalid={getErrorsByType("name").length > 0}
            >
              <FormControl.Label
                _text={{
                  color: "#121212",
                  fontSize: "lg",
                  fontWeight: 500,
                }}
              >
                Navn
              </FormControl.Label>
              <Input
                size="lg"
                type="text"
                onChangeText={(text) => setName(text)}
              />
              <FormControl.ErrorMessage
                _text={{ color: "#e22134", fontSize: "md" }}
              >
                {getErrorsByType("name").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={getErrorsByType("email").length > 0}
            >
              <FormControl.Label
                _text={{
                  color: "#121212",
                  fontSize: "lg",
                  fontWeight: 500,
                }}
              >
                Epost
              </FormControl.Label>
              <Input
                size="lg"
                type="email"
                onChangeText={(text) => setEmail(text)}
              />
              <FormControl.ErrorMessage
                _text={{ color: "#e22134", fontSize: "md" }}
              >
                {getErrorsByType("email").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={getErrorsByType("password").length > 0}
            >
              <FormControl.Label
                _text={{
                  color: "#121212",
                  fontSize: "lg",
                  fontWeight: 500,
                }}
              >
                Passord
              </FormControl.Label>
              <Input
                size="lg"
                type="password"
                onChangeText={(text) => setPassword(text)}
              />
              <FormControl.ErrorMessage
                _text={{ color: "#e22134", fontSize: "md" }}
              >
                {getErrorsByType("password").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={getErrorsByType("confirmPassword").length > 0}
            >
              <FormControl.Label
                _text={{
                  color: "#121212",
                  fontSize: "lg",
                  fontWeight: 500,
                }}
              >
                Bekreft passord
              </FormControl.Label>
              <Input
                size="lg"
                type="password"
                onChangeText={(text) => setConfirmPassword(text)}
              />
              <FormControl.ErrorMessage
                _text={{ color: "#e22134", fontSize: "md" }}
              >
                {getErrorsByType("confirmPassword").map((e) => e.message)}
              </FormControl.ErrorMessage>
              <FormControl
                isRequired
                isInvalid={getErrorsByType("insuranceCompany").length > 0}
                mt={2}
              >
                <FormControl.Label
                  _text={{
                    color: "#121212",
                    fontSize: "lg",
                    fontWeight: 500,
                  }}
                >
                  Forsikringsselskap
                </FormControl.Label>
                <Select
                  selectedValue={insuranceCompany}
                  minWidth={200}
                  accessibilityLabel="Velg hvilket forsikringsselskap du har"
                  placeholder="Velg hvilket forsikringsselskap du har"
                  onValueChange={(itemValue) =>
                    setInsuranceCompany(itemValue as InsuranceCompany)
                  }
                >
                  <Select.Item label="Klp" value="Klp" />
                  <Select.Item label="Gjensidige" value="Gjensidige" />
                  <Select.Item label="If" value="If" />
                  <Select.Item label="Codan" value="Codan" />
                  <Select.Item label="Frende" value="Frende" />
                  <Select.Item label="Tryg" value="Tryg" />
                  <Select.Item label="Storebrand" value="Storebrand" />
                  <Select.Item label="Annet" value="Annet" />
                </Select>
                <FormControl.ErrorMessage
                  _text={{ color: "#e22134", fontSize: "md" }}
                >
                  {getErrorsByType("insuranceCompany").map((e) => e.message)}
                </FormControl.ErrorMessage>
              </FormControl>
            </FormControl>
            <VStack space={2} mt={5}>
              <Button
                size="md"
                colorScheme="cyan"
                _text={{ color: "#121212" }}
                onPress={onRegisterPress}
              >
                Registrer deg
              </Button>
            </VStack>
            <HStack justifyContent="center">
              <Text fontSize="md" color="#121212" fontWeight={400}>
                Har du allerede bruker?{" "}
              </Text>
              <Link
                _text={{ color: "primary.500", bold: true, fontSize: "md" }}
                onPress={showLogin}
              >
                Logg inn
              </Link>
            </HStack>
          </VStack>
        </Box>
      </NativeBaseProvider>
    </SafeAreaView>
  );
}
