import { Bookmark } from './../models/bookmark';
import { JwtService } from './../services/jwt.service';
import { JwtPayload } from './../models/jwtPayload';
import { Mark } from './../models/mark';

const jwtService = new JwtService();

export interface State {
  loggedIn: boolean,
  marks: Mark[],
  bookmarks: Bookmark[],
  lastAction?: ReduxAction
  jwtPayload?: JwtPayload | undefined;
  searchValue: string;
}

const INITIAL_STATE: State = {
  loggedIn: false,
  marks: [],
  bookmarks: [],
  searchValue: '',
};

export type ReduxActionType =
  'ADD_MARK' |
  'REMOVE_MARK' |
  'INIT_MARKS' |
  'UPDATE_MARK' |
  'ADD_BOOKMARK' |
  'REMOVE_BOOKMARK' |
  'INIT_BOOKMARKS' |
  'UPDATE_BOOKMARK' |
  'LOGIN' |
  'LOGOUT'|
  'SEARCH_VALUE_CHANGED';

export interface ReduxAction {
  type: ReduxActionType,
  marks?: Mark[],
  bookmarks?: Bookmark[],
  bookmark?: Bookmark,
  bookmarkId?: string,
  mark?: Mark,
  markId?: string,
  jwtPayload?: JwtPayload | undefined,
  searchValue?: string
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
    case 'INIT_BOOKMARKS':
      return {
        ...state,
        bookmarks: action.bookmarks,
        lastAction: action.type
      };
    case 'ADD_BOOKMARK':
      return {
        ...state,
        bookmarks: [...state.bookmarks, action.bookmark],
        lastAction: action.type
      };
    case 'REMOVE_BOOKMARK':
      return {
        ...state,
        bookmarks: state.bookmarks.filter(e => e.id !== action.bookmarkId),
        lastAction: action.type
      };
    case 'UPDATE_BOOKMARK':
      return {
        ...state,
        bookmarks: state.bookmarks.map(bookmark => bookmark.id === action.bookmark.id ? action.bookmark : bookmark),
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
    case 'SEARCH_VALUE_CHANGED':
      return {
        ...state,
        searchValue: action.searchValue,
      };
    default:
      return state;
  }
};