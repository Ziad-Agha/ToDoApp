import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const emailRef = useRef<HTMLInputElement>(null);
const passRef = useRef<HTMLInputElement>(null);
const navigate = useNavigate();

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const email = emailRef.current?.value;
  const pass = passRef.current?.value;

  const response = await fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, pass }),
  });
  const data = await response.json();
  localStorage.setItem("token", data.token);
  navigate("/home")
}

export default function LoginForm() {
  return (
    <form onSubmit={handleSubmit}>
      <label>Email</label>
      <input type="text" ref={emailRef} />
      <label htmlFor="">Password</label>
      <input type="password" ref={passRef} />
      <button type="submit">Log in</button>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </form>
  );
}
