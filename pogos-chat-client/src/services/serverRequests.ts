import io, { Socket } from 'socket.io-client';
import { SignInResponseData, SignInData, WsAuthData } from '../serverObjTypes/serverObjTypes';


const serverHost: string = process.env.REACT_APP_SERVER_HOST ? process.env.REACT_APP_SERVER_HOST : "http://localhost"
const serverHttpPort: number = parseInt(process.env.REACT_APP_SERVER_HTTP_PORT ? process.env.REACT_APP_SERVER_HTTP_PORT : "8001", 10);
const wsServerPort: number = parseInt(process.env.REACT_APP_SERVER_WS_PORT ? process.env.REACT_APP_SERVER_WS_PORT : "8002", 10);
const signInEndpoint: string = serverHost + ":" + serverHttpPort + "/auth/signin";
const signUpEndpoint = serverHost + ":" + serverHttpPort + "/auth/signup";
const wsServerEndpoint = serverHost + ":" + wsServerPort;

export const signUpReq = async (signUpData: SignInData): Promise<SignInResponseData | null> => {
    try {
        const request: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signUpData),
          };
        const response = await fetch(signUpEndpoint, request);
        const successData: SignInResponseData = await response.json();
        const jwtToken: string = successData.access_token;
        localStorage.setItem('jwtToken', jwtToken);
        console.log('/signup success data:', successData);
        return successData;
    } catch (error) {
        console.log('/signup failure error:', error);
        return null;
    }
}

export const signInReq = async (signinData: SignInData): Promise<SignInResponseData | null> => {
    try {
        const request: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signinData),
          };
        const response = await fetch(signInEndpoint, request);
        const successData: SignInResponseData = await response.json();
        const jwtToken: string = successData.access_token;
        localStorage.setItem('jwtToken', jwtToken);
        console.log('/signup success data:', successData);
        return successData;
    } catch (error) {
        console.log('/signup failure error:', error);
        return null;
    }
}

export const logOutReq = async (): Promise<boolean | null> => {
    try {
        const jwtToken = localStorage.getItem('jwtToken');
        const request: RequestInit = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
            },
          };
        const response = await fetch(signInEndpoint, request);
        const successData: boolean = await response.json();
        localStorage.removeItem('jwtToken');
        console.log('/logout success data:', successData);
        return true;
    } catch (error) {
        console.log('/logout failure error:', error);
        return null;
    }
}


export const wsConnect = (wsAuthData: WsAuthData): Socket | null => {
    try {
        const socketOptions = {
            transportOptions: {
                polling: {
                    extraHeaders: {
                        authorization: wsAuthData.auth.jwtToken, // 'Bearer h93t4293t49jt34j9rferek...'
                        username: wsAuthData.auth.username,
                    }
                }
            }
        };
        const socket: Socket = io(wsServerEndpoint, socketOptions);
        console.log('ws connect:', socket);
        return socket;
    } catch (error) {
        console.log('ws connection failure error:', error);
        return null;
    }
}

export const wsDisconnect = (socket: Socket): boolean => {
    try {
        if (socket) {
            console.log('ws disconnect:', socket);
            socket.disconnect();
            return true;
        }
        return false;
    } catch (error) {
        console.log('ws disconnect failure error:', error);
        return false;
    }
}

const wsMessages: Array<string> = ['connected', 'disconnected', 'sendMessage', 'getMessages'];

export const wsSendMessage = (socket: Socket | null, message: string, messageData: any): boolean => {
    try {
        if (socket && (wsMessages.includes(message) )) {
            console.log('ws send to server:', message, 'data', messageData);
            socket.send(message, messageData);
            return true;
        }
        return false;
    } catch (error) {
        console.log('ws message failure error:', error);
        return false;
    }
}

type wsHandlerCallback = (data: any) => any;
export const wsRegisterMessageHandler = (socket: Socket | null, message: string, wsMessageHandler: wsHandlerCallback): any => {
    try {
        if (socket) {
            socket.on(message, (data) => {
                console.log(`Received message: ${message} from server | data: ${data}`);
                wsMessageHandler(data);
                return true
              });
        }
        return false;
    } catch (error) {
        console.log('ws message handle failure error:', error);
        return false;
    }
}

export const wsUnRegisterMessageHandler = (socket: Socket | null, message: string): any => {
    try {
        if (socket) {
            socket.off(message);
            return true;
        }
        return false;
    } catch (error) {
        console.log('ws message handle failure error:', error);
        return false;
    }
}
