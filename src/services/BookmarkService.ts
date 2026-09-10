import { BookmarkProvider, Bookmark } from '../providers/BookmarkProvider';

export class BookmarkService {
  constructor(private provider: BookmarkProvider) {}

  async getBookmarks(): Promise<Bookmark[]> {
    return this.provider.getData();
  }
}
