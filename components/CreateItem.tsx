import * as React from "react";
import {
  Text,
  Heading,
  FormControl,
  Input,
  Button,
  HStack,
  VStack,
  Select,
  ScrollView,
} from "native-base";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import { Platform, Image, SafeAreaView, StyleSheet } from "react-native";
import { Error, Item, Status } from "../lib/Types";
import { useGlobalState } from "./StateManagement/GlobalState";
import { validateCreateItem } from "../lib/validation";
import firebase from "../firebase/config";
import QRScanner from "./QR/QRScanner";

export default function CreateItem({
  initialItem,
  displayItemOverview,
}: {
  initialItem: Item;
  displayItemOverview: () => void;
}) {
  const [scanQR, setScanQR] = useState(false);
  const [id, setId] = useState(initialItem.id ?? "");
  const [name, setName] = useState(initialItem.name ?? "");
  const [description, setDescription] = useState(initialItem.description ?? "");
  const [images, setImages] = useState(initialItem.imageIDs ?? []);
  const [bounty, setBounty] = useState<number | "">(initialItem.bounty ?? "");
  const [status, setStatus] = useState<Status>(initialItem.status ?? "");
  const [lostAt, setLostAt] = useState(initialItem.lostAt ?? "");
  const [lostDate, setLostDate] = useState(initialItem.lostDate ?? "");
  const [expirationDate, setExpirationDate] = useState(
    initialItem.expirationDate ?? ""
  );
  const [owners, setOwners] = useState(initialItem.owners ?? []);
  const [errors, setErrors] = useState<Error[]>([]);

  const { dispatch } = useGlobalState();

  const resetForm = () => {
    setId("");
    setName("");
    setDescription("");
    setImages([]);
    setBounty("");
    setStatus("registered");
    setLostAt("");
    setLostDate("");
    setExpirationDate("");
    setOwners([]);
    setErrors([]);
  };

  const getErrorsByType = (type: string) =>
    errors.filter((e) => e.type === type);

  const onRegister = async () => {
    const validationErrorsAddItem = validateCreateItem(
      name,
      description,
      images,
      bounty as number,
      lostAt as string,
      lostDate as string,
      expirationDate,
      owners,
      status
    );

    // TODO add item to firebase
    // TODO: Backend validation (add ID after creating in backend)
    // TODO: validate that there is an ID (frontend)

    setErrors(validationErrorsAddItem);
    if (validationErrorsAddItem.length === 0) {
      const data = {
        name,
        description,
        imageIDs: images,
        bounty,
        lostAt,
        lostDate,
        expirationDate,
        owners,
        status,
      };
      const itemRef = firebase.firestore().collection("items");
      itemRef
        .doc(initialItem.id)
        .set(data)
        .catch((error) => {
          // eslint-disable-next-line no-alert
          alert(error);
        })
        .then(() => {
          dispatch({
            type: "ADD_ITEM",
            payload: {
              id,
              name,
              description,
              imageIDs: images,
              bounty,
              lostAt,
              lostDate,
              expirationDate,
              owners,
              status,
            },
          });
        });
      resetForm();
      displayItemOverview();
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status: permission } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission !== "granted") {
          // eslint-disable-next-line no-alert
          alert(
            "Beklager, vi trenger tilgang til kamerarullen for å få dette til å fungere"
          );
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImages(result.uri);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {scanQR && (
        <QRScanner
          createItem
          setItem={(item: Item) => {
            setId(item.id);
            setScanQR(false);
          }}
        />
      )}
      {!scanQR && (
        <ScrollView flex={1} p={2} w="90%" mx="auto">
          <Heading size="lg" textAlign="center" color="primary.500">
            Ny gjenstand
          </Heading>

          <VStack space={2} mt={5}>
            <FormControl
              isRequired
              isInvalid={getErrorsByType("name").length > 0}
            >
              <FormControl.Label
                _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
              >
                Gjenstandens navn
              </FormControl.Label>
              <Input
                type="text"
                value={name}
                onChangeText={(text: string) => setName(text)}
              />
              <FormControl.ErrorMessage>
                {getErrorsByType("name").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={getErrorsByType("description").length > 0}
              mb={5}
            >
              <FormControl.Label
                _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
              >
                Beskrivelse
              </FormControl.Label>
              <Input
                type="text"
                value={description}
                onChangeText={(text: string) => setDescription(text)}
              />
              <FormControl.ErrorMessage>
                {getErrorsByType("description").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired mb={5}>
              <FormControl.Label
                _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
              >
                Bilder
              </FormControl.Label>
              <Button
                colorScheme="cyan"
                _text={{ color: "white" }}
                onPress={pickImage}
              >
                Pick an image from camera roll
              </Button>
              {images?.length > 0 && (
                <Image source={{ uri: images[0] }} width={200} height={200} />
              )}
            </FormControl>
            <FormControl
              isRequired
              isInvalid={getErrorsByType("bounty").length > 0}
              mb={5}
            >
              <FormControl.Label
                _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
              >
                Utlovet dusør ved tap
              </FormControl.Label>
              <Input
                type="number"
                value={bounty}
                onChangeText={(text: string) => setBounty(Number(text))}
              />
              <FormControl.ErrorMessage>
                {getErrorsByType("bounty").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={getErrorsByType("status").length > 0}
              mb={5}
            >
              <FormControl.Label
                _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
              >
                Status
              </FormControl.Label>
              <Select
                selectedValue={status}
                minWidth={200}
                accessibilityLabel="Velg gjenstandens status"
                placeholder="Velg gjenstandens status"
                onValueChange={(itemValue) => setStatus(itemValue as Status)}
              >
                <Select.Item label="Registrert" value="registered" />
                <Select.Item label="Mistet" value="missing" />
                <Select.Item label="Funnet" value="found" />
                <Select.Item label="Dusør innbetalt" value="bountyPaid" />
                <Select.Item
                  label="Klar for sending"
                  value="readyForShipment"
                />
                <Select.Item label="Under transport" value="inTransit" />
              </Select>

              <FormControl.ErrorMessage>
                {getErrorsByType("status").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>
            {status === "missing" && (
              <>
                <FormControl
                  isRequired
                  isInvalid={getErrorsByType("lostAt").length > 0}
                  mb={5}
                >
                  <FormControl.Label
                    _text={{
                      color: "muted.700",
                      fontSize: "sm",
                      fontWeight: 600,
                    }}
                  >
                    Hvor ble gjenstanden mistet?
                  </FormControl.Label>
                  <Input
                    type="text"
                    value={lostAt}
                    onChangeText={(text: string) => setLostAt(text)}
                  />
                  <FormControl.ErrorMessage>
                    {getErrorsByType("lostAt").map((e) => e.message)}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={getErrorsByType("lostDate").length > 0}
                  mb={5}
                >
                  <FormControl.Label
                    _text={{
                      color: "muted.700",
                      fontSize: "sm",
                      fontWeight: 600,
                    }}
                  >
                    Når ble gjenstanden mistet?
                  </FormControl.Label>
                  <Input
                    type="text"
                    value={lostDate}
                    onChangeText={(text: string) => setLostDate(text)}
                  />
                  <FormControl.ErrorMessage>
                    {getErrorsByType("lostDate").map((e) => e.message)}
                  </FormControl.ErrorMessage>
                </FormControl>
              </>
            )}
            <FormControl
              isRequired
              isInvalid={getErrorsByType("expirationDate").length > 0}
              mb={5}
            >
              <FormControl.Label
                _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
              >
                Varighet
              </FormControl.Label>
              <Input
                type="text"
                value={expirationDate}
                onChangeText={(text: string) => setExpirationDate(text)}
              />
              <FormControl.ErrorMessage>
                {getErrorsByType("expirationDate").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={getErrorsByType("email").length > 0}>
              <FormControl.Label>Brukere med tilgang</FormControl.Label>
              <Input
                type="email"
                value={owners}
                onChangeText={(text: string) => setOwners([text])}
              />
              <FormControl.ErrorMessage>
                {getErrorsByType("email").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>
            <VStack space={2} alignItems="center">
              <Text fontSize="xl">Knytt til ID</Text>
              <HStack mt={15} alignItems="center">
                <Button onPress={() => setScanQR(true)} mr={15}>
                  QR
                </Button>
                <Text mr={15}>Eller</Text>
                <Button>NFC</Button>
              </HStack>

              <VStack space={2} mt={15}>
                <Button
                  colorScheme="cyan"
                  _text={{ color: "white" }}
                  onPress={() => onRegister()}
                  mb={25}
                >
                  Opprett gjenstand
                </Button>
              </VStack>
            </VStack>
          </VStack>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
