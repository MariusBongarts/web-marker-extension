var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JwtService } from './jwt.service';
import { HttpClient } from './http-client';
import { environment } from '../environments/environment.dev';
import { login, logout } from '../store/actions';
export class UserService {
    constructor() {
        this.jwtService = new JwtService();
        this.httpClient = new HttpClient({ baseURL: environment.BACKEND_URL });
    }
    /**
     * Signs the user in and saves the jwtToken in the jwtService.
     *
     * @returns {Promise<string>}
     * @memberof UserService
     */
    login(loginUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.httpClient.post('/auth', loginUserDto);
            const jwtToken = yield token.json();
            this.jwtService.setJwt(jwtToken.token);
            const jwtPayload = yield this.jwtService.getJwtPayload();
            login(jwtPayload);
            return jwtToken.token;
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            this.jwtService.setJwt('');
            logout();
        });
    }
}
//# sourceMappingURL=user.service.js.map