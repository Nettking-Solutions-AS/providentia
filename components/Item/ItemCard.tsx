import React, { useEffect, useState } from "react";
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
import firebase from "../../firebase/config";
import { isAdmin } from "../../lib/helpers";

export default function ItemCard({
  item,
  editItem,
}: {
  item: Item;
  // eslint-disable-next-line no-unused-vars
  editItem: (initialItem: Item) => void;
}) {
  const { state, dispatch } = useGlobalState();
  const [owners, setOwners] = useState<string[]>();
  const [imageURL, setImageURL] = useState<string>();
  const updateMissingStatus = () => {
    firebase
      .firestore()
      .collection("items")
      .doc(item.id)
      .update({
        status: item.status === "missing" ? "found" : "missing",
      })
      .then(() => {
        dispatch({ type: "TOGGLE_MISSING", payload: { id: item.id } });
      });
  };

  useEffect(() => {
    async function fetchOwnerNames() {
      const userRequests = item.owners.map((owner) =>
        firebase.firestore().collection("users").doc(owner).get()
      );
      const users = await Promise.all(userRequests);

      setOwners(users.map((user) => user.data()?.name));
    }
    async function fetchImageURL() {
      const url = await firebase.storage().ref(item.imageIDs).getDownloadURL();
      setImageURL(url);
    }

    if (item.imageIDs.length > 0) {
      fetchImageURL();
    }
    if (isAdmin(state.currentUser)) {
      fetchOwnerNames();
    } else {
      setOwners([state.currentUser?.name as string]);
    }
  }, []);

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
          {item.name} ({owners})
        </Heading>
        <IconButton
          icon={<Icon size="sm" as={<AntDesign name="edit" />} />}
          onPress={() => editItem(item)}
        />
      </HStack>
      <Image
        source={{
          uri: imageURL,
        }}
        alt="Denne gjenstanden har ingen bilder"
        resizeMode="contain"
        height={150}
        roundedTop="md"
      />
      <Text color="primary.150" mt={5} mb={5}>
        {item.description}
      </Text>
      <Tooltip
        label="Du kan skrive hvor og når du mistet gjenstanden ved å trykke på rediger"
        openDelay={200}
      >
        <Button
          size="md"
          colorScheme="green"
          _text={{ color: "primary.150" }}
          onPress={updateMissingStatus}
        >
          {item.status === "missing" ? "Meld funnet" : "Meld savnet"}
        </Button>
      </Tooltip>
    </Box>
  );
}
