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

export async function login(jwtPayload: JwtPayload) {
  const reduxAction: ReduxAction = {
    type: 'LOGIN',
    jwtPayload: jwtPayload
  }
  store.dispatch(reduxAction);
  const markService = new MarkerService();
  try {
    const marks = await markService.getMarks();
    initMarks(marks);
  } catch (error) {
    logout()
  }
}

export function logout() {
  const reduxAction: ReduxAction = {
    type: 'LOGOUT'
  }
  store.dispatch(reduxAction);
  initMarks([]);
}