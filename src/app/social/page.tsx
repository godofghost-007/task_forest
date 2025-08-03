
'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, Send, Smile, Image as ImageIcon, FileText, Film, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';


interface User {
  id: string;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  online?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  text?: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  file?: {
    name: string;
    url: string;
    size?: string;
  };
}

const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice', avatarUrl: 'https://placehold.co/100x100/a2d2ff/333.png', lastMessage: 'See you tomorrow!', lastMessageTime: '10:42 AM', online: true },
  { id: 'user-2', name: 'Bob', avatarUrl: 'https://placehold.co/100x100/ffb3ba/333.png', lastMessage: 'Sounds good!', lastMessageTime: '10:30 AM' },
  { id: 'user-3', name: 'Charlie', avatarUrl: 'https://placehold.co/100x100/bae1ff/333.png', lastMessage: 'Can you send the file?', lastMessageTime: 'Yesterday' },
  { id: 'user-4', name: 'Diana', avatarUrl: 'https://placehold.co/100x100/ffffba/333.png', lastMessage: 'Just checking in.', lastMessageTime: 'Yesterday', online: true },
];

const mockMessages: { [key: string]: Message[] } = {
  'user-1': [
    { id: 'msg-1', senderId: 'user-1', text: 'Hey, how is the project going?', timestamp: '10:40 AM', type: 'text' },
    { id: 'msg-2', senderId: 'me', text: 'It\'s going well! Almost done.', timestamp: '10:41 AM', type: 'text' },
    { id: 'msg-3', senderId: 'user-1', text: 'Great! See you tomorrow!', timestamp: '10:42 AM', type: 'text' },
    { id: 'msg-4', senderId: 'me', file: { name: 'preview-screenshot.png', url: 'https://placehold.co/400x300.png', size: '128 KB' }, timestamp: '10:43 AM', type: 'image' },
  ],
  'user-2': [
    { id: 'msg-5', senderId: 'user-2', text: 'Lunch at 1?', timestamp: '10:30 AM', type: 'text' },
    { id: 'msg-6', senderId: 'me', text: 'Sounds good!', timestamp: '10:30 AM', type: 'text' },
  ],
  'user-3': [
    { id: 'msg-7', senderId: 'me', text: 'Here is the document we talked about.', timestamp: 'Yesterday', type: 'text' },
    { id: 'msg-8', senderId: 'me', file: { name: 'Project-Brief.pdf', url: '#', size: '2.3 MB' }, timestamp: 'Yesterday', type: 'file' },
    { id: 'msg-9', senderId: 'user-3', text: 'Thanks! Can you send the file?', timestamp: 'Yesterday', type: 'text' },
  ],
  'user-4': [
    { id: 'msg-10', senderId: 'user-4', text: 'Just checking in.', timestamp: 'Yesterday', type: 'text' },
  ]
};

// Mock current user
const currentUser = {
    id: 'me',
    name: 'You',
    avatarUrl: 'https://placehold.co/100x100/e0e0e0/333.png'
};


function AttachmentMenu({ onFileSelect }: { onFileSelect: (file: File) => void }) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const imageInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileClick = (ref: React.RefObject<HTMLInputElement>) => ref.current?.click();
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onFileSelect(event.target.files[0]);
        }
    };
    
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Paperclip className="h-5 w-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
                <div className="grid grid-cols-3 gap-2">
                    <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                    <Button variant="outline" className="flex flex-col h-20 w-20" onClick={() => handleFileClick(imageInputRef)}>
                        <ImageIcon className="h-6 w-6 mb-1"/>
                        <span className="text-xs">Image</span>
                    </Button>
                     <Button variant="outline" className="flex flex-col h-20 w-20" onClick={() => handleFileClick(fileInputRef)}>
                        <FileText className="h-6 w-6 mb-1"/>
                        <span className="text-xs">Document</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20 w-20" disabled>
                        <Film className="h-6 w-6 mb-1"/>
                        <span className="text-xs">GIF</span>
                    </Button>
                     <Button variant="outline" className="flex flex-col h-20 w-20" disabled>
                        <StickyNote className="h-6 w-6 mb-1"/>
                        <span className="text-xs">Sticker</span>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

