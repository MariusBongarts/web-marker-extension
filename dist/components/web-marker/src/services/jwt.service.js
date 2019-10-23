import jwt_decode from 'jwt-decode';
import { login, logout } from '../store/actions';
export class JwtService {
    constructor() { }
    getJwt() {
        return new Promise((res) => {
            try {
                chrome.storage.sync.get((items) => {
                    res(items['jwt_key']);
                });
            }
            catch (error) {
                let jwt = localStorage.jwt_webmarker;
                jwt ? res(jwt) : res('');
            }
        });
    }
    /**
     * Tries to get the jwt-token either from the chrome storage or localstorage
     *
     * @returns {Promise<JwtPayload>}
     * @memberof JwtService
     */
    getJwtPayload() {
        return new Promise((res) => {
            try {
                chrome.storage.sync.get((items) => {
                    let payload;
                    try {
                        payload = jwt_decode(items['jwt_key']);
                    }
                    catch (error) {
                        res({});
                    }
                    login(payload);
                    res(payload);
                });
            }
            catch (error) {
                try {
                    const jwt = localStorage.jwt_webmarker;
                    const payload = jwt_decode(jwt);
                    payload ? login(payload) : logout();
                    payload ? res(payload) : res({});
                }
                catch (error) {
                    res({});
                }
            }
        });
    }
    setJwt(jwt) {
        try {
            localStorage.jwt_webmarker = jwt;
            chrome.storage.sync.set({ jwt_key: jwt });
        }
        catch (error) {
            console.log(error);
        }
    }
}
//# sourceMappingURL=jwt.service.js.map