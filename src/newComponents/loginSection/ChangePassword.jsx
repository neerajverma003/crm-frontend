import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";
import changePasswordIllustration from "../../assets/changePassword.jpg";

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePassword = () => {
  const [formData, setFormData] = useState(initialForm);
  const [visibleFields, setVisibleFields] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const toggleVisibility = (field) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.currentPassword.trim()) {
      return "Please enter your current password.";
    }
    if (!formData.newPassword.trim()) {
      return "Please enter a new password.";
    }
    if (formData.newPassword.length < 8) {
      return "Your new password must be at least 8 characters long.";
    }
    if (formData.newPassword === formData.currentPassword) {
      return "New password must be different from the current password.";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      return "New password and confirmation do not match.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (!userId || !role) {
      toast.error("Missing session details. Please sign in again.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/login/change-password", {
        userId,
        role,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success("Password updated successfully.");
      setFormData(initialForm);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to update password. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderPasswordField = (label, name, placeholder) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-semibold text-gray-800">
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={name}
          name={name}
          type={visibleFields[name] ? "text" : "password"}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          className="w-full rounded-lg border bg-[#FBFDFF] px-4 py-3 pr-12 text-sm text-gray-700 outline-none transition focus:border-black"
        />
        <button
          type="button"
          onClick={() => toggleVisibility(name)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-gray-800"
        >
          {visibleFields[name] ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-screen grid-cols-1 bg-white md:grid-cols-2">
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-[linear-gradient(180deg,#E9F0FB_0%,#F6FBFF_100%)] p-6 text-center">
        <img
          src={changePasswordIllustration}
          alt="Secure password illustration"
          className="h-48 w-80 rounded-md object-cover md:h-60 md:w-96"
        />
        <h3 className="text-xl font-semibold text-[#0F2133] md:text-2xl">
          Change Your Password
        </h3>
        <p className="px-4 text-sm text-gray-600 md:px-0 md:text-base">
          Keep your CRM account secure by updating your password regularly.
        </p>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg sm:p-8"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
              🔒
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              Update Password
            </h2>
            <p className="text-sm text-gray-500">
              Choose a strong password to protect your account.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {renderPasswordField(
              "Current Password",
              "currentPassword",
              "Enter your current password"
            )}
            {renderPasswordField(
              "New Password",
              "newPassword",
              "Enter a new password"
            )}
            {renderPasswordField(
              "Confirm New Password",
              "confirmPassword",
              "Re-enter the new password"
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full rounded-lg bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Updating..." : "Update Password"}
          </button>

          <p className="mt-4 text-center text-xs text-gray-500">
            Tip: Use at least 8 characters with a mix of letters, numbers, and
            symbols.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
