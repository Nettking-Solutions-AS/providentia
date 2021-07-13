import React, { useState } from "react";
import Login from "../components/Login";
import Registration from "../components/Registration";

export default function UserRegistration() {
  const [showRegistration, setShowRegistration] = useState(false);
  return showRegistration ? (
    <Registration />
  ) : (
    <Login showRegistration={() => setShowRegistration(true)} />
  );
}
