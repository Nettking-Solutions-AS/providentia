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

export function UserLogin() {
  const [showLogin, setShowLogin] = useState(false);
  return showLogin ? (
    <Login />
  ) : (
    <Registration showLogin={() => setShowLogin(true)} />
  );
}
