import React, { useEffect, useState } from "react";
import api from "@/assets/lib/axios";
import { useNavigate } from "react-router-dom";

const MatchModal = () => {
  const [players, setPlayers] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [formData, setFormData] = useState({
    player1Id: "",
    player2Id: "",
    leagueId: "",
    round: "",
    scheduledDate: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playerRes = await api.get("/players/all");
        const leagueRes = await api.get("/leagues/all");
        setPlayers(playerRes.data);
        setLeagues(leagueRes.data);
      } catch (error) {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.player1Id ||
      !formData.player2Id ||
      !formData.leagueId ||
      !formData.scheduledDate
    ) {
      toast.error("All fields are required");
      return;
    }
    if (formData.player1Id === formData.player2Id) {
      toast.error("Players must be different");
      return;
    }

    try {
      await api.post("/matches/create", formData);
      toast.success("Match created successfully");
      navigate("/matches");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create match");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-center mb-4">Create Match</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="player1Id"
          className="w-full border rounded-lg p-2"
          value={formData.player1Id}
          onChange={handleChange}
        >
          <option value="">Select Player 1</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nickname}
            </option>
          ))}
        </select>

        <select
          name="player2Id"
          className="w-full border rounded-lg p-2"
          value={formData.player2Id}
          onChange={handleChange}
        >
          <option value="">Select Player 2</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nickname}
            </option>
          ))}
        </select>

        <select
          name="leagueId"
          className="w-full border rounded-lg p-2"
          value={formData.leagueId}
          onChange={handleChange}
        >
          <option value="">Select League</option>
          {leagues.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="round"
          placeholder="Round"
          className="w-full border rounded-lg p-2"
          value={formData.round}
          onChange={handleChange}
        />

        <input
          type="date"
          name="scheduledDate"
          className="w-full border rounded-lg p-2"
          value={formData.scheduledDate}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700"
        >
          Save Match
        </button>
      </form>
    </div>
  );
}
export default MatchModal;
