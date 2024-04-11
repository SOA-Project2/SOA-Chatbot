const request = require('supertest');
const { app } = require('../src/server');
const STATUS_CODES = require('../src/constants/statusCodes')

describe('POST /postFeedback', () => {
    test('It should respond with a 500 status code', async () => {
        const response = await request(app)
            .post('/postFeedback')
            .type('form')
            .send({ 
                feedback: "Me encantó este restaurante, lo recomiendo totalmente" 
            });
        expect(response.statusCode).toBe(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });
    test('It should respond with a 200 status code', async () => {
        const response = await request(app)
            .post('/postFeedback')
            .type('form')
            .send({ 
                feedback: "Me encantó este restaurante, lo recomiendo totalmente"
            });
        expect(response.statusCode).toBe(STATUS_CODES.OK);
    });
    
    test('It should respond with a 400 status code for empty feedback', async () => {
        const response = await request(app)
            .post('/postFeedback')
            .type('form')
            .send({ 
                feedback: '' 
            });
        expect(response.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
    });
    
    test('It should respond with a 400 status code for missing feedback', async () => {
        const response = await request(app)
            .post('/postFeedback')
            .type('form')
            .send({});
        expect(response.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
    });
    
    test('It should respond with a 400 status code for incorrect field name', async () => {
        const response = await request(app)
            .post('/postFeedback')
            .type('form')
            .send({ 
                Feedback: 'Me encantó este restaurante, lo recomiendo totalmente' 
            });
        expect(response.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
    });
    
})
