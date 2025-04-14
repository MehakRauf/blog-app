import React from "react";
import { login, logout, loggedInUserDisplayName } from "../Services/authService";

export function Signin() {
  return <button onClick={login}>Sign In</button>;
}

export function SignOut() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <div>
        Hello, {loggedInUserDisplayName()}
        <br />
        <button onClick={logout}>Sign Out</button>
      </div>
    </div>
  );
}
