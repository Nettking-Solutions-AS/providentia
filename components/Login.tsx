import * as React from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
} from "native-base";
import { useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import firebase from "../firebase/config";
import { Error } from "../lib/Types";
import { validateEmail, validatePassword } from "../lib/validation";

export default function Login({
  showRegistration,
}: {
  showRegistration: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);

  const onLoginPress = () => {
    const validationErrors = [
      ...validateEmail(email),
      ...validatePassword(password),
    ];

    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
          const usersRef = firebase.firestore().collection("users");
          usersRef
            .doc(response.user?.uid)
            .get()
            .then((firestoreDocument) => {
              if (!firestoreDocument.exists) {
                // eslint-disable-next-line no-alert
                alert("Brukeren eksisterer ikke!");
                // return;
              }
              // const user = firestoreDocument.data();
              // TODO: Fetch user items
            })
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

  const getErrorsByType = (type: string) =>
    errors.filter((e) => e.type === type);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Box flex={1} p={2} w="90%" mx="auto">
        <Heading textAlign="center" color="primary.50" size="2xl">
          Providentia
        </Heading>
        <VStack space={2} mt={5}>
          <FormControl
            isRequired
            isInvalid={getErrorsByType("email").length > 0}
          >
            <FormControl.Label
              _text={{ color: "primary.150", fontSize: "lg", fontWeight: 500 }}
            >
              Epost
            </FormControl.Label>
            <Input
              size="lg"
              type="email"
              onChangeText={(text) => setEmail(text)}
            />
            <FormControl.ErrorMessage
              _text={{ color: "primary.250", fontSize: "md" }}
            >
              {getErrorsByType("email").map((e) => e.message)}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={getErrorsByType("password").length > 0}
            mb={5}
          >
            <FormControl.Label
              _text={{ color: "primary.150", fontSize: "lg", fontWeight: 500 }}
            >
              Passord
            </FormControl.Label>
            <Input type="password" onChangeText={(text) => setPassword(text)} />
            <FormControl.ErrorMessage
              _text={{ color: "primary.250", fontSize: "md" }}
            >
              {getErrorsByType("password").map((e) => e.message)}
            </FormControl.ErrorMessage>
          </FormControl>
          <VStack space={2}>
            <Button
              size="md"
              colorScheme="green"
              _text={{ color: "primary.150" }}
              onPress={onLoginPress}
            >
              Login
            </Button>
          </VStack>
          <HStack justifyContent="center">
            <Text fontSize="md" color="primary.150" fontWeight={400}>
              Har du ikke bruker?{" "}
            </Text>
            <Link
              _text={{ color: "primary.50", bold: true, fontSize: "md" }}
              onPress={showRegistration}
            >
              Registrer deg
            </Link>
          </HStack>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}
