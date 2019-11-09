import { Tab } from './../models/tabs';
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
  activeView: Tab;
  activeTag: string;
}

const INITIAL_STATE: State = {
  loggedIn: false,
  marks: [],
  bookmarks: [],
  searchValue: '',
  activeView: 'mark-view',
  activeTag: ''
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
  'LOGOUT' |
  'SEARCH_VALUE_CHANGED' |
  'CHANGE_VIEW';

export interface ReduxAction {
  type: ReduxActionType,
  marks?: Mark[],
  bookmarks?: Bookmark[],
  bookmark?: Bookmark,
  bookmarkId?: string,
  mark?: Mark,
  markId?: string,
  jwtPayload?: JwtPayload | undefined,
  searchValue?: string,
  activeView?: Tab,
  activeTag?: string
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
      const oldBookmark = state.bookmarks.find(bookmark => bookmark.id === action.bookmark.id);
      const newBookmark = action.bookmark;

      const type = oldBookmark.tags.length > newBookmark.tags.length ? 'removedTag' : 'addedTag';

      let changedTag = '';

      // If tag was removed
      if (oldBookmark.tags.length > newBookmark.tags.length) changedTag = oldBookmark.tags.find(tag => !newBookmark.tags.includes(tag));

      // If tag was added
      if (oldBookmark.tags.length < newBookmark.tags.length) changedTag = newBookmark.tags.find(tag => !oldBookmark.tags.includes(tag));

      return {
        ...state,
        bookmarks: state.bookmarks.map(bookmark => bookmark.id === action.bookmark.id ? action.bookmark : bookmark),
        // Update tags of mark
        marks: state.marks.map(mark => mark.url === oldBookmark.url ? {
          ...mark,
          tags: changedTag ? type === 'addedTag' ? [...new Set([...mark.tags, changedTag])] : mark.tags.filter(tag => tag !== changedTag) : mark.tags
        } : mark),
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

    case 'CHANGE_VIEW':
      return {
        ...state,
        activeView: action.activeView,
        activeTag: action.activeTag ? action.activeTag : ''
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