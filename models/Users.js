import mongoose from 'mongoose';
import { randomBytes, pbkdf2Sync } from 'crypto';

const { Schema } = mongoose;

export const UsersSchema = new Schema({
    firstname: { type: String, required: true, trim: true, index: true },
    lastname: { type: String, required: true, trim: true, index: true },
    email: { type: String, required: true, trim: true, match: /^[a-zA-Z][a-zA-Z_.0-9]+\b@gmail\.com\b/gm, index: true },
    username: { type: String, required: true, trim: true, index: true },
    password: { type: String, required: true, index: true },
    salt: { type: String, required: true, index: true },
    keys: { type: Map, of: String }
});

UsersSchema.methods.setPassword = function (password) {
    this.salt = randomBytes(16).toString('hex');
    this.password = pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');

    this.keys.set('secretKey', randomBytes(256).toString('hex'));
};

UsersSchema.methods.validatePassword = function (password) {
    const hash = pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.password === hash;
};

//UsersSchema.methods.generateJWT = function () {
//    const today = new Date();
//    const expirationDate = new Date(today);
//    expirationDate.setDate(today.getDate() + 60);

//    return jwt.sign({
//        email: this.email,
//        id: this._id,
//        exp: parseInt(expirationDate.getTime() / 1000, 10),
//    }, 'secret');
//}

//UsersSchema.methods.toAuthJSON = function () {
//    return {
//        _id: this._id,
//        email: this.email,
//        token: this.generateJWT(),
//    };
//};

export const UserModel = function () {
    UsersSchema.post('validate', function (doc) {
        console.log('%s has been validated (but not saved yet)', doc._id);
    });

    return mongoose.model('Users', UsersSchema);
}