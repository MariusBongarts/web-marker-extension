import { store } from './../store/store';
import { Bookmark } from './../models/bookmark';
import { JwtService } from './jwt.service';
import { Mark } from './../models/mark';
import { HttpClient } from './http-client';
import { environment } from '../environments/environment.dev';
import { updateBookmark, addBookmark, removeBookmark, initBookmarks } from '../store/actions';
import { v4 as uuid } from 'uuid';
import { MarkerService } from './marker.service';
import { getTitleForBookmark } from '../helper/bookmarkHelper';


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
    initBookmarks(bookmarks);
    return bookmarks;
  }

  async getBookmarkForUrl(url: string): Promise<Bookmark> {
    const response = await this.httpClient.get(this.BASE_URL + '/url?url=' + url);
    const bookmark = (await response.json() as Bookmark);
    return bookmark;
  }

  async createBookmark(bookmark?: Bookmark): Promise<Bookmark | undefined> {
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
    updateBookmark(bookmark);

    //await this.updateTagsOfRelatedMarks(bookmark);

    await this.httpClient.put(this.BASE_URL, bookmark);

    // Update bookmarks for store
    await this.getBookmarks();
  }

  async getBookmarkById(id: string): Promise<Bookmark> {
    const response = await this.httpClient.get(this.BASE_URL + '/' + id);
    const bookmark = (await response.json() as Bookmark);
    return bookmark;
  }

  createNewBookmark(isStarred: boolean) {
    return {
      id: uuid(),
      createdAt: new Date().getTime(),
      url: location.href,
      isStarred: isStarred,
      tags: [],
      title: getTitleForBookmark(),
      origin: location.origin
    } as Bookmark;
  }


  /**
   * When the tags of a bookmarks change. The tags are also being added to the related marks.
   *
   * @memberof BookmarkService
   */
  async updateTagsOfRelatedMarks(bookmark: Bookmark) {
    const markService = new MarkerService();
    const marks = store.getState().marks.filter(mark => mark.url === bookmark.url)
    .map(mark => {
      return {...mark, tags: [...new Set([...mark.tags, ...bookmark.tags])]};
      }
      );
    console.log(marks);
    marks.forEach(async (mark) => await markService.updateMark(mark));
  }

}
