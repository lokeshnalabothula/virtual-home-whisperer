
import React, { useState, useEffect } from 'react';
import { AssistantFeedback, AssistantMood } from '@/types/types';

interface AIAssistantProps {
  feedback: AssistantFeedback;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ feedback }) => {
  const [mood, setMood] = useState<AssistantMood>('happy');
  
  // Change mood based on feedback
  useEffect(() => {
    if (feedback.isVisible) {
      if (feedback.message.includes("didn't understand")) {
        setMood('confused');
      } else if (feedback.message.includes('Turning on')) {
        setMood('excited');
      } else if (feedback.message.includes('Checking')) {
        setMood('thinking');
      } else {
        setMood('happy');
      }
    }
  }, [feedback]);

  if (!feedback.isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 flex items-end gap-2 animate-fade-in z-50">
      <div className="bg-white rounded-2xl shadow-lg p-4 max-w-xs">
        <div className="flex items-center gap-2">
          <p className="text-gray-800">{feedback.message} {feedback.emoji}</p>
        </div>
      </div>
      <div className={`w-14 h-14 rounded-full bg-smarthome-purple flex items-center justify-center ${mood === 'excited' ? 'animate-bounce' : mood === 'thinking' ? 'animate-pulse' : ''}`}>
        {mood === 'happy' && <span className="text-2xl">😊</span>}
        {mood === 'confused' && <span className="text-2xl">🤔</span>}
        {mood === 'thinking' && <span className="text-2xl">💭</span>}
        {mood === 'excited' && <span className="text-2xl">😃</span>}
      </div>
    </div>
  );
};

export default AIAssistant;
