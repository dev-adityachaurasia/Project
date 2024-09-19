import React from "react";

function Post() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
      <div className="flex items-center mb-4">
        <img src="path-to-naruto-avatar" alt="Naruto" className="w-12 h-12 rounded-full" />
        <div className="ml-3">
          <h3 className="font-bold">Naruto_Uzumaki</h3>
          <span className="text-gray-500 text-sm">6d</span>
        </div>
      </div>
      <img src="path-to-car-image" alt="Car Post" className="w-full h-auto rounded-lg mb-4" />
      <div className="flex items-center space-x-2">
        <span>❤️</span> 
        <span className="font-bold">10 likes</span>
      </div>
    </div>
  );
}

export default Post;
