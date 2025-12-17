import React from 'react'
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const { setShowUserLogin, setUser } = useAppContext();
  const navigate = useNavigate();

  // state for login or register
  const [state, setState] = React.useState("login");

  // state for input value
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  }

  // handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setUser({
      email: "thar@gmail.com",
      name: "thar",
    })
    setShowUserLogin(false);
    navigate("/");

  };

  return (
    <div onClick={() => setShowUserLogin(false)} className="fixed inset-0 z-30 flex items-center justify-center px-4 text-sm text-gray-700 bg-primary/10 backdrop-blur-[2px]">
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-md text-left border border-gray-100 rounded-2xl px-8 py-10 bg-white shadow-2xl shadow-primary/10"
      >
        <div className="flex items-center gap-2 p-1 bg-primary/10 rounded-full text-sm font-medium mb-6">
          <button
            type="button"
            className={`flex-1 py-2 rounded-full transition ${state === "login" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
            onClick={() => {
              setState("login");
              resetForm();
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded-full transition ${state !== "login" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
            onClick={() => {
              setState("register");
              resetForm();
            }}
          >
            Register
          </button>
        </div>

        <h1 className="text-gray-900 text-3xl font-semibold">
          {state === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-gray-500 text-sm mt-2 pb-4">
          {state === "login" ? "Sign in to continue shopping" : "Join us to start ordering fresh groceries"}
        </p>

        {state !== "login" && (
          <div className="flex items-center w-full mt-4 bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 gap-3 focus-within:border-primary focus-within:bg-white focus-within:shadow-sm transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400" viewBox="0 0 24 24" >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              type="text"
              placeholder="Full name"
              className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="flex items-center w-full mt-4 bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 gap-3 focus-within:border-primary focus-within:bg-white focus-within:shadow-sm transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400" viewBox="0 0 24 24" >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <input
            type="email"
            placeholder="Email address"
            className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 gap-3 focus-within:border-primary focus-within:bg-white focus-within:shadow-sm transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400" viewBox="0 0 24 24" >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-sm w-full h-full"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {state === "login" && (
          <div className="mt-5 text-left">
            <a className="text-sm text-primary font-medium" href="#" >
              Forgot password?
            </a>
          </div>
        )}

        <button type="submit" className="mt-6 w-full h-11 rounded-full text-white bg-primary hover:bg-primary-dull transition-colors font-medium shadow-md shadow-primary/20" >
          {state === "login" ? "Login" : "Create account"}
        </button>

        <p className="text-gray-500 text-sm mt-4">
          {state === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            type="button"
            className="text-primary font-semibold"
            onClick={() => {
              setState((prev) => prev === "login" ? "register" : "login")
              resetForm();
            }} >
            {state === "login" ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;