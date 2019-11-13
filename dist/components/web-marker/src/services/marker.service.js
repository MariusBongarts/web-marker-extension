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
import { BookmarkService } from './bookmark.service';
import { JwtService } from './jwt.service';
import { HttpClient } from './http-client';
import { environment } from '../environments/environment.dev';
import { addMark, removeMark, updateMark, initMarks } from '../store/actions';
export class MarkerService {
    constructor() {
        this.jwtService = new JwtService();
        this.bookmarkService = new BookmarkService();
        this.tagsService = new TagsService();
        this.httpClient = new HttpClient({ baseURL: environment.BACKEND_URL });
    }
    getMarks() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.httpClient.get('/marks');
            const marks = yield response.json();
            initMarks(marks);
            return marks;
        });
    }
    getMarksForUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.httpClient.get('/marks/url?url=' + url);
            const marks = yield response.json();
            return marks;
        });
    }
    createMark(mark) {
        return __awaiter(this, void 0, void 0, function* () {
            mark = this.addTagsOfBookmark(mark);
            addMark(mark);
            //await this.emitSocket('createMark', mark);
            const response = yield this.httpClient.post('/marks', mark);
            const createdMark = yield response.json();
            // Reload bookmarks to update for changes (If first mark on page is made, bookmark will be created)
            yield this.bookmarkService.getBookmarks();
            return createdMark;
        });
    }
    deleteMark(markId) {
        return __awaiter(this, void 0, void 0, function* () {
            removeMark(markId);
            yield this.httpClient.delete('/marks/' + markId);
            // Reload bookmarks to update for changes (If last mark gets deleted, bookmark will be deleted if not starred)
            yield this.bookmarkService.getBookmarks();
        });
    }
    updateMark(mark) {
        return __awaiter(this, void 0, void 0, function* () {
            updateMark(mark);
            yield this.httpClient.put('/marks', mark);
            yield this.tagsService.getTags();
        });
    }
    getMarkById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.httpClient.get('/marks/' + id);
            const mark = yield response.json();
            return mark;
        });
    }
    /**
     * Adds the tags of the current bookmark to the created mark
     *
     * @param {Mark} mark
     * @memberof MarkerService
     */
    addTagsOfBookmark(mark) {
        try {
            const bookmark = store.getState().bookmarks.find(bookmark => bookmark.url === mark.url);
            if (bookmark && bookmark.tags)
                mark.tags = [...new Set([...mark.tags, ...bookmark.tags])];
        }
        catch (error) {
            //
        }
        return mark;
    }
}
//# sourceMappingURL=marker.service.js.map