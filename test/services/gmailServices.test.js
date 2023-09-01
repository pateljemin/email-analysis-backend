const { readGmails } = require('../../src/services/gmailService'); // Update the path accordingly
const { google } = require('googleapis');

jest.mock('googleapis'); // Mock the googleapis module

describe('readGmails', () => {
    it('should return emails successfully', async() => {
        const accessToken = 'mockAccessToken';
        const messageData1 = { data: { messages: [{ id: 'mockId1' }], snippet: "Sample message" } };
        const messageData2 = { data: { messages: [{ id: 'mockId2' }], snippet: "Sample message 2" } };

        const mockGmail = {
            users: {
                messages: {
                    list: jest.fn(() => messageData1),
                    get: jest.fn((params) => {
                        if (params.id === 'mockId1') return messageData1;
                        if (params.id === 'mockId2') return messageData2;
                    }),
                },
            },
        };

        const mockOAuth2Client = {
            setCredentials: jest.fn(),
        };

        google.auth.OAuth2.mockReturnValue(mockOAuth2Client);
        google.gmail.mockReturnValue(mockGmail);

        const result = await readGmails(accessToken);
        expect(result.isSuccess).toBe(true);
        expect(result.emails).toEqual([messageData1.data.snippet]);
        expect(mockGmail.users.messages.list).toHaveBeenCalledWith({
            userId: 'me',
            q: 'in:sent',
            auth: mockOAuth2Client,
            maxResults: 50,
        });
        expect(mockGmail.users.messages.get).toHaveBeenCalledTimes(1);
    });

    it('should handle errors and return failure', async() => {
        const accessToken = 'mockAccessToken';

        const mockGmail = {
            users: {
                messages: {
                    list: jest.fn(() => {
                        throw new Error('mockListError');
                    }),
                },
            },
        };

        const mockOAuth2Client = {
            setCredentials: jest.fn(),
        };

        google.auth.OAuth2.mockReturnValue(mockOAuth2Client);
        google.gmail.mockReturnValue(mockGmail);

        const result = await readGmails(accessToken);

        expect(result.isSuccess).toBe(false);
        expect(result.message).toBe('Something went wrong!');
    });
});