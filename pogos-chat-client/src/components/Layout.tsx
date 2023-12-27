import React, { useState } from 'react';
import AuthComponent from './AuthComponent';
import { Chat } from '../serverObjTypes/serverObjTypes';
import { logOutReq } from '../services/serverRequests';
import ChatProvider from './ChatProvider';

interface LayoutProps {
}

const Layout: React.FC<LayoutProps> = (props) => {
  const [token, setToken] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  const [username, setUsername] = useState('');

  const logout = async () => {
    const response: boolean | null = await logOutReq();
    // if(response) {
      setToken('');
      setChat(null);
      setUsername('');
      if(localStorage.getItem('jwtToken')) {
        localStorage.removeItem('jwtToken');
      }
    // }
  }

  if(token) {
    return <ChatProvider authToken={token} chat={chat} username={username} logout={async () => await logout()}/>
  }

  return <AuthComponent setAuthToken={setToken} setChat={setChat} setUsername={setUsername} />
}

export default Layout;