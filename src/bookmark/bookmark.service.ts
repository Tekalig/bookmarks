import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateBookmarkPayload, EditBookmarkPayload } from './payload';

@Injectable()
export class BookmarkService {
  constructor(private db: DbService) {}
  getBookmarks(userId: number) {
    return this.db.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return this.db.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async createBookmark(userId: number, payload: CreateBookmarkPayload) {
    const bookmark = await this.db.bookmark.create({
      data: {
        userId,
        ...payload,
      },
    });

    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    payload: EditBookmarkPayload,
  ) {
    const bookmark = await this.db.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resource is denied');

    return this.db.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...payload,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.db.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark?.userId !== userId)
      throw new ForbiddenException('Access to resource is denied');

    return this.db.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
