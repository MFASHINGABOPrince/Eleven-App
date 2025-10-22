import React,{useState} from "react";
import SideBar from "../side-bar/SideBar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ArrowUp,
  ClockArrowUp,
  Users,
  BadgeCheck,
  ChartNoAxesColumnIncreasing,
  Plus,
  User,
  Check,
  CalendarFold,
  Download,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";


const Match = () => {
  const matches = [
    {
      id: 1,
      match: "Team A vs Team B",
      date: "2025-10-15",
      round: "Round 1",
      status: "Completed",
      winner: "Team A",
    },
    {
      id: 2,
      match: "Team C vs Team D",
      date: "2025-10-18",
      round: "Round 2",
      status: "Scheduled",
      winner: "-",
    },
    {
      id: 3,
      match: "Team E vs Team F",
      date: "2025-10-12",
      round: "Round 1",
      status: "Completed",
      winner: "Team F",
    },
    {
      id: 4,
      match: "Team G vs Team H",
      date: "2025-10-20",
      round: "Round 3",
      status: "Scheduled",
      winner: "-",
    },
    {
      id: 5,
      match: "Team I vs Team J",
      date: "2025-10-10",
      round: "Round 1",
      status: "Completed",
      winner: "Team I",
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
              <button onClick={() => setIsModalOpen(true)} className="bg-[#288f5f] text-white px-4 py-2 rounded-lg hover:bg-[#1f6f4c] transition">
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
                    Completed Matches
                  </div>
                  <div className="bg-green-100 text-[#288f5f] rounded-full p-2 hover:bg-green-200 transition">
                    <div className="bg-green-200 rounded-full p-1 hover:bg-green-300 transition">
                      <Check className="w-4 h-4" />
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
                    Scheduled Matches
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
            <CardHeader className="border-b border-gray-200">
              <div className="flex justify-between items-center">
                <CardTitle className="text-[20px] font-semibold text-[#101828]">
                  All Matches
                </CardTitle>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Match
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Round
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Winner
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {matches.map((match) => (
                      <tr key={match.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {match.match}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {match.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {match.round}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              match.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {match.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {match.winner}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-lg transition">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
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
        {/* <AddMatch
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // onAdd={handleAccountAdd}
      /> */}
    </div>
  );
};

export default Match;