import { environment } from './../environments/environment.dev';
import { Tag } from './../models/tag';
import { store } from './../store/store';
import { JwtService } from './jwt.service';
import { HttpClient } from './http-client';
import { initTags } from '../store/actions';

export class TagsService {
  httpClient!: HttpClient;
  jwtService = new JwtService();
  BASE_URL = '/tags';

  constructor() {
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

    tags = [...new Set(tags)].filter(tag =>
      tag.toLowerCase().includes(store.getState().searchValue.toLowerCase()));
    tags.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    return tags;
  }

  async getTags(): Promise<Tag[]> {
    try {
      const response = await this.httpClient.get(this.BASE_URL);
      const tags = (await response.json() as Tag[]);
      initTags(tags);
      return tags;
    } catch (error) {
      //
    }
  }
}
