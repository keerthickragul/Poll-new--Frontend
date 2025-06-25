import React from 'react';
import { Plus, Minus, AlertCircle, X } from 'lucide-react';

export default function CreatePollModal({
  pollData,
  errors,
  isSubmitting,
  handleQuestionChange,
  handleOptionChange,
  addOption,
  removeOption,
  handleSubmit,
  closePollForm
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 mx-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-2">
          <h2 className="text-xl font-semibold text-white">Create New Poll</h2>
          <button 
            onClick={closePollForm}
            className="p-1 hover:bg-gray-700 rounded"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
            <span className="text-red-400 text-sm">{errors.general}</span>
          </div>
        )}

        {/* Question */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Question <span className="text-red-400">*</span>
          </label>
          <textarea
            value={pollData.question}
            onChange={(e) => handleQuestionChange(e.target.value)}
            rows={3}
            placeholder="Enter your Question here"
            className={`w-full bg-gray-700 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 resize-none ${
              errors.question ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
            }`}
            disabled={isSubmitting}
          />
          {errors.question && (
            <p className="text-red-400 text-xs mt-1">{errors.question}</p>
          )}
        </div>

        {/* Options */}
        <div className="mb-6">
          {pollData.options.map((option, index) => (
            <div key={index} className="mb-3">
              <div className="flex items-center">
                <span className="text-gray-400 text-sm mr-2 w-20">
                  Option {index + 1}
                  {index < 2 && <span className="text-red-400 ml-1">*</span>}
                </span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Enter option ${index + 1}`}
                  maxLength={100}
                  className={`flex-1 bg-gray-700 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors[`option${index}`]
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-600 focus:ring-blue-500'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors[`option${index}`] && (
                <p className="text-red-400 text-xs mt-1 ml-24">{errors[`option${index}`]}</p>
              )}
            </div>
          ))}

          {/* Duplicate Options Error */}
          {errors.duplicateOptions && (
            <p className="text-red-400 text-xs mb-3">{errors.duplicateOptions}</p>
          )}

          {/* Add/Remove Buttons */}
          <div className="flex space-x-3 mt-2">
            <button
              onClick={addOption}
              disabled={pollData.options.length >= 4 || isSubmitting}
              className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-white text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Option
            </button>
            <button
              onClick={removeOption}
              disabled={pollData.options.length <= 2 || isSubmitting}
              className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-white text-sm"
            >
              <Minus className="w-4 h-4 mr-1" />
              Remove Option
            </button>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg"
          >
            {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
          </button>
          <button
            onClick={closePollForm}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
