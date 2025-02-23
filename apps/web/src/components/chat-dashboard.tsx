"use client"

import { useState } from "react"
import { MessageCircle, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthModals } from "./auth-modals"

export default function ChatDashboard() {
  const [currentTab, setCurrentTab] = useState("chats")

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b px-6 py-3 flex items-center justify-between bg-background">
        <h1 className="text-xl font-semibold">Chat App</h1>
        <AuthModals />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Card className="w-80 border-r rounded-none border-l-0 border-t-0 border-b-0">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full h-full flex flex-col">
            <div className="flex items-center border-b px-4 py-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chats" className="flex gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Chats
                </TabsTrigger>
                <TabsTrigger value="active" className="flex gap-2">
                  <Users className="h-4 w-4" />
                  Active
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chats" className="flex-1 m-0">
              <ScrollArea className="h-full">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    className="flex items-center gap-4 w-full p-4 hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>{chat.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{chat.name}</span>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <span className="text-xs text-muted-foreground line-clamp-1">{chat.lastMessage}</span>
                    </div>
                    {chat.unread > 0 && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                        {chat.unread}
                      </span>
                    )}
                  </button>
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="active" className="flex-1 m-0">
              <ScrollArea className="h-full">
                {activeUsers.map((user) => (
                  <button
                    key={user.id}
                    className="flex items-center gap-4 w-full p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.status}</span>
                    </div>
                  </button>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center gap-4 border-b p-4 bg-background">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/avatars/01.png" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Sarah Chen</span>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-end gap-2 ${message.sender === "me" ? "flex-row-reverse" : ""}`}
                >
                  {message.sender !== "me" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${message.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground self-end">{message.time}</span>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4 bg-background">
            <form className="flex gap-2">
              <Input className="flex-1" placeholder="Type a message..." />
              <Button>Send</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const chats = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/avatars/01.png",
    lastMessage: "I'll send you the files shortly",
    time: "2m ago",
    unread: 2,
  },
  {
    id: 2,
    name: "Michael Kim",
    avatar: "/avatars/02.png",
    lastMessage: "The meeting is scheduled for tomorrow at 10 AM",
    time: "1h ago",
    unread: 0,
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "/avatars/03.png",
    lastMessage: "Thanks for your help!",
    time: "2h ago",
    unread: 0,
  },
  {
    id: 4,
    name: "Alex Thompson",
    avatar: "/avatars/04.png",
    lastMessage: "Let's discuss this in person",
    time: "1d ago",
    unread: 0,
  },
]

const activeUsers = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/avatars/01.png",
    status: "Online",
  },
  {
    id: 2,
    name: "Michael Kim",
    avatar: "/avatars/02.png",
    status: "Online",
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "/avatars/03.png",
    status: "Online",
  },
]

const messages = [
  {
    sender: "them",
    content: "Hey! How's the project coming along?",
    time: "10:00 AM",
  },
  {
    sender: "me",
    content: "It's going well! I've completed the initial designs",
    time: "10:02 AM",
  },
  {
    sender: "them",
    content: "That's great to hear! Could you share them with me?",
    time: "10:03 AM",
  },
  {
    sender: "me",
    content: "Of course! I'll send you the files shortly",
    time: "10:05 AM",
  },
]

