import React from "react";

const ElectionResults = () => {
  return (
    <div className="p-6 font-sans text-center bg-gray-100">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800">US ELECTION 2024</h1>
        
      </header>

      {/* Results Section */}
      <div className="flex items-center justify-center gap-8 p-6 bg-white rounded-md shadow-md">
        {/* Harris */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-blue-700">HARRIS</h2>
          <p className="mt-2 text-3xl font-bold text-blue-900">226</p>
          <p className="mt-1 text-sm text-gray-600">
            75,247,917 | 48.33% VOTES
          </p>
        </div>

        {/* Separator */}
        <div className="text-3xl font-bold text-gray-400">|</div>

        {/* Trump */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-700">TRUMP</h2>
          <p className="mt-2 text-3xl font-bold text-red-900">312</p>
          <p className="mt-1 text-sm text-gray-600">
            77,858,631 | 50.01% VOTES
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-8">
        <h2 className="text-2xl font-bold text-red-800">TRUMP WINS</h2>
      </footer>
    </div>
  );
};

export default ElectionResults;
