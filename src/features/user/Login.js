import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";
import { useDispatch } from "react-redux";
import { setAuthData } from "../common/authSlice";
import Cookies from "js-cookie";
function Login() {
  const INITIAL_LOGIN_OBJ = {
    password: "",
    emailId: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
  const dispatch = useDispatch();

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation
    if (!loginObj.emailId.trim()) return setErrorMessage("Email is required!");
    if (!loginObj.password.trim())
      return setErrorMessage("Password is required!");

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        {
          email: loginObj.emailId,
          password: loginObj.password,
        }
      );

      console.log("Full API Response:", response); // Debug log

      // Handle response based on status
      if (response.data?.status === "success") {
        const token = response.data?.data?.accessToken;
        const userId = response.data?.data?.id;

        if (!token) {
          throw new Error("No access token received");
        }

        // Store authentication data
        localStorage.setItem("token", token);
        if (userId) localStorage.setItem("adminId", userId);

        // Dispatch to Redux
        dispatch(
          setAuthData({
            id: userId,
            accessToken: token,
          })
        );

        // Redirect
        window.location.href = "/app/dashboard";
      } else if (response.data?.status === "error") {
        // Handle error response from backend
        throw new Error(response.data?.error?.message || "Login failed");
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error("Login error details:", err);

      // Handle axios errors and backend error responses
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";

      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-md shadow-xl">
        <div className="bg-base-100 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
          <form onSubmit={submitForm}>
            <div className="mb-4">
              <InputText
                type="emailId"
                defaultValue={loginObj.emailId}
                updateType="emailId"
                containerStyle="mt-4"
                labelTitle="Email"
                updateFormValue={updateFormValue}
              />

              <InputText
                defaultValue={loginObj.password}
                type="password"
                updateType="password"
                containerStyle="mt-4"
                labelTitle="Password"
                updateFormValue={updateFormValue}
              />
            </div>

            <div className="text-right text-primary">
              <Link to="/forgot-password">
                <span className="text-sm inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                  Forgot Password?
                </span>
              </Link>
            </div>

            {errorMessage && (
              <div className="alert alert-error mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}
            <button
              type="submit"
              className={
                "btn mt-2 w-full bg-black text-white" +
                (loading ? " loading" : "")
              }
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
