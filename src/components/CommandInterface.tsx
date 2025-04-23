
import React, { useState, useEffect, useRef } from 'react';
import { CommandType } from '@/types/types';
import { processCommand } from '@/utils/nlpProcessor';

interface CommandInterfaceProps {
  onCommand: (command: CommandType) => void;
}

export const CommandInterface: React.FC<CommandInterfaceProps> = ({ onCommand }) => {
  const [textCommand, setTextCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [supportsSpeech, setSupportsSpeech] = useState(false);
  
  // Check for Web Speech API support
  useEffect(() => {
    setSupportsSpeech('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);
  
  // Handle text command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textCommand.trim()) {
      const command = processCommand(textCommand);
      onCommand(command);
      setTextCommand('');
    }
  };
  
  // Handle voice commands
  const startListening = () => {
    if (!supportsSpeech) return;
    
    setIsListening(true);
    
    // Use any type to bypass TypeScript errors with Speech Recognition API
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTextCommand(transcript);
      const command = processCommand(transcript);
      onCommand(command);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex gap-2 p-2 bg-white rounded-lg shadow-lg">
        <input
          type="text"
          value={textCommand}
          onChange={(e) => setTextCommand(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-smarthome-purple-light focus:border-transparent"
          placeholder="Type your command..."
        />
        <button 
          type="submit" 
          className="bg-smarthome-purple text-white p-2 rounded-md hover:bg-smarthome-purple-dark"
        >
          Send
        </button>
        {supportsSpeech && (
          <button 
            type="button" 
            onClick={startListening}
            className={`p-2 rounded-md ${isListening ? 'bg-red-500 animate-pulse' : 'bg-smarthome-blue'} text-white`}
          >
            {isListening ? 'Listening...' : '🎤'}
          </button>
        )}
      </form>
    </div>
  );
};

export default CommandInterface;
