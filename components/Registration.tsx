import React, { useState } from "react";
import {
  NativeBaseProvider,
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
} from "native-base";
import firebase from "../firebase/config";
import { Error } from "../lib/Types.d";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../lib/validation";

export default function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);

  const getErrorsByType = (type: string) =>
    errors.filter((e) => e.type === type);

  const onRegisterPress = () => {
    const validationErrors = [
      ...validateEmail(email),
      ...validatePassword(password, confirmPassword),
      ...validateName(name),
    ];

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
  return (
    <NativeBaseProvider>
      <Box flex={1} p={2} w="90%" mx="auto">
        <Heading size="lg" color="primary.500">
          Velkommen!
        </Heading>
        <Heading color="muted.400" size="xs">
          Registrer deg for å fortsette!
        </Heading>

        <VStack space={2} mt={5}>
          <FormControl
            isRequired
            isInvalid={getErrorsByType("name").length > 0}
          >
            <FormControl.Label
              _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
            >
              Navn
            </FormControl.Label>
            <Input type="text" onChangeText={(text) => setName(text)} />
            <FormControl.ErrorMessage>
              {getErrorsByType("name").map((e) => e.message)}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={getErrorsByType("email").length > 0}
          >
            <FormControl.Label
              _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
            >
              Epost
            </FormControl.Label>
            <Input type="email" onChangeText={(text) => setEmail(text)} />
            <FormControl.ErrorMessage>
              {getErrorsByType("email").map((e) => e.message)}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={getErrorsByType("password").length > 0}
          >
            <FormControl.Label
              _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
            >
              Passord
            </FormControl.Label>
            <Input type="password" onChangeText={(text) => setPassword(text)} />
            <FormControl.ErrorMessage>
              {getErrorsByType("password").map((e) => e.message)}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={getErrorsByType("confirmPassword").length > 0}
          >
            <FormControl.Label
              _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
            >
              Bekreft passord
            </FormControl.Label>
            <Input
              type="password"
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <FormControl.ErrorMessage>
              {getErrorsByType("confirmPassword").map((e) => e.message)}
            </FormControl.ErrorMessage>
          </FormControl>
          <VStack space={2} mt={5}>
            <Button
              colorScheme="cyan"
              _text={{ color: "white" }}
              onPress={onRegisterPress}
            >
              Registrer deg
            </Button>
          </VStack>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
}