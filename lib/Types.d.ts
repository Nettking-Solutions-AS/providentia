// A common storage for the types used in the app

export type UserRole = "customer" | "insurer" | "police" | "transportCompany";
export type Status =
  | "registered"
  | "missing"
  | "found"
  | "bountyPaid"
  | "readyForShipment"
  | "inTransit";

export type InsuranceCompany =
  | "Klp"
  | "Gjensidige"
  | "If"
  | "Codan"
  | "Frende"
  | "Tryg"
  | "Storebrand"
  | "Annet";

export type ID = string;

export type User = {
  id: ID;
  name: string;
  email: string;
  insuranceCompany: InsuranceCompany;
  role: UserRole;
};

export type Item = {
  id: ID;
  name: string;
  description: string;
  imageIDs: string;
  bounty: number;
  status: Status;
  lostAt?: string;
  lostDate?: string;
  expirationDate: string;
  owners: ID[];
};

export type GlobalState = {
  currentUser?: User;
  items?: Item[];
};

export type DispatchAction =
  | "SET_STATE"
  | "SET_CURRENT_USER"
  | "SET_ITEMS"
  | "ADD_ITEM"
  | "TOGGLE_MISSING";

export type DispatchObject = {
  type: DispatchAction;
  payload: any;
};

export type Error = {
  type: string;
  message: string;
};
