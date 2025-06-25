import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LifeBuoy  } from 'lucide-react';

export default function PollCard({ poll }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/poll/${poll._id}`, { state: { poll } });
  };

  return (
    <div className=''>
        <div 
      onClick={handleClick}
      className="cursor-pointer bg-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center shadow-md hover:bg-gray-700 transition-colors w-48 h-60"
    >
      <div className="bg-blue-600 rounded-lg w-20 h-28 flex items-center justify-center mb-4 shadow">
       <LifeBuoy  className="w-10 h-10 text-white" />


      </div>
      <div className="text-white text-center text-sm font-medium">
        {poll.question.length > 25 ? poll.question.slice(0, 25) + "..." : poll.question}
      </div>
    </div>
    </div>
    

  );
}
