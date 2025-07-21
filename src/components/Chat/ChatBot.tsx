import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { clsx } from 'clsx';

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m SafePath Assistant. I can help you with safety concerns, route planning, or answer questions about staying safe. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const generateBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('emergency') || lowerInput.includes('help') || lowerInput.includes('panic')) {
      return 'If this is an emergency, please call 911 immediately. You can also use the red panic button on the map to alert your emergency contacts. Would you like me to guide you to the nearest safe location?';
    }
    
    if (lowerInput.includes('route') || lowerInput.includes('path') || lowerInput.includes('navigation')) {
      return 'I can help you find the safest route to your destination. Simply tap on the map to set your destination, and I\'ll calculate the best path considering safety factors like lighting, crime data, and police proximity.';
    }
    
    if (lowerInput.includes('report') || lowerInput.includes('unsafe') || lowerInput.includes('incident')) {
      return 'To report a safety concern, tap the "Report" button in the navigation bar. You can anonymously report harassment, poor lighting, crime, or other safety issues. Your reports help keep the community safe.';
    }
    
    if (lowerInput.includes('safe') || lowerInput.includes('safety')) {
      return 'Your current safety score is displayed in the top-left corner of the map. It\'s calculated using real-time data including crime statistics, lighting conditions, and community reports. Scores above 70 indicate safe areas.';
    }
    
    return 'I understand you need help with safety. Here are some things I can assist with:\n\n• Finding safe routes to your destination\n• Explaining safety features\n• Helping with incident reporting\n• Providing safety tips\n\nWhat specific safety concern can I help you with?';
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 left-4 z-10 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-10 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <span className="font-medium">SafePath Assistant</span>
        </div>
        <button onClick={onToggle} className="text-white hover:text-gray-200">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={clsx(
              'flex items-start space-x-2',
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            )}
          >
            <div className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
              message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-200'
            )}>
              {message.sender === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-gray-600" />
              )}
            </div>
            <div className={clsx(
              'max-w-[80%] p-3 rounded-lg text-sm',
              message.sender === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-900 rounded-bl-none'
            )}>
              <p className="whitespace-pre-line">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};