import React, { useState, useEffect } from "react";
import { Search, Home, FileText, FolderOpen, BarChart3, LogOut } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreatePollModal from "./Components/CreatePoll";
import PollCard from "./Components/PollCard";
import { jwtDecode } from "jwt-decode";

export default function Createpoll() {
  const navigate = useNavigate();

  const [showPollForm, setShowPollForm] = useState(false);
  const [CurrentUserQuestion, setCurrentUserQuestion] = useState([]);
  const [otherQuestions, setOtherQuestions] = useState([]);
  const [pollData, setPollData] = useState({ question: "", options: ["", ""] });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOtherQuestions, setFilteredOtherQuestions] = useState([]);

  useEffect(() => {
  if (searchQuery.trim() === '') {
    setFilteredOtherQuestions(otherQuestions);
  } else {
    const filtered = otherQuestions.filter((q) =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOtherQuestions(filtered);
  }
}, [searchQuery, otherQuestions]);



  
  const getToken = () => {
    const tokenCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  };

  const token = getToken();

  // Decode token to get user email
  let userEmail = "";
  if (token) {
    const decodedToken = jwtDecode(token);
    userEmail = decodedToken.email;
  }

  // Check authentication on mount
  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchQuestions();
    }
  }, []);

  // Fetch all questions
  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/question/getAll`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched data:", res.data);

      // Separate My Questions and Other Questions
      const myQuestions = res.data.filter((q) => q.createdBy === userEmail);
      const others = res.data.filter((q) => q.createdBy !== userEmail);

      setCurrentUserQuestion(myQuestions);
      setFilteredOtherQuestions(others);  // Initial full list
      setOtherQuestions(others);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const openPollForm = () => {
    setShowPollForm(true);
    setPollData({ question: "", options: ["", ""] });
    setErrors({});
  };

  const closePollForm = () => {
    setShowPollForm(false);
    setPollData({ question: "", options: ["", ""] });
    setErrors({});
  };

  const handleQuestionChange = (value) => {
    setPollData((prev) => ({ ...prev, question: value }));
  };
  
  const addOption = () => {
    if (pollData.options.length < 4) {  // 🔥 LIMIT SET TO 4
      setPollData((prev) => ({
        ...prev,
        options: [...prev.options, ""],
      }));
    } else {
      alert("You can add maximum 4 options.");
    }
  };

  const removeOption = () => {
    if (pollData.options.length > 2) {
      setPollData((prev) => ({
        ...prev,
        options: prev.options.slice(0, -1),
      }));
    } else {
      alert("At least 2 options are required.");
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...pollData.options];
    newOptions[index] = value;
    setPollData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async () => {
    // Simple frontend validation
    if (!pollData.question.trim() || pollData.options.some((opt) => !opt.trim())) {
      setErrors({ general: "Please fill out question and all options." });
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/question/create`,
        {
          question: pollData.question.trim(),
          options: pollData.options,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      closePollForm();
      fetchQuestions(); // Refresh poll list after creating new poll
    } catch (err) {
      console.error("Error during poll creation:", err);
    }
  };

  const handleLogout = () => {
    // Clear the token cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-20 h-screen bg-gray-900 flex flex-col items-center py-8 space-y-8 border-r border-gray-700">
          <div className="flex flex-col items-center space-y-6">
            <button className="p-3 bg-blue-600 rounded-full shadow-md hover:bg-blue-700 transition" onClick={() => navigate("/home")}>
              <Home className="w-6 h-6 text-white" />
            </button>
            <div className="text-xs text-white font-medium">Home</div>

            <button className="p-3 bg-gray-700 rounded-full shadow-md hover:bg-gray-600 transition" onClick={() => navigate("/analytics")}>
              <FolderOpen className="w-6 h-6 text-white" />
            </button>
            <div className="text-xs text-gray-300">Analytics</div>

            <button className="p-3 bg-red-600 rounded-full shadow-md hover:bg-red-700 transition" onClick={handleLogout}>
              <LogOut className="w-6 h-6 text-white" />
            </button>
            <div className="text-xs text-gray-300">Logout</div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <p className="font-semibold text-4xl mb-5">Welcome !</p>

            {/* Create Poll Card */}
            <div className="grid grid-cols-6 gap-4 mb-4">
              <div className="group cursor-pointer">
                <div className="bg-gray-800 rounded-lg p-4 h-32 flex items-center justify-center mb-2 hover:bg-gray-700 transition-colors" onClick={openPollForm}>
                  <div className="w-16 h-20 bg-green-600 rounded border-2 border-green-500 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-s text-gray-300 text-center">Create Poll</div>
              </div>

              {/* My created polls */}
              {CurrentUserQuestion.map((poll, index) => (
                console.log("Poll:", poll),
                <div key={index} className="group cursor-pointer">
                  <div
                    className="bg-gray-800 rounded-lg p-4 h-32 flex items-center justify-center mb-2 hover:bg-gray-700 transition-colors"
                    onClick={() => navigate(`/newpoll/${poll._id}`, { state: { poll } })}
                  >
                    <div className="w-16 h-20 bg-blue-600 rounded border-2 border-blue-500 flex items-center justify-center">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-300 text-center">
                    {poll.question.length > 20 ? poll.question.slice(0, 20) + "..." : poll.question}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
  type="text"
  placeholder="Search"
  className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

            </div>

            {/* Display other polls (optional if you want) */}
            <div className="flex space-x-6 overflow-x-auto p-4">
  {filteredOtherQuestions.map((poll, index) => (
    <PollCard key={index} poll={poll} />
  ))}
</div>

          </div>
        </div>
      </div>

      {/* Create Poll Modal */}
      {showPollForm && (
        <CreatePollModal
          pollData={pollData}
          errors={errors}
          isSubmitting={isSubmitting}
          handleQuestionChange={handleQuestionChange}
          handleOptionChange={handleOptionChange}
          addOption={addOption}
          removeOption={removeOption}
          handleSubmit={handleSubmit}
          closePollForm={closePollForm}
        />
      )}
    </div>
  );
}