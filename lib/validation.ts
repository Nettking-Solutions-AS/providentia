import { Error } from "./Types";

const validEmail = (em: string) =>
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    em
  );

export const validateEmail = (email: string): Error[] => {
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
  }

  return validationErrors;
};

export const validatePassword = (
  password: string,
  confirmPassword?: string
): Error[] => {
  const validationErrors: Error[] = [];
  if (password.length === 0) {
    validationErrors.push({
      type: "password",
      message: "Du må skrive inn et passord!",
    });
  } else if (password.length < 6) {
    validationErrors.push({
      type: "password",
      message: "Passordet må være lengre enn 6 bokstaver!",
    });
  }

  if (confirmPassword !== undefined) {
    if (confirmPassword.length === 0) {
      validationErrors.push({
        type: "confirmPassword",
        message: "Du må skrive inn et passord!",
      });
    } else if (confirmPassword.length < 6) {
      validationErrors.push({
        type: "confirmPassword",
        message: "Passordet må være lengre enn 6 bokstaver!",
      });
    } else if (password !== confirmPassword) {
      validationErrors.push({
        type: "confirmPassword",
        message: "Passordene må være like!",
      });
    }
  }
  return validationErrors;
};

export const validateName = (name: string): Error[] => {
  const validationErrors: Error[] = [];
  if (name.length === 0) {
    validationErrors.push({
      type: "name",
      message: "Du må skrive inn navn!",
    });
  }
  return validationErrors;
};
