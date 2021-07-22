import React, { useState } from "react";
import Login from "../components/Login";
import Registration from "../components/Registration";

export default function UserLogin() {
  const [showLogin, setShowLogin] = useState(false);
  return showLogin ? (
    <Login />
  ) : (
    <Registration showLogin={() => setShowLogin(true)} />
  );
}
