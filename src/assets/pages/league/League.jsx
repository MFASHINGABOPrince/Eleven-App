import React from 'react'
import SideBar from '../side-bar/SideBar'
const League = () => {
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
          </div>
      </div>
    </div>
  )
}

export default League
