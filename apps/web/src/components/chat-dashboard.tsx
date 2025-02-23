"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthModals } from "./auth-modals"
import { apiClient } from "@/lib/api-client"
import { socketService } from "@/lib/socket-service"

interface Message {
  sender: string;
  content: string;
  timestamp?: string;
}

interface Conversation {
  conversation_id: string;
  username: string;
  last_message: string;
  last_sender: string;
}

interface ActiveUser {
  username: string;
}

function decodeJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export default function ChatDashboard() {
  const [currentTab, setCurrentTab] = useState("chats")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
  const [loadingActiveUsers, setLoadingActiveUsers] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentUsername, setCurrentUsername] = useState<string>("")

  // Add new ref for message container
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  // Connect to WebSocket when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('jwt')
      if (token) {
        const socket = socketService.connect(token)
        
        socket.on('emit_message', (message: Message) => {
          setMessages(prev => [...prev, message])
        })

        // Cleanup on unmount
        return () => {
          socketService.disconnect()
        }
      }
    }
  }, [isAuthenticated])

  // Fetch conversation messages when user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchConversation(selectedUser)
    }
  }, [selectedUser])

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      const decoded = decodeJwt(jwt);
      if (decoded?.username) {
        setCurrentUsername(decoded.username);
      }
    }
  }, []);

  // Update the scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Modify the useEffect for scrolling
  useEffect(() => {
    // Only scroll if the new message is from the current user or it's the initial load
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.sender === currentUsername || messages.length === 0) {
      scrollToBottom()
    }
  }, [messages, currentUsername])

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

  const fetchConversation = async (username: string) => {
    try {
      const response = await apiClient.getConversation(username)
      setMessages(response.messages)
    } catch (error) {
      console.error('Failed to fetch conversation:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !newMessage.trim()) return

    const socket = socketService.getSocket()
    if (socket) {
      socket.emit('on_message', JSON.stringify({
        receiver: selectedUser,
        content: newMessage
      }))
      
      // Optimistically add message to UI
      // setMessages(prev => [...prev, {
      //   sender: currentUsername,
      //   content: newMessage
      // }])
      
      setNewMessage("")
    }
  }

  const handleUserSelect = (username: string) => {
    setSelectedUser(username)
    fetchConversation(username) // Fetch conversation history when selecting any user
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
                      onClick={() => handleUserSelect(conversation.username)}
                      className={`flex items-center gap-4 w-full p-4 hover:bg-muted/50 transition-colors ${
                        selectedUser === conversation.username ? 'bg-muted' : ''
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{conversation.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{conversation.username}</span>
                        </div>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {conversation.last_sender === 'me' ? 'You: ' : `${conversation.last_sender}: `}
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
                      onClick={() => handleUserSelect(user.username)}
                      className={`flex items-center gap-4 w-full p-4 hover:bg-muted/50 transition-colors ${
                        selectedUser === user.username ? 'bg-muted' : ''
                      }`}
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
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Chat Header */}
          {selectedUser && (
            <div className="flex items-center gap-4 border-b p-4 bg-background">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{selectedUser[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{selectedUser}</span>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {messages.length === 0 && selectedUser && (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                )}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-end gap-2 ${
                      message.sender === currentUsername ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender !== currentUsername && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{message.sender[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.sender === currentUsername
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.sender === currentUsername && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{currentUsername[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    {message.timestamp && (
                      <span className="text-[10px] text-muted-foreground self-end">
                        {message.timestamp}
                      </span>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} /> {/* Scroll anchor */}
              </div>
            </ScrollArea>
          </div>

          {/* Input */}
          {selectedUser && (
            <div className="border-t p-4 bg-background">
              <form className="flex gap-2" onSubmit={handleSendMessage}>
                <Input 
                  className="flex-1" 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit" disabled={!newMessage.trim()}>Send</Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

