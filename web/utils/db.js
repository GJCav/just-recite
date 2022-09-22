import Dexie from "dexie";
import { Dictionary } from "./model";


export const persist = async () => {
    return await navigator.storage && navigator.storage.persist &&
        navigator.storage.persist();
}


export const persisted = async () => {
    return await navigator.storage && navigator.storage.persisted &&
        navigator.storage.persisted();
}


/**
 * does NOT work for firefox (and maybe safari). Though firefox has an IndexedDB of name '_dbnames',
 * we can not read data from it.
 * Ref: https://gist.github.com/rmehner/b9a41d9f659c9b1c3340
 */
export const delete_all_database = async () => {
    const dbs = await window.indexedDB.databases()
    dbs.forEach(db => { window.indexedDB.deleteDatabase(db.name) })
}


/**
 * An Archive manages a dictionary and user data on it.
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
            /**
             * properties of the archive, in format of { name: <name>, value: <value> }.
             * well-defined properties are listed bellow:
             *   - dic_meta: meta data of the dictionary
             *   - last_open: last open datetime
             */
            property: "name",
            entry: "word",
            record: "word, time, mode, correct",
        })
    }

    async open() {
        if (!this.db.isOpen()){
            await this.db.open()
        }
        return true;
    }

    async get_property(name) {
        const property = await this.db.property.get(name);
        return property ? property.value : null;
    }

    async set_property(name, value) {
        await this.db.property.put({name, value});
    }

    set_dictionary(dic) {
        const db = this.db;
        return db.transaction("rw", db.property, db.entry, async () => {
            // delete old data
            await db.entry.toCollection().delete();

            // save new data
            this.set_property("dic_meta", dic.meta);
            for(const e of Object.values(dic.entries)){
                await db.entry.put(e)
            }
        })
    }

    async get_dictionary() {
        const db = this.db;
        const meta = this.get_property("dic_meta")
        const entries = await db.entry.toArray();
        const dic = new Dictionary();
        dic.meta = meta;
        dic.entries = entries;
        return dic;
    }
}


/**
 * 单例模式类，用于管理 Application level 的信息
 */
class AppData {
    db = null;

    constructor() {
        this.db = new Dexie("_app");
        this.db.version(1).stores({
            /**
             * In format of { name: <name>, value: <value> }.well-defined properties 
             * are listed bellow:
             *  - archive_list: an array of archive names
             *  - last_open: name of last opened archive
             */
            property: "name"
        })
    }

    async open() {
        if (!this.db.isOpen()){
            await this.db.open();
        }
    }

    async get_property(name) {
        const property = await this.db.property.get(name);
        return property ? property.value : null;
    }

    async set_property(name, value) {
        await this.db.property.put({name, value})
    }
}


export const open_archive = async (db_name) => {
    const archive = new Archive(db_name);
    await archive.db.open()
}

let _app_data = null;

/**
 * get the singleton instance of AppData
 * @returns 
 */
export const open_app_data = async () => {
    if(!_app_data) {
        _app_data = new AppData();
        await _app_data.open();
    }
    return _app_data;
}