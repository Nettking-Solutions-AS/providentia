import { Error, InsuranceCompany, Status } from "./Types";

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

export const validateInsurance = (insurance: InsuranceCompany): Error[] => {
  const validationErrors: Error[] = [];
  if (insurance.length === 0) {
    validationErrors.push({
      type: "insuranceCompany",
      message: "Du må velge et forsikringsselskap!",
    });
  }
  return validationErrors;
};

const validDate = (da: string) =>
  /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/.test(da);

export const validateCreateItem = (
  id: string,
  name: string,
  description: string,
  images: string,
  bounty: number,
  lostAt: string | undefined,
  lostDate: string | undefined,
  expirationDate: string,
  owners: string[],
  status: Status
): Error[] => {
  const validationErrorsAddItem: Error[] = [];
  if (id.length === 0) {
    validationErrorsAddItem.push({
      type: "id",
      message: "Du må registrere en unik ID",
    });
  }

  if (name.length === 0) {
    validationErrorsAddItem.push({
      type: "name",
      message: "Du må skrive inn navn!",
    });
  }

  if (description.length === 0) {
    validationErrorsAddItem.push({
      type: "description",
      message: "Du må skrive inn en beskrivelse!",
    });
  }

  if (images.length === 0) {
    validationErrorsAddItem.push({
      type: "images",
      message: "Du må legge til minst ett bilde!",
    });
  }

  if (bounty <= 0) {
    validationErrorsAddItem.push({
      type: "bounty",
      message: "Du må fylle ut belønning!",
    });
  }

  if (status === "missing") {
    if (lostAt.length === 0) {
      validationErrorsAddItem.push({
        type: "lostAt",
        message: "Du må skrive inn hvor du mistet gjenstanden!",
      });
    }

    if (lostDate.length === 0) {
      validationErrorsAddItem.push({
        type: "lostDate",
        message: "Du må skrive inn dato for når du mistet gjenstanden!",
      });
    } else if (!validDate(lostDate)) {
      validationErrorsAddItem.push({
        type: "lostDate",
        message: "Ugyldig dato!",
      });
    }
  }

  if (expirationDate.length === 0) {
    validationErrorsAddItem.push({
      type: "expirationDate",
      message: "Du må skrive inn en utløpsdato!",
    });
  } else if (!validDate(expirationDate)) {
    validationErrorsAddItem.push({
      type: "expirationDate",
      message: "Ugyldig dato!",
    });
  }
  return validationErrorsAddItem;
};
