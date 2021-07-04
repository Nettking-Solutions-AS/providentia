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

export default function Login() {
  return (
    <Box flex={1} p={2} w="90%" mx="auto">
      <Heading size="lg" textAlign="center" color="primary.500">
        Providentia
      </Heading>

      <VStack space={2} mt={5}>
        <FormControl>
          <FormControl.Label
            _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
          >
            Epost
          </FormControl.Label>
          <Input />
        </FormControl>
        <FormControl mb={5}>
          <FormControl.Label
            _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
          >
            Passord
          </FormControl.Label>
          <Input type="password" />
        </FormControl>
        <VStack space={2}>
          <Button colorScheme="cyan" _text={{ color: "white" }}>
            Login
          </Button>
        </VStack>
        <HStack justifyContent="center">
          <Text fontSize="sm" color="muted.700" fontWeight={400}>
            Har du ikke bruker?{" "}
          </Text>
          <Link
            _text={{ color: "cyan.500", bold: true, fontSize: "sm" }}
            href="#"
          >
            Registrer deg
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
}
