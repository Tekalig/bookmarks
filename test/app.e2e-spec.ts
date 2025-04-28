import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DbService } from 'src/db/db.service';
import {
  CreateBookmarkPayload,
  EditBookmarkPayload,
} from 'src/bookmark/payload';

describe('App e2e', () => {
  let app: INestApplication;
  let db: DbService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3000);
    pactum.request.setBaseUrl('http://localhost:3000');

    db = app.get<DbService>(DbService);
    await db.cleanDb();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    // payload for signup and signin
    const payload = {
      email: 'test@test.com',
      password: 'password',
    };

    // Test signup logic
    // Test duplicate email error
    describe('signup', () => {
      // should signup a new user
      it('should signup a new user', () => {
        // Test signup logic here
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(payload)
          .expectStatus(201)
          .stores('userAt', 'access_token')
          .expectBodyContains('access_token');
      });

      it('should throw an error if email is already in use', () => {
        // Test duplicate email error here
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(payload)
          .expectStatus(403)
          .expectBodyContains('Credentials taken');
      });

      it('should throw an error if onbody is send', () => {
        // Test invalid email error here
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400)
          .expectBodyContains('email must be an email')
          .expectBodyContains('email should not be empty')
          .expectBodyContains('password must be a string')
          .expectBodyContains('password should not be empty');
      });

      it('should throw an error if email is not provided', () => {
        // Test email not provided error here
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: payload.password,
          })
          .expectStatus(400)
          .expectBodyContains('email must be an email')
          .expectBodyContains('email should not be empty');
      });
      it('should throw an error if password is not provided', () => {
        // Test password not provided error here
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: payload.email,
          })
          .expectStatus(400)
          .expectBodyContains('password must be a string')
          .expectBodyContains('password should not be empty');
      });
    });

    // Test sign in logic
    // Test invalid credentials error
    describe('signin', () => {
      it('should sign in an existing user', () => {
        // Test sign in logic here
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(payload)
          .expectStatus(200)
          .stores('userAt', 'access_token')
          .expectBodyContains('access_token');
      });

      it('should throw an error if email is invalid', () => {
        // Test invalid email error here
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'teka@test.com',
            password: 'wrongpassword',
          })
          .expectStatus(403)
          .expectBodyContains('Incorrect Credentials');
      });

      it('should throw an error if email is correct but the password is invalid', () => {
        // Test email not provided error here
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'test@test.com',
            password: 'wrongpassword',
          })
          .expectStatus(403)
          .expectBodyContains('Incorrect Credentials');
      });

      it('should throw an error if onbody is send', () => {
        // Test invalid email error here
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400)
          .expectBodyContains('email must be an email')
          .expectBodyContains('email should not be empty')
          .expectBodyContains('password must be a string')
          .expectBodyContains('password should not be empty');
      });

      it('should throw an error if email is not provided', () => {
        // Test email not provided error here
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: payload.password,
          })
          .expectStatus(400)
          .expectBodyContains('email must be an email')
          .expectBodyContains('email should not be empty');
      });
      it('should throw an error if password is not provided', () => {
        // Test password not provided error here
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: payload.email,
          })
          .expectStatus(400)
          .expectBodyContains('password must be a string')
          .expectBodyContains('password should not be empty');
      });
    });
  });

  describe('Users', () => {
    describe('getMe', () => {
      it('should return the current user', () => {
        // Test getMe logic here
        return pactum
          .spec()
          .get('/user/me')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBodyContains('email')
          .expectBodyContains('id')
          .expectBodyContains('createdAt')
          .expectBodyContains('updatedAt')
          .expectBodyContains('first_name')
          .expectBodyContains('last_name');
      });

      it('should throw an error if user not found', () => {
        // Test user not found error here
        const fakeAccessToken = 'fakeAccessToken12345';
        return pactum
          .spec()
          .patch('/user/update-profile')
          .withHeaders({ Authorization: `Bearer ${fakeAccessToken}` })
          .withBody({
            first_name: 'John',
            last_name: 'Doe',
          })
          .expectStatus(401)
          .expectBodyContains('Unauthorized');
      });
    });

    describe('editProfile', () => {
      it('should edit the user profile', () => {
        // Test editProfile logic here
        return pactum
          .spec()
          .patch('/user/update-profile')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            first_name: 'John',
            last_name: 'Doe',
          })
          .expectStatus(200)
          .expectBodyContains('first_name')
          .expectBodyContains('last_name')
          .expectBodyContains('email')
          .expectBodyContains('id');
      });

      it('should throw an error if user not found', () => {
        // Test user not found error here
        const fakeAccessToken = 'fakeAccessToken12345';
        return pactum
          .spec()
          .patch('/user/update-profile')
          .withHeaders({ Authorization: `Bearer ${fakeAccessToken}` })
          .withBody({
            first_name: 'John',
            last_name: 'Doe',
          })
          .expectStatus(401)
          .expectBodyContains('Unauthorized');
      });
    });
  });

  describe('Bookmarks', () => {
    describe('get empty bookmarks', () => {
      it('should return all bookmarks for the user', () => {
        // Test getBookmarks logic here
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('create bookmark', () => {
      const payload: CreateBookmarkPayload = {
        title: 'Test title.',
        url: 'https://www.youtube.com/watch?v=GHTA143_b-s&list=PPSV',
      };
      it('should create a new bookmark', () => {
        // Test createBookmark logic here
        return pactum
          .spec()
          .post('/bookmark')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(payload)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });

    describe('get bookmarks', () => {
      it('should return all bookmarks for the user', () => {
        // Test getBookmarks logic here
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('get bookmark by Id', () => {
      it('should return a bookmark by ID', () => {
        // Test getBookmark byId logic here
        return pactum
          .spec()
          .get('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('edit bookmark by Id', () => {
      const editPayload: EditBookmarkPayload = {
        title: 'NestJs Course for Beginners - Create a REST API',
        description:
          'Learn NestJs by building a CRUD REST API with end-to-end tests using modern web development techniques. NestJs is a rapidly growing node js framework that helps build scalable and maintainable backend applications.',
      };
      it('should edit a bookmark', () => {
        // Test editBookmark logic here
        return pactum
          .spec()
          .patch('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(editPayload)
          .expectStatus(200)
          .expectBodyContains(editPayload.title as string)
          .expectBodyContains(editPayload.description as string);
      });
    });

    describe('delete bookmark by Id', () => {
      it('should delete a bookmark', () => {
        // Test deleteBookmark logic here
        return pactum
          .spec()
          .delete('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(204);
      });
    });
  });
});
