import type { Provider } from '../types/provider';
import type { Bookmark } from '../providers/BookmarkProvider';

export class BookmarkService {
  constructor(private provider: Provider<Bookmark[]>) {}

  async getBookmarks(): Promise<Bookmark[]> {
    return this.provider.getData();
  }
}
