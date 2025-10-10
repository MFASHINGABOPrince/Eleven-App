import React from "react";
import {
  ArrowUp,
  ClockArrowUp,
  Users,
  BadgeCheck,
  ChartNoAxesColumnIncreasing,
  Plus,
  User,
  Check,
  CalendarClock
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import SideBar from "../side-bar/SideBar";
function Dashboard() {
  return (
    <div className="flex">
      <div className="fixed top-0 left-0 w-64 h-screen z-50">
        <SideBar />
      </div>
      <div className="ml-64 flex-1 h-screen overflow-y-auto pt-10 bg-[#F2F3F3]">
        <div className="flex-1 px-6 bg-[#F2F3F3] ">
          <h2 className="text-[30px] font-normal  text-[#101828]">Dashboard</h2>
          <p className="text-[#667085] text-[16px]  font-normal mb-[20px] ">
            Eleven Pool League Management System
          </p>

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
                  20
                </div>

                <div className="flex items-center gap-2 ">
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
            <Card className="rounded-2xl shadow-sm border border-gray-200 ">
              <CardContent className="flex flex-col justify-between p-6 relative">
                <div className="flex justify-between  items-center">
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
                  20
                </div>

                <div className="flex items-center gap-2 ">
                  <span className="text-blue-600 font-semibold text-sm">
                    +12
                  </span>
                  <span className="font-medium text-[14px] text-blue-600">
                    this week
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-sm border border-gray-200 ">
              <CardContent className="flex flex-col justify-between p-6 relative">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-muted-foreground">
                    Active Tournaments
                  </div>
                  <div className="bg-purple-100 text-[#8304ec] rounded-full p-2 hover:bg-purple-200 transition">
                    <div className="bg-purple-200 rounded-full p-1 hover:bg-purple-300 transition">
                      <ChartNoAxesColumnIncreasing className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[36px] font-semibold text-[#101828] tracking-tight">
                  20
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
                  20
                </div>

                <div>
                  <span className="font-medium text-[14px] text-[#ff7300]">
                    Next 7 days
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 mt-4">
            <Card className="rounded-2xl shadow-sm border border-gray-200 ">
              <CardContent className="flex flex-col justify-between p-6 relative">
                <div className="flex justify-between items-center">
                  <div className="text-[16px] text-[#101828] font-medium text-muted-foreground">
                    Quick Actions
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <Card className="rounded shadow-sm border border-gray-200 ">
                      <CardContent className="flex flex-col justify-between p-2 relative">
                        <div className="flex gap-4 items-center cursor-pointer">
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
                    <Card className="rounded shadow-sm border border-gray-200 ">
                      <CardContent className="flex flex-col justify-between p-2 relative">
                        <div className="flex gap-4 items-center cursor-pointer">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="rounded-2xl shadow-sm border border-gray-200 ">
              <CardContent className="flex flex-col justify-between p-6 relative">
                <div>
                  <div className="text-[16px] font-medium text-[#101828]">
                    Recent Activity
                  </div>
                </div>
                <hr className="my-4 border-gray-200 w-full" />
                <div className="flex justify-between items-center mb-4">
                  <div className="flex justify-between items-center gap-2 text-sm text-[#101828] font-normal">
                    <div className="bg-green-100 text-[#288f5f] rounded-full p-2 hover:bg-green-200 transition">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h1>Bertin vs Norbert</h1>
                      <h1>Winner: • 2025-09-15</h1>
                    </div>
                  </div>
                  <p className="text-green-600">Completed</p>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex justify-between items-center gap-2 text-sm text-[#101828] font-normal">
                    <div className="bg-green-100 text-[#288f5f] rounded-full p-2 hover:bg-green-200 transition">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h1>Bertin vs Norbert</h1>
                      <h1>Winner: • 2025-09-15</h1>
                    </div>
                  </div>
                  <p className="text-green-600">Completed</p>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex justify-between items-center gap-2 text-sm text-[#101828] font-normal">
                    <div className="bg-green-100 text-[#288f5f] rounded-full p-2 hover:bg-green-200 transition">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h1>Bertin vs Norbert</h1>
                      <h1>Winner: • 2025-09-15</h1>
                    </div>
                  </div>
                  <p className="text-green-600">Completed</p>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex justify-between items-center gap-2 text-sm text-[#101828] font-normal">
                    <div className="bg-green-100 text-[#288f5f] rounded-full p-2 hover:bg-green-200 transition">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h1>Bertin vs Norbert</h1>
                      <h1>Winner: • 2025-09-15</h1>
                    </div>
                  </div>
                  <p className="text-green-600">Completed</p>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex justify-between items-center gap-2 text-sm text-[#101828] font-normal">
                    <div className="bg-green-100 text-[#288f5f] rounded-full p-2 hover:bg-green-200 transition">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h1>Bertin vs Norbert</h1>
                      <h1>Winner: • 2025-09-15</h1>
                    </div>
                  </div>

                  <p className="text-green-600">Completed</p>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex justify-between items-center gap-2 text-sm text-[#101828] font-normal">
                    <div className="bg-green-100 text-[#288f5f] rounded-full p-2 hover:bg-green-200 transition">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h1>Bertin vs Norbert</h1>
                      <h1>Winner: • 2025-09-15</h1>
                    </div>
                  </div>

                  <p className="text-green-600">Completed</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-sm border border-gray-200 ">
              <CardContent className="flex flex-col justify-between p-6 relative">
                <div className="flex justify-between items-center">
                  <div className="text-[16px] font-medium text-[#101828]">
                    Upcoming Matches
                  </div>
                </div>
                <hr className="my-4 border-gray-200 w-full" />
                 <div className="flex justify-between items-center mb-4 rounded-md border border-gray-200 p-4">
                  <div className="flex justify-between items-center gap-2 text-sm text-[#101828] font-normal">
                    <div className="bg-blue-100 text-[#004cff] rounded-full p-2 hover:bg-blue-200 transition">
                      <CalendarClock className="w-4 h-4" />
                    </div>
                    <div>
                      <h1>Bertin vs Norbert</h1>
                      <h1>Winner: • 2025-09-15</h1>
                    </div>
                  </div>

                  <p className="text-blue-600">Schedule</p>
                </div>
                 <div className="flex justify-between items-center mb-4 rounded-md border border-gray-200 p-4">
                  <div className="flex justify-between items-center gap-2 text-sm text-[#101828] font-normal">
                    <div className="bg-blue-100 text-[#004cff] rounded-full p-2 hover:bg-blue-200 transition">
                      <CalendarClock className="w-4 h-4" />
                    </div>
                    <div>
                      <h1>Bertin vs Norbert</h1>
                      <h1>Winner: • 2025-09-15</h1>
                    </div>
                  </div>

                  <p className="text-blue-600">Schedule</p>
                </div>
                 <div className="flex justify-between items-center mb-4 rounded-md border border-gray-200 p-4">
                  <div className="flex justify-between items-center gap-2 text-sm text-[#101828] font-normal">
                    <div className="bg-blue-100 text-[#004cff] rounded-full p-2 hover:bg-blue-200 transition">
                      <CalendarClock className="w-4 h-4" />
                    </div>
                    <div>
                      <h1>Bertin vs Norbert</h1>
                      <h1>Winner: • 2025-09-15</h1>
                    </div>
                  </div>

                  <p className="text-blue-600">Schedule</p>
                </div>
                 <div className="flex justify-between items-center mb-4 rounded-md border border-gray-200 p-4">
                  <div className="flex justify-between items-center gap-2 text-sm text-[#101828] font-normal">
                    <div className="bg-blue-100 text-[#004cff] rounded-full p-2 hover:bg-blue-200 transition">
                      <CalendarClock className="w-4 h-4" />
                    </div>
                    <div>
                      <h1>Bertin vs Norbert</h1>
                      <h1>Winner: • 2025-09-15</h1>
                    </div>
                  </div>

                  <p className="text-blue-600">Schedule</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
