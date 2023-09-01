const request = require('supertest');
const { app } = require('../src/server'); // Update the path accordingly

// Mock the services
jest.mock('../src/services/emailAnalysisService', () => ({
    findRepeatedParagraphSortedByCount: jest.fn(() => ({
        isSuccess: true,
        snippets: ["Repeated snippet"],
    })),
}));

jest.mock('../src/services/gmailService', () => ({
    readGmails: jest.fn(() => ({
        isSuccess: true,
        emails: ["Email content 1", "Email content 2"],
    })),
}));

describe('analyzeEmails', () => {
    it('should analyze emails and return snippets', async() => {
        const response = await request(app)
            .post('/api/analyze-emails')
            .send({ accessToken: 'mockAccessToken' })
            .expect(200);

        expect(response.body).toEqual({ snippets: ["Repeated snippet"] });
    });

    it('should handle missing access token', async() => {
        const response = await request(app)
            .post('/api/analyze-emails')
            .send({})
            .expect(400);

        expect(response.body).toEqual({ message: '\"accessToken\" is required' });
    });

    it('should handle readGmails error', async() => {
        const readGmailsMock = require('../src/services/gmailService').readGmails;
        readGmailsMock.mockReturnValue({ isSuccess: false, message: 'Read error' });

        const response = await request(app)
            .post('/api/analyze-emails')
            .send({ accessToken: 'mockAccessToken' })
            .expect(400);

        expect(response.body).toEqual({ message: 'Read error' });
    });

    it('should handle findRepeatedParagraphSortedByCount error', async() => {
        const findRepeatedParagraphSortedByCountMock = require('../src/services/emailAnalysisService').findRepeatedParagraphSortedByCount;
        findRepeatedParagraphSortedByCountMock.mockReturnValue({ isSuccess: false });

        const response = await request(app)
            .post('/api/analyze-emails')
            .send({ accessToken: 'mockAccessToken' })
            .expect(400);

        expect(response.body).toEqual({ message: 'Read error' });
    });
});