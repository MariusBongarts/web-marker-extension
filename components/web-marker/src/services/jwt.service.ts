import { JwtPayload } from './../models/jwtPayload';
import { HttpClient } from './http-client';
import jwt_decode from 'jwt-decode';
import { login, logout } from '../store/actions';

export class JwtService {
  httpClient!: HttpClient;

  constructor() {}

  getJwt(): Promise<string> {
    return new Promise((res) => {
      try {
        chrome.storage.sync.get((items) => {
          res(items['jwt_key']);
        });
      } catch (error) {
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
  getJwtPayload(): Promise<JwtPayload> {
    return new Promise((res) => {
      try {
        chrome.storage.sync.get((items) => {
          let payload;
          try {
            payload = jwt_decode(items['jwt_key']);
          } catch (error) {
            res({} as JwtPayload);
          }
          login(payload);
          res(payload);
        });
      } catch (error) {
        try {
          const jwt = localStorage.jwt_webmarker;
          const payload = jwt_decode(jwt) as JwtPayload;
          payload ? login(payload) : logout();
          payload ? res(payload) : res({} as JwtPayload);
        } catch (error) {
          res({} as JwtPayload);
        }
      }
    });
  }

  setJwt(jwt: string) {
    try {
      localStorage.jwt_webmarker = jwt;
      chrome.storage.sync.set({ jwt_key: jwt });
    } catch (error) {
      console.log(error);
    }
  }
}
