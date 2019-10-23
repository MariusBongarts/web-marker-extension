var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MarkerService } from './../services/marker.service';
import { store } from './store';
export function initMarks(marks) {
    const reduxAction = {
        type: 'INIT_MARKS',
        marks: marks
    };
    store.dispatch(reduxAction);
}
export function addMark(mark) {
    const reduxAction = {
        type: 'ADD_MARK',
        mark: mark
    };
    store.dispatch(reduxAction);
}
export function removeMark(markId) {
    const reduxAction = {
        type: 'REMOVE_MARK',
        markId: markId
    };
    store.dispatch(reduxAction);
}
export function updateMark(mark) {
    const reduxAction = {
        type: 'UPDATE_MARK',
        mark: mark
    };
    store.dispatch(reduxAction);
}
export function login(jwtPayload) {
    return __awaiter(this, void 0, void 0, function* () {
        const reduxAction = {
            type: 'LOGIN',
            jwtPayload: jwtPayload
        };
        store.dispatch(reduxAction);
        const markService = new MarkerService();
        try {
            const marks = yield markService.getMarks();
            initMarks(marks);
        }
        catch (error) {
            logout();
        }
    });
}
export function logout() {
    const reduxAction = {
        type: 'LOGOUT'
    };
    store.dispatch(reduxAction);
    initMarks([]);
}
//# sourceMappingURL=actions.js.map