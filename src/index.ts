import fsp from "fs/promises";
import fs from "fs";

let writeDB: any, map: any, filename: string | undefined = 'database.db', dirname: string = './data/', db: any, file: any, data: any;

writeDB = fsp.writeFile;

export class MapDB {
    /**
     * @constructor
     * @param filename If not set, MapDB will only use internal memory
     * @example 'file.db'
     * @param options Options to pass to the constructor
     * @param options.dirname
     * @example 'data'
     */
    constructor(fn: string | undefined, options: any) {
        map = new Map();

        if (fn) filename = fn;

        if (options.dirname) dirname = options.dirname;

        if (!fs.existsSync(dirname)) fs.mkdirSync(dirname);

        db = `./${dirname}/${filename}`

        try {
            file = fs.readFileSync(db);
            data = JSON.parse(file.toString());

            for (let i = 0; i < data.length; i++) {
                map.set(data[i].key, data[i].value);
            }
        } catch {}
    }

    /**
     * @param key
     * @param value
     */
    async set(key: string | number, value: any) {
        try {
            file = fs.readFileSync(db);
            data = JSON.parse(data);

            let i = data.findIndex((pair: any) => pair.key == key);
            !data[i] ? data.push({ key, value }) : data[i] = { key, value };

            await writeDB(db, JSON.stringify(data));
        } catch {
            await await writeDB(db, `[${JSON.stringify({ key, value })}]`)
        }

        return map.set(key, value)
    }

    /**
     * @param key 
     */

    get(key: string | number) {
        if (map) {
            return map.get(key)
        } else {
            file = fs.readFileSync(db);
            data = JSON.parse(file.toString());

            return data.find((pair: any) => pair.key == key)?.value || undefined;
        }
    }
}