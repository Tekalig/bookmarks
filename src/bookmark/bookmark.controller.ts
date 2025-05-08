import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorator';
import { CreateBookmarkPayload, EditBookmarkPayload } from './payload';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarks: BookmarkService) {}

  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarks.getBookmarks(userId);
  }

  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarks.getBookmarkById(userId, bookmarkId);
  }

  @Post()
  createBookmark(
    @GetUser('id') userId: number,
    @Body() payload: CreateBookmarkPayload,
  ) {
    return this.bookmarks.createBookmark(userId, payload);
  }

  @Patch(':id')
  editBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() payload: EditBookmarkPayload,
  ) {
    return this.bookmarks.editBookmarkById(userId, bookmarkId, payload);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarks.deleteBookmarkById(userId, bookmarkId);
  }
}
