import React, { useState } from 'react';
import { Alert } from '@mui/material';
import InputFieldComponent from './InputFieldComponent';
import ButtonComponent from './ButtonComponent';
import { signInReq, signUpReq } from '../services/serverRequests';
import { Chat, SignInResponseData } from '../serverObjTypes/serverObjTypes';

interface AuthProps {
  setAuthToken: (token: string) => void;
  setChat: (chat: Chat | null) => void;
  setUsername: (token: string) => void;
}

const AuthComponent: React.FC<AuthProps> = ({setAuthToken, setChat, setUsername}) => {
  const [usernameVal, setUsernameVal] = useState('');
  const [passwordVal, setPasswordVal] = useState('');
  const [validPass, setValidPass] = useState(true)
  const [validUsername, setValidUsername] = useState(true)

  const handleSignIn = async () => {
    const response: SignInResponseData | null = await signInReq({username: usernameVal, password:passwordVal});
    response ? setAuthToken(response.access_token) : setAuthToken('');
    response ? setChat(response.chat) : setChat(null);
    response ? setUsername(usernameVal) : setUsername('');
    if (!response?.access_token) {
      setValidPass(false);
      setValidUsername(false);
      if(localStorage.getItem('jwtToken')) {
        localStorage.removeItem('jwtToken');
      }
    } else if (response && response.access_token) {
      setValidPass(true);
      setValidUsername(true);
    }
  }

  const handleSignUp = async () => {
    const response: SignInResponseData | null = await signUpReq({username: usernameVal, password:passwordVal});
    response ? setAuthToken(response.access_token) : setAuthToken('');
    response ? setChat(response.chat) : setChat(null);
    response ? setUsername(usernameVal) : setUsername('');
    if (response && !response.access_token) {
      setValidPass(false);
      setValidUsername(false);
      if(localStorage.getItem('jwtToken')) {
        localStorage.removeItem('jwtToken');
      }
    } else if (response && response.access_token) {
      setValidPass(true);
      setValidUsername(true);
    }
  }

  const validateUsername = (username: string) => {
    setValidUsername((prevUsername) => prevUsername && (username.length <= 20));
  }

  const validatePassword = (pass: string) => {
    const matchRegex = new RegExp("/((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/");
    setValidPass((prevPass) => prevPass && (matchRegex.test(pass) && (pass.length >= 8)));
  }

  return (
    <div>
      {validPass && validUsername ? null : <Alert severity="error">Authorization Failed</Alert>}
      <InputFieldComponent label="Username" type="username" onChange={setUsernameVal} validate={() => validateUsername}/>
      <InputFieldComponent label="Password" type="password" onChange={setPasswordVal} validate={() => validatePassword} />
      <ButtonComponent label="Sign In" handleOnClick={async () => await handleSignIn()} />
      <ButtonComponent label="Sign Up" handleOnClick={async () => await handleSignUp()} />
    </div>
  );
};

export default AuthComponent;