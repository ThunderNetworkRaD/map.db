"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
const util_1 = require("util");
const fs = __importStar(require("fs"));
const writeDB = (0, util_1.promisify)(fs.writeFile);
const deleteDB = (0, util_1.promisify)(fs.unlink);
class MapDB {
    map;
    filename;
    db;
    options;
    /**
     * @constructor
     * @param filename If not set, MapDB will only use internal memory
     * @example 'file.db'
     * @param options Options to pass in the constructor
     * @param options.localOnly When enabled, MapDB will only use local storage, without touching internal memory (requires a filename)
     */
    constructor(filename, options) {
        if (!filename && options?.localOnly)
            throw new Error('Cannot use local storage without a filename');
        this.map = !options?.localOnly ? new Map() : null;
        this.filename = filename;
        if (!fs.existsSync('./data/'))
            fs.mkdirSync('./data');
        this.db = this.filename ? `./data/${this.filename}` : null;
        if (this.map && this.db) {
            try {
                const file = fs.readFileSync(this.db);
                const data = JSON.parse(file.toString());
                for (let i = 0; i < data.length; i++) {
                    this.map.set(data[i].key, data[i].value);
                }
            }
            catch { }
        }
    }
    /**
     *
     * @param key
     * @param value
     */
    async set(key, value) {
        if (typeof key !== 'string' && typeof key !== 'number') {
            throw new TypeError('key must be of type string or number');
        }
        if (this.db) {
            try {
                const file = fs.readFileSync(this.db);
                const data = JSON.parse(file.toString());
                const i = data.findIndex(pair => pair.key == key);
                !data[i] ? data.push({ key, value }) : data[i] = { key, value };
                await writeDB(this.db, JSON.stringify(data));
                if (!this.map)
                    return data;
            }
            catch {
                await writeDB(this.db, `[${JSON.stringify({ key, value })}]`).then(() => {
                    if (!this.map)
                        return JSON.parse(fs.readFileSync(this.db).toString());
                });
            }
        }
        return this.map.set(key, value);
    }
    /**
     *
     * @param key
     */
    get(key) {
        if (this.map) {
            return this.map.get(key);
        }
        else {
            const file = fs.readFileSync(this.db);
            const data = JSON.parse(file.toString());
            return data.find(pair => pair.key == key)?.value || undefined;
        }
    }
    /**
     *
     * @param key
     */
    has(key) {
        if (this.map) {
            return this.map.has(key);
        }
        else {
            const file = fs.readFileSync(this.db);
            const data = JSON.parse(file.toString());
            return data.find(pair => pair.key == key) ? true : false;
        }
    }
    entries() {
        if (this.map) {
            return this.map.entries();
        }
        else {
            const file = fs.readFileSync(this.db);
            const data = JSON.parse(file.toString());
            return data.map(pair => [pair.key, pair.value]);
        }
    }
    keys() {
        if (this.map) {
            return this.map.keys();
        }
        else {
            const file = fs.readFileSync(this.db);
            const data = JSON.parse(file.toString());
            return data.map(pair => pair.key);
        }
    }
    values() {
        if (this.map) {
            return this.map.values();
        }
        else {
            const file = fs.readFileSync(this.db);
            const data = JSON.parse(file.toString());
            return data.map(pair => pair.value);
        }
    }
    /**
     *
     * @param callbackfn
     */
    forEach(callback) {
        if (this.map) {
            this.map.forEach(callback);
        }
        else {
            const file = fs.readFileSync(this.db);
            const data = JSON.parse(file.toString());
            data.forEach(pair => callback(pair.value, pair.key, this.map));
        }
    }
    /**
     *
     * @param key
     */
    async delete(key) {
        if (this.db) {
            try {
                const file = fs.readFileSync(this.db);
                const data = JSON.parse(file.toString());
                const i = data.findIndex(pair => pair.key == key);
                if (data[i]) {
                    data.splice(i, 1);
                    await writeDB(this.db, JSON.stringify(data));
                    if (!this.map)
                        return true;
                }
                else if (!this.map) {
                    return false;
                }
            }
            catch { }
        }
        if (this.map) {
            return this.map.delete(key);
        }
    }
    async clear() {
        await writeDB(this.db, JSON.stringify([])).catch(() => { });
        if (this.map) {
            this.map.clear();
        }
    }
    size() {
        if (this.map) {
            return this.map.size;
        }
        else {
            const file = fs.readFileSync(this.db);
            const data = JSON.parse(file.toString());
            return data.length;
        }
    }
}
module.exports = MapDB;
