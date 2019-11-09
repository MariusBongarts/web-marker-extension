import { store } from './../store/store';

export class TagsService {

  constructor() {}

  getTags() {
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
}
