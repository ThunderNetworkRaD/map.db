import { promisify } from "util";
import * as fs from "fs";

const writeDB = promisify(fs.writeFile);
const deleteDB = promisify(fs.unlink);

class MapDB {
    /**
     * @constructor
     * @param filename If not set, MapDB will only use internal memory
     * @example 'file.db'
     */
}