import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, MessageCircle } from "lucide-react";
import SideBar from "@/components/Dashboard/SideBar";
import { auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: number;
}

const BOT_RESPONSES: { [key: string]: string } = {
  hello: "Hello! 👋 I'm your study buddy. How can I help you today?",
  hi: "Hi there! 😊 Ready to boost your productivity?",
  help: "I can help you with:\n• Setting study goals\n• Managing your tasks\n• Tracking your progress\n• Staying motivated\n\nWhat would you like to know?",
  "study tips": "Here are some effective study tips:\n• Use the Pomodoro Technique (25min focus + 5min break)\n• Break large tasks into smaller chunks\n• Eliminate distractions\n• Take regular breaks\n• Stay hydrated and get enough sleep",
  motivation: "You're doing great! 🌟 Remember:\n• Every small step counts\n• Progress, not perfection\n• You're capable of amazing things\n• Keep pushing forward!\n\nBelieve in yourself! 💪",
  focus: "To improve focus:\n• Use the Focus Timer on the Timer page\n• Turn off notifications\n• Create a dedicated study space\n• Set clear goals for each session\n• Reward yourself after completing tasks",
  pomodoro: "The Pomodoro Technique is simple:\n1. Choose a task\n2. Set timer for 25 minutes\n3. Work until timer rings\n4. Take a 5-minute break\n5. After 4 pomodoros, take a longer 15-30 min break\n\nTry it on our Timer page!",
  "time management": "Effective time management tips:\n• Prioritize tasks using the Eisenhower Matrix\n• Use time blocking\n• Set realistic deadlines\n• Track your time to identify patterns\n• Learn to say no to distractions",
  tasks: "You can manage your tasks on the Tasks page:\n• Create new tasks\n• Set priorities\n• Add images for visual context\n• Mark tasks as complete\n• Filter by status",
  analytics: "Check your Analytics page to:\n• View your total focus time\n• See daily study patterns\n• Track completed tasks\n• Monitor your progress over time",
  break: "Taking breaks is crucial! 🌸\n• Step away from your desk\n• Stretch or do light exercise\n• Hydrate\n• Rest your eyes\n• Clear your mind\n\nYou'll come back refreshed!",
  stress: "Feeling stressed? Try:\n• Deep breathing exercises\n• Short walk or stretch\n• Listen to calming music\n• Talk to someone\n• Remember: It's okay to take breaks!\n\nYou've got this! 💙",
  goals: "Setting effective goals:\n• Make them SMART (Specific, Measurable, Achievable, Relevant, Time-bound)\n• Break big goals into smaller milestones\n• Write them down\n• Review regularly\n• Celebrate your wins!",
  default: "I'm here to help! You can ask me about:\n• Study tips\n• Time management\n• Motivation\n• Focus techniques\n• Tasks and analytics\n\nOr just say 'help' to see more options! 😊",
};

export default function ChatbotPage() {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm NekoMate, your AI study companion! 🐱 How can I assist you today?",
      sender: "bot",
      timestamp: Date.now(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Check for exact matches first
    if (BOT_RESPONSES[lowerMessage]) {
      return BOT_RESPONSES[lowerMessage];
    }

    // Check for partial matches
    for (const [key, response] of Object.entries(BOT_RESPONSES)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    // Special cases
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "You're welcome! Happy to help! 😊 Keep up the great work!";
    }

    if (lowerMessage.includes("bye") || lowerMessage.includes("goodbye")) {
      return "Goodbye! Come back anytime you need study support. Good luck! 👋";
    }

    if (lowerMessage.includes("how are you")) {
      return "I'm doing great, thanks for asking! 😊 Ready to help you achieve your study goals!";
    }

    if (lowerMessage.includes("joke")) {
      return "Why did the student eat their homework? 📚\nBecause the teacher said it was a piece of cake! 😄";
    }

    return BOT_RESPONSES.default;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot typing and response delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickReplies = ["Help", "Study tips", "Motivation", "Focus", "Tasks"];

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans">
      <SideBar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white px-8 py-6 shadow-sm">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-orange-500"
            >
              <Bot size={24} />
            </motion.div>
            <div>
              <h1 className="text-2xl font-semibold text-blue-900">NekoMate AI</h1>
              <p className="text-sm text-gray-600">Your friendly study companion</p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="ml-auto"
            >
              <Sparkles className="text-orange-400" size={20} />
            </motion.div>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-gray-50">
          <div className="mx-auto max-w-4xl space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex gap-3 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-orange-500"
                    >
                      <Bot size={20} />
                    </motion.div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white border border-gray-200 shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm leading-relaxed">
                      {message.text}
                    </p>
                  </motion.div>

                  {message.sender === "user" && (
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500"
                    >
                      <User size={20} />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-orange-500">
                    <Bot size={20} />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                    <motion.div
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="h-2 w-2 rounded-full bg-orange-400"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="h-2 w-2 rounded-full bg-orange-400"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="h-2 w-2 rounded-full bg-orange-400"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Replies */}
        <div className="border-t border-gray-200 bg-white px-8 py-4 shadow-sm">
          <div className="mx-auto max-w-4xl">
            <div className="mb-2 flex items-center gap-2">
              <MessageCircle size={16} className="text-gray-600" />
              <p className="text-xs text-gray-600">Quick replies:</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <motion.button
                  key={reply}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickReply(reply)}
                  className="rounded-full border border-blue-300 bg-blue-50 px-4 py-2 text-sm text-blue-600 transition hover:bg-blue-100"
                >
                  {reply}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white px-8 py-6 shadow-sm">
          <div className="mx-auto max-w-4xl">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={18} />
                Send
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
