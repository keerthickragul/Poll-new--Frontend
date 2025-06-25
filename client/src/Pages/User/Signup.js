import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo1 from '../../assets/poll.png';
import axios from 'axios';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/auth/signUp`, {
        email: email,
        password: password
      });

      document.cookie = `token=${res.data.token}; path=/;`;
      console.log("Signup successful:", res.data);
      navigate('/home');
    } catch (err) {
      console.error("Error during signup:", err);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/2 bg-gradient-to-br from-green-500 to-green-700 flex flex-col items-center justify-center p-8 text-white">
        <div className="max-w-md w-full text-center space-y-6">
          <h2 className="text-5xl font-extrabold">PollHubb</h2>
          <p className="text-lg text-blue-600">Create. Vote. Analyze.</p>
          <p className="text-sm opacity-80">Engage your audience with powerful polls in seconds.</p>
        </div>
      </div>

      {/* Right Panel with dark theme */}
      <div className="w-1/2 bg-gray-900 text-white flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-green-400">Create Account</h1>
          </div>

          <div className="text-center">
            <span className="text-gray-400">Already have an account? </span>
            <button
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-500"
            >
              Login
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-0 py-3 border-0 border-b border-gray-500 placeholder-gray-400 bg-transparent focus:border-green-400 focus:outline-none text-white"
            />

            <input
              type="password"
              placeholder="Password *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-0 py-3 border-0 border-b border-gray-500 placeholder-gray-400 bg-transparent focus:border-green-400 focus:outline-none text-white"
            />
          </div>

          <button
            className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            onClick={handleSignup}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
