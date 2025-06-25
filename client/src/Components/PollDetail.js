import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function PollDetail() {
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(location.state?.poll || null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [newOptionText, setNewOptionText] = useState('');
  const [isAddingOption, setIsAddingOption] = useState(false);

  useEffect(() => {
    if (poll) {
      setQuestion(poll.question);
      setOptions(poll.options.map(opt => opt.text));
    } else {
      fetchPoll();
    }
  }, [poll]);

  const fetchPoll = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/question/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPoll(res.data);
      setQuestion(res.data.question);
      setOptions(res.data.options.map(opt => opt.text));
    } catch (err) {
      console.error("Error fetching poll", err);
      alert("Poll not found");
      navigate("/");
    }
  };

  const handleSaveQuestion = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BASE_URL}/api/question/updateQuestion/${id}`, {
        question: question.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Question updated");
    } catch (err) {
      console.error("Error updating question", err);
    }
  };

  const handleOptionChange = async (index, value) => {
    setOptions(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleUpdateOption = async (index) => {
    try {
      await axios.put(`${process.env.REACT_APP_BASE_URL}/api/question/updateOption/${id}`, {
        index,
        newText: options[index].trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Option updated");
    } catch (err) {
      console.error("Error updating option", err);
    }
  };

  const handleAddOption = () => {
    if (options.length >= 4) {
      alert("Maximum 4 options allowed.");
      return;
    }
    setIsAddingOption(true);
  };

  const handleSaveNewOption = async () => {
    const trimmedText = newOptionText.trim();
    if (!trimmedText) {
      alert("Option text cannot be empty.");
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/question/addOption/${id}`, {
        text: trimmedText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPoll(res.data);
      setQuestion(res.data.question);
      setOptions(res.data.options.map(opt => opt.text));
      setNewOptionText('');
      setIsAddingOption(false);
    } catch (err) {
      console.error("Error adding option", err);
      alert(`Failed to add option: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleRemoveOption = async (index) => {
    if (options.length <= 2) {
      alert("Minimum 2 options required.");
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/question/deleteOption/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { index: index }
      });

      setOptions(options.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting option", err);
      alert("Failed to delete option. Please try again.");
    }
  };

  const handleDeletePoll = async () => {
    if (!window.confirm("Are you sure you want to delete this poll?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/question/deleteQuestion/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Poll deleted");
      navigate("/");
    } catch (err) {
      console.error("Error deleting poll", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Poll</h1>

      <div className="mb-4">
        <label className="block mb-1">Question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
        />
        <button onClick={handleSaveQuestion} className="mt-2 bg-blue-600 px-4 py-2 rounded">
          Save Question
        </button>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Options</label>
        {options.map((opt, idx) => (
          <div key={idx} className="flex mb-2">
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="w-full p-2 rounded bg-gray-700"
            />
            <button
              className="ml-2 bg-red-600 px-2 rounded"
              onClick={() => handleRemoveOption(idx)}
            >
              Remove
            </button>
            <button
              className="ml-2 bg-green-600 px-2 rounded"
              onClick={() => handleUpdateOption(idx)}
            >
              Update
            </button>
          </div>
        ))}

        {isAddingOption ? (
          <div className="flex mb-2 mt-2">
            <input
              type="text"
              value={newOptionText}
              onChange={(e) => setNewOptionText(e.target.value)}
              className="w-full p-2 rounded bg-gray-700"
              placeholder="Enter new option..."
            />
            <button
              className="ml-2 bg-green-600 px-2 rounded"
              onClick={handleSaveNewOption}
            >
              Save
            </button>
          </div>
        ) : (
          <button onClick={handleAddOption} className="mt-2 bg-green-600 px-4 py-2 rounded">
            Add Option
          </button>
        )}
      </div>

      <div className="flex space-x-4">
        <button onClick={handleDeletePoll} className="bg-red-600 px-4 py-2 rounded">
          Delete Poll
        </button>
        <button onClick={() => navigate("/")} className="bg-gray-600 px-4 py-2 rounded">
          Back
        </button>
      </div>
    </div>
  );
}
