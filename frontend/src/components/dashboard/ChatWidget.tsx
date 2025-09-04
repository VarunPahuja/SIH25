import React, { useState } from 'react';
import { MessageCircle, Minimize2, Maximize2, X, Send, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type ChatState = 'floating' | 'docked' | 'fullscreen';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
}

const ChatWidget = () => {
  const isMobile = useIsMobile();
  const [chatState, setChatState] = useState<ChatState>('floating');
  const [message, setMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Manny, your SLCM assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [chatHistories] = useState<ChatHistory[]>([
    { id: '1', title: 'Library Inquiry', lastMessage: 'Book availability question' },
    { id: '2', title: 'Exam Schedule', lastMessage: 'When is my final exam?' },
    { id: '3', title: 'Counselling', lastMessage: 'Career guidance session' },
    { id: '4', title: 'Fee Payment', lastMessage: 'Payment deadline query' },
    { id: '5', title: 'Course Registration', lastMessage: 'How to add electives?' },
  ]);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate bot response after a short delay
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: `Thank you for your message: "${message}". I'm here to help with any SLCM related queries!`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Floating Button State
  if (chatState === 'floating') {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div 
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Button
            onClick={() => setChatState('docked')}
            className="w-14 h-14 rounded-full bg-gradient-orange shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
          >
            <MessageCircle className="w-6 h-6 text-white group-hover:animate-pulse" />
          </Button>
          
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute bottom-16 right-0 bg-popover text-popover-foreground text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap animate-fade-in border border-border">
              Chat with our chatbot Manny
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fullscreen State
  if (chatState === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 bg-background animate-scale-in">
        <div className="flex h-full">
          {/* Left Sidebar - Chat History */}
          <div className={cn(
            "transition-all duration-300 border-r border-border bg-card",
            showSidebar ? "w-80" : "w-0",
            isMobile && showSidebar ? "absolute inset-y-0 left-0 z-10 w-80 shadow-lg" : ""
          )}>
            {showSidebar && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-card-foreground">Chat History</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {chatHistories.map((chat) => (
                    <button
                      key={chat.id}
                      className="w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors duration-200 mb-2"
                    >
                      <div className="font-medium text-sm text-card-foreground mb-1">{chat.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{chat.lastMessage}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="hover:bg-secondary transition-colors duration-200"
                >
                  <Menu className="w-4 h-4" />
                </Button>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-orange text-white text-sm font-semibold">
                    M
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">Manny - Your AI Assistant</h2>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setChatState('docked')}
                  className="hover:bg-secondary transition-colors duration-200"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setChatState('floating')}
                  className="hover:bg-secondary transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn(
                    "flex items-start space-x-3",
                    msg.sender === 'user' && "flex-row-reverse space-x-reverse"
                  )}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={cn(
                        "text-white text-sm font-semibold",
                        msg.sender === 'bot' ? "bg-gradient-orange" : "bg-primary"
                      )}>
                        {msg.sender === 'bot' ? 'M' : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "rounded-2xl p-4 max-w-md break-words",
                      msg.sender === 'bot' 
                        ? "bg-secondary rounded-tl-md" 
                        : "bg-primary text-primary-foreground rounded-tr-md"
                    )}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="border-t border-border p-4 bg-card">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-3">
                  <Input
                    type="text"
                    placeholder="Ask Manny anything about SLCM..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 h-12"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="h-12 px-6 bg-gradient-orange"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobile && showSidebar && (
          <div 
            className="absolute inset-0 bg-black/50 z-5"
            onClick={() => setShowSidebar(false)}
          />
        )}
      </div>
    );
  }

  // Docked Panel State - Mobile Bottom Sheet
  if (isMobile) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-in-right">
        <div className="bg-card border-t border-border rounded-t-2xl shadow-lg max-h-[70vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-gradient-orange text-white text-xs font-semibold">
                  M
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-sm">Manny</h3>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setChatState('fullscreen')}
                className="h-8 w-8 hover:bg-secondary transition-colors duration-200"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setChatState('floating')}
                className="h-8 w-8 hover:bg-secondary transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto min-h-[200px]">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex items-start space-x-2",
                  msg.sender === 'user' && "flex-row-reverse space-x-reverse"
                )}>
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className={cn(
                      "text-white text-xs font-semibold",
                      msg.sender === 'bot' ? "bg-gradient-orange" : "bg-primary"
                    )}>
                      {msg.sender === 'bot' ? 'M' : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "rounded-lg p-3 text-xs max-w-[250px] break-words",
                    msg.sender === 'bot' 
                      ? "bg-secondary rounded-tl-sm" 
                      : "bg-primary text-primary-foreground rounded-tr-sm"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 h-10 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                size="icon"
                className="h-10 w-10 bg-gradient-orange"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Docked Panel State - Desktop
  return (
    <div className="fixed bottom-20 right-6 z-50 animate-slide-in-right">
      <Card className="w-80 h-96 shadow-glass backdrop-blur-glass bg-card border-border">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="bg-gradient-orange text-white text-xs font-semibold">
                M
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-sm">Manny</h3>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setChatState('fullscreen')}
              className="h-6 w-6 hover:bg-secondary/50 transition-colors duration-200"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setChatState('floating')}
              className="h-6 w-6 hover:bg-secondary/50 transition-colors duration-200"
            >
              <Minimize2 className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>

        {/* Chat Messages */}
        <CardContent className="p-0 flex flex-col h-full">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex items-start space-x-2",
                  msg.sender === 'user' && "flex-row-reverse space-x-reverse"
                )}>
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className={cn(
                      "text-white text-xs font-semibold",
                      msg.sender === 'bot' ? "bg-gradient-orange" : "bg-primary"
                    )}>
                      {msg.sender === 'bot' ? 'M' : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "rounded-lg p-3 text-xs max-w-[200px] break-words",
                    msg.sender === 'bot' 
                      ? "bg-secondary rounded-tl-sm" 
                      : "bg-primary text-primary-foreground rounded-tr-sm"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-border">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 h-8 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                size="icon"
                className="h-8 w-8 bg-gradient-orange"
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatWidget;