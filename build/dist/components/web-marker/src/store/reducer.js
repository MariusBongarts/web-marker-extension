import { JwtService } from './../services/jwt.service';
const jwtService = new JwtService();
const INITIAL_STATE = {
    loggedIn: false,
    marks: [],
    bookmarks: [],
    searchValue: '',
};
export const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'INIT_MARKS':
            return Object.assign(Object.assign({}, state), { marks: action.marks, lastAction: action.type });
        case 'ADD_MARK':
            return Object.assign(Object.assign({}, state), { marks: [...state.marks, action.mark], lastAction: action.type });
        case 'REMOVE_MARK':
            return Object.assign(Object.assign({}, state), { marks: state.marks.filter(e => e.id !== action.markId), lastAction: action.type });
        case 'UPDATE_MARK':
            return Object.assign(Object.assign({}, state), { marks: state.marks.map(mark => mark.id === action.mark.id ? action.mark : mark), lastAction: action.type });
        case 'INIT_BOOKMARKS':
            return Object.assign(Object.assign({}, state), { bookmarks: action.bookmarks, lastAction: action.type });
        case 'ADD_BOOKMARK':
            return Object.assign(Object.assign({}, state), { bookmarks: [...state.bookmarks, action.bookmark], lastAction: action.type });
        case 'REMOVE_BOOKMARK':
            return Object.assign(Object.assign({}, state), { bookmarks: state.bookmarks.filter(e => e.id !== action.bookmarkId), lastAction: action.type });
        case 'UPDATE_BOOKMARK':
            const oldBookmark = state.bookmarks.find(bookmark => bookmark.id === action.bookmark.id);
            const newBookmark = action.bookmark;
            const type = oldBookmark.tags.length > newBookmark.tags.length ? 'removedTag' : 'addedTag';
            let changedTag = '';
            // If tag was removed
            if (oldBookmark.tags.length > newBookmark.tags.length)
                changedTag = oldBookmark.tags.find(tag => !newBookmark.tags.includes(tag));
            // If tag was added
            if (oldBookmark.tags.length < newBookmark.tags.length)
                changedTag = newBookmark.tags.find(tag => !oldBookmark.tags.includes(tag));
            return Object.assign(Object.assign({}, state), { bookmarks: state.bookmarks.map(bookmark => bookmark.id === action.bookmark.id ? action.bookmark : bookmark), 
                // Update tags of mark
                marks: state.marks.map(mark => mark.url === oldBookmark.url ? Object.assign(Object.assign({}, mark), { tags: type === 'addedTag' ? [...new Set([...mark.tags, changedTag])] : mark.tags.filter(tag => tag !== changedTag) }) : mark), lastAction: action.type });
        case 'LOGIN':
            return Object.assign(Object.assign({}, state), { loggedIn: true, jwtPayload: action.jwtPayload });
        case 'LOGOUT':
            return Object.assign(Object.assign({}, state), { loggedIn: false, jwtPayload: undefined });
        case 'SEARCH_VALUE_CHANGED':
            return Object.assign(Object.assign({}, state), { searchValue: action.searchValue });
        default:
            return state;
    }
};
//# sourceMappingURL=reducer.js.map