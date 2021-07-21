import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "./Types";

const PUSH_KEY = "Providentia_push_token";

// eslint-disable-next-line import/prefer-default-export
export const isAdmin = (user: User | undefined) =>
  user === undefined ||
  user.role === "police" ||
  user.role === "insurer" ||
  user.role === "transportCompany";

const storeString = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(
      `LAGRING: Feil under lagring av string med nøkkel '${key}' til async lagring.`,
      value,
      e
    );
  }
};

// eslint-disable-next-line consistent-return
const readString = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
    throw Error("Verdien er null");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(
      `LAGRING: Feil under lesing av string med nøkkel '${key}' fra async lagring.`,
      e
    );
  }
};

export const storePushToken = async (value: string) =>
  storeString(PUSH_KEY, value);

export const readPushToken = async () => readString(PUSH_KEY);
