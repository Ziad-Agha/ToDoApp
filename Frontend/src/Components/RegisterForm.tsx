import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const emailRef = useRef<HTMLInputElement>(null);
const passRef = useRef<HTMLInputElement>(null);
const usernameRef = useRef<HTMLInputElement>(null);
const navigate = useNavigate();

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const email = emailRef.current?.value;
  const pass = passRef.current?.value;
  const username = usernameRef.current?.value;

  const response = await fetch("http://localhost:3001/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, pass }),
  });
  const data = await response.json();
  localStorage.setItem("token", data.token);
  navigate("/home");
}

export default function RegisterForm() {
  return (
    <form onSubmit={handleSubmit}>
      <label>Username</label>
      <input type="text" ref={usernameRef} />
      <label>Email</label>
      <input type="text" ref={emailRef} />
      <label htmlFor="">Password</label>
      <input type="password" ref={passRef} />
      <button type="submit">Log in</button>
    </form>
  );
}
