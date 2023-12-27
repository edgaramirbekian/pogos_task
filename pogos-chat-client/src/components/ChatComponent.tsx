import React, { useState, useEffect } from 'react';
import InputFieldComponent from './InputFieldComponent'; // Assuming you have this component
import ButtonComponent from './ButtonComponent'; // Assuming you have this component
import { Chat, Message } from '../serverObjTypes/serverObjTypes';
import { wsConnect, wsDisconnect, wsRegisterMessageHandler, wsSendMessage, wsUnRegisterMessageHandler } from '../services/serverRequests';
import { Socket } from 'socket.io-client';

interface ChatProps {
    socket: Socket | null;
    chat: Chat | null;
    sendMessage: (content: string) => void;
    getNMessage: (from: number, next: number) => void;
    seenBy: (messageId: string) => void;
    kickOut: (kickOutUsername: string) => void;
  }

const ChatComponent: React.FC<ChatProps> = ({chat, socket, sendMessage, getNMessage, seenBy, kickOut}) => {
    const [message, setMessage] = useState<string>('');
    const [chatMessages, setChatMessages] = useState<Array<Message>>(chat ? chat.messages : []);
    const [peers, setPeers] = useState<Array<string>>(chat ? chat.peers : []);

    useEffect(() => {
        console.log(`UseEffect`);

        setMessage('');

        if(socket) {
            wsRegisterMessageHandler(socket, 'connected', (username: string) => {
                console.log('connected event received from server | peers', peers, 'add to peers', username)
                if(!peers.includes(username)) {
                    setPeers((prevPeers) => [...prevPeers, username]);
                }
            });
            wsRegisterMessageHandler(socket, 'disconnected', (username: string) => {
                console.log('disconnected event received from server | peers', peers, 'remove from peers', username)
                setPeers((prevPeers) => prevPeers.filter((peerUsername) => peerUsername !== username));
            });
            wsRegisterMessageHandler(socket, 'sendMessage', (message: Message) => {
                console.log('sendMessage event received from server | chatMessages', chatMessages, 'add to chatMessages', message)
                setChatMessages((prevMessages) => [...prevMessages, message]);
            });
            wsRegisterMessageHandler(socket, 'getMessages', (olderNMessages: Array<Message>) => {
                console.log('sendMessage event received from server | chatMessages', chatMessages, 'add to chatMessages', olderNMessages)
                setChatMessages((prevMessages) => [...prevMessages, ...olderNMessages]);
            });
            // wsRegisterMessageHandler(newSocket, 'seenBy', (isSuccess boolean) => {
            //     setSeenBy((prevSeen) => [...prevSeen, username]);
            // });
            // wsRegisterMessageHandler(newSocket, 'kickOut', (isSuccess: boolean) => {
            //     setPeers((prevPeers) => prevPeers.filter((peerUsername) => peerUsername !== kickOutUsername));
            // });
        }

        return () => {
            if(socket) {
                wsUnRegisterMessageHandler(socket, 'connected');
                wsUnRegisterMessageHandler(socket, 'disconnected');
                wsUnRegisterMessageHandler(socket, 'sendMessage');
                wsUnRegisterMessageHandler(socket, 'getMessages');
                // wsUnRegisterMessageHandler(socket, 'seenBy');
                // wsUnRegisterMessageHandler(socket, 'kickOut');
                // wsDisconnect(socket);
            }
        };
    }, [chat, chatMessages, peers, socket]);

    return (
        <div>
            <div>
                <div>
                    <ButtonComponent label='Get older messages' handleOnClick={() => getNMessage(chatMessages.length, 50)} />
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
                        <label key={index}>{" | "}{aPeer}{" | "}</label>
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
                            <br/>
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
                    <ButtonComponent label='Send' handleOnClick={() => sendMessage(message)} />
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;