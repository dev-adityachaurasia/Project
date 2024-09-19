import React from "react";
import image from "../assets/boruto.jpeg";


function StatusBar() {
  const statuses = [
    { name: "Naruto", img: "path-to-naruto-image" },
    { name: "Sakura", img: "path-to-sakura-image" },
    { name: "Hinata", img: "path-to-hinata-image" },
  ];

  return (
    <div className="flex overflow-x-auto space-x-4 mb-6">
      {statuses.map((status, index) => (
        <div key={index} className="flex flex-col items-center">
          <img src={image} alt={status.name} className="w-16 h-16 rounded-full" />
          <p className="text-sm mt-1">{status.name}</p>
        </div>
      ))}
    </div>
  );
}

export default StatusBar;
