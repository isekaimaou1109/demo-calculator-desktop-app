import mongoose from 'mongoose';

const { Schema } = mongoose;

export const LogsSchema = new Schema({
    clientIP: { type: String, required: true, trim: true, index: true },
    username: { type: String, trim: true, index: true, default: 'anonymous' },
    protocol: { type: String, required: true, trim: true, index: true },
    method: { type: String, required: true, trim: true, index: true },
    path: { type: String, required: true, trim: true },
    accessTime: { type: String, required: true, index: true, default: null },
    wrongTimeCount: { type: Number, required: true, index: true, default: 0 }
});

LogsSchema.methods.initialization = function (clientAddress = null, protocol, method, username) {
    if (this.accessTime == null) {
        this.accessTime = new Date().toLocaleString();
    }

    this.clientIP = `${clientAddress}`;

    this.protocol = protocol;
    this.method = method;

    if (username) {
        this.username = username;
    }
};

LogsSchema.methods.wrongAuthCount = function () {
    this.wrongTimeCount += 1;

    if (this.wrongTimeCount == 4) {
        return this.wrongTimeCount;
    }

    return this.wrongTimeCount;
};

export const LogsModel = mongoose.model('Logs', LogsSchema);