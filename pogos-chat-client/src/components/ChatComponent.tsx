import { Socket } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import InputFieldComponent from './InputFieldComponent'; // Assuming you have this component
import ButtonComponent from './ButtonComponent'; // Assuming you have this component
import { Chat, Message } from '../serverObjTypes/serverObjTypes';
import { wsConnect, wsDisconnect, wsRegisterMessageHandler, wsSendMessage } from '../services/serverRequests';

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
        const newSocket = wsConnect({auth: {jwtToken: authToken, username: username}});

        wsRegisterMessageHandler(newSocket, 'connected', (username: string) => {
            setPeers((prevPeers) => [...prevPeers, username]);
        });
        wsRegisterMessageHandler(newSocket, 'disconnected', (username: string) => {
            setPeers((prevPeers) => prevPeers.filter((peerUsername) => peerUsername !== username));
        });
        wsRegisterMessageHandler(newSocket, 'sendMessage', (message: Message) => {
            setChatMessages((prevMessages) => [...prevMessages, message]);
        });
        wsRegisterMessageHandler(newSocket, 'getMessages', (olderNMessages: Array<Message>) => {
            setChatMessages((prevMessages) => [...prevMessages, ...olderNMessages]);
        });

        setSocket(newSocket);
        if (chat) {
            setChatMessages(chat.messages);
            setPeers(chat.peers);
        }

        return () => {
            if(newSocket) {
                wsDisconnect(newSocket);
            }
        };
    }, []);

    const sendMessage = () => {
        if (socket && message.trim() !== '') {
            const content = message
            wsSendMessage(socket, 'sendMessage', {username, content})
            setMessage('');
        }
    }

    const getNMessage = (from: number, nextQuantity: number) => {
        if (socket) {
            wsSendMessage(socket, 'getMessages', {from, nextQuantity})
        }
    };

    const setSeen = (messageId: string) => {
        if (socket) {
            wsSendMessage(socket, 'setSeen', {messageId, username})
        }
    };

    return (
        <div>
            <div>
                <div>
                    <ButtonComponent label='Logout' handleOnClick={logout} />
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
                        <div key={index}>{aPeer + " | "}</div>
                    ))}
                    <hr/>
                </div>
            </div>
            <div>
                <strong>Messages:</strong>
                {chatMessages.map((aMessage, index) => (
                    <div key={index}>
                        <div>
                            {aMessage.senderUsername + ": "}{aMessage.content}
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
                    <ButtonComponent label='Send' handleOnClick={sendMessage} />
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;