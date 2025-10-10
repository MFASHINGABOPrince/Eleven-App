import React from 'react'
import SideBar from '../side-bar/SideBar'

const Player = () => {
  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1 p-6">
        <h1>Player Page</h1>
      </div>
    </div>
  )
}

export default Player

