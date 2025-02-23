"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthModals } from "./auth-modals"
import { apiClient } from "@/lib/api-client"

interface Conversation {
  conversation_id: string;
  last_message: string;
  last_sender: string;
}

interface ActiveUser {
  username: string;
}

export default function ChatDashboard() {
  const [currentTab, setCurrentTab] = useState("chats")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
  const [loadingActiveUsers, setLoadingActiveUsers] = useState(false)

  useEffect(() => {
    const jwt = localStorage.getItem('jwt')
    setIsAuthenticated(!!jwt)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      // Initial fetch
      fetchRecentConversations()
      fetchActiveUsers()

      // Set up polling for active users
      const pollInterval = setInterval(() => {
        fetchActiveUsers()
      }, 10000) // 10 seconds

      // Cleanup function to clear interval when component unmounts
      // or when isAuthenticated changes
      return () => clearInterval(pollInterval)
    }
  }, [isAuthenticated]) // Only re-run effect if isAuthenticated changes

  const fetchRecentConversations = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getRecentConversations()
      setConversations(response.conversations)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchActiveUsers = async () => {
    try {
      setLoadingActiveUsers(true)
      const response = await apiClient.getActiveUsers()
      setActiveUsers(response.usernames.map(username => ({ username })))
    } catch (error) {
      console.error('Failed to fetch active users:', error)
    } finally {
      setLoadingActiveUsers(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b px-6 py-3 flex items-center justify-between bg-background">
        <h1 className="text-xl font-semibold">Chat App</h1>
        <AuthModals onLogin={() => setIsAuthenticated(true)} />
      </header>

      {/* Main Content */}
      <div className={`flex flex-1 overflow-hidden relative ${!isAuthenticated ? 'pointer-events-none' : ''}`}>
        {!isAuthenticated && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <p className="text-lg text-muted-foreground">Please login to access the chat</p>
          </div>
        )}
        
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
                {loading ? (
                  <div className="flex items-center justify-center p-4">
                    <p className="text-sm text-muted-foreground">Loading conversations...</p>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex items-center justify-center p-4">
                    <p className="text-sm text-muted-foreground">No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.conversation_id}
                      className="flex items-center gap-4 w-full p-4 hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{conversation.last_sender[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{conversation.last_sender}</span>
                        </div>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {conversation.last_message}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="active" className="flex-1 m-0">
              <ScrollArea className="h-full">
                {loadingActiveUsers ? (
                  <div className="flex items-center justify-center p-4">
                    <p className="text-sm text-muted-foreground">Loading active users...</p>
                  </div>
                ) : !activeUsers || activeUsers.length === 0 ? (
                  <div className="flex items-center justify-center p-4">
                    <p className="text-sm text-muted-foreground">No active users</p>
                  </div>
                ) : (
                  activeUsers.map((user) => (
                    <button
                      key={user.username}
                      className="flex items-center gap-4 w-full p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{user.username}</span>
                        <span className="text-xs text-muted-foreground">Online</span>
                      </div>
                    </button>
                  ))
                )}
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

