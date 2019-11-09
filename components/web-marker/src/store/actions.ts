import { Tab } from './../models/tabs';
import { BookmarkService } from './../services/bookmark.service';
import { Bookmark } from './../models/bookmark';
import { MarkerService } from './../services/marker.service';
import { JwtPayload } from './../models/jwtPayload';
import { Mark } from './../models/mark';
import { ReduxAction } from './reducer';
import { store } from './store';


export function initMarks(marks: Mark[]) {
  const reduxAction: ReduxAction = {
    type: 'INIT_MARKS',
    marks: marks
  }
  store.dispatch(reduxAction);
}

export function addMark(mark: Mark) {
  const reduxAction: ReduxAction = {
    type: 'ADD_MARK',
    mark: mark
  }
  store.dispatch(reduxAction);
}

export function removeMark(markId: string) {
  const reduxAction: ReduxAction = {
    type: 'REMOVE_MARK',
    markId: markId
  }
  store.dispatch(reduxAction);
}

export function updateMark(mark: Mark) {
  const reduxAction: ReduxAction = {
    type: 'UPDATE_MARK',
    mark: mark
  }
  store.dispatch(reduxAction);
}

export function initBookmarks(bookmarks: Bookmark[]) {
  const reduxAction: ReduxAction = {
    type: 'INIT_BOOKMARKS',
    bookmarks: bookmarks
  }
  store.dispatch(reduxAction);
}

export function addBookmark(bookmark: Bookmark) {
  const reduxAction: ReduxAction = {
    type: 'ADD_BOOKMARK',
    bookmark: bookmark
  }
  store.dispatch(reduxAction);
}

export function removeBookmark(bookmarkId: string) {
  const reduxAction: ReduxAction = {
    type: 'REMOVE_BOOKMARK',
    bookmarkId: bookmarkId
  }
  store.dispatch(reduxAction);
}

export function updateBookmark(bookmark: Bookmark) {
  const reduxAction: ReduxAction = {
    type: 'UPDATE_BOOKMARK',
    bookmark: bookmark
  }
  store.dispatch(reduxAction);
}


/**
 * Hand a tab as a param to set selected tag
 *
 * @export
 * @param {Tab} activeView
 * @param {string} [tag]
 */
export function navigateToTab(activeView: Tab, tag?: string) {
  const reduxAction: ReduxAction = {
    type: 'CHANGE_VIEW',
    activeView: activeView,
    activeTag: tag ? tag : ''
  }
  store.dispatch(reduxAction);
}

export async function login(jwtPayload: JwtPayload) {
  const reduxAction: ReduxAction = {
    type: 'LOGIN',
    jwtPayload: jwtPayload
  }
  store.dispatch(reduxAction);
  await initData();
}

export function logout() {
  const reduxAction: ReduxAction = {
    type: 'LOGOUT'
  }
  store.dispatch(reduxAction);
  initMarks([]);
}

export function searchValueChanged(value: string) {
  const reduxAction: ReduxAction = {
    type: 'SEARCH_VALUE_CHANGED',
    searchValue: value
  }
  store.dispatch(reduxAction);
}

async function initData() {
  const markService = new MarkerService();
  const bookmarkService = new BookmarkService();
  try {

    // Init marks
  await markService.getMarks();
  await bookmarkService.getBookmarks();

  } catch (error) {
    logout()
  }
}