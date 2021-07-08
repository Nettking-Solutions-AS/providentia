import * as React from "react";

import { Heading, View } from "native-base";
import { useGlobalState } from "../components/StateManagement/GlobalState";
import ItemCard from "../components/Item/ItemCard";

export default function ItemOverview() {
  const { state } = useGlobalState();

  return (
    <View flex={1} alignItems="center" overflow="scroll">
      <Heading mb={5}>Mine gjenstander</Heading>
      {state.items?.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </View>
  );
}
