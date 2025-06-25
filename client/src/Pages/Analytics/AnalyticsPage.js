import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { Search, Home, FileText, FolderOpen } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

export default function AnalyticsPage() {
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [currentUserQuestion, setCurrentUserQuestion] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/question/getAll`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const myQuestions = res.data.filter(q => q.createdBy === decodedToken.email);
      setCurrentUserQuestion(myQuestions);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const filteredPolls = currentUserQuestion.filter(poll =>
    poll.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getChartData = (options) => {
    return options.map(option => ({
      option: option.text,
      count: option.count
    }));
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">

      {/* Sidebar */}
      <div className="w-20 h-screen bg-gray-900 flex flex-col items-center py-8 space-y-8 border-r border-gray-700">
        <div className="flex flex-col items-center space-y-6">

          <button className="p-3 bg-blue-600 rounded-full shadow-md hover:bg-blue-700 transition" onClick={() => navigate("/home")}>
            <Home className="w-6 h-6 text-white" />
          </button>
          <div className="text-xs">Home</div>


          <button className="p-3 bg-gray-700 rounded-full shadow-md hover:bg-gray-600 transition" onClick={() => navigate("/analytics")}>
            <FolderOpen className="w-6 h-6 text-white" />
          </button>
          <div className="text-xs text-gray-300">Analytics</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-semibold mb-8">Poll Analytics</h1>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search polls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Poll List */}
        {!selectedPoll ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPolls.length > 0 ? (
              filteredPolls.map((poll) => (
                <div 
                  key={poll._id} 
                  className="cursor-pointer bg-gray-800 p-6 rounded-xl shadow hover:bg-gray-700 transition"
                  onClick={() => setSelectedPoll(poll)}
                >
                  <h3 className="text-lg font-semibold mb-3">{poll.question}</h3>
                  <p className="text-sm text-gray-400">{poll.options.length} options</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 col-span-3 text-center">No polls found</p>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{selectedPoll.question}</h2>
              <button
                onClick={() => setSelectedPoll(null)}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Back
              </button>
            </div>

            <div className="w-full h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData(selectedPoll.options)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                  <XAxis dataKey="option" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
