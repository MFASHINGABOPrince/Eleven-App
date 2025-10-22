import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "@/assets/lib/axios";
import LeagueDropdown from "../league/ LeagueDropdown";
import MatchList from "./MatchList";
import { useSelector } from "react-redux";
import SideBar from "../side-bar/SideBar";

const Match = () => {
  const { user } = useSelector((state) => state.reducer.auth);
  const token = user?.payload?.tokens?.accessToken;

  const [selectedLeague, setSelectedLeague] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // when a league is selected, fetch its matches
  useEffect(() => {
    if (selectedLeague) {
      fetchMatches(selectedLeague);
    }
  }, [selectedLeague]);

  // fetch matches by league
  const fetchMatches = async (leagueId) => {
    try {
      setLoading(true);
      const res = await api.get(
        `http://localhost:2020/api/v1/matches/league/${leagueId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMatches(res.data);
    } catch (err) {
      toast.error("Failed to load matches!");
    } finally {
      setLoading(false);
    }
  };

  // generate matches automatically
  const handleGenerateMatches = async () => {
    if (!selectedLeague) {
      toast.warning("Select a league first!");
      return;
    }

    try {
      await api.post(
        `http://localhost:2020/api/v1/matches/generate/${selectedLeague}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Matches generated successfully!");
      fetchMatches(selectedLeague);
    } catch (err) {
      toast.error("Failed to generate matches");
    }
  };

  // handle reschedule
  const handleReschedule = async (matchId, newDate) => {
    try {
      await api.put(
        `http://localhost:2020/api/v1/matches/reschedule/${matchId}`,
        { newDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Match rescheduled!");
      fetchMatches(selectedLeague);
    } catch (err) {
      toast.error("Failed to reschedule match");
    }
  };

  return (
     <div className="flex">
      <div className="fixed top-0 left-0 w-64 h-screen z-50">
        <SideBar />
      </div>
      <div className="ml-64 flex-1 h-screen overflow-y-auto pt-10 bg-[#F2F3F3]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">League Matches</h2>
        <button
          onClick={handleGenerateMatches}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Generate Matches
        </button>
      </div>

      <LeagueDropdown onSelectLeague={setSelectedLeague} />

      {loading ? (
        <p className="mt-6 text-gray-600">Loading matches...</p>
      ) : (
        <MatchList matches={matches} onReschedule={handleReschedule} />
      )}
    </div>
    </div>
  );
};

export default Match;
