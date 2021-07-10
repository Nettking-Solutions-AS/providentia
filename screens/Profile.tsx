import * as React from "react";

import { Button, Heading, View } from "native-base";
import { useGlobalState } from "../components/StateManagement/GlobalState";

export default function Profile() {
  const { state, dispatch } = useGlobalState();
  const logout = () => dispatch({ type: "SET_CURRENT_USER", payload: null });
  return (
    <View flex={1} alignItems="center">
      <Heading>{state.currentUser?.name}</Heading>
      <Heading size="md" mt={2} mb={5}>
        {state.currentUser?.email}
      </Heading>
      <Button onPress={logout}>Logg ut</Button>
    </View>
  );
}
