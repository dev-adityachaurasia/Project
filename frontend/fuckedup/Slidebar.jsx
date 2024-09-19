import React from "react";

function Sidebar() {
  return (
    <div className="flex flex-col space-y-6">
      <ul className="text-gray-700 space-y-4">
        <li className="hover:text-blue-500 cursor-pointer">Home</li>
        <li className="hover:text-blue-500 cursor-pointer">Search</li>
        <li className="hover:text-blue-500 cursor-pointer">Dopo</li>
        <li className="hover:text-blue-500 cursor-pointer">Profile</li>
        <li className="hover:text-blue-500 cursor-pointer">Upload</li>
        <li className="hover:text-blue-500 cursor-pointer">Events</li>
        <li className="hover:text-blue-500 cursor-pointer">Setting</li>
        <li className="hover:text-blue-500 cursor-pointer">Result</li>
        <li className="hover:text-blue-500 cursor-pointer">Question Paper</li>
        <li className="hover:text-blue-500 cursor-pointer">Logout</li>
      </ul>
    </div>
  );
}

export default Sidebar;
