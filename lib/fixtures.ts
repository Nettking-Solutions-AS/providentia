import { Item, User } from "./Types";

export const users: User[] = [
  {
    id: "0",
    name: "Ola",
    email: "ola@nordmann.no",
    role: "customer",
  },
  {
    id: "1",
    name: "Admin",
    email: "admin@adminsen.no",
    role: "police",
  },
];
export const items: Item[] = [
  {
    id: "0",
    name: "Mitt nøkkelknippe",
    description: "Et kult nøkkelknippe",
    imageIDs: [],
    bounty: 200,
    status: "ok",
    expirationDate: "2021-01-01",
    owners: ["0"],
  },
  {
    id: "1",
    name: "Sykkel",
    description: "En ganske nais sykkel",
    imageIDs: [],
    bounty: 900,
    status: "stolen",
    lostDate: "2021-07-07",
    lostAt: "Treningssenteret",
    expirationDate: "2022-01-01",
    owners: ["0"],
  },
];
