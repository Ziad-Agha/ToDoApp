import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Login form asks for email and password
export default function LoginForm() {
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passRef.current?.value;

    const response = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error);
      return;
    }
    // revieves token from API response and stores in localstorage of browser.
    // Refer to authmiddleware to see how its used.
    const data = await response.json();
    localStorage.setItem("token", data.token);
    navigate("/home");
  }
  return (
    <div className="bg-backdrop flex flex-col self-center m-6 w-80 rounded-xl p-8 gap-4">
      <p className="text-2xl text-nav font-bold w-fit">Log in</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col text-left gap-1">
          <label className="text-lg">Email</label>
          <input
            className="border-b focus:outline-none"
            type="text"
            ref={emailRef}
            placeholder="funky@yahoo.com"
          />
        </div>

        <div className="flex flex-col text-left gap-1">
          <label className="text-lg">Password</label>
          <input
            className="border-b focus:outline-none"
            type="password"
            placeholder="$4r0ng p@$$w0rd"
            ref={passRef}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          className="border bg-nav rounded p-2 text-backdrop py-2 px-4 mt-4 w-25 self-center hover:bg-subnav"
          type="submit"
        >
          Log in
        </button>
        <p className="">
          Don't have an account? <br />
          <Link className="text-blue-900 hover:text-blue-600 p" to="/register">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
