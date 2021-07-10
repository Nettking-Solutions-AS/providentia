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
import { useGlobalState } from "./StateManagement/GlobalState";
import { fetchUserData } from "../lib/requests";
import { Error } from "../lib/Types";
import { validateLogin } from "../lib/validation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);

  const { dispatch } = useGlobalState();

  const getErrorsByType = (type: string) =>
    errors.filter((e) => e.type === type);

  const login = async () => {
    const validationErrors = validateLogin(email, password);

    // TODO: Backend validation

    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      const { user, items } = await fetchUserData(email);
      dispatch({ type: "SET_CURRENT_USER", payload: user });
      dispatch({ type: "SET_ITEMS", payload: items });
    }
  };

  return (
    <Box flex={1} p={2} w="90%" mx="auto">
      <Heading size="lg" textAlign="center" color="primary.500">
        Providentia
      </Heading>

      <VStack space={2} mt={5}>
        <FormControl isRequired isInvalid={getErrorsByType("email").length > 0}>
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
          mb={5}
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
        <VStack space={2}>
          <Button colorScheme="cyan" _text={{ color: "white" }} onPress={login}>
            Login
          </Button>
        </VStack>
        <HStack justifyContent="center">
          <Text fontSize="sm" color="muted.700" fontWeight={400}>
            Har du ikke bruker?{" "}
          </Text>
          <Link _text={{ color: "cyan.500", bold: true, fontSize: "sm" }}>
            Registrer deg
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
}
