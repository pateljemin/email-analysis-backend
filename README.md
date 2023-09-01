### Description
A NodeJs server which will read gmails of the user and will analyse the emails and suggest repetitive snippets. 



## Setup
1. Install NodeJs: https://nodejs.org/en/download/
2. Go to the root directory of the project.
3. You can change the value in `env_sample` file as per your requirement and rename it with `.env`.
4. Run the following commands:
```
npm install
npm run start
```

### Code Architecture

1. In `src` directory you will get the entire code.
2. In `src/validators` directory you will get all the validators of the controller requests.
3. In `src/controllers` directory you will get all the controllers.
4. In `src/services` directory you will get all the services. 
5. In `src/router.js` file you will get all the routes.
6. In `src/server.js` file you will get how server is created.
7. In `test` directory you will get all the unit and integrated test cases. 

### Request flow
Request flow will be like : `server.js -> router.js -> validator -> controller -> service`

### Log Format
You will find the logs in this format `[fileName][methodName] Error message` so with this format it becomes easy to locate the errors.

## API Documentation
### Get sent emails analysis (Find repetitive snippets)

Request

You need to pass gooele access token in body.
```
POST /api/analyze-emails
{
   accessToken: 'access-token'
}
```

Response:

```
{
    snippets: ['This is the first snippet','This is the second Snippet','This is the third Snippet']
}
```

## Code walkthrough
https://www.loom.com/share/99b1df0f76c74f60ac8ec916b9c341f3?sid=2bc59892-4bc0-4a61-8691-9ea4d87694b8

