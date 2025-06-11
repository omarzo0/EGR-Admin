import { useState } from "react";
import { Link } from "react-router-dom";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthData } from "../common/authSlice";
import { motion } from "framer-motion";

function AdminLogin() {
  const INITIAL_LOGIN_OBJ = {
    emailId: "",
    password: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
  const dispatch = useDispatch();

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

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

      if (response.data?.status === "success") {
        const token = response.data?.data?.accessToken;
        const userId = response.data?.data?.id;

        if (!token) throw new Error("No access token received");

        localStorage.setItem("token", token);
        if (userId) localStorage.setItem("adminId", userId);

        dispatch(setAuthData({ id: userId, accessToken: token }));
        window.location.href = "/app/dashboard";
      } else {
        throw new Error(response.data?.error?.message || "Login failed");
      }
    } catch (err) {
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative Blobs */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute w-96 h-96 opacity-40 rounded-full -top-20 -left-20 blur-3xl"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 2 }}
        className="absolute w-80 h-80 opacity-40 rounded-full -bottom-20 -right-20 blur-3xl"
      />

      <motion.div
        className="bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-md p-8 border border-gray-300/50"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4 tracking-wide">
          Admin Login
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your credentials to access the dashboard.
        </p>
        <form onSubmit={submitForm} className="space-y-6">
          <InputText
            type="email"
            defaultValue={loginObj.emailId}
            updateType="emailId"
            labelTitle="Email Address"
            updateFormValue={updateFormValue}
            containerStyle="relative"
          />

          <InputText
            type="password"
            defaultValue={loginObj.password}
            updateType="password"
            labelTitle="Password"
            updateFormValue={updateFormValue}
            containerStyle="relative"
          />

          <div className="flex justify-end text-sm">
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <ErrorText styleClass="text-red-500">{errorMessage}</ErrorText>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 rounded-xl text-white bg-black hover:bg-gray-800 transition-all duration-300 shadow-md"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
