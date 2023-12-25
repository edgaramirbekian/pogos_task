## Description

Pogos Chat Assesment with ReactJS and NestJS
**Objective:**
The objective of this assignment is to create a chat application with real-time messaging using
Nest.js as the backend framework.
**Requirements:**
Frontend (React.js and TypeScript):
1. Create a React.js application with the following components:
- ChatRoom: Display a chat room where users can send and receive messages.
- ChatInput: Allow users to enter and send messages.
2. Implement basic state management within components (without using a state management
library).
3. Implement real-time messaging using WebSocket (you can use libraries like Socket.io or
plain WebSockets).
4. Allow users to enter a username before joining the chat.
5. Display sent and received messages with a timestamp.
6. Use TypeScript for type safety.
Backend (Nest.js, TypeScript, WebSocket):
1. Create a Nest.js application for the server.
2. Implement WebSocket support for real-time communication between clients using Nest.js
WebSockets.
3. Store chat messages in-memory (no need for a database).
4. Implement basic user authentication with the ability to choose a username.
5. Use TypeScript for type safety in your server code.
General Guidelines:
- Use a simplified folder structure for the frontend and backend code.
- Provide basic instructions on how to run the application locally.
- Keep the code organized and readable, focusing on the core features.
**Bonus (Optional):**
- Add user avatars or profile pictures.
- Implement message history so that users can see previous messages upon joining the chat.
- Implement basic error handling for failed messages.
**Submission:**
The candidate should submit the assignment as a GitHub repository with a README.md file
that explains how to run the application. Include any additional notes about their
implementation

## Installation

```bash
$ cd ./pogos-chat-client
$ npm install
```
```bash
$ cd ./pogos-chat-server
$ npm install
```

## Running the app

```bash
$ cd ./pogos-chat-client
$ npm run start
```
```bash
$ cd ./pogos-chat-server
$ npm run start
```
