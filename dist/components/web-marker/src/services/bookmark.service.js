var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TagsService } from './tags.service';
import { store } from './../store/store';
import { JwtService } from './jwt.service';
import { HttpClient } from './http-client';
import { environment } from '../environments/environment.dev';
import { updateBookmark, addBookmark, removeBookmark, initBookmarks } from '../store/actions';
import { v4 as uuid } from 'uuid';
import { MarkerService } from './marker.service';
import { getTitleForBookmark } from '../helper/bookmarkHelper';
export class BookmarkService {
    constructor() {
        this.jwtService = new JwtService();
        this.tagsService = new TagsService();
        this.BASE_URL = '/bookmarks';
        this.httpClient = new HttpClient({ baseURL: environment.BACKEND_URL });
    }
    getBookmarks() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.httpClient.get(this.BASE_URL);
            const bookmarks = yield response.json();
            initBookmarks(bookmarks);
            return bookmarks;
        });
    }
    getBookmarkForUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.httpClient.get(this.BASE_URL + '/url?url=' + url);
            const bookmark = yield response.json();
            return bookmark;
        });
    }
    createBookmark(bookmark) {
        return __awaiter(this, void 0, void 0, function* () {
            // Update redux
            addBookmark(bookmark);
            const response = yield this.httpClient.post(this.BASE_URL, bookmark);
            const createdBookmark = yield response.json();
            return createdBookmark;
        });
    }
    deleteBookmark(bookmarkId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Update redux
            removeBookmark(bookmarkId);
            yield this.httpClient.delete(this.BASE_URL + '/' + bookmarkId);
        });
    }
    updateBookmark(bookmark) {
        return __awaiter(this, void 0, void 0, function* () {
            // Update redux
            updateBookmark(bookmark);
            //await this.updateTagsOfRelatedMarks(bookmark);
            yield this.httpClient.put(this.BASE_URL, bookmark);
            yield this.updateRelatedMarks(bookmark);
            // Update bookmarks for store
            yield this.getBookmarks();
            // Update tags for store
            yield this.tagsService.getTags();
        });
    }
    getBookmarkById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.httpClient.get(this.BASE_URL + '/' + id);
            const bookmark = yield response.json();
            return bookmark;
        });
    }
    createNewBookmark(isStarred) {
        return {
            id: uuid(),
            createdAt: new Date().getTime(),
            url: location.href,
            isStarred: isStarred,
            tags: [],
            title: getTitleForBookmark(),
            origin: location.origin
        };
    }
    /**
     * If tags of bookmark are changing they also have to be stored and saved in mark
     *
     * @param {Bookmark} bookmark
     * @memberof BookmarkService
     */
    updateRelatedMarks(bookmark) {
        return __awaiter(this, void 0, void 0, function* () {
            const markService = new MarkerService();
            const marks = store.getState().marks.filter(mark => mark.url === bookmark.url);
            marks.forEach((mark) => __awaiter(this, void 0, void 0, function* () { return yield markService.updateMark(mark); }));
        });
    }
}
//# sourceMappingURL=bookmark.service.js.map