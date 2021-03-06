import { TagsService } from './tags.service';
import { store } from './../store/store';
import { BookmarkService } from './bookmark.service';
import { JwtService } from './jwt.service';
import { Mark } from './../models/mark';
import { HttpClient } from './http-client';
import { environment } from '../environments/environment.dev';
import { addMark, removeMark, updateMark, initMarks, logout } from '../store/actions';


export class MarkerService {
  httpClient!: HttpClient;
  socket;
  jwtService = new JwtService();
  bookmarkService = new BookmarkService();
  tagsService = new TagsService();

  constructor() {
    this.httpClient = new HttpClient({ baseURL: environment.BACKEND_URL });
  }

  async getMarks(): Promise<Mark[]> {
    const response = await this.httpClient.get('/marks');
    const marks: Mark[] = (await response.json() as Mark[]);
    initMarks(marks);
    return marks;
  }

  async getMarksForUrl(url: string): Promise<Mark[]> {
    try {
      const response = await this.httpClient.get('/marks/url?url=' + url);
      const marks: Mark[] = (await response.json() as Mark[]);
      return marks;
    } catch (error) {
      logout();
    }
  }

  async createMark(mark: Mark): Promise<Mark | undefined> {
    mark = this.addTagsOfBookmark(mark);
    addMark(mark);
    //await this.emitSocket('createMark', mark);
    const response = await this.httpClient.post('/marks', mark);
    const createdMark: Mark = (await response.json() as Mark);

    // Reload bookmarks to update for changes (If first mark on page is made, bookmark will be created)
    await this.bookmarkService.getBookmarks();

    return createdMark;
  }

  async deleteMark(markId: string): Promise<void> {
    removeMark(markId)
    await this.httpClient.delete('/marks/' + markId);

  // Reload bookmarks to update for changes (If last mark gets deleted, bookmark will be deleted if not starred)
    await this.bookmarkService.getBookmarks();
  }

  async updateMark(mark: Mark): Promise<void> {
    updateMark(mark);
    await this.httpClient.put('/marks', mark);
    await this.tagsService.getTags();
  }

  async getMarkById(id: string): Promise<Mark> {
    const response = await this.httpClient.get('/marks/' + id);
    const mark = (await response.json() as Mark);
    return mark;
  }

  /**
   * Adds the tags of the current bookmark to the created mark
   *
   * @param {Mark} mark
   * @memberof MarkerService
   */
  addTagsOfBookmark(mark: Mark) {
    try {
      const bookmark = store.getState().bookmarks.find(bookmark => bookmark.url === mark.url);
      if (bookmark && bookmark.tags) mark.tags = [...new Set([...mark.tags, ...bookmark.tags])];
    } catch (error) {
      //
    }
    return mark;
  }

}
