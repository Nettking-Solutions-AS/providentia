import { Error } from "./Types";
import { users } from "./fixtures";

const validEmail = (em: string) =>
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    em
  );

// eslint-disable-next-line import/prefer-default-export
export const validateLogin = (email: string, password: string): Error[] => {
  const validationErrors: Error[] = [];
  if (email.length === 0) {
    validationErrors.push({
      type: "email",
      message: "Du må skrive inn epost-adresse!",
    });
  } else if (!validEmail(email)) {
    validationErrors.push({
      type: "email",
      message: "Ugyldig epostadresse!",
    });
  } else if (!users.some((user) => user.email === email)) {
    validationErrors.push({
      type: "email",
      message: "Det finnes ingen bruker med denne epost-adressen!",
    });
  }

  if (password.length === 0) {
    validationErrors.push({
      type: "password",
      message: "Du må skrive inn passord!",
    });
  }

  return validationErrors;
};
