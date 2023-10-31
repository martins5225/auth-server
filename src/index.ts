/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as cors from 'cors';
import * as express from 'express';
import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';

import { addUser, getAllUsers, getUser, updateUser } from './userController';

import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
setGlobalOptions({ maxInstances: 10 });

const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => res.status(200).send('hey there!'));
app.post('/signup', addUser);
app.patch('/users/:userId', updateUser);
app.get('/users', getAllUsers);
app.get('/users/:userId', getUser);

export const helloWorld = onRequest((request, response) => {
	logger.info('Hello logs!', { structuredData: true });
	response.send('Hello from Firebase!');
});

exports.app = functions.https.onRequest(app);
