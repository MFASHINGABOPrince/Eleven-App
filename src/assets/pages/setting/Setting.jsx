import React from 'react'
import SideBar from '../side-bar/SideBar'
const Setting = () => {
  return (
   <div className="flex">
      <div className="fixed top-0 left-0 w-64 h-screen z-50">
        <SideBar />
      </div>
      <div className="ml-64 flex-1 h-screen overflow-y-auto pt-10 bg-[#F2F3F3]">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences.</p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Account</h2>
        <p className="mt-2 text-gray-600">Update your account information and password.</p>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" />
          
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" />
        </div>
        <button className="mt-6 bg-[#288f5f] text-white px-4 py-2 rounded-md hover:bg-[#1f6f4c] transition">Save Changes</button>
      </div>
    </div>
    </div>
  )
}
export default Setting
