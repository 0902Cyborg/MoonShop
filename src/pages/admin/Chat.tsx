
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, Send, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ChatMessage {
  id: string;
  user_id: string;
  staff_id: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

interface ChatUser {
  id: string;
  full_name: string;
  unread: number;
  latest_message?: string;
  latest_message_time?: string;
}

const AdminChat: React.FC = () => {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch users who have sent chat messages
  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        setLoading(true);
        
        // Get users with chat messages and count of unread messages
        const { data, error } = await supabase
          .from('chat_messages')
          .select(`
            user_id,
            message,
            created_at,
            is_read,
            profiles:user_id(full_name)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Process data to get unique users with their latest message and unread count
        const usersMap = new Map<string, ChatUser>();
        
        data.forEach((msg: any) => {
          if (!usersMap.has(msg.user_id)) {
            usersMap.set(msg.user_id, {
              id: msg.user_id,
              full_name: msg.profiles?.full_name || 'Unknown User',
              unread: msg.is_read ? 0 : 1,
              latest_message: msg.message,
              latest_message_time: msg.created_at
            });
          } else {
            const user = usersMap.get(msg.user_id)!;
            if (!msg.is_read) {
              user.unread += 1;
            }
          }
        });
        
        setChatUsers(Array.from(usersMap.values()));
      } catch (error) {
        console.error('Error fetching chat users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load chat users',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchChatUsers();
    
    // Set up real-time subscription for new messages
    const chatSubscription = supabase
      .channel('public:chat_messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages' 
        }, 
        (payload) => {
          // Update users list or message count when new message arrives
          const newMessage = payload.new as ChatMessage;
          
          setChatUsers(prevUsers => {
            const existingUserIndex = prevUsers.findIndex(u => u.id === newMessage.user_id);
            
            if (existingUserIndex >= 0) {
              const updatedUsers = [...prevUsers];
              updatedUsers[existingUserIndex] = {
                ...updatedUsers[existingUserIndex],
                unread: updatedUsers[existingUserIndex].unread + 1,
                latest_message: newMessage.message,
                latest_message_time: newMessage.created_at
              };
              return updatedUsers;
            } else {
              // Need to fetch user details for new user
              fetchUserDetails(newMessage.user_id).then(userData => {
                if (userData) {
                  setChatUsers(prev => [
                    {
                      id: newMessage.user_id,
                      full_name: userData.full_name || 'Unknown User',
                      unread: 1,
                      latest_message: newMessage.message,
                      latest_message_time: newMessage.created_at
                    },
                    ...prev
                  ]);
                }
              });
              return prevUsers;
            }
          });
          
          // If the message is for the currently selected user, add it to the messages
          if (selectedUser && newMessage.user_id === selectedUser.id) {
            setMessages(prev => [...prev, newMessage]);
            scrollToBottom();
            markMessagesAsRead(selectedUser.id);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(chatSubscription);
    };
  }, [selectedUser]);
  
  // Fetch user details for a new chat user
  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };
  
  // Fetch messages for selected user
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const fetchMessages = async (userId: string) => {
    try {
      setLoadingMessages(true);
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          profiles:user_id(full_name)
        `)
        .or(`user_id.eq.${userId},staff_id.eq.${userId}`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data as ChatMessage[]);
      
      // Mark messages as read
      markMessagesAsRead(userId);
      
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    } finally {
      setLoadingMessages(false);
    }
  };
  
  const markMessagesAsRead = async (userId: string) => {
    try {
      // Update messages as read
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
      
      if (error) throw error;
      
      // Update local state
      setChatUsers(prev => 
        prev.map(u => 
          u.id === userId ? { ...u, unread: 0 } : u
        )
      );
      
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser || !newMessage.trim() || !user) return;
    
    try {
      const message = {
        user_id: selectedUser.id,
        staff_id: user.id,
        message: newMessage.trim(),
        is_read: true
      };
      
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([message])
        .select();
      
      if (error) throw error;
      
      // Add message to state
      setMessages([...messages, data[0] as ChatMessage]);
      setNewMessage('');
      scrollToBottom();
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  };
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };
  
  // Filter chat users based on search
  const filteredUsers = chatUsers.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customer Chat Support</h1>
      
      <div className="flex h-[calc(80vh-2rem)] rounded-lg overflow-hidden border">
        {/* User list sidebar */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((chatUser) => (
                <div
                  key={chatUser.id}
                  className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                    selectedUser?.id === chatUser.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedUser(chatUser)}
                >
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {chatUser.full_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{chatUser.full_name}</h3>
                        {chatUser.latest_message_time && (
                          <span className="text-xs text-gray-500">
                            {formatTime(chatUser.latest_message_time)}
                          </span>
                        )}
                      </div>
                      {chatUser.latest_message && (
                        <p className="text-sm text-gray-500 truncate">
                          {chatUser.latest_message}
                        </p>
                      )}
                    </div>
                    {chatUser.unread > 0 && (
                      <div className="ml-2 bg-blue-500 text-white text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                        {chatUser.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No customers found matching your search' : 'No customer chats available'}
              </div>
            )}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="w-2/3 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat header */}
              <div className="p-3 border-b flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {selectedUser.full_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-medium">{selectedUser.full_name}</h3>
              </div>
              
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                ) : messages.length > 0 ? (
                  <>
                    {messages.map((message, index) => {
                      const isCurrentUser = message.staff_id === user?.id;
                      const showDateHeader = index === 0 || 
                        formatDate(messages[index-1].created_at) !== formatDate(message.created_at);
                      
                      return (
                        <React.Fragment key={message.id}>
                          {showDateHeader && (
                            <div className="flex justify-center my-2">
                              <div className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
                                {formatDate(message.created_at)}
                              </div>
                            </div>
                          )}
                          
                          <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-lg p-3 ${
                              isCurrentUser 
                                ? 'bg-blue-500 text-white rounded-br-none' 
                                : 'bg-gray-100 rounded-bl-none'
                            }`}>
                              <p>{message.message}</p>
                              <p className={`text-xs mt-1 text-right ${
                                isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {formatTime(message.created_at)}
                              </p>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    No messages yet. Start the conversation!
                  </div>
                )}
              </div>
              
              {/* Message input */}
              <div className="p-3 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a customer to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
