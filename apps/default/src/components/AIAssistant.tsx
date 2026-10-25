import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Save } from 'lucide-react';
import { aiApi } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
}

interface AIAssistantProps {
  innovationTitle: string;
  innovationWhat: string;
  innovationWhy: string;
  categoryColor: string;
  category: string;
}

const quickQuestions = [
  { id: 'roi', label: '💰 ROI', prompt: 'What is the expected return on investment and financial impact for this innovation?' },
  { id: 'student-interest', label: '🎓 Student Interest', prompt: 'How will this appeal to students and increase engagement?' },
  { id: 'steps', label: '📋 Steps', prompt: 'What are the implementation steps for this innovation?' },
];

export const AIAssistant: React.FC<AIAssistantProps> = ({
  innovationTitle,
  innovationWhat,
  innovationWhy,
  categoryColor,
  category,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hi! I'm your Innovation Assistant. I can help you understand the financial, risk, and implementation aspects of "${innovationTitle}" in the South African context. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userName } = useAppStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (question?: string) => {
    const messageText = question || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const context = `${innovationWhat}\n\n${innovationWhy}`;
      const response = await aiApi.askQuestion(messageText, context);
      
      // Validate response has content before adding
      const responseContent = response?.trim() || '';
      
      if (responseContent) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: responseContent,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'I received an empty response. Please try asking again.',
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (prompt: string) => {
    handleSend(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveChat = async () => {
    const hasUserMessages = messages.some(m => m.type === 'user');
    if (messages.length <= 1 || !hasUserMessages) {
      toast.error('No conversation to save yet!');
      return;
    }

    setIsSaving(true);
    try {
      const conversation = messages
        .map((m) => `${m.type === 'user' ? 'User' : 'AI'}: ${m.content}`)
        .join('\n\n');

      await aiApi.saveChatHistory({
        user: userName,
        innovationCard: innovationTitle,
        category,
        conversation,
      });

      toast.success('Chat saved for management review!', {
        style: {
          background: '#000000',
          border: `2px solid ${categoryColor}`,
          color: '#EDEDED',
          boxShadow: `0 0 30px ${categoryColor}60`,
        },
      });
    } catch (error) {
      toast.error('Failed to save chat. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: categoryColor }} />
          <h3 className="text-[#A0A0A0] text-xs font-bold uppercase tracking-wider">
            Ask AI Assistant
          </h3>
        </div>
        <button
          onClick={handleSaveChat}
          disabled={isSaving || messages.length <= 1}
          className="px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-medium bg-white/5 text-[#A0A0A0] hover:bg-white/10 hover:text-[#EDEDED] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-1.5 border border-white/10"
          style={{
            borderColor: `${categoryColor}30`,
          }}
        >
          <Save className="w-3 h-3" />
          <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Chat'}</span>
          <span className="sm:hidden">{isSaving ? '...' : 'Save'}</span>
        </button>
      </div>

      {/* Chat messages */}
      <div className="h-32 sm:h-40 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.filter(msg => msg.content && msg.content.trim()).map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                  message.type === 'user'
                    ? 'bg-white/10 text-[#EDEDED]'
                    : 'bg-white/5 text-[#EDEDED] border border-white/10'
                }`}
                style={
                  message.type === 'ai'
                    ? {
                        borderColor: `${categoryColor}30`,
                        backgroundColor: `${categoryColor}08`,
                      }
                    : undefined
                }
              >
                <div className="whitespace-pre-line">{message.content}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div
              className="px-3 py-2 rounded-xl text-xs border border-white/10"
              style={{
                borderColor: `${categoryColor}30`,
                backgroundColor: `${categoryColor}08`,
              }}
            >
              <div className="flex gap-1">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]"
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick questions */}
      <div className="flex gap-1.5 sm:gap-2 flex-wrap">
        {quickQuestions.map((q) => (
          <button
            key={q.id}
            onClick={() => handleQuickQuestion(q.prompt)}
            disabled={isLoading}
            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium bg-white/5 text-[#A0A0A0] hover:bg-white/10 hover:text-[#EDEDED] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
            style={{
              borderColor: `${categoryColor}30`,
            }}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-1.5 sm:gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about finance, risks..."
          disabled={isLoading}
          className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white/5 border-2 border-white/10 rounded-xl text-[#EDEDED] placeholder-[#A0A0A0] focus:outline-none focus:border-[#2DF9FF]/60 transition-all duration-300 text-xs sm:text-sm disabled:opacity-50"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: categoryColor,
            boxShadow: `0 0 20px ${categoryColor}60`,
          }}
        >
          <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
        </button>
      </div>
    </div>
  );
};
