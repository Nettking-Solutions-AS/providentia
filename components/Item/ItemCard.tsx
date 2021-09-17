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
import sendPushNotification from "../Notifications/CreatePushNotification";

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
  const [expoPushToken, setExpoPushToken] = useState<any>();
  const updateMissingStatus = () => {
    firebase
      .firestore()
      .collection("items")
      .doc(item.id)
      .update({
        status: item.status === "missing" ? "found" : "missing",
      })
      .then(async () => {
        dispatch({ type: "TOGGLE_MISSING", payload: { id: item.id } });

        if (item.status === "missing") {
          await sendPushNotification(expoPushToken);
        }
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

    async function fetchExpoPushToken() {
      const itemOwnerId = item.owners.map((owner) =>
        firebase.firestore().collection("users").doc(owner).get()
      );
      const userID = await Promise.all(itemOwnerId);

      setExpoPushToken(userID.map((user) => user.data()?.expoPushToken));
    }

    async function fetchImageURL() {
      const url = await firebase.storage().ref(item.imageIDs).getDownloadURL();
      setImageURL(url);
    }

    fetchOwnerNames();
    fetchExpoPushToken();
    if (item.imageIDs.length > 0) {
      fetchImageURL();
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
      width="85%"
      padding={5}
      paddingTop={2}
      mb={5}
    >
      <HStack alignItems="center" justifyContent="space-between">
        <Heading size="md" mt={2} mb={2}>
          {item.name} ({owners?.join(", ")})
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
        height={300}
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
          _text={{ color: "primary.200" }}
          onPress={updateMissingStatus}
        >
          {item.status === "missing" ? "Meld funnet" : "Meld savnet"}
        </Button>
      </Tooltip>
    </Box>
  );
}
