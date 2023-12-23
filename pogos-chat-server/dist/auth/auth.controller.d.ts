import { AuthService } from './auth.service';
import { SignInDTO } from './auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn(signInDto: SignInDTO): Promise<any>;
    logOut(username: string): boolean;
}
