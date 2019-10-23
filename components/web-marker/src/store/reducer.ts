import { JwtService } from './../services/jwt.service';
import { JwtPayload } from './../models/jwtPayload';
import { Mark } from './../models/mark';

const jwtService = new JwtService();

export interface State {
  loggedIn: boolean,
  marks: Mark[],
  lastAction?: ReduxAction
  jwtPayload?: JwtPayload | undefined;
}

const INITIAL_STATE: State = {
  loggedIn: false,
  marks: []
};

export type ReduxActionType = 'ADD_MARK' | 'REMOVE_MARK' | 'CHANGE_TEST' | 'INIT_MARKS' | 'UPDATE_MARK' | 'LOGIN' | 'LOGOUT';

export interface ReduxAction {
  type: ReduxActionType,
  marks?: Mark[],
  mark?: Mark,
  markId?: string,
  jwtPayload?: JwtPayload | undefined;
}


export const reducer = (state = INITIAL_STATE, action: ReduxAction) => {
  switch (action.type) {
    case 'INIT_MARKS':
      return {
        ...state,
        marks: action.marks,
        lastAction: action.type
      };
    case 'ADD_MARK':
      return {
        ...state,
        marks: [...state.marks, action.mark],
        lastAction: action.type
      };
    case 'REMOVE_MARK':
      return {
        ...state,
        marks: state.marks.filter(e => e.id !== action.markId),
        lastAction: action.type
      };
    case 'UPDATE_MARK':
      return {
        ...state,
        marks: state.marks.map(mark => mark.id === action.mark.id ? action.mark : mark),
        lastAction: action.type
      };
    case 'LOGIN':
      return {
        ...state,
        loggedIn: true,
        jwtPayload: action.jwtPayload
      };
    case 'LOGOUT':
      return {
        ...state,
        loggedIn: false,
        jwtPayload: undefined
      };
    default:
      return state;
  }
};