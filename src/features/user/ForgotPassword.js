import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setErrorMessage("Please enter a valid email address");
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/admin/forgot-password",
        { email }
      );

      // Handle success response
      if (response.data?.status === "success") {
        setShowResetForm(true); // Directly show OTP input
      } else {
        // Handle other non-success cases from backend
        setErrorMessage(response.data?.error?.message || "Failed to send OTP");
      }
    } catch (err) {
      // Handle network errors and backend errors
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Failed to send OTP. Please try again later.";

      // Special handling for "Admin not found" error
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

    // Frontend validation
    if (!otp.trim()) return setErrorMessage("OTP is required!");
    if (!newPassword.trim())
      return setErrorMessage("New password is required!");
    if (newPassword !== confirmPassword)
      return setErrorMessage("Passwords do not match");

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/admin/reset-password",
        { email, otp, newPassword }
      );

      // Check for success status
      if (response.data?.status === "success") {
        setResetSuccess(true);
      } else {
        // Handle backend validation errors
        setErrorMessage(
          response.data?.error?.message || "Password reset failed"
        );
      }
    } catch (err) {
      // Handle network errors or server errors
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
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-md shadow-xl">
        <div className="bg-base-100 rounded-xl p-8">
          <div className="py-10 px-15">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              {resetSuccess ? "Password Reset Successfully" : "Forgot Password"}
            </h2>

            {resetSuccess ? (
              <>
                <div className="text-center mt-8">
                  <CheckCircleIcon className="inline-block w-32 text-success" />
                </div>
                <p className="my-4 text-xl font-bold text-center">All Set!</p>
                <p className="mt-4 mb-8 font-semibold text-center">
                  Your password has been updated successfully
                </p>
                <div className="text-center mt-4">
                  <Link to="/login">
                    <button className="btn mt-2 w-full bg-black text-white">
                      Back to Login
                    </button>
                  </Link>
                </div>
              </>
            ) : showResetForm ? (
              <>
                <p className="my-8 font-semibold text-center">
                  Enter the OTP sent to {email} and your new password
                </p>
                <form onSubmit={handleResetPassword}>
                  <div className="mb-4">
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
                  </div>

                  <ErrorText styleClass="mt-12">{errorMessage}</ErrorText>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn mt-2 w-full bg-black text-white ${
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
                      className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200"
                    >
                      Resend OTP
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <p className="my-8 font-semibold text-center">
                  Enter your email to receive an OTP
                </p>
                <form onSubmit={handleSendOtp}>
                  <div className="mb-4">
                    <InputText
                      type="email"
                      value={email}
                      updateType="email"
                      containerStyle="mt-4"
                      labelTitle="Email Address"
                      updateFormValue={({ value }) => setEmail(value)}
                      placeholder="your@email.com"
                    />
                  </div>

                  <ErrorText styleClass="mt-12">{errorMessage}</ErrorText>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn mt-2 w-full bg-black text-white ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>

                  <div className="text-center mt-4">
                    Remember your password?{" "}
                    <Link to="/login">
                      <button className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                        Login
                      </button>
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
