import * as React from "react";

import { Button, Heading, HStack, View } from "native-base";
import { useGlobalState } from "../components/StateManagement/GlobalState";
import ItemCard from "../components/Item/ItemCard";
import { isAdmin } from "../lib/helpers";

export default function ItemOverview() {
  const { state } = useGlobalState();

  return (
    <View flex={1} alignItems="center" overflow="scroll">
      <Heading mb={5}>
        {isAdmin(state.currentUser) ? "Alle gjenstander" : "Mine gjenstander"}
      </Heading>
      {state.items?.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
      {isAdmin(state.currentUser) && (
        <>
          <Heading>Finn gjenstand</Heading>
          <HStack mt={2}>
            <Button mr={5}>QR</Button>
            <Button>NFC</Button>
          </HStack>
        </>
      )}
    </View>
  );
}
