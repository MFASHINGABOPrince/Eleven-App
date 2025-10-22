import React, { useEffect, useState } from "react";
import api from "@/assets/lib/axios";
import { useSelector } from "react-redux";


const LeagueDropdown = ({ selectedLeague, onSelectLeague }) => {
    const { user } = useSelector((state) => state.reducer.auth);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = user?.payload?.tokens?.accessToken;

  useEffect(() => {
    const fetchLeagues = async () => {
      setLoading(true);
      try {
        const res = await api.get("http://localhost:2020/api/v1/leagues", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeagues(res.data || []);
      } catch (err) {
        console.error("Failed to load leagues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeagues();
  }, [token]);

  return (
    <div className="w-full">
      <label className="block text-gray-700 font-medium mb-2">Select League</label>
      {loading ? (
        <p className="text-gray-500 text-sm">Loading leagues...</p>
      ) : (
        <select
          value={selectedLeague || ""}
          onChange={(e) => onSelectLeague(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">-- Select League --</option>
          {leagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default LeagueDropdown;
