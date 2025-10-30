import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowUp,
  ClockArrowUp,
  Users,
  BadgeCheck,
  ChartNoAxesColumnIncreasing,
  Plus,
  User,
  Check,
  CalendarClock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "../../components/ui/card";
import SideBar from "../side-bar/SideBar";

function Dashboard() {
  const navigate = useNavigate();
  
  // Get user and token from Redux
  const { user } = useSelector((state) => state.reducer.auth);
  const token = user?.payload?.tokens?.accessToken;

  const [stats, setStats] = useState({
    totalPlayers: 0,
    matchesPlayed: 0,
    activeLeagues: 0,
    upcomingMatches: 0,
  });
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:2020/api/v1";

  // Get auth headers with Redux token
  const getAuthHeaders = () => {
    if (!token) {
      console.warn("No token found in Redux store");
      return {
        "Content-Type": "application/json",
      };
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // Check if user is authenticated
  const checkAuth = () => {
    if (!user || !token) {
      console.error("No authentication found - redirecting to login");
      navigate("/login");
      return false;
    }
    return true;
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    // Check authentication first
    if (!checkAuth()) return;

    try {
      setLoading(true);
      setError(null);

      const headers = getAuthHeaders();

      // Fetch players
      const playersRes = await axios.get(`${API_BASE_URL}/players`, { headers });

      // Fetch leagues
      let leaguesData = [];
      try {
        const leaguesRes = await axios.get(`${API_BASE_URL}/leagues`, { headers });
        leaguesData = leaguesRes.data;
      } catch (err) {
        console.warn("Could not fetch leagues:", err.message);
      }

      // Get all matches from all leagues
      let allMatches = [];
      if (leaguesData.length > 0) {
        for (const league of leaguesData) {
          try {
            const matchesRes = await axios.get(
              `${API_BASE_URL}/matches/league/${league.id}`,
              { headers }
            );
            allMatches = [...allMatches, ...matchesRes.data];
          } catch (err) {
            console.warn(`Could not fetch matches for league ${league.id}:`, err.message);
          }
        }
      }

      // Calculate stats
      const completedMatches = allMatches.filter((m) => m.winner !== null);
      const pendingMatches = allMatches.filter((m) => m.winner === null);

      // Sort matches by date
      const sortedCompleted = completedMatches
        .sort((a, b) => {
          const dateA = Array.isArray(a.scheduledDate) 
            ? new Date(a.scheduledDate[0], a.scheduledDate[1] - 1, a.scheduledDate[2])
            : new Date(a.scheduledDate);
          const dateB = Array.isArray(b.scheduledDate)
            ? new Date(b.scheduledDate[0], b.scheduledDate[1] - 1, b.scheduledDate[2])
            : new Date(b.scheduledDate);
          return dateB - dateA;
        })
        .slice(0, 6);

      const sortedUpcoming = pendingMatches
        .sort((a, b) => {
          const dateA = Array.isArray(a.scheduledDate)
            ? new Date(a.scheduledDate[0], a.scheduledDate[1] - 1, a.scheduledDate[2])
            : new Date(a.scheduledDate);
          const dateB = Array.isArray(b.scheduledDate)
            ? new Date(b.scheduledDate[0], b.scheduledDate[1] - 1, b.scheduledDate[2])
            : new Date(b.scheduledDate);
          return dateA - dateB;
        })
        .slice(0, 4);

      setStats({
        totalPlayers: playersRes.data.length,
        matchesPlayed: completedMatches.length,
        activeLeagues: leaguesData.length,
        upcomingMatches: pendingMatches.length,
      });

      setRecentMatches(sortedCompleted);
      setUpcomingMatches(sortedUpcoming);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      
      // Handle 401 Unauthorized (invalid token)
      if (error.response?.status === 401) {
        console.error("Authentication failed - redirecting to login");
        navigate("/login");
        return;
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        setError("You don't have permission to view this data");
      } else {
        setError("Failed to load dashboard data. Please try again.");
      }
      
      setLoading(false);
    }
  };

  // Load data on component mount or when token changes
  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const formatDate = (dateArray) => {
    if (Array.isArray(dateArray)) {
      const [year, month, day] = dateArray;
      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    }
    return "Date not set";
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex">
        <div className="fixed top-0 left-0 w-64 h-screen z-50">
          <SideBar />
        </div>
        <div className="ml-64 flex-1 h-screen flex items-center justify-center bg-[#F2F3F3]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#288f5f] mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex">
        <div className="fixed top-0 left-0 w-64 h-screen z-50">
          <SideBar />
        </div>
        <div className="ml-64 flex-1 h-screen flex items-center justify-center bg-[#F2F3F3]">
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
            <div className="bg-red-100 text-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="bg-[#288f5f] text-white px-6 py-3 rounded-lg hover:bg-[#1f6f4c] transition flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 w-64 h-screen z-50">
        <SideBar />
      </div>
      <div className="ml-64 flex-1 h-screen overflow-y-auto pt-10 bg-[#F2F3F3]">
        <div className="flex-1 px-6 bg-[#F2F3F3] pb-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-[30px] font-normal text-[#101828]">Dashboard</h2>
              <p className="text-[#667085] text-[16px] font-normal mb-[20px]">
                Eleven Pool League Management System
              </p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[16px]">
            <Card className="rounded-2xl shadow-sm border border-gray-200">
              <CardContent className="flex flex-col justify-between p-6 relative">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Players
                  </div>
                  <div className="bg-green-100 text-[#288f5f] rounded-full p-2 hover:bg-green-200 transition">
                    <div className="bg-green-200 rounded-full p-1 hover:bg-green-300 transition">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[36px] font-semibold text-[#101828] tracking-tight">
                  {stats.totalPlayers}
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUp className="text-green-500 w-4 h-4" />
                  <span className="text-green-600 font-semibold text-sm">
                    +{Math.floor(stats.totalPlayers * 0.1)}
                  </span>
                  <span className="font-medium text-[14px] text-green-600">
                    this month
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border border-gray-200">
              <CardContent className="flex flex-col justify-between p-6 relative">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-muted-foreground">
                    Matches Played
                  </div>
                  <div className="bg-blue-100 text-[#004cff] rounded-full p-2 hover:bg-blue-200 transition">
                    <div className="bg-blue-200 rounded-full p-1 hover:bg-blue-300 transition">
                      <BadgeCheck className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[36px] font-semibold text-[#101828] tracking-tight">
                  {stats.matchesPlayed}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-semibold text-sm">
                    +{Math.floor(stats.matchesPlayed * 0.15)}
                  </span>
                  <span className="font-medium text-[14px] text-blue-600">
                    this week
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border border-gray-200">
              <CardContent className="flex flex-col justify-between p-6 relative">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-muted-foreground">
                    Active Leagues
                  </div>
                  <div className="bg-purple-100 text-[#8304ec] rounded-full p-2 hover:bg-purple-200 transition">
                    <div className="bg-purple-200 rounded-full p-1 hover:bg-purple-300 transition">
                      <ChartNoAxesColumnIncreasing className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[36px] font-semibold text-[#101828] tracking-tight">
                  {stats.activeLeagues}
                </div>

                <div>
                  <span className="font-medium text-[14px] text-[#8304ec]">
                    Ongoing events
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border border-gray-200">
              <CardContent className="flex flex-col justify-between p-6 relative">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-muted-foreground">
                    Upcoming Matches
                  </div>
                  <div className="bg-orange-100 text-[#ff7300] rounded-full p-2 hover:bg-orange-200 transition">
                    <div className="bg-orange-200 rounded-full p-1 hover:bg-orange-300 transition">
                      <ClockArrowUp className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[36px] font-semibold text-[#101828] tracking-tight">
                  {stats.upcomingMatches}
                </div>

                <div>
                  <span className="font-medium text-[14px] text-[#ff7300]">
                    Next 7 days
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-1 mt-4">
            <Card className="rounded-2xl shadow-sm border border-gray-200">
              <CardContent className="flex flex-col justify-between p-6 relative">
                <div className="flex justify-between items-center">
                  <div className="text-[16px] text-[#101828] font-medium">
                    Quick Actions
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <Card className="rounded shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition">
                      <CardContent className="flex flex-col justify-between p-2 relative">
                        <div className="flex gap-4 items-center">
                          <div className="bg-blue-100 text-[#004cff] rounded p-2 hover:bg-blue-200 transition">
                            <div className="bg-blue-200 rounded p-1 hover:bg-blue-300 transition">
                              <Plus className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="text-sm font-medium text-muted-foreground">
                            Schedule a Game
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="rounded shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition">
                      <CardContent className="flex flex-col justify-between p-2 relative">
                        <div className="flex gap-4 items-center">
                          <div className="bg-green-100 text-[#288f5f] rounded p-2 hover:bg-green-200 transition">
                            <div className="bg-green-200 rounded p-1 hover:bg-green-300 transition">
                              <User className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="text-sm font-medium text-muted-foreground">
                            Update Player Info
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Upcoming Matches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Recent Activity */}
            <Card className="rounded-2xl shadow-sm border border-gray-200">
              <CardContent className="flex flex-col justify-between p-6 relative">
                <div>
                  <div className="text-[16px] font-medium text-[#101828]">
                    Recent Activity
                  </div>
                </div>
                <hr className="my-4 border-gray-200 w-full" />

                {recentMatches.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No completed matches yet
                  </div>
                ) : (
                  recentMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex justify-between items-center mb-4"
                    >
                      <div className="flex items-center gap-2 text-sm text-[#101828] font-normal">
                        <div className="bg-green-100 text-[#288f5f] rounded-full p-2">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <h1 className="font-semibold">
                            {match.player1?.name} vs {match.player2?.name}
                          </h1>
                          <h1 className="text-xs text-gray-500">
                            {match.winner?.name} • {formatDate(match.scheduledDate)}
                          </h1>
                        </div>
                      </div>
                      <p className="text-green-600 text-sm font-medium">
                        {match.scorePlayer1}-{match.scorePlayer2}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Upcoming Matches */}
            <Card className="rounded-2xl shadow-sm border border-gray-200">
              <CardContent className="flex flex-col justify-between p-6 relative">
                <div className="flex justify-between items-center">
                  <div className="text-[16px] font-medium text-[#101828]">
                    Upcoming Matches
                  </div>
                </div>
                <hr className="my-4 border-gray-200 w-full" />

                {upcomingMatches.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No upcoming matches scheduled
                  </div>
                ) : (
                  upcomingMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex justify-between items-center mb-4 rounded-md border border-gray-200 p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-2 text-sm text-[#101828] font-normal">
                        <div className="bg-blue-100 text-[#004cff] rounded-full p-2">
                          <CalendarClock className="w-4 h-4" />
                        </div>
                        <div>
                          <h1 className="font-semibold">
                            {match.player1?.name} vs {match.player2?.name}
                          </h1>
                          <h1 className="text-xs text-gray-500">
                            {match.round} • {formatDate(match.scheduledDate)}
                          </h1>
                        </div>
                      </div>

                      <p className="text-blue-600 text-sm font-medium">
                        Scheduled
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;