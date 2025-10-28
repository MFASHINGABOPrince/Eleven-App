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

  useEffect(() => {
    if (selectedLeague) fetchMatches(selectedLeague);
  }, [selectedLeague]);

  const fetchMatches = async (leagueId) => {
    try {
      setLoading(true);
      const res = await api.get(
        `http://localhost:2020/api/v1/matches/league/${leagueId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMatches(res.data);
    } catch (err) {
      toast.error("Failed to load matches!");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMatches = async () => {
    if (!selectedLeague) {
      toast.warning("Select a league first!");
      return;
    }
    try {
      await api.post(
        `http://localhost:2020/api/v1/matches/generate/${selectedLeague}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Matches generated successfully!");
      fetchMatches(selectedLeague);
    } catch (err) {
      toast.error("Failed to generate matches");
    }
  };

  const handleReschedule = async (matchId, newDate) => {
    try {
      await api.put(
        `http://localhost:2020/api/v1/matches/reschedule/${matchId}?newDate=${newDate}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Match rescheduled!");
      fetchMatches(selectedLeague);
    } catch (err) {
      toast.error("Failed to reschedule match");
    }
  };

  const handleRecordResult = async (matchId, scorePlayer1, scorePlayer2) => {
    if (scorePlayer1 === "" || scorePlayer2 === "") {
      toast.warning("Please enter both scores");
      return;
    }

    try {
      await api.put(
        `http://localhost:2020/api/v1/matches/result/${matchId}`,
        { scorePlayer1, scorePlayer2 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Result saved successfully!");
      fetchMatches(selectedLeague);
    } catch (err) {
      toast.error("Failed to save result");
    }
  };
  const handleRecordScore = async (matchId, score1, score2) => {
  try {
    const res = await fetch(`http://localhost:2020/api/v1/matches/${matchId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ scorePlayer1: score1, scorePlayer2: score2 }),
    });
    const data = await res.json();
    console.log("Updated match:", data);
    toast.success("Scores recorded successfully!");
  } catch (error) {
    console.error("Error recording score:", error);
    toast.error("Failed to record scores");
  }
};

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 w-64 h-screen z-50">
        <SideBar />
      </div>
      <div className="ml-64 flex-1 h-screen overflow-y-auto pt-10 bg-[#F2F3F3] px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">League Matches</h2>
          <button
            onClick={handleGenerateMatches}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Generate Matches
          </button>
        </div>

        <LeagueDropdown onSelectLeague={setSelectedLeague} />

        {loading ? (
          <p className="mt-6 text-gray-600">Loading matches...</p>
        ) : (
          <MatchList
            matches={matches}
            onReschedule={handleReschedule}
            onRecordResult={handleRecordResult}
            onRecordScore={handleRecordScore}
          />
        )}
      </div>
    </div>
  );
};
export default Match;
