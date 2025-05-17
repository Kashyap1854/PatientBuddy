import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  FileText,
  Bot,
  User,
  X,
  Loader,
  HelpCircle,
} from "lucide-react";
import Button from "../components/ui/Button";
import { useToast } from "../contexts/ToastContext";

// Sample chat suggestions
const chatSuggestions = [
  "What does my blood test result mean?",
  "Explain my prescription side effects",
  "When should I take this medication?",
  "What are normal cholesterol levels?",
  "How to interpret my MRI report?",
];

// Mock message history with preloaded welcome message
interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

const CHAT_STORAGE_KEY = "patientbuddy_chat_messages";

const getInitialMessages = () => {
  const saved = localStorage.getItem(CHAT_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      return parsed.length
        ? parsed
        : [
            {
              id: "1",
              text:
                "Hello! I'm your Buddy AI Assistant. I can help you understand your medical records, prescriptions, and answer health-related questions. How can I assist you today?",
              sender: "assistant",
              timestamp: new Date(),
            },
          ];
    } catch {
      // If parsing fails, show welcome message
      return [
        {
          id: "1",
          text:
            "Hello! I'm your Buddy AI Assistant. I can help you understand your medical records, prescriptions, and answer health-related questions. How can I assist you today?",
          sender: "assistant",
          timestamp: new Date(),
        },
      ];
    }
  } else {
    return [
      {
        id: "1",
        text:
          "Hello! I'm your Buddy AI Assistant. I can help you understand your medical records, prescriptions, and answer health-related questions. How can I assist you today?",
        sender: "assistant",
        timestamp: new Date(),
      },
    ];
  }
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  // Save messages to localStorage whenever they change
  useEffect(() => {
    console.log("Saving messages to localStorage:", messages);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Test localStorage functionality
  localStorage.setItem("test", JSON.stringify([{ text: "hello" }]));
  console.log(localStorage.getItem("test"));

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedFile) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
      ...(selectedFile && {
        attachment: {
          name: selectedFile.name,
          size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
          type: selectedFile.type,
        },
      }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");
    setSelectedFile(null);
    setIsLoading(true);

    try {
      // Send question to Flask LLM backend
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newUserMessage.text }),
      });

      if (!res.ok) {
        throw new Error("Failed to get answer from AI");
      }

      const data = await res.json();
      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        text: data.answer || "Sorry, I couldn't find an answer.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-ai",
          text: "Sorry, there was an error contacting the AI.",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 20 * 1024 * 1024) {
        // 20MB limit
        showToast("File size exceeds 20MB limit", "error");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-[calc(100vh-9rem)] flex flex-col">
      <div className="bg-white rounded-lg shadow-sm p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <div className="flex items-center">
            <div className="bg-primary-100 p-2 rounded-full mr-3">
              <Bot size={24} className="text-primary-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                AI Health Assistant
              </h1>
              <p className="text-sm text-gray-500">
                Ask anything about your medical records
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<HelpCircle size={16} />}
          >
            How to use
          </Button>
        </div>

        {/* Message area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
                    message.sender === "user"
                      ? "bg-primary-100 ml-2"
                      : "bg-gray-100"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User size={16} className="text-primary-700" />
                  ) : (
                    <Bot size={16} className="text-gray-700" />
                  )}
                </div>

                <div
                  className={`rounded-lg px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.attachment && (
                    <div className="mb-2 p-2 bg-white bg-opacity-20 rounded flex items-center">
                      <FileText size={16} className="mr-2" />
                      <div className="text-sm">
                        <div className="font-medium">
                          {message.attachment.name}
                        </div>
                        <div className="text-xs opacity-80">
                          {message.attachment.size}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.text}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-primary-100"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%]">
                <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-2 bg-gray-100">
                  <Bot size={16} className="text-gray-700" />
                </div>
                <div className="rounded-lg px-4 py-3 bg-gray-100 text-gray-800">
                  <div className="flex items-center">
                    <Loader className="animate-spin mr-2" size={16} />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length < 3 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {chatSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected file preview */}
        {selectedFile && (
          <div className="mb-3 bg-gray-50 rounded-md p-2 flex items-center">
            <FileText size={16} className="text-gray-500 mr-2" />
            <span className="text-sm truncate">{selectedFile.name}</span>
            <span className="text-xs text-gray-500 mx-2">
              ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
            </span>
            <button
              className="ml-auto text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedFile(null)}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Input area */}
        <div className="border-t pt-3">
          <div className="relative flex items-center">
            <input
              type="file"
              id="attachment"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <label
              htmlFor="attachment"
              className="absolute left-3 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <Paperclip size={20} />
            </label>

            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={1}
              style={{ maxHeight: "120px", minHeight: "44px" }}
            />

            <button
              className="absolute right-3 text-primary-500 hover:text-primary-700 disabled:text-gray-300"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() && !selectedFile}
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This AI assistant can help you understand your medical records. For
            medical emergencies, please contact your healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
}
