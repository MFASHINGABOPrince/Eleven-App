import React, { useState } from "react";
import { Gamepad2, X, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const LeagueModal = ({ isOpen, onClose, onLeagueAdded }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState([]);

  const { user } = useSelector((state) => state.reducer.auth);
  const token = user?.payload?.tokens?.accessToken;

  // Fetch players
  React.useEffect(() => {
    if (!token) return;

    const fetchPlayers = async () => {
      try {
        const res = await fetch("http://localhost:2020/api/v1/players", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // Reba niba data ari array
        if (Array.isArray(data)) {
          setAvailablePlayers(data);
        } else if (Array.isArray(data?.data)) {
          setAvailablePlayers(data.data);
        } else {
          setAvailablePlayers([]);
        }
      } catch (error) {
        toast.error("Failed to load players");
      }
    };

    fetchPlayers();
  }, [token]);

  const togglePlayer = (id) => {
    setSelectedPlayers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (
      !name.trim() ||
      !startDate ||
      !endDate ||
      selectedPlayers.length === 0
    ) {
      toast.warn("Please fill all fields");
      return;
    }

    const body = {
      name,
      startDate,
      endDate,
      playerIds: selectedPlayers,
    };

    try {
      const res = await fetch("http://localhost:2020/api/v1/leagues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("League created successfully!");
        onLeagueAdded();
        handleCancel();
      } else {
        toast.error(data?.message || "Failed to create league");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  const handleCancel = () => {
    setName("");
    setStartDate("");
    setEndDate("");
    setSelectedPlayers([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gamepad2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-[18px] font-medium text-[#101828]">
            Add New League
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              League Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Eleven Pool League 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Players
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full border rounded-xl px-4 py-3 flex justify-between items-center"
            >
              <span>
                {selectedPlayers.length === 0
                  ? "Select players"
                  : `${selectedPlayers.length} selected`}
              </span>
              <ChevronDown
                className={`transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 bg-white w-full border rounded-xl mt-2 max-h-60 overflow-y-auto">
                {availablePlayers.length === 0 ? (
                  <p className="text-center text-gray-400 p-3">
                    No players available
                  </p>
                ) : (
                  availablePlayers.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlayers.includes(p.id)}
                        onChange={() => togglePlayer(p.id)}
                      />
                      <span className="ml-3">{p.name}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCancel}
              className="flex-1 border rounded-xl py-3 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-[#288f5f] text-white rounded-xl py-3 hover:bg-[#1f6f4c]"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueModal;
