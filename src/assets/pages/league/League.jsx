import React, { useState, useEffect } from "react";
import { Plus, Eye, X, Calendar, Users, Trash2 } from "lucide-react";
import LeagueModal from "./LeagueModal";
import SideBar from "../side-bar/SideBar";

const League = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [leagueToDelete, setLeagueToDelete] = useState(null);

  // Get the actual token from your auth context or localStorage
  // Replace this with your actual token retrieval logic
  const token = localStorage.getItem('accessToken'); // Example
  // OR if using auth context:
  // const { user } = useAuth();
  // const token = user?.payload?.tokens?.accessToken;

  const fetchLeagues = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:2020/api/v1/leagues", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (res.ok) {
        setLeagues(Array.isArray(data) ? data : []);
      } else {
        console.error(data?.message || "Failed to load leagues");
      }
    } catch (error) {
      console.error("Error fetching leagues:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchLeagues();
  }, [token]);

  const handleLeagueAdded = () => {
    fetchLeagues();
    setIsModalOpen(false);
  };

  const handlePreview = (league) => {
    setSelectedLeague(league);
    setIsPreviewOpen(true);
  };

  const handleDeleteClick = (league) => {
    setLeagueToDelete(league);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!leagueToDelete) return;

    setDeleteLoading(leagueToDelete.id);
    try {
      const res = await fetch(`http://localhost:2020/api/v1/leagues/${leagueToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        // Remove from local state
        setLeagues(leagues.filter(league => league.id !== leagueToDelete.id));
        setShowDeleteConfirm(false);
        setLeagueToDelete(null);
        
        // Show success message (you can add a toast notification here)
        console.log('League deleted successfully');
      } else {
        const data = await res.json();
        console.error(data?.message || 'Failed to delete league');
        alert(data?.message || 'Failed to delete league');
      }
    } catch (error) {
      console.error('Error deleting league:', error);
      alert('Error deleting league. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateArray) => {
    if (Array.isArray(dateArray) && dateArray.length === 3) {
      const [year, month, day] = dateArray;
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return dateArray;
  };

  const formatDateReadable = (dateArray) => {
    if (Array.isArray(dateArray) && dateArray.length === 3) {
      const [year, month, day] = dateArray;
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    return dateArray;
  };

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 w-64 h-screen z-50">
        <SideBar />
      </div>
      <div className="ml-64 flex-1 h-screen overflow-y-auto pt-10 bg-[#F2F3F3]">
        <div className="flex-1 px-6 bg-[#F2F3F3] pb-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900">League</h2>
              <p className="text-gray-600 mt-1">
                Manage all league, statistics, and information
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#288f5f] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <Plus size={20} />
              Add League
            </button>
          </div>

          {/* League Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {loading ? (
              <p className="text-center text-gray-500 py-8">Loading leagues...</p>
            ) : leagues.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No leagues found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr className="text-gray-600 text-sm">
                      <th className="py-3 px-6 text-left font-medium">#</th>
                      <th className="py-3 px-6 text-left font-medium">League Name</th>
                      <th className="py-3 px-6 text-left font-medium">Start Date</th>
                      <th className="py-3 px-6 text-left font-medium">End Date</th>
                      <th className="py-3 px-6 text-left font-medium">Players</th>
                      <th className="py-3 px-6 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leagues.map((league, index) => (
                      <tr
                        key={league.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6 text-gray-900">{index + 1}</td>
                        <td className="py-4 px-6 text-gray-900 font-medium">
                          {league.name}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {formatDate(league.startDate)}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {formatDate(league.endDate)}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {league.players?.length || 0} players
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handlePreview(league)}
                              className="text-green-600 hover:text-green-800 transition p-2 hover:bg-green-50 rounded-lg"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(league)}
                              disabled={deleteLoading === league.id}
                              className="text-red-600 hover:text-red-800 transition p-2 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete League"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add League Modal */}
      <LeagueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && leagueToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Delete League
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{leagueToDelete.name}</strong>? 
              This action cannot be undone and will remove all associated data.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setLeagueToDelete(null);
                }}
                disabled={deleteLoading !== null}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading !== null}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {deleteLoading !== null ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && selectedLeague && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-gray-900">
                League Details
              </h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* League Info */}
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  {selectedLeague.name}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                    <Calendar className="text-green-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Start Date</p>
                      <p className="text-gray-900 font-semibold">
                        {formatDateReadable(selectedLeague.startDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                    <Calendar className="text-red-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">End Date</p>
                      <p className="text-gray-900 font-semibold">
                        {formatDateReadable(selectedLeague.endDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg mb-6">
                  <Users className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Players</p>
                    <p className="text-gray-900 font-semibold text-lg">
                      {selectedLeague.players?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Players List */}
              <div>
                <h5 className="text-lg font-semibold text-gray-900 mb-4">
                  Players
                </h5>
                
                {selectedLeague.players && selectedLeague.players.length > 0 ? (
                  <div className="space-y-3">
                    {selectedLeague.players.map((player, index) => (
                      <div
                        key={player.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {index + 1}. {player.name}
                            </p>
                            <p className="text-sm text-gray-500">{player.phone}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t">
                          <div>
                            <p className="text-xs text-gray-500">Points</p>
                            <p className="font-semibold text-gray-900">
                              {player.points}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Goals Scored</p>
                            <p className="font-semibold text-green-600">
                              {player.goalsScored}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Goals Conceded</p>
                            <p className="font-semibold text-red-600">
                              {player.goalsConceded}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Users className="mx-auto text-gray-400 mb-2" size={48} />
                    <p className="text-gray-500">No players in this league yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
              >
                Edit League
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default League;