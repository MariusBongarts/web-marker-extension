import { Bookmark } from './../models/bookmark';
import { JwtService } from './jwt.service';
import { Mark } from './../models/mark';
import { HttpClient } from './http-client';
import { environment } from '../environments/environment.dev';
import { addMark, removeMark, updateMark, addBookmark, removeBookmark } from '../store/actions';


export class BookmarkService {
  httpClient!: HttpClient;
  socket;
  jwtService = new JwtService();
  BASE_URL = '/bookmarks';

  constructor() {
    this.httpClient = new HttpClient({ baseURL: environment.BACKEND_URL });
  }

  async getBookmarks(): Promise<Bookmark[]> {
    const response = await this.httpClient.get(this.BASE_URL);
    const bookmarks = (await response.json() as Bookmark[]);
    return bookmarks;
  }

  async getBookmarkForUrl(url: string): Promise<Bookmark> {
    const response = await this.httpClient.get(this.BASE_URL + '/url?url=' + url);
    const bookmark = (await response.json() as Bookmark);
    return bookmark;
  }

  async createBookmark(bookmark: Bookmark): Promise<Bookmark | undefined> {
    // Update redux
    addBookmark(bookmark);
    const response = await this.httpClient.post(this.BASE_URL, bookmark);
    const createdBookmark: Bookmark = (await response.json() as Bookmark);
    return createdBookmark;
  }

  async deleteBookmark(bookmarkId: string): Promise<void> {
    // Update redux
    removeBookmark(bookmarkId)
    await this.httpClient.delete(this.BASE_URL + '/' + bookmarkId);
  }

  async updateBookmark(bookmark: Bookmark): Promise<void> {
    // Update redux
    this.updateBookmark(bookmark);
    await this.httpClient.put(this.BASE_URL, bookmark);
  }

  async getBookmarkById(id: string): Promise<Bookmark> {
    const response = await this.httpClient.get(this.BASE_URL + '/' + id);
    const bookmark = (await response.json() as Bookmark);
    return bookmark;
  }

}
