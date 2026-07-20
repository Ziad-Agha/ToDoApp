import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passRef.current?.value;
    const username = usernameRef.current?.value;

    const response = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });
    const data = await response.json();
    localStorage.setItem("token", data.token);
    navigate("/home");
  }
  return (
    <div className="bg-backdrop flex flex-col self-center m-6 w-90 rounded-xl p-8 gap-4">
      <p className="text-2xl text-nav font-bold w-fit">Sign up</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col text-left gap-1">
          <label className="text-lg">Username</label>
          <input
            className="border-b focus:outline-none"
            type="text"
            ref={usernameRef}
            placeholder="funkydude42"
          />
        </div>

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

        <button
          className="border bg-nav rounded p-2 text-backdrop py-2 px-4 w-25 mt-4 self-center hover:bg-subnav"
          type="submit"
        >
          Sign up
        </button>

        <p>
          Already have an account? <br />
          <Link className="text-blue-900 hover:text-blue-600" to="/">
            Log in here
          </Link>
        </p>
      </form>
    </div>
  );
}
