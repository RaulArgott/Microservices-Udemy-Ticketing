import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


declare global {
    var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});

    process.env.JWT_KEY = 'asdf';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
});
beforeEach(async () => {
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});


/**
 * Signs in a user and returns a cookie with a valid session
 * 
 * The function generates a JWT token with a random ID and the email
 * hYq9C@example.com. The token is then converted to a base64 string
 * and returned as a cookie in the format session=<base64>
 * 
 * @returns {string[]} An array with a single element, the cookie
 */
global.signin = () => {
 const payload = {
     id: new mongoose.Types.ObjectId().toHexString(),
     email: 'hYq9C@example.com'
 };

 const token = jwt.sign(payload, process.env.JWT_KEY!);

 const session = { jwt: token };

 const sessionJSON = JSON.stringify(session);

 const base64 = Buffer.from(sessionJSON).toString('base64');

 return [`session=${base64}`];
}
