import React from 'react';
import { Play, BarChart3, Cloud, Shield, Star, MessageSquare, CreditCard, Users } from 'lucide-react';
import { Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Signup from './Pages/User/Signup';
import logo from './assets/poll.png'; // Adjust the path as necessary
import { useEffect } from 'react';
export default function Home() {

    
    const navigate = useNavigate();
        useEffect(() => {
          const token = document.cookie.split(';').find(row => row.startsWith('token='));
          if (token) {
            const tokenValue = token.split('=')[1];
            if (tokenValue) {
             navigate('/home');
            }
          } else {
                   navigate('/');
          }
        }, []);
    const handleClick = () => {
        navigate('/signup');
    };

    const handleLogin = () => {
        navigate('/login');
    };
  return (
    <div className="min-h-screen bg-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold text-green-600">
            <img src={logo} width={40} height={40}></img>
          </div>
          <div className="text-2xl font-bold text-green-600">PollHubb</div>
    
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-white hover:text-green-2
          00" onClick={handleLogin}>Log In</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors" onClick={handleClick}>
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-20">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Live polling
                </h1>
                <p className="text-lg sm:text-xl text-gray-400 mt-6 leading-relaxed">
                  Make your meetings and presentations more engaging with our easy-to-use online poll maker. Create your polls in seconds and stop guessing what your participants really think.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 " >
                <button className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors mt-8" onClick={handleLogin}>
                  Create your polls for free
                </button>
              </div>
              
              
            </div>

            {/* Right Column - Image/Video Section */}
            <div className="relative">
              {/* Main laptop mockup */}
              <div className="relative">
                <div className="bg-gray-100 rounded-lg p-8 shadow-2xl">
                  {/* Laptop screen mockup */}
                  <div className="bg-blue-900 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-medium">PollHubb</div>
                      <div className="text-sm">Active poll</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-sm">
                        What was the occasion for which the Eiffel Tower was designed and built?
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold">#M785</div>
                        <div className="text-sm">Q 2 6</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm">Paris World Exposition 1889</div>
                        </div>
                        <div className="bg-blue-700 h-2 rounded-full"></div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm">Olympic Games in Paris 1900</div>
                          <div className="text-sm">56%</div>
                        </div>
                        <div className="bg-blue-600 h-2 rounded-full w-3/5"></div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm">Start of the Third French Republic in 1871</div>
                          <div className="text-sm">27%</div>
                        </div>
                        <div className="bg-blue-500 h-2 rounded-full w-1/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-green-600 rounded-full p-6 shadow-lg">
                    <Play className="w-8 h-8 text-white fill-current" />
                  </div>
                </div>
              </div>
              
              {/* Mobile mockup */}
              <div className="absolute -bottom-8 -right-4 lg:-right-8">
                <div className="bg-gray-100 rounded-2xl p-2 shadow-xl w-32 sm:w-40">
                  <div className="bg-green-600 rounded-xl p-3 text-white">
                    <div className="text-xs font-medium mb-2">PollHubb</div>
                    <div className="space-y-2">
                      <div className="bg-white rounded p-2">
                        <div className="h-8 bg-gray-200 rounded mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="flex space-x-1">
                        <div className="bg-green-500 rounded px-2 py-1 text-xs">Submit</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}