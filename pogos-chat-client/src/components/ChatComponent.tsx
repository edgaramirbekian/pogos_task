import { Socket } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import InputFieldComponent from './InputFieldComponent'; // Assuming you have this component
import ButtonComponent from './ButtonComponent'; // Assuming you have this component
import { Chat, Message } from '../serverObjTypes/serverObjTypes';
import { wsConnect, wsDisconnect, wsRegisterMessageHandler, wsSendMessage, wsUnRegisterMessageHandler } from '../services/serverRequests';

interface ChatProps {
    authToken: string;
    chat: Chat | null;
    username: string
    logout: () => void;
  }

const ChatComponent: React.FC<ChatProps> = ({authToken, chat, username, logout}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [message, setMessage] = useState<string>('');
    const [chatMessages, setChatMessages] = useState<Array<Message>>([]);
    const [peers, setPeers] = useState<Array<string>>([]);

    useEffect(() => {
        console.log(`UseEffect`);
        const newSocket = wsConnect({auth: {jwtToken: authToken, username: username}});

        wsRegisterMessageHandler(newSocket, 'connect', (username: string) => {
            setPeers((prevPeers) => [...prevPeers, username]);
        });
        wsRegisterMessageHandler(newSocket, 'disconnect', (username: string) => {
            setPeers((prevPeers) => prevPeers.filter((peerUsername) => peerUsername !== username));
        });
        wsRegisterMessageHandler(newSocket, 'sendMessage', (message: Message) => {
            setChatMessages((prevMessages) => [...prevMessages, message]);
        });
        wsRegisterMessageHandler(newSocket, 'getMessages', (olderNMessages: Array<Message>) => {
            setChatMessages((prevMessages) => [...prevMessages, ...olderNMessages]);
        });
        // wsRegisterMessageHandler(newSocket, 'seenBy', (isSuccess boolean) => {
        //     setSeenBy((prevSeen) => [...prevSeen, username]);
        // });
        // wsRegisterMessageHandler(newSocket, 'kickOut', (isSuccess: boolean) => {
        //     setPeers((prevPeers) => prevPeers.filter((peerUsername) => peerUsername !== kickOutUsername));
        // });

        setSocket(newSocket);
        if (chat) {
            setChatMessages(chat.messages);
            setPeers(chat.peers);
        }

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

    const sendMessage = () => {
        if (socket && message.trim() !== '') {
            const content = message;
            console.log(`Send message: sendMessage to server | data: ${{username, content}}`);
            wsSendMessage(socket, 'sendMessage', {username, content});
            setMessage('');
        }
    }

    const getNMessage = (from: number, nextQuantity: number) => {
        if (socket) {
            console.log(`Send message: getMessages to server | data: ${{from, nextQuantity}}`);
            wsSendMessage(socket, 'getMessages', {from, nextQuantity})
        }
    };

    const setSeen = (messageId: string) => {
        if (socket) {
            console.log(`Send message: seenBy to server | data: ${{messageId, username}}`);
            wsSendMessage(socket, 'seenBy', {messageId, username})
        }
    };

    const kickOut = (kickOutUsername: string) => {
        if (socket && chat?.owner === username) {
            console.log(`Send message: kickOut from server data: ${{kickOutUsername}}`);
            wsSendMessage(socket, 'kickOut', {kickOutUsername})
        }
    };

    const disconnectAndLogout = () => {
        if (socket) {
            wsUnRegisterMessageHandler(socket, 'connect');
            wsUnRegisterMessageHandler(socket, 'disconnect');
            wsUnRegisterMessageHandler(socket, 'sendMessage');
            wsUnRegisterMessageHandler(socket, 'getMessages');
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
                    <label>Chat: {chat?.id}</label>
                    <br/>
                    <label>Chat Owner: {chat?.owner}</label>
                    <hr/>
                </div>
                <div>
                    <strong>Peers:</strong>
                    {peers.map((aPeer, index) => (
                        <label key={index}>{" |"}{aPeer}</label>
                    ))}
                    <hr/>
                </div>
            </div>
            <div>
                <strong>Messages:</strong>
                {chatMessages.map((aMessage, index) => (
                    <div key={index}>
                        <div>
                            {aMessage.senderUsername}{": "}{aMessage.content}
                            <label>{aMessage.dateCreated.toString()}</label>
                        </div>
                        <br/>
                    </div>
                ))}
            </div>
            <div>
                <div>
                    <hr/>
                    <label>Write a message:</label>
                    <InputFieldComponent
                        type="text"
                        label="message content"
                        onChange={setMessage}
                        validate={() => {}}
                    />
                    <ButtonComponent label='Send' handleOnClick={() => sendMessage()} />
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;