import React, { useState, useEffect, useRef } from 'react';
import { CommandType } from '@/types/types';
import { processCommand } from '@/utils/nlpProcessor';
import { Mic, MicOff, Send, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

function ReplyBubble({ text, visible }: { text: string, visible: boolean }) {
  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 bottom-20 z-50 transition-all duration-500 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"} animate-fade-in`}
      style={{
        pointerEvents: "none",
      }}
    >
      <div className="flex items-center gap-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white px-6 py-3 rounded-3xl shadow-xl backdrop-blur-lg text-lg font-semibold border border-white/20">
        <Sparkles className="animate-bounce" />
        {text}
      </div>
    </div>
  );
}

interface CommandInterfaceProps {
  onCommand: (command: CommandType) => void;
}

export const CommandInterface: React.FC<CommandInterfaceProps> = ({ onCommand }) => {
  const [textCommand, setTextCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [supportsSpeech, setSupportsSpeech] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const bgRecognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    setSupportsSpeech('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setupBackgroundListening();
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.abort();
      }
      if (bgRecognitionRef.current) {
        bgRecognitionRef.current.onresult = null;
        bgRecognitionRef.current.onend = null;
        bgRecognitionRef.current.onerror = null;
        bgRecognitionRef.current.abort();
      }
    };
  }, []);

  const setupBackgroundListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const bgRecognition = new SpeechRecognition();

    bgRecognition.continuous = true;
    bgRecognition.interimResults = false;
    bgRecognition.lang = 'en-US';

    bgRecognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      if (transcript.includes('bala')) {
        bgRecognition.stop();
        setIsVisible(true);
        setTimeout(() => {
          startListening();
        }, 400);
      }
    };

    bgRecognition.onend = () => {
      if (!isListening && !isVisible) {
        bgRecognition.start();
      }
    };

    bgRecognition.onerror = (event: any) => {
      setTimeout(() => {
        if (!isListening && !isVisible) {
          bgRecognition.start();
        }
      }, 1200);
    };

    bgRecognition.start();
    bgRecognitionRef.current = bgRecognition;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textCommand.trim()) {
      const command = processCommand(textCommand);
      onCommand(command);

      setReply(`"${textCommand}" received!`);
      setTimeout(() => setReply(null), 2100);

      setTextCommand('');
      setTimeout(() => {
        setIsVisible(false);
        setupBackgroundListening();
      }, 2200);
    }
  };

  const startListening = () => {
    if (!supportsSpeech) return;
    setIsListening(true);

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let innerTranscript = '';

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      setTextCommand(transcript);
      innerTranscript = transcript;

      if (event.results[event.results.length - 1].isFinal) {
        const command = processCommand(transcript);
        onCommand(command);

        setReply(`"${transcript}" received!`);
        setTimeout(() => setReply(null), 2200);

        setTimeout(() => {
          setIsVisible(false);
          setTextCommand('');
          setIsListening(false);
          setupBackgroundListening();
        }, 2220);
      }
    };

    recognition.onerror = (_event: any) => {
      setIsListening(false);
      toast({
        title: "Voice error",
        description: "Couldn't capture voice. Try again or type.",
        duration: 2000,
      });
      setupBackgroundListening();
    };

    recognition.onend = () => {
      setIsListening(false);
      if (innerTranscript === '') setupBackgroundListening();
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  useEffect(() => {
    if (!isVisible) {
      setupBackgroundListening();
    }
  }, [isVisible]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
        setIsListening(false);
        setupBackgroundListening();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-7 right-7 p-4 shadow-xl rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-400 animate-pulse hover:scale-110 transition-transform duration-200"
        aria-label="Activate Bala"
      >
        <Mic className="text-white" size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[95vw] max-w-lg z-40 transition duration-300 scale-100 drop-shadow-2xl">
      {reply && <ReplyBubble text={reply} visible={!!reply} />}

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 items-center px-3 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 rounded-3xl shadow-lg backdrop-blur-lg animate-fade-in relative"
      >
        <input
          type="text"
          value={textCommand}
          onChange={(e) => setTextCommand(e.target.value)}
          className="flex-1 px-5 py-4 bg-white/70 border-0 rounded-2xl focus:outline-none text-lg font-medium shadow-inner"
          placeholder={isListening ? "Listening..." : "Ask Bala anything..."}
          autoFocus
        />
        <button
          type="submit"
          className="bg-white/90 text-purple-800 px-4 py-3 rounded-2xl hover:bg-gray-100 transition-colors shadow-md"
        >
          <Send size={24} />
        </button>
        {supportsSpeech && (
          <button
            type="button"
            onClick={startListening}
            className={`ml-2 px-4 py-3 rounded-2xl ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-white/90 text-purple-700'} transition-colors shadow-md`}
            aria-label={isListening ? "Stop Listening" : "Voice Command"}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
        )}
      </form>
      {isListening && (
        <div className="mt-2 text-center font-semibold text-white/90 bg-purple-800/80 rounded-xl py-2 animate-fade-in">
          Listening...
        </div>
      )}
    </div>
  );
};

export default CommandInterface;
