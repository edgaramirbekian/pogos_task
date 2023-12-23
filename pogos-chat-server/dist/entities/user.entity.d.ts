interface IUser {
    id: string;
    username: string;
    passwordHash: string;
    isLoggedIn: boolean;
    jwt: string;
}
export declare let allUsers: Map<string, User>;
export declare const hashPassword: (password: string) => Promise<string>;
export declare class User implements IUser {
    id: string;
    username: string;
    passwordHash: string;
    isLoggedIn: boolean;
    jwt: string;
    constructor(username: string, passwordHash: string);
    logInOut(isIn: boolean): void;
}
type userFactory = User | null;
export declare const userFactory: (username: string, password: string) => Promise<userFactory>;
export {};
