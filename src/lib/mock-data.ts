
export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  lastMessage?: string;
  lastMessageTime?: string;
  online?: boolean;
  mobile?: string;
}

export interface Message {
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

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice', username: 'alice_in_wonderland', mobile: '111-222-3333', avatarUrl: 'https://placehold.co/100x100/a2d2ff/333.png', lastMessage: 'See you tomorrow!', lastMessageTime: '10:42 AM', online: true },
  { id: 'user-2', name: 'Bob', username: 'bob_the_builder', mobile: '222-333-4444', avatarUrl: 'https://placehold.co/100x100/ffb3ba/333.png', lastMessage: 'Sounds good!', lastMessageTime: '10:30 AM' },
  { id: 'user-3', name: 'Charlie', username: 'charlie_brown', mobile: '333-444-5555', avatarUrl: 'https://placehold.co/100x100/bae1ff/333.png', lastMessage: 'Can you send the file?', lastMessageTime: 'Yesterday' },
  { id: 'user-4', name: 'Diana', username: 'diana_prince', mobile: '444-555-6666', avatarUrl: 'https://placehold.co/100x100/ffffba/333.png', lastMessage: 'Just checking in.', lastMessageTime: 'Yesterday', online: true },
  { id: 'user-5', name: 'Eve', username: 'eve_online', mobile: '555-666-7777', avatarUrl: 'https://placehold.co/100x100/baffc9/333.png' },
  { id: 'user-6', name: 'Frank', username: 'frankenstein', mobile: '666-777-8888', avatarUrl: 'https://placehold.co/100x100/ffdfba/333.png' },
];

export const mockMessages: { [key: string]: Message[] } = {
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
  ],
  'user-5': [],
  'user-6': [],
};
