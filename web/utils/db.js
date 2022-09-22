import Dexie from "dexie";
import { Dictionary } from "./model";


/**
 * A Archive manages a dictionary and user data on it.
 * 
 * 
 */
export class Archive {
    db_name = "archive_name"
    db = null;

    constructor(db_name) {
        this.db_name = db_name;
        this.db = new Dexie(db_name);
        const db = this.db;

        db.version(1).stores({
            meta: "name", // meta data, contains only one record
            entry: "word",
            // TODO: 实现学习数据的储存
        })
    }

    async open() {
        if (!this.db.isOpen()){
            await this.db.open()
        }
        return true;
    }

    set_dictionary(dic) {
        const db = this.db;
        return db.transaction("rw", db.meta, db.entry, async () => {
            // delete old data
            await db.meta.toCollection().delete();
            await db.entry.toCollection().delete();

            // save new data
            await db.meta.put(dic.meta)
            for(const e of Object.values(dic.entries)){
                await db.entry.put(e)
            }
        })
    }

    async get_dictionary() {
        const db = this.db;
        const meta = (await db.meta.toArray())[0];
        const entries = await db.entry.toArray();
        const dic = new Dictionary();
        dic.meta = meta;
        dic.entries = entries;
        return dic;
    }
}


export const open_archive = async (db_name) => {
    const archive = new Archive(db_name);
    await archive.db.open()
}


export const persist = async () => {
    return await navigator.storage && navigator.storage.persist &&
        navigator.storage.persist();
}


export const persisted = async () => {
    return await navigator.storage && navigator.storage.persisted &&
        navigator.storage.persisted();
}