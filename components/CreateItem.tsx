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
  Badge,
  Icon,
  IconButton,
} from "native-base";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import { Platform, Image, SafeAreaView, StyleSheet } from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Error, Item, Status } from "../lib/Types";
import { useGlobalState } from "./StateManagement/GlobalState";
import { validateCreateItem, validateEmail } from "../lib/validation";

import QRScanner from "./QR/QRScanner";
import firebase from "../firebase/config";
import { isAdmin } from "../lib/helpers";

export default function CreateItem({
  initialItem,
  displayItemOverview,
}: {
  initialItem: Item;
  displayItemOverview: () => void;
}) {
  const { state, dispatch } = useGlobalState();

  const [scanQR, setScanQR] = useState(false);
  const [id, setId] = useState(initialItem.id ?? "");
  const [name, setName] = useState(initialItem.name ?? "");
  const [description, setDescription] = useState(initialItem.description ?? "");
  const [images, setImages] = useState(initialItem.imageIDs ?? "");
  const [bounty, setBounty] = useState<number | "">(initialItem.bounty ?? "");
  const [status, setStatus] = useState<Status>(
    initialItem.status ?? "registered"
  );
  const [lostAt, setLostAt] = useState(initialItem.lostAt ?? "");
  const [lostDate, setLostDate] = useState(initialItem.lostDate ?? "");
  const [expirationDate, setExpirationDate] = useState(
    initialItem.expirationDate ??
      new Date(
        new Date().getFullYear() + 3,
        new Date().getMonth() + 1,
        new Date().getDate()
      )
  );
  const [inputOwnerEmail, setInputOwnerEmail] = useState("");
  const [owners, setOwners] = useState(
    initialItem.owners?.length > 0
      ? initialItem.owners
      : [state.currentUser?.id ?? ""]
  );
  const [ownerEmails, setOwnerEmails] = useState<string[]>([]);
  const [visibleFor, setVisibleFor] = useState<string[]>(
    initialItem.visibleFor ?? [state.currentUser?.insuranceCompany]
  );
  const [inputVisibleFor, setInputVisbleFor] = useState("");

  const [, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || expirationDate;
    setShow(Platform.OS === "ios");
    setExpirationDate(currentDate);
  };

  const showMode = (currentMode: React.SetStateAction<string>) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const [errors, setErrors] = useState<Error[]>([]);

  const resetForm = () => {
    setId("");
    setName("");
    setDescription("");
    setImages("");
    setBounty("");
    setStatus("registered");
    setLostAt("");
    setLostDate("");
    setExpirationDate(
      new Date(
        new Date().getFullYear() + 3,
        new Date().getMonth() + 1,
        new Date().getDate()
      )
    );
    setOwners([state.currentUser?.id ?? ""]);
    setOwnerEmails([]);
    setInputOwnerEmail("");
    setVisibleFor([state.currentUser?.insuranceCompany ?? ""]);
    setInputVisbleFor("");
    setErrors([]);
  };

  const updateForm = () => {
    setId(initialItem.id);
    setName(initialItem.name);
    setDescription(initialItem.description);
    setImages(initialItem.imageIDs);
    setBounty(initialItem.bounty);
    setStatus(initialItem.status);
    setLostAt(initialItem.lostAt ?? "");
    setLostDate(initialItem.lostDate ?? "");
    setExpirationDate(initialItem.expirationDate);
    setOwners(initialItem.owners);
    setInputOwnerEmail("");
    setVisibleFor(initialItem.visibleFor);
    setInputVisbleFor("");
    setErrors([]);
  };

  const getErrorsByType = (type: string) =>
    errors.filter((e) => e.type === type);

  const onRegister = async () => {
    const validationErrorsAddItem = validateCreateItem(
      id,
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

    setErrors(validationErrorsAddItem);
    if (validationErrorsAddItem.length === 0) {
      firebase
        .firestore()
        .collection("items")
        .doc(id)
        .set({
          name,
          description,
          imageIDs: images,
          bounty,
          lostAt,
          lostDate,
          expirationDate,
          owners,
          status,
          visibleFor,
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
              visibleFor,
            },
          });
          resetForm();
          displayItemOverview();
        })
        .catch((error) => {
          // eslint-disable-next-line no-alert
          alert(error);
        });
    }
  };

  const getOwnerEmails = async (newOwners: string[] = owners) => {
    const fetchedOwnerEmails = await Promise.all(
      newOwners.map((ownerID) =>
        firebase
          .firestore()
          .collection("users")
          .doc(ownerID)
          .get()
          .then((doc) => doc.data()?.email)
      )
    );
    setOwnerEmails(fetchedOwnerEmails);
  };

  useEffect(() => {
    if (initialItem.name) {
      updateForm();
    } else {
      resetForm();
    }
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
      getOwnerEmails();
    })();
  }, [initialItem]);

  async function uploadImageAsync(uri: string) {
    const blob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function onload() {
        resolve(xhr.response);
      };
      xhr.onerror = function error(e) {
        // eslint-disable-next-line no-alert
        alert(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const metadata = {
      contentType: "image/jpeg",
    };

    const namet = uuidv4();
    setImages(namet);
    const ref = firebase.storage().ref().child(namet);
    const snapshot = await ref.put(blob, metadata);
    return snapshot.ref.getDownloadURL();
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      await uploadImageAsync(result.uri);
    }
  };

  const addOwner = () => {
    const validationErrors = validateEmail(inputOwnerEmail);
    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      firebase
        .firestore()
        .collection("users")
        .where("email", "==", inputOwnerEmail)
        .get()
        .then((querySnapshot) => {
          let userID;
          querySnapshot.forEach((doc) => {
            userID = doc.id;
          });
          if (userID) {
            setInputOwnerEmail("");
            const newOwners = [...new Set([...owners, userID])];
            setOwners(newOwners);
            getOwnerEmails(newOwners);
          } else {
            setErrors([
              {
                type: "email",
                message: "Fant ingen bruker med denne epost-adressen!",
              },
            ]);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-alert
          alert(error);
        });
    }
  };

  const addGroup = () => {
    const newGroups = [...new Set([...visibleFor, inputVisibleFor])];
    setVisibleFor(newGroups);
    setInputVisbleFor("");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  const labelToString = (label: string) => {
    switch (label) {
      case "registered":
        return "Registrert";
      case "missing":
        return "Mistet";
      case "found":
        return "Funnet";
      case "bountyPaid":
        return "Dusør Innbetalt";
      case "readyForShipment":
        return "Klar for sending";
      case "inTransit":
        return "Under transport";
      default:
        return "Registrert";
    }
  };

  const SelectElements = () => (
    <>
      {status !== "registered" && (
        <Select.Item label="Registrert" value="registered" />
      )}
      {status !== "missing" && <Select.Item label="Mistet" value="missing" />}
      {status !== "found" && <Select.Item label="Funnet" value="found" />}

      {status !== "bountyPaid" && isAdmin(state.currentUser) && (
        <Select.Item label="Dusør innbetalt" value="bountyPaid" />
      )}

      {status !== "readyForShipment" && isAdmin(state.currentUser) && (
        <Select.Item label="Klar for sending" value="readyForShipment" />
      )}

      {status !== "inTransit" && isAdmin(state.currentUser) && (
        <Select.Item label="Under transport" value="inTransit" />
      )}
    </>
  );

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
          <Heading size="2xl" textAlign="center" color="primary.500">
            Ny gjenstand
          </Heading>

          <VStack space={2} mt={5}>
            <FormControl
              isRequired
              isInvalid={getErrorsByType("name").length > 0}
            >
              <FormControl.Label
                _text={{
                  color: "primary.150",
                  fontSize: "lg",
                  fontWeight: 500,
                }}
              >
                Gjenstandens navn
              </FormControl.Label>
              <Input
                type="text"
                value={name}
                placeholder="Feks. Nøkkelknippe"
                onChangeText={(text: string) => setName(text)}
              />
              <FormControl.ErrorMessage
                _text={{ color: "primary.250", fontSize: "md" }}
              >
                {getErrorsByType("name").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={getErrorsByType("description").length > 0}
              mb={5}
            >
              <FormControl.Label
                _text={{
                  color: "primary.150",
                  fontSize: "lg",
                  fontWeight: 500,
                }}
              >
                Beskrivelse
              </FormControl.Label>
              <Input
                type="text"
                value={description}
                placeholder="Et nydelig nøkkelknippe"
                onChangeText={(text: string) => setDescription(text)}
              />
              <FormControl.ErrorMessage
                _text={{ color: "primary.250", fontSize: "md" }}
              >
                {getErrorsByType("description").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired mb={5}>
              <FormControl.Label
                _text={{
                  color: "primary.150",
                  fontSize: "lg",
                  fontWeight: 500,
                }}
              >
                Bilder
              </FormControl.Label>
              <Button
                _text={{ color: "primary.200" }}
                onPress={pickImage}
                mb={15}
              >
                Velg et bilde fra kamerarullen
              </Button>
              {images?.length > 0 && (
                <Image source={{ uri: images }} width={200} height={200} />
              )}
            </FormControl>
            <FormControl
              isRequired
              isInvalid={getErrorsByType("bounty").length > 0}
              mb={5}
            >
              <FormControl.Label
                _text={{
                  color: "primary.150",
                  fontSize: "lg",
                  fontWeight: 500,
                }}
              >
                Utlovet dusør ved tap
              </FormControl.Label>
              <Input
                type="number"
                keyboardType="numeric"
                placeholder="200 kr"
                onChangeText={(text: string) => setBounty(Number(text))}
                value={bounty?.toString()}
              />
              <FormControl.ErrorMessage
                _text={{ color: "primary.250", fontSize: "md" }}
              >
                {getErrorsByType("bounty").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={getErrorsByType("status").length > 0}
              mb={5}
            >
              <FormControl.Label
                _text={{
                  color: "primary.150",
                  fontSize: "lg",
                  fontWeight: 500,
                }}
              >
                Status
              </FormControl.Label>
              <Select
                isDisabled={
                  state.currentUser?.role === "customer" &&
                  (status === "bountyPaid" ||
                    status === "readyForShipment" ||
                    status === "inTransit")
                }
                selectedValue={status}
                minWidth={200}
                accessibilityLabel="Velg gjenstandens status"
                placeholder="Velg gjenstandens status"
                onValueChange={(itemValue) => setStatus(itemValue as Status)}
              >
                <Select.Item label={labelToString(status)} value={status} />
                {SelectElements()}
              </Select>

              <FormControl.ErrorMessage
                _text={{ color: "primary.250", fontSize: "md" }}
              >
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
                      color: "primary.150",
                      fontSize: "lg",
                      fontWeight: 500,
                    }}
                  >
                    Hvor ble gjenstanden mistet?
                  </FormControl.Label>
                  <Input
                    type="text"
                    value={lostAt}
                    placeholder="Feks. Haldensgata 24, 1768 Halden"
                    onChangeText={(text: string) => setLostAt(text)}
                  />
                  <FormControl.ErrorMessage
                    _text={{ color: "primary.250", fontSize: "md" }}
                  >
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
                      color: "primary.150",
                      fontSize: "lg",
                      fontWeight: 500,
                    }}
                  >
                    Når ble gjenstanden mistet?
                  </FormControl.Label>
                  <Input
                    type="text"
                    value={lostDate}
                    placeholder="20.01.2021"
                    onChangeText={(text: string) => setLostDate(text)}
                  />
                  <FormControl.ErrorMessage
                    _text={{ color: "primary.250", fontSize: "md" }}
                  >
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
                _text={{
                  color: "primary.150",
                  fontSize: "lg",
                  fontWeight: 500,
                }}
              >
                Varighet
              </FormControl.Label>
              <Button onPress={showDatepicker} mb={5}>
                Sett utløpsdato!
              </Button>
              {show && (
                <DateTimePicker
                  testID="datetimepicker"
                  value={expirationDate}
                  display="default"
                  onChange={onChange}
                />
              )}
              <FormControl.ErrorMessage
                _text={{ color: "primary.250", fontSize: "md" }}
              >
                {getErrorsByType("expirationDate").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={getErrorsByType("email").length > 0}>
              <FormControl.Label
                _text={{
                  color: "primary.150",
                  fontSize: "lg",
                  fontWeight: 500,
                }}
              >
                Brukere med tilgang
              </FormControl.Label>
              <HStack>
                <Input
                  type="email"
                  width="90%"
                  value={inputOwnerEmail}
                  onChangeText={(text: string) => setInputOwnerEmail(text)}
                />
                <IconButton
                  onPress={() => addOwner()}
                  icon={<Icon size="sm" as={<AntDesign name="plus" />} />}
                />
              </HStack>
              {ownerEmails.map((email) => (
                <Text key={email} mt={3}>
                  {email}
                </Text>
              ))}
              <FormControl.ErrorMessage
                _text={{ color: "primary.250", fontSize: "md" }}
              >
                {getErrorsByType("email").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>

            {state.currentUser?.role !== "customer" && (
              <FormControl>
                <FormControl.Label
                  _text={{
                    color: "primary.150",
                    fontSize: "lg",
                    fontWeight: 500,
                  }}
                >
                  Grupper med tilgang
                </FormControl.Label>
                <HStack>
                  <Input
                    type="text"
                    value={inputVisibleFor}
                    width="90%"
                    onChangeText={(text: string) => setInputVisbleFor(text)}
                  />
                  <IconButton
                    onPress={() => addGroup()}
                    icon={<Icon size="sm" as={<AntDesign name="plus" />} />}
                  />
                </HStack>
                {visibleFor.map((group) => (
                  <Text key={group} mt={3}>
                    {group}
                  </Text>
                ))}
              </FormControl>
            )}
            <VStack space={2} alignItems="center">
              <FormControl
                alignItems="center"
                isRequired
                isInvalid={getErrorsByType("id").length > 0}
              >
                <FormControl.Label
                  _text={{
                    color: "primary.150",
                    fontSize: "lg",
                    fontWeight: 500,
                  }}
                >
                  Knytt til ID
                </FormControl.Label>
                {id && (
                  <Badge colorScheme="success" padding={2}>
                    {id}
                  </Badge>
                )}
                <HStack mt={15} alignItems="center">
                  <Button
                    onPress={() => setScanQR(true)}
                    size="md"
                    _text={{ color: "primary.200" }}
                    mr={15}
                  >
                    QR
                  </Button>
                </HStack>
                <FormControl.ErrorMessage>
                  {getErrorsByType("id").map((e) => e.message)}
                </FormControl.ErrorMessage>
              </FormControl>
              <VStack space={2} mt={15}>
                <Button
                  size="md"
                  _text={{ color: "primary.200" }}
                  onPress={() => onRegister()}
                  mb={200}
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
