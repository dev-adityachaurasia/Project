import React from "react";

function Suggestions() {
  const suggestions = [
    { name: "Naruto_Uzumaki", reason: "Suggested for you" },
    { name: "Naruto_Uzumaki", reason: "Followed by your friend" },
    { name: "Naruto_Uzumaki", reason: "Same branch" },
    { name: "Naruto_Uzumaki", reason: "Same college" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="font-bold mb-4">Suggestions</h3>
      {suggestions.map((suggestion, index) => (
        <div key={index} className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img src="path-to-naruto-avatar" alt={suggestion.name} className="w-10 h-10 rounded-full" />
            <div className="ml-3">
              <p className="font-bold">{suggestion.name}</p>
              <span className="text-gray-500 text-sm">{suggestion.reason}</span>
            </div>
          </div>
          <button className="text-blue-500 font-semibold">Follow</button>
        </div>
      ))}
    </div>
  );
}

export default Suggestions;
