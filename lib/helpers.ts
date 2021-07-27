import { User } from "./Types";

// eslint-disable-next-line import/prefer-default-export
export const isAdmin = (user: User | undefined) =>
  user === undefined ||
  user.role === "police" ||
  user.role === "insurer" ||
  user.role === "transportCompany";
