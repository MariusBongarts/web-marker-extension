import { Tag } from './../models/tag';
import { Directory } from './../models/directory';
import { Tab } from './../models/tabs';
import { Bookmark } from './../models/bookmark';
import { JwtService } from './../services/jwt.service';
import { JwtPayload } from './../models/jwtPayload';
import { Mark } from './../models/mark';
import { addTag } from './actions';

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
  directories: Directory[],
  activeDirectory: Directory,
  tags: Tag[],
  dragMode: boolean
}

const INITIAL_STATE: State = {
  loggedIn: false,
  marks: [],
  bookmarks: [],
  searchValue: '',
  activeView: 'mark-view',
  activeTag: '',
  directories: [],
  tags: [],
  activeDirectory: undefined,
  dragMode: false
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
  'CHANGE_VIEW' |
  'INIT_DIRECTORIES' |
  'ADD_DIRECTORY' |
  'REMOVE_DIRECTORY' |
  'UPDATE_DIRECTORY' |
  'INIT_TAGS' |
  'ADD_TAG' |
  'REMOVE_TAG' |
  'TOGGLE_DIRECTORY' |
  'TOGGLE_TAG' |
  'TOGGLE_DRAGMODE';

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
  activeTag?: string,
  directories?: Directory[],
  directory?: Directory,
  directoryId?: string,
  tags?: Tag[],
  tagName?: string,
  activeDirectory?: Directory,
  dragMode?: boolean
}


export const reducer = (state = INITIAL_STATE, action: ReduxAction) => {
  switch (action.type) {

    case 'TOGGLE_DIRECTORY':
      return {
        ...state,
        activeDirectory: action.activeDirectory,
        activeTag: action.activeTag
      };
    case 'TOGGLE_DRAGMODE':
      return {
        ...state,
        dragMode: action.dragMode
      };

    case 'INIT_MARKS':
      return {
        ...state,
        marks: action.marks,
        lastAction: action.type
      };

    case 'INIT_TAGS':
      return {
        ...state,
        tags: action.tags,
        lastAction: action.type
      };

    case 'ADD_TAG':
      const tag: Tag = { name: action.tagName, _directory: action.directoryId };
      return {
        ...state,
        tags: [...state.tags, tag],
        lastAction: action.type
      };

    case 'TOGGLE_TAG':
      return {
        ...state,
        activeTag: action.activeTag
      };

    case 'REMOVE_TAG':
      return {
        ...state,
        tags: state.tags.filter(e => e.name !== action.tagName),
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

    case 'INIT_DIRECTORIES':
      return {
        ...state,
        directories: action.directories,
        lastAction: action.type
      };

    case 'ADD_DIRECTORY':
      return {
        ...state,
        directories: [...state.directories, action.directory],
        lastAction: action.type
      };

    case 'REMOVE_DIRECTORY':
      return {
        ...state,
        directories: state.directories.filter(e => e._id !== action.directoryId),
        lastAction: action.type
      };

    case 'UPDATE_DIRECTORY':
      return {
        ...state,
        directories: state.directories.map(directory => directory.id === action.directory.id ? action.directory : directory),
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
      // Old bookmark is necessary to identify if tag was removed or added
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