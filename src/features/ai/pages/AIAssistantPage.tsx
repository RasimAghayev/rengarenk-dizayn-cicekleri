import React, { useState, useRef, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Send,
  Bot,
  User,
  Sparkles,
  MessageSquare,
  Zap,
  Heart,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  typing?: boolean;
}

const AIAssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Salam! Mən sizin AI assistentinizəm. Sizə necə kömək edə bilərəm? 🌟",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const aiResponses = [
    "Bu çox maraqlı sualdır! Gəlin birlikdə araşdıraq. 🔍",
    "Mən sizə bu məsələdə kömək edə bilərəm. İşə başlayaq! 💪",
    "Əla seçim! Bu barədə ətraflı danışaq. ✨",
    "Bu mövzu məni həqiqətən maraqlandırır. Daha ətraflı izah edim? 🤔",
    "Siz çox ağıllı sual verdiniz! Cavabım belə olacaq... 🧠",
    "Bu məsələdə sizə praktik məsləhətlər verə bilərəm. 📝",
    "Gözəl! Gəlin bu ideyanı inkişaf etdirək. 🚀",
    "Sizin fikirləriniz həqiqətən yaradıcıdır! 🎨",
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(
      () => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      },
      1500 + Math.random() * 1000,
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    {
      icon: MessageSquare,
      text: "Sual ver",
      action: () => setNewMessage("Mənə bu barədə məlumat ver: "),
    },
    {
      icon: Zap,
      text: "İdea al",
      action: () => setNewMessage("Mənə yaradıcı bir idея ver: "),
    },
    {
      icon: Heart,
      text: "Məsləhət al",
      action: () => setNewMessage("Bu məsələdə məsləhətin nədir: "),
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-brandBlue to-brandGreen rounded-full flex items-center justify-center">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brandBlue to-brandGreen bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <p className="text-muted-foreground mt-2">
            Sizin ağıllı köməkçiniz - hər an, hər yerdə
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4 mb-6">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={action.action}
              className="flex items-center gap-2 hover:bg-brandBlue/10 border-brandBlue/20"
            >
              <action.icon className="w-4 h-4" />
              {action.text}
            </Button>
          ))}
        </div>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-6">
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      {message.sender === "ai" ? (
                        <>
                          <AvatarImage src="/ai-avatar.png" />
                          <AvatarFallback className="bg-gradient-to-br from-brandBlue to-brandGreen text-white">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/user-avatar.png" />
                          <AvatarFallback className="bg-gradient-to-br from-brandRed to-brandGreen text-white">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>

                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-brandBlue to-brandGreen text-white"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs opacity-70 ${
                            message.sender === "user"
                              ? "text-white"
                              : "text-muted-foreground"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString("az-AZ", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {message.sender === "ai" && (
                          <Badge variant="secondary" className="text-xs">
                            AI
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-brandBlue to-brandGreen text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-brandBlue rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-brandBlue rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-brandBlue rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mesajınızı yazın..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isTyping}
                className="bg-gradient-to-r from-brandBlue to-brandGreen hover:from-brandBlue/90 hover:to-brandGreen/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Stats */}
        <div className="flex justify-center gap-6 mt-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>{messages.length} mesaj</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Sürətli cavab</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AIAssistantPage;
