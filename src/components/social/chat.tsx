
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, onSnapshot, orderBy, serverTimestamp, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Search, Send, LogOut } from 'lucide-react';

interface ChatUser {
  id: string;
  username: string;
  email: string;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
}

export function Chat() {
  const { user, username } = useAuth();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<ChatUser[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getChatId = (user1: string, user2: string) => {
    return [user1, user2].sort().join('_');
  };

  useEffect(() => {
    if (selectedUser && user) {
      const chatId = getChatId(user.uid, selectedUser.id);
      const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
        setMessages(msgs);
      });
      return () => unsubscribe();
    }
  }, [selectedUser, user]);
  
   useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;
    const q = query(collection(db, 'users'), where('username', '==', search));
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatUser));
    setSearchResults(results.filter(u => u.id !== user?.uid));
  };
  
  const handleSelectUser = (user: ChatUser) => {
    setSelectedUser(user);
    setSearch('');
    setSearchResults([]);
     if (!conversations.find(c => c.id === user.id)) {
      setConversations(prev => [...prev, user]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !user || !selectedUser) return;

    const chatId = getChatId(user.uid, selectedUser.id);
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text: message,
      senderId: user.uid,
      createdAt: serverTimestamp(),
    });

    setMessage('');
  };

  return (
    <div className="h-dvh flex text-foreground">
      <aside className="w-1/3 min-w-[300px] bg-card flex flex-col border-r">
        <div className="p-4 border-b flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Avatar>
                <AvatarFallback>{username?.[0].toUpperCase()}</AvatarFallback>
             </Avatar>
             <h2 className="font-semibold">{username}</h2>
           </div>
           <Button variant="ghost" size="icon" onClick={() => signOut(auth)}>
              <LogOut className="h-5 w-5" />
           </Button>
        </div>
        <div className="p-4 border-b">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button type="submit" size="icon"><Search className="h-5 w-5"/></Button>
          </form>
           {searchResults.length > 0 && (
            <ul className="mt-4 space-y-2">
              {searchResults.map(u => (
                <li key={u.id}>
                  <button onClick={() => handleSelectUser(u)} className="w-full text-left p-2 rounded-md hover:bg-secondary">
                    {u.username}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
            <h3 className="p-4 text-sm font-semibold text-muted-foreground">Conversations</h3>
            <ul>
                {conversations.map(c => (
                     <li key={c.id}>
                        <button onClick={() => setSelectedUser(c)} className={`w-full text-left p-4 hover:bg-secondary ${selectedUser?.id === c.id ? 'bg-secondary' : ''}`}>
                            {c.username}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        {selectedUser ? (
            <>
              <header className="p-4 border-b flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{selectedUser.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h2 className="font-semibold">{selectedUser.username}</h2>
              </header>
              <div className="flex-1 p-4 overflow-y-auto bg-secondary/50">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex my-2 ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-lg max-w-lg ${msg.senderId === user?.uid ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <footer className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                      <Button type="submit" size="icon"><Send className="h-5 w-5" /></Button>
                  </form>
              </footer>
            </>
        ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start chatting.
            </div>
        )}
      </main>
    </div>
  );
}
