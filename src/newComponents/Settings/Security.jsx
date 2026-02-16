import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Security() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [smsAuth, setSmsAuth] = useState(true);
  const [emailAuth, setEmailAuth] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <form
        onSubmit={handlePasswordUpdate}
        className="bg-white p-6 rounded-lg shadow-sm space-y-4"
        aria-labelledby="change-password-heading"
      >
        <h2 id="change-password-heading" className="text-lg font-semibold">
          Change Password
        </h2>

        {/* Current Password */}
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <div className="relative">
            <input
              id="current-password"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3 py-2 rounded-lg border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-required="true"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label={showCurrent ? "Hide current password" : "Show current password"}
            >
              {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-3 py-2 rounded-lg border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-required="true"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label={showNew ? "Hide new password" : "Show new password"}
            >
              {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 rounded-lg border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-required="true"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Update Password"}
        </button>
      </form>

      {/* Two-Factor Authentication */}
      <div
        className="bg-white p-6 rounded-lg shadow-sm space-y-4"
        aria-labelledby="two-factor-heading"
      >
        <h2 id="two-factor-heading" className="text-lg font-semibold">
          Two-Factor Authentication
        </h2>

        {/* SMS Authentication */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">SMS Authentication</p>
            <p className="text-gray-500 text-sm">Receive codes via SMS</p>
          </div>
          <input
            type="checkbox"
            checked={smsAuth}
            onChange={() => setSmsAuth(!smsAuth)}
            className="toggle-checkbox"
            aria-label="Enable or disable SMS Authentication"
          />
        </div>

        {/* Email Authentication */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Email Authentication</p>
            <p className="text-gray-500 text-sm">Receive codes via email</p>
          </div>
          <input
            type="checkbox"
            checked={emailAuth}
            onChange={() => setEmailAuth(!emailAuth)}
            className="toggle-checkbox"
            aria-label="Enable or disable Email Authentication"
          />
        </div>
      </div>
    </div>
  );
}
