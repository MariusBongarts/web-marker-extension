var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import uuidv4 from 'uuid/v4';
import { JwtService } from './jwt.service';
import { HttpClient } from './http-client';
import { environment } from '../environments/environment.dev';
import { initDirectories, addDirectory, removeDirectory, updateDirectory, addTag } from '../store/actions';
export class DirectoryService {
    constructor() {
        this.jwtService = new JwtService();
        this.BASE_URL = '/directory';
        this.httpClient = new HttpClient({ baseURL: environment.BACKEND_URL });
    }
    getDirectories() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.httpClient.get(this.BASE_URL);
            const directories = yield response.json();
            initDirectories(directories);
            return directories;
        });
    }
    createDirectory(directory) {
        return __awaiter(this, void 0, void 0, function* () {
            const newDirectory = Object.assign(Object.assign({}, directory), { id: uuidv4() });
            const response = yield this.httpClient.post(this.BASE_URL, newDirectory);
            const createdDirectory = yield response.json();
            // Update redux
            addDirectory(createdDirectory);
            // Create tag for directory
            addTag(createdDirectory.name, createdDirectory._id);
            return createdDirectory;
        });
    }
    deleteDirectory(directoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Update redux
            removeDirectory(directoryId);
            yield this.httpClient.delete(this.BASE_URL + '/' + directoryId);
        });
    }
    updateDirectory(directory) {
        return __awaiter(this, void 0, void 0, function* () {
            // Update redux
            updateDirectory(directory);
            yield this.httpClient.put(this.BASE_URL, directory);
            // Update directories for store
            yield this.getDirectories();
        });
    }
    getDirectoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.httpClient.get(this.BASE_URL + '/' + id);
                const directory = yield response.json();
                return directory;
            }
            catch (error) {
                //
            }
        });
    }
}
//# sourceMappingURL=directory.service.js.map