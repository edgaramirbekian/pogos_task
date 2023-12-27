import { Socket } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import InputFieldComponent from './InputFieldComponent'; // Assuming you have this component
import ButtonComponent from './ButtonComponent'; // Assuming you have this component
import { Chat, Message } from '../serverObjTypes/serverObjTypes';
import { wsConnect, wsDisconnect, wsRegisterMessageHandler, wsSendMessage, wsUnRegisterMessageHandler } from '../services/serverRequests';
import ChatComponent from './ChatComponent';

interface ChatProviderProps {
    authToken: string;
    chat: Chat | null;
    username: string
    logout: () => void;
  }

const ChatProvider: React.FC<ChatProviderProps> = ({authToken, chat, username, logout}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    // const [message, setMessage] = useState<string>('');
    // const [chatMessages, setChatMessages] = useState<Array<Message>>([]);
    // const [peers, setPeers] = useState<Array<string>>([]);

    useEffect(() => {
        console.log(`UseEffect`);
        const newSocket = wsConnect({auth: {jwtToken: authToken, username: username}});

        // wsRegisterMessageHandler(newSocket, 'connect', (username: string) => {
        //     setPeers((prevPeers) => [...prevPeers, username]);
        // });
        // wsRegisterMessageHandler(newSocket, 'disconnect', (username: string) => {
        //     setPeers((prevPeers) => prevPeers.filter((peerUsername) => peerUsername !== username));
        // });
        // wsRegisterMessageHandler(newSocket, 'sendMessage', (message: Message) => {
        //     setChatMessages((prevMessages) => [...prevMessages, message]);
        // });
        // wsRegisterMessageHandler(newSocket, 'getMessages', (olderNMessages: Array<Message>) => {
        //     setChatMessages((prevMessages) => [...prevMessages, ...olderNMessages]);
        // });

        // wsRegisterMessageHandler(newSocket, 'seenBy', (isSuccess boolean) => {
        //     setSeenBy((prevSeen) => [...prevSeen, username]);
        // });
        // wsRegisterMessageHandler(newSocket, 'kickOut', (isSuccess: boolean) => {
        //     setPeers((prevPeers) => prevPeers.filter((peerUsername) => peerUsername !== kickOutUsername));
        // });

        setSocket(newSocket);
        // if (chat) {
        //     setChatMessages(chat.messages);
        //     setPeers(chat.peers);
        // }

        return () => {
            if(newSocket) {
                wsUnRegisterMessageHandler(socket, 'connect');
                wsUnRegisterMessageHandler(socket, 'disconnect');
                wsUnRegisterMessageHandler(socket, 'sendMessage');
                wsUnRegisterMessageHandler(socket, 'getMessages');
                // wsUnRegisterMessageHandler(socket, 'seenBy');
                // wsUnRegisterMessageHandler(socket, 'kickOut');
                wsDisconnect(newSocket);
            }
        };
    }, []);

    const sendMessage = (content: string) => {
        if (socket && content.trim() !== '') {
            console.log(`Send message: sendMessage to server | data: ${{username, content}}`);
            wsSendMessage(socket, 'sendMessage', {senderUsername: username, content});
            // setMessage('');
        }
    }

    const getNMessage = (from: number, next: number) => {
        if (socket) {
            console.log(`Send message: getMessages to server | data: ${{from, next}}`);
            wsSendMessage(socket, 'getMessages', {from, next})
        }
    };

    const seenBy = (messageId: string) => {
        if (socket) {
            console.log(`Send message: seenBy to server | data: ${{messageId, username}}`);
            wsSendMessage(socket, 'seenBy', {messageId, username})
        }
    };

    const kickOut = (kickOutUsername: string) => {
        if (socket && chat?.owner === username) {
            console.log(`Send message: kickOut from server data: ${{kickOutUsername}}`);
            wsSendMessage(socket, 'kickOut', {kickOutUsername, ownerToken: authToken})
        }
    };

    const disconnectAndLogout = () => {
        if (socket) {
            // wsUnRegisterMessageHandler(socket, 'connect');
            // wsUnRegisterMessageHandler(socket, 'disconnect');
            // wsUnRegisterMessageHandler(socket, 'sendMessage');
            // wsUnRegisterMessageHandler(socket, 'getMessages');
            // wsUnRegisterMessageHandler(socket, 'seenBy');
            // wsUnRegisterMessageHandler(socket, 'kickOut');
            wsDisconnect(socket);
            logout();
        }
    };

    return (
        <div>
            <div>
                <div>
                    <ButtonComponent label='Logout' handleOnClick={disconnectAndLogout} />
                    <hr/>
                </div>
                <div>
                    <ChatComponent chat={chat} socket={socket} sendMessage={sendMessage} getNMessage={getNMessage} seenBy={seenBy} kickOut={kickOut} />
                </div>
            </div>
        </div>
    );
};

export default ChatProvider;