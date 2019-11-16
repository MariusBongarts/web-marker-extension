var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { environment } from './../environments/environment.dev';
import { store } from './../store/store';
import { JwtService } from './jwt.service';
import { HttpClient } from './http-client';
import { initTags } from '../store/actions';
export class TagsService {
    constructor() {
        this.jwtService = new JwtService();
        this.BASE_URL = '/tags';
        this.httpClient = new HttpClient({ baseURL: environment.BACKEND_URL });
    }
    getTagsFromMarksAndBookmarks() {
        let tags = [];
        store.getState().marks.forEach(mark => {
            tags = [...tags, ...mark.tags];
        });
        store.getState().bookmarks.forEach(bookmark => {
            tags = [...tags, ...bookmark.tags];
        });
        tags = [...new Set(tags)].filter(tag => tag.toLowerCase().includes(store.getState().searchValue.toLowerCase()));
        tags.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        return tags;
    }
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.httpClient.get(this.BASE_URL);
                const tags = yield response.json();
                initTags(tags);
                return tags;
            }
            catch (error) {
                //
            }
        });
    }
    /**
     * Updates a tag and reloads all tags from server for state management
     *
     * @param {Tag} tag
     * @memberof TagsService
     */
    updateTag(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.httpClient.put(this.BASE_URL, tag);
                yield this.getTags();
            }
            catch (error) {
                //
            }
        });
    }
}
//# sourceMappingURL=tags.service.js.map