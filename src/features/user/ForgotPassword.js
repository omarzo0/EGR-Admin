import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Frontend validation
    if (!email.trim()) return setErrorMessage("Email is required!");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setErrorMessage("Please enter a valid email address");

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/admin/forgot-password",
        { email }
      );

      // On success, show the OTP input and reset form
      if (response.data?.status === "success") {
        setShowResetForm(true);
      } else {
        setErrorMessage(response.data?.error?.message || "Failed to send OTP");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Failed to send OTP. Please try again later.";
      if (err.response?.status === 404) {
        setErrorMessage("No account found with this email address");
      } else {
        setErrorMessage(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Frontend validation for reset
    if (!otp.trim()) return setErrorMessage("OTP is required!");
    if (!newPassword.trim()) return setErrorMessage("New password is required!");
    if (newPassword !== confirmPassword)
      return setErrorMessage("Passwords do not match");

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/admin/reset-password",
        { email, otp, newPassword }
      );

      if (response.data?.status === "success") {
        setResetSuccess(true);
      } else {
        setErrorMessage(response.data?.error?.message || "Password reset failed");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Password reset failed. Please try again later.";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
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

      {/* Main Card Container */}
      <motion.div
        className="bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-md p-8 border border-gray-300/50 relative z-10"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center mb-4 tracking-wide">
          {resetSuccess ? "Password Reset Successfully" : "Forgot Password"}
        </h2>

        {resetSuccess ? (
          <>
            <div className="text-center mt-8">
              <CheckCircleIcon className="inline-block w-20 text-green-500" />
            </div>
            <p className="my-4 text-xl font-bold text-center">All Set!</p>
            <p className="mb-8 font-semibold text-center">
              Your password has been updated successfully
            </p>
            <div className="text-center mt-4">
              <Link to="/login">
                <button
                  className="w-full py-3 rounded-lg text-white font-semibold bg-black hover:bg-gray-800 transition-all duration-300 shadow-md"
                >
                  Back to Login
                </button>
              </Link>
            </div>
          </>
        ) : showResetForm ? (
          <>
            <p className="my-6 font-medium text-center">
              Enter the OTP sent to <strong>{email}</strong> and your new password
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <InputText
                type="text"
                value={otp}
                updateType="otp"
                containerStyle="mt-4"
                labelTitle="OTP Code"
                updateFormValue={({ value }) => setOtp(value)}
                placeholder="Enter 6-digit OTP"
                autoFocus
              />
              <InputText
                type="password"
                value={newPassword}
                updateType="newPassword"
                containerStyle="mt-4"
                labelTitle="New Password"
                updateFormValue={({ value }) => setNewPassword(value)}
                placeholder="Enter new password"
              />
              <InputText
                type="password"
                value={confirmPassword}
                updateType="confirmPassword"
                containerStyle="mt-4"
                labelTitle="Confirm Password"
                updateFormValue={({ value }) => setConfirmPassword(value)}
                placeholder="Confirm new password"
              />
              <ErrorText styleClass="mt-6">{errorMessage}</ErrorText>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-semibold bg-black hover:bg-gray-800 transition-all duration-300 shadow-md ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <div className="text-center mt-4">
                Didn't receive OTP?{" "}
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-blue-500 hover:underline transition duration-200"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <p className="my-6 font-medium text-center">
              Enter your email to receive an OTP
            </p>
            <form onSubmit={handleSendOtp} className="space-y-4">
              <InputText
                type="email"
                value={email}
                updateType="email"
                containerStyle="mt-4"
                labelTitle="Email Address"
                updateFormValue={({ value }) => setEmail(value)}
                placeholder="your@email.com"
              />
              <ErrorText styleClass="mt-6">{errorMessage}</ErrorText>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-semibold bg-black hover:bg-gray-800 transition-all duration-300 shadow-md ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
              <div className="text-center mt-4">
                Remember your password?{" "}
                <Link to="/login">
                  <button className="text-blue-500 hover:underline transition duration-200">
                    Login
                  </button>
                </Link>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
