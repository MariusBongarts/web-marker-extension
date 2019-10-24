import { BookmarkService } from './bookmark.service';
import { JwtService } from './jwt.service';
import { Mark } from './../models/mark';
import { HttpClient } from './http-client';
import { environment } from '../environments/environment.dev';
import { addMark, removeMark, updateMark, initMarks } from '../store/actions';


export class MarkerService {
  httpClient!: HttpClient;
  socket;
  jwtService = new JwtService();
  bookmarkService = new BookmarkService();

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
    const response = await this.httpClient.get('/marks/url?url=' + url);
    const marks: Mark[] = (await response.json() as Mark[]);
    return marks;
  }

  async createMark(mark: Mark): Promise<Mark | undefined> {
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
  }

  async getMarkById(id: string): Promise<Mark> {
    const response = await this.httpClient.get('/marks/' + id);
    const mark = (await response.json() as Mark);
    return mark;
  }

}
