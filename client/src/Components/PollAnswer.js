import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

export default function PollAnswer() {
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const location = useLocation();
  const poll = location.state?.poll;

  const [selected, setSelected] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [responses, setResponses] = useState(
    poll.options.reduce((acc, option) => ({ ...acc, [option.text]: option.count }), {})
  );
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    let total = 0;

    poll.options.forEach(option => {
      total += option.count;
      if (option.emails.includes(decodedToken.email)) {
        setSelected(option.text);
        setSubmitted(true);
      }
    });

    setTotalVotes(total);
  }, []);

  if (!poll) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <p className="text-xl">Poll not found!</p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!selected) return alert("Please select an option.");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/question/vote/${poll._id}`,
        {
          optionIndex: poll.options.findIndex(option => option.text === selected),
          email: decodedToken.email
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res);

      // Update local state after successful submission:
      setResponses(prev => ({
        ...prev,
        [selected]: prev[selected] + 1
      }));
      setTotalVotes(prev => prev + 1);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting vote:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center">{poll.question}</h1>

        {!submitted ? (
          <div className="space-y-5">
            {poll.options.map((option, index) => (
              <label key={index} className="flex items-center bg-gray-700 rounded-lg p-4 hover:bg-gray-600 cursor-pointer transition">
                <input
                  type="radio"
                  name="option"
                  value={option.text}
                  checked={selected === option.text}
                  onChange={(e) => setSelected(e.target.value)}
                  className="h-5 w-5 text-blue-500 mr-4"
                />
                <span className="text-lg">{option.text}</span>
              </label>
            ))}

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Submit
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-2 text-center">Poll Results</h2>
            {poll.options.map((option, index) => {
              const count = responses[option.text];
              const percent = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
              return (
                <div key={index} className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-lg">{option.text}</span>
                    <span className="font-semibold">{percent}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
