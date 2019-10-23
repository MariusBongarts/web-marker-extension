var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JwtService } from './jwt.service';
import { HttpClient } from './http-client';
import { environment } from '../environments/environment.dev';
import { addMark, removeMark, updateMark } from '../store/actions';
export class MarkerService {
    constructor() {
        this.jwtService = new JwtService();
        this.httpClient = new HttpClient({ baseURL: environment.BACKEND_URL });
    }
    getMarks() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.httpClient.get('/marks');
            const marks = yield response.json();
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
            addMark(mark);
            //await this.emitSocket('createMark', mark);
            const response = yield this.httpClient.post('/marks', mark);
            const createdMark = yield response.json();
            return createdMark;
        });
    }
    deleteMark(markId) {
        return __awaiter(this, void 0, void 0, function* () {
            removeMark(markId);
            yield this.httpClient.delete('/marks/' + markId);
        });
    }
    updateMark(mark) {
        return __awaiter(this, void 0, void 0, function* () {
            updateMark(mark);
            yield this.httpClient.put('/marks', mark);
        });
    }
    getMarkById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.httpClient.get('/marks/' + id);
            const mark = yield response.json();
            return mark;
        });
    }
}
//# sourceMappingURL=marker.service.js.map