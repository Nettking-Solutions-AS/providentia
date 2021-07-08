import React from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  Button,
  IconButton,
  Icon,
  HStack,
  Tooltip,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { Item } from "../../lib/Types";
import { useGlobalState } from "../StateManagement/GlobalState";

export default function ItemCard({ item }: { item: Item }) {
  const { dispatch } = useGlobalState();
  const updateMissingStatus = () => {
    dispatch({ type: "TOGGLE_MISSING", payload: { id: item.id } });
  };

  return (
    <Box
      bg="white"
      shadow={2}
      rounded="lg"
      maxWidth="90%"
      width="75%"
      padding={5}
      paddingTop={2}
      mb={5}
    >
      <HStack alignItems="center" justifyContent="space-between">
        <Heading size="md">
          {item.name} ({item.owners})
        </Heading>
        <IconButton icon={<Icon size="sm" as={<AntDesign name="edit" />} />} />
      </HStack>
      <Image
        source={{
          uri: "https://sample-example.nativebase.io/static/media/dawki-river.ebbf5434.png",
        }}
        alt="image base"
        resizeMode="cover"
        height={150}
        roundedTop="md"
      />
      <Text color="gray.700" mt={5} mb={5}>
        {item.description}
      </Text>
      <Tooltip
        label="Du kan skrive hvor og når du mistet gjenstanden ved å trykke på rediger"
        openDelay={200}
      >
        <Button onPress={updateMissingStatus}>
          {item.status === "missing" ? "Meld funnet" : "Meld savnet"}
        </Button>
      </Tooltip>
    </Box>
  );
}
