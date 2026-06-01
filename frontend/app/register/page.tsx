"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    const response = await fetch(
      "http://127.0.0.1:8000/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    alert(data.message);
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl mb-5">Register</h1>

      <input
        className="border p-2 mb-3 block"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="border p-2 mb-3 block"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  );
}