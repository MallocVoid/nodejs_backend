const http = require('http');
const request = require('supertest')
const app = require('../app')

let server;

beforeEach(() => {
  server = http.createServer(app);
})

afterEach(async () => {
  if (server) {
    await server.close();
  }
})

describe('Server running', () => {
  it('should check the root for a greeting from the machine spirit', async () => {
    const res = await request(server)
        .get("/")
        .expect(200)
        .then(response => {
          expect(response.body.text).toBe("Hello World!")
        })
  })
})

describe('Get the list of apps', () => {
  it('should add an App and then request the list of apps', async () => {
    const res = await request(server)
        .get("/apps")
        .then(response => {
          expect(response.statusCode).toBe(200);
        })
    })
})

describe('Register User', () => {
  it('should require username and password', async () => {
    const res = await request(server)
        .post("/register")
        .then(response => {
          // No username or password sent
          expect(response.statusCode).toBe(400);
        })
    })
})