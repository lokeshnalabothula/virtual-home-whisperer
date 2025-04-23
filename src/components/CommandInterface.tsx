
import React, { useState, useEffect, useRef } from 'react';
import { CommandType } from '@/types/types';
import { processCommand } from '@/utils/nlpProcessor';
import { Mic, MicOff, Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CommandInterfaceProps {
  onCommand: (command: CommandType) => void;
}

export const CommandInterface: React.FC<CommandInterfaceProps> = ({ onCommand }) => {
  const [textCommand, setTextCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [supportsSpeech, setSupportsSpeech] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  
  // Check for Web Speech API support
  useEffect(() => {
    setSupportsSpeech('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    
    // Setup background listening for activation phrase "Bala"
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setupBackgroundListening();
    }
    
    return () => {
      // Cleanup recognition
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.abort();
      }
    };
  }, []);
  
  // Setup background listening for wake word "Bala"
  const setupBackgroundListening = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const bgRecognition = new SpeechRecognition();
    
    bgRecognition.continuous = true;
    bgRecognition.interimResults = false;
    bgRecognition.lang = 'en-US';
    
    bgRecognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("Background heard:", transcript);
      
      if (transcript.includes('bala')) {
        bgRecognition.stop(); // Stop background listening
        setIsVisible(true); // Show command interface
        toast({
          title: "Hello!",
          description: "I'm listening. What would you like me to do?",
          duration: 3000
        });
        // Start active listening after a brief pause
        setTimeout(() => {
          startListening();
        }, 300);
      }
    };
    
    bgRecognition.onend = () => {
      // Restart background listening if not actively listening
      if (!isListening) {
        bgRecognition.start();
      }
    };
    
    bgRecognition.onerror = (event: any) => {
      console.error('Background speech recognition error', event.error);
      // Restart on error after a delay
      setTimeout(() => {
        if (!isListening) {
          bgRecognition.start();
        }
      }, 2000);
    };
    
    // Start background listening
    bgRecognition.start();
    recognitionRef.current = bgRecognition;
  };
  
  // Handle text command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textCommand.trim()) {
      const command = processCommand(textCommand);
      onCommand(command);
      
      // Show Siri-like response
      toast({
        title: "Processing command",
        description: `"${textCommand}"`,
        duration: 2000
      });
      
      setTextCommand('');
      // Hide interface after processing
      setTimeout(() => {
        setIsVisible(false);
        // Resume background listening
        setupBackgroundListening();
      }, 2000);
    }
  };
  
  // Handle voice commands - IMPROVED FUNCTIONALITY
  const startListening = () => {
    if (!supportsSpeech) return;
    
    setIsListening(true);
    
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true; // Enable interim results for faster response
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: any) => {
      // Get both interim and final results
      const transcript = event.results[0][0].transcript;
      // Update text field in real time
      setTextCommand(transcript);
      
      // Process command only on final result
      if (event.results[0].isFinal) {
        const command = processCommand(transcript);
        onCommand(command);
        
        // Show Siri-like response
        toast({
          title: "I heard you say",
          description: `"${transcript}"`,
          duration: 3000
        });
        
        // Hide interface after processing
        setTimeout(() => {
          setIsVisible(false);
          // Resume background listening
          setupBackgroundListening();
        }, 3000);
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      toast({
        title: "Voice Recognition Error",
        description: "Please try again or type your command",
        duration: 3000
      });
      setIsListening(false);
      // Resume background listening
      setupBackgroundListening();
    };
    
    recognition.onend = () => {
      setIsListening(false);
      // If no result was captured, resume background listening
      if (textCommand.trim() === '') {
        setupBackgroundListening();
      }
    };
    
    recognition.start();
    recognitionRef.current = recognition;
  };

  // Handle escape key to close interface
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
        setupBackgroundListening();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  // Animation for showing/hiding interface
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isVisible]);

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-smarthome-purple text-white rounded-full shadow-lg hover:bg-smarthome-purple-dark"
        aria-label="Open command interface"
      >
        <Mic size={24} />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md transition-all duration-300 ${isAnimating ? 'scale-95 opacity-90' : 'scale-100 opacity-100'}`}>
      <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl backdrop-blur-md">
        <input
          type="text"
          value={textCommand}
          onChange={(e) => setTextCommand(e.target.value)}
          className="flex-1 p-4 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-lg font-medium"
          placeholder={isListening ? "Listening..." : "Say 'Bala' to activate..."}
          autoFocus
        />
        <button 
          type="submit" 
          className="bg-white/90 text-purple-700 p-4 rounded-xl hover:bg-white transition-colors"
        >
          <Send size={22} />
        </button>
        {supportsSpeech && (
          <button 
            type="button" 
            onClick={startListening}
            className={`p-4 rounded-xl ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/90'} text-purple-700 transition-colors`}
          >
            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
        )}
      </form>
      {isListening && (
        <div className="mt-2 text-center font-medium text-white bg-purple-600/80 rounded-xl p-2 backdrop-blur-sm animate-pulse">
          Listening...
        </div>
      )}
    </div>
  );
};

export default CommandInterface;
