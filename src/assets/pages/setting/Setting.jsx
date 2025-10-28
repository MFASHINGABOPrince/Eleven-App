import React, { useState } from "react";
import SideBar from "../side-bar/SideBar";

const Setting = () => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="flex w-full bg-[#F2F3F3]">
      <div className="fixed top-0 left-0 w-64 h-screen z-50">
        <SideBar />
      </div>

      <div className="ml-64 flex-1 min-h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Account Information Card */}
          <div className="bg-white  rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Account Information
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Update your email and personal details
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#288f5f] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#288f5f] focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="bg-[#288f5f] text-white px-6 py-2.5 rounded-lg hover:bg-[#1f6f4c] transition-colors font-medium">
                Save Changes
              </button>
            </div>
          </div>

          {/* Password Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Password
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Update your password to keep your account secure
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#288f5f] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#288f5f] focus:border-transparent outline-none transition"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Must be at least 8 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#288f5f] focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="bg-[#288f5f] text-white px-6 py-2.5 rounded-lg hover:bg-[#1f6f4c] transition-colors font-medium">
                Update Password
              </button>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Preferences
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Customize your experience
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Email Notifications
                  </h3>
                  <p className="text-xs text-gray-500">
                    Receive email updates about your account
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? "bg-[#288f5f]" : "bg-gray-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-xs text-gray-500">
                    Add an extra layer of security
                  </p>
                </div>
                <button
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactor ? "bg-[#288f5f]" : "bg-gray-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactor ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-red-100">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Danger Zone
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Irreversible actions for your account
            </p>

            <button className="bg-white text-red-600 border-2 border-red-600 px-6 py-2.5 rounded-lg hover:bg-red-50 transition-colors font-medium">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
