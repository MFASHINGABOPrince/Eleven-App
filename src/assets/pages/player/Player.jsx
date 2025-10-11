import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ArrowUp, Users, CalendarFold, Plus, Edit, Eye,Download ,FolderInput } from "lucide-react";
import SideBar from "../side-bar/SideBar";

const Player = () => {
  // Sample data for players
  const players = [
    {
      id: 1,
      rank: "#1",
      name: "Bertin",
      title: "Player #1",
      avatar: "B",
      points: 7,
      matches: 10,
      winPercent: "%",
      gamesPlayed: 30,
      gamesWon: 16,
      gamesLost: 14,
      goalDifference: 2,
    },
    {
      id: 2,
      rank: "#2",
      name: "Norbert",
      title: "Player #2",
      avatar: "N",
      points: 6,
      matches: 8,
      winPercent: "%",
      gamesPlayed: 24,
      gamesWon: 17,
      gamesLost: 7,
      goalDifference: 10,
    },
    {
      id: 3,
      rank: "#3",
      name: "Hussein",
      title: "Player #3",
      avatar: "H",
      points: 6,
      matches: 9,
      winPercent: "%",
      gamesPlayed: 27,
      gamesWon: 18,
      gamesLost: 9,
      goalDifference: 9,
    },
  ];

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 w-64 h-screen z-50">
        <SideBar />
      </div>
      <div className="ml-64 flex-1 h-screen overflow-y-auto pt-10 bg-[#F2F3F3]">
        <div className="flex-1 px-6 bg-[#F2F3F3] pb-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-[30px] font-normal text-[#101828]">
                Match Management
              </h2>
              <p className="text-[#667085] text-[16px] font-normal mb-[20px]">
                Manage all league matches, results, and scheduling
              </p>
            </div>
            <div>
              <button className="bg-[#288f5f] text-white px-4 py-2 rounded-lg hover:bg-[#1f6f4c] transition">
                <Plus className="inline-block mr-2" />
                Match
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
                  15
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUp className="text-green-500 w-4 h-4" />
                  <span className="text-green-600 font-semibold text-sm">
                    +2
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
                      <CalendarFold className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[36px] font-semibold text-[#101828] tracking-tight">
                  20
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-semibold text-sm">
                    +12
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
                  All Players
                </CardTitle>
                <div className="flex gap-3">
                  <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                    <FolderInput className="w-4 h-4" />
                    Import
                  </button>
                  <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
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
                        Points
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Matches
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Win %
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Games Played
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Games Won
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Games Lost
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
                    {players.map((player) => (
                      <tr
                        key={player.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {player.rank}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                              {player.avatar}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {player.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {player.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {player.points}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {player.matches}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {player.winPercent}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {player.gamesPlayed}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {player.gamesWon}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {player.gamesLost}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {player.goalDifference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Eye className="text-[#667085] " />
                            <Edit className="text-[#667085]" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Player;
