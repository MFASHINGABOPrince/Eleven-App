import React, { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { useSelector } from "react-redux";

const PlayerModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.reducer.auth
  );

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = ["name", "phone"];
    const hasEmptyFields = requiredFields.some(
      (field) => !formData[field] || !formData[field].trim()
    );

    if (hasEmptyFields) {
      alert("Please fill in all required fields");
      return;
    }
    fetch("http://localhost:2020/api/v1/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.payload?.tokens?.accessToken}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Player added successfully:", data);
        handleCancel();
      })
      .catch((error) => {
        console.error("Error adding player:", error);
      });
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      phone: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-[18px] font-medium text-[#101828]">
            Add New Player
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the player information below
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Personal Information Section */}

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label className="block text-[14px] font-medium text-[#344054] mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter name"
                className="w-full px-4 py-3 border placeholder-[#667085] border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Contact Information */}

            <div>
              <label className="block text-[14px] font-medium text-[#344054] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border placeholder-[#667085] border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-200 mt-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-[#288f5f] text-white rounded-xl hover:bg-[#288f5f] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              !formData.name?.trim() ||
              !formData.phone?.trim()
            }
          >
            Add Player
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
