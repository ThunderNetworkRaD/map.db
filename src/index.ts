import fs from "fs/promises";

const writeDB = fs.writeFile;
class MapDB {
    /**
     * @constructor
     * @param filename If not set, MapDB will only use internal memory
     * @example 'file.db'
     * @param options Options to pass to the constructor
     * @param options.dirname
     */
    constructor(filename: string | undefined, options: any) {
        this.map = new Map()
    }
}