function MessageBubble({ message }: { message: Message }) {
    const isMe = message.senderId === 'me';
    
    const renderContent = () => {
        switch (message.type) {
            case 'image':
                return (
                    <img 
                        src={message.file?.url} 
                        alt={message.file?.name}
                        data-ai-hint="chat image"
                        className="rounded-lg max-w-xs cursor-pointer" 
                    />
                );
            case 'file':
                return (
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                            <p className="font-medium truncate max-w-[150px]">{message.file?.name}</p>
                            <p className="text-xs text-muted-foreground">{message.file?.size}</p>
                        </div>
                    </div>
                );
            case 'text':
            default:
                return <p>{message.text}</p>;
        }
    };

    return (
        <div className={cn('flex items-end gap-2 my-2', isMe ? 'justify-end' : 'justify-start')}>
             {!isMe && (
                <Avatar className="h-8 w-8">
                    <AvatarImage src={mockUsers.find(u => u.id === message.senderId)?.avatarUrl} />
                    <AvatarFallback>{mockUsers.find(u => u.id === message.senderId)?.name.charAt(0)}</AvatarFallback>
                </Avatar>
            )}
            <div className={cn(
                'max-w-md rounded-2xl px-4 py-2',
                 isMe ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none'
            )}>
               {renderContent()}
            </div>
            {isMe && (
                 <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatarUrl} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
            )}
        </div>
    );
}


export default function SocialPage() {
  const [selectedUser, setSelectedUser] = useState<User>(mockUsers[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages[mockUsers[0].id]);
  const [messageInput, setMessageInput] = useState('');

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setMessages(mockMessages[user.id] || []);
  };
  
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessageInput(prevInput => prevInput + emojiData.emoji);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: 'me',
        text: messageInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };
  
  const handleFileUpload = (file: File) => {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: file.type.startsWith('image/') ? 'image' : 'file',
        file: {
            name: file.name,
            url: URL.createObjectURL(file), // Create a temporary local URL
            size: `${(file.size / 1024).toFixed(2)} KB`
        }
      };
      setMessages([...messages, newMessage]);
  }

  return (
    <AppLayout>
        <div className="h-full w-full flex bg-secondary">
           <Card className="h-full w-1/3 min-w-[300px] max-w-[400px] rounded-r-none border-r flex flex-col">
                <header className="p-4 border-b">
                    <h2 className="text-xl font-bold font-headline">Chats</h2>
                    <Input placeholder="Search or start new chat" className="mt-2" />
                </header>
                <ScrollArea className="flex-1">
                    {mockUsers.map(user => (
                        <div 
                            key={user.id} 
                            className={cn(
                                "flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary/70",
                                selectedUser.id === user.id && 'bg-secondary'
                            )}
                            onClick={() => handleUserSelect(user)}
                        >
                            <Avatar className="h-12 w-12 relative">
                                <AvatarImage src={user.avatarUrl} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                {user.online && <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />}
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <h3 className="font-semibold truncate">{user.name}</h3>
                                <p className="text-sm text-muted-foreground truncate">{user.lastMessage}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{user.lastMessageTime}</span>
                        </div>
                    ))}
                </ScrollArea>
           </Card>
           <div className="flex-1 flex flex-col h-full">
                <header className="flex items-center gap-4 p-4 border-b bg-card">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedUser.avatarUrl} />
                        <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold">{selectedUser.name}</h3>
                        <p className="text-sm text-green-500">{selectedUser.online ? 'Online' : 'Offline'}</p>
                    </div>
                </header>
                <ScrollArea className="flex-1 p-4 bg-background">
                    <div className="flex flex-col">
                        {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
                    </div>
                </ScrollArea>
                <footer className="p-4 border-t bg-card">
                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-muted-foreground">
                                    <Smile className="h-5 w-5" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 border-0">
                                <EmojiPicker onEmojiClick={onEmojiClick} />
                            </PopoverContent>
                        </Popover>
                        
                        <AttachmentMenu onFileSelect={handleFileUpload}/>

                        <Input 
                            placeholder="Type a message..." 
                            className="flex-1"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button size="icon" onClick={handleSendMessage}>
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </footer>
           </div>
        </div>
    </AppLayout>
  );
}
