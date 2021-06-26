const app = require('./index.js');
const client = require('./db.js')

const supertest = require('supertest');

beforeAll(done => {
  done()
})

describe('get questions', () => {
  it('should respond with a 200 status code', () => {
    app.get('/qa/questions?product_id=17309', (err, res) => {
      expect(res.statusCode).toBe(200);
    })
  })
});

describe('get answers', () => {
  it('should respond with a 200 status code', () => {
    app.get('/qa/34/answers', (err, res) => {
      expect(res.statusCode).toBe(200);
    })
  })
});

describe('mark question helpful', () => {
  it('should respond with a 200 status code', () => {
    app.get('/qa/questions/3365799/helpful', (err, res) => {
      expect(res.statusCode).toBe(200);
    })
  })
});

describe('report question', () => {
  it('should respond with a 200 status code', () => {
    app.get('/qa/questions/61452/report', (err, res) => {
      expect(res.statusCode).toBe(200);
    })
  })
});

describe('mark answer helpful', () => {
  it('should respond with a 200 status code', () => {
    app.get('/qa/answers/119743/helpful', (err, res) => {
      expect(res.statusCode).toBe(200);
    })
  })
});

describe('report answer', () => {
  it('should respond with a 200 status code', () => {
    app.get('/qa/answers/119743/report', (err, res) => {
      expect(res.statusCode).toBe(200);
    })
  })
});

afterAll(done => {
  client.end()
  done()
})