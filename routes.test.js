const app = require('./index.js');

const supertest = require('supertest');

describe('get questions', () => {
  it('should respond with a 200 status code', () => {
    app.get('/qa/questions?product_id=17309', (err, res) => {
      expect(res.statusCode).toBe(200)
    })
  })
})