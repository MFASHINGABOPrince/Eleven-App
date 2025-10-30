import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ArrowUp,
  Users,
  Plus,
  Edit,
  Eye,
  Download,
  FolderInput,
  ChartNoAxesColumnIncreasing,
  Loader2,
  X,
} from "lucide-react";
import SideBar from "../side-bar/SideBar";
import PlayerModal from "./PlayerModal";

const Player = () => {
  const { user } = useSelector((state) => state.reducer.auth);
  const token = user?.payload?.tokens?.accessToken;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPlayers: 0,
    activePlayers: 0,
    newThisMonth: 0,
    newThisWeek: 0,
  });

  // Import state
  const [importFile, setImportFile] = useState(null);
  const [importFileType, setImportFileType] = useState("csv");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const API_URL = "http://localhost:2020/api/v1/players";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(API_URL, {
        headers: getAuthHeaders(),
      });

      const playersData = response.data;
      const sortedPlayers = playersData.sort((a, b) => b.points - a.points);
      
      const playersWithRank = sortedPlayers.map((player, index) => ({
        ...player,
        rank: `#${index + 1}`,
        winPercent: calculateWinPercentage(player),
        gamesPlayed: player.goalsScored + player.goalsConceded,
        goalDifference: player.goalsScored - player.goalsConceded,
      }));

      setPlayers(playersWithRank);
      calculateStats(playersWithRank);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching players:", err);
      setError("Failed to load players. Please try again.");
      setLoading(false);
    }
  };

  const calculateWinPercentage = (player) => {
    const totalMatches = player.points;
    if (totalMatches === 0) return "0%";
    const winRate = (player.points / (player.points + 5)) * 100;
    return `${Math.round(winRate)}%`;
  };

  const calculateStats = (playersData) => {
    const total = playersData.length;
    const active = playersData.filter((p) => p.points > 0).length;
    
    setStats({
      totalPlayers: total,
      activePlayers: active,
      newThisMonth: Math.floor(total * 0.13),
      newThisWeek: Math.floor(total * 0.8),
    });
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handlePlayerUpdate = () => {
    fetchPlayers();
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_URL}/export/csv`, {
        headers: getAuthHeaders(),
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "players.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Players exported successfully!");
    } catch (error) {
      toast.error("Failed to export players");
    }
  };

  // ==================== IMPORT FUNCTIONS ====================

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const extension = selectedFile.name.split(".").pop().toLowerCase();
      
      if (extension === "csv") {
        setImportFileType("csv");
        setImportFile(selectedFile);
      } else if (extension === "xlsx") {
        setImportFileType("excel");
        setImportFile(selectedFile);
      } else {
        toast.error("Only CSV and Excel (.xlsx) files are supported");
        e.target.value = "";
      }
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.warning("Please select a file first");
      return;
    }

    try {
      setImporting(true);
      const formData = new FormData();
      formData.append("file", importFile);

      const endpoint = importFileType === "csv" 
        ? `${API_URL}/import/csv`
        : `${API_URL}/import/excel`;

      const response = await axios.post(endpoint, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      setImportResult(response.data);
      
      if (response.data.successCount > 0) {
        toast.success(response.data.message);
        fetchPlayers();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import file");
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get(`${API_URL}/template/csv`, {
        headers: getAuthHeaders(),
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "players_template.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Template downloaded successfully");
    } catch (error) {
      toast.error("Failed to download template");
    }
  };

  const closeImportModal = () => {
    setIsImportModalOpen(false);
    setImportFile(null);
    setImportResult(null);
  };

  if (loading) {
    return (
      <div className="flex">
        <div className="fixed top-0 left-0 w-64 h-screen z-50">
          <SideBar />
        </div>
        <div className="ml-64 flex-1 h-screen flex items-center justify-center bg-[#F2F3F3]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#288f5f] mx-auto mb-4" />
            <p className="text-gray-600">Loading players...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <div className="fixed top-0 left-0 w-64 h-screen z-50">
          <SideBar />
        </div>
        <div className="ml-64 flex-1 h-screen flex items-center justify-center bg-[#F2F3F3]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchPlayers}
              className="bg-[#288f5f] text-white px-6 py-2 rounded-lg hover:bg-[#1f6f4c]"
            >
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
              <h2 className="text-[30px] font-medium text-[#101828]">
                Player Management
              </h2>
              <p className="text-[#667085] text-[16px] font-normal mb-[20px]">
                Manage all league players, statistics, and information
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="border border-[#288f5f] text-[#288f5f] px-4 py-2 rounded-lg hover:bg-[#288f5f] hover:text-white transition"
              >
                <FolderInput className="inline-block mr-2 w-4 h-4" />
                Import
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#288f5f] text-white px-4 py-2 rounded-lg hover:bg-[#1f6f4c] transition"
              >
                <Plus className="inline-block mr-2" />
                Player
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mb-6">
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
                    +{stats.newThisMonth}
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
                    Active Players
                  </div>
                  <div className="bg-blue-100 text-[#004cff] rounded-full p-2 hover:bg-blue-200 transition">
                    <div className="bg-blue-200 rounded-full p-1 hover:bg-blue-300 transition">
                      <ChartNoAxesColumnIncreasing className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[36px] font-semibold text-[#101828] tracking-tight">
                  {stats.activePlayers}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-semibold text-sm">
                    +{stats.newThisWeek}
                  </span>
                  <span className="font-medium text-[14px] text-blue-600">
                    this week
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table Section */}
          <Card className="rounded-2xl shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-200 bg-white">
              <div className="flex justify-between items-center">
                <CardTitle className="text-[24px] font-medium text-[#101828]">
                  All Players ({players.length})
                </CardTitle>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsImportModalOpen(true)}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <FolderInput className="w-4 h-4" />
                    Import
                  </button>
                  <button
                    onClick={handleExport}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Player
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Win %
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Goals Scored
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Goals Conceded
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Goal Difference
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {players.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                          No players found. Add your first player!
                        </td>
                      </tr>
                    ) : (
                      players.map((player) => (
                        <tr
                          key={player.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {player.rank}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                                {player.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {player.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Player {player.rank}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {player.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {player.points} pts
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {player.winPercent}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {player.goalsScored}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {player.goalsConceded}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span
                              className={
                                player.goalDifference > 0
                                  ? "text-green-600"
                                  : player.goalDifference < 0
                                  ? "text-red-600"
                                  : "text-gray-600"
                              }
                            >
                              {player.goalDifference > 0 ? "+" : ""}
                              {player.goalDifference}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <button className="text-[#667085] hover:text-blue-600 transition">
                                <Eye className="w-5 h-5" />
                              </button>
                              <button className="text-[#667085] hover:text-green-600 transition">
                                <Edit className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Player Modal */}
      <PlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handlePlayerUpdate}
      />

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Import Players</h2>
              <button
                onClick={closeImportModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">📝 Instructions:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Supported formats: CSV (.csv) and Excel (.xlsx)</li>
                <li>• Required columns: Name, Phone</li>
                <li>• First row should be header (Name,Phone)</li>
                <li>• Download template below for reference</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleDownloadTemplate}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                📥 Download Template
              </button>
              <button
                onClick={handleExport}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                📤 Export Players
              </button>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Select File (CSV or Excel)
              </label>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {importFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {importFile.name} ({importFileType.toUpperCase()})
                </p>
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={handleImport}
              disabled={!importFile || importing}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 font-semibold"
            >
              {importing ? "Importing..." : "Upload & Import"}
            </button>

            {/* Results */}
            {importResult && (
              <div className="mt-6 border-t pt-6">
                <h3 className="font-semibold text-lg mb-4">Import Results</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Success</p>
                    <p className="text-3xl font-bold text-green-600">
                      {importResult.successCount}
                    </p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Failed</p>
                    <p className="text-3xl font-bold text-red-600">
                      {importResult.failureCount}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4">{importResult.message}</p>

                {importResult.errors && importResult.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <h4 className="font-semibold text-red-800 mb-2">Errors:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {importResult.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;