import Dexie, { liveQuery } from "dexie";
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
    _observers = {}; // cache for liveQuery

    constructor(db_name) {
        this.db_name = db_name;
        this.db = new Dexie(db_name);
        const db = this.db;

        db.version(1).stores({
            /**
             * properties of the archive, in format of { name: <name>, value: <value> }.
             * well-defined properties are listed bellow:
             *  - dic_meta: meta data of the dictionary
             *  - create_time
             *  - last_open_time
             *  - bookmark
             *  - paper_config
             *  - 
             *  TODO: 这里设置复习记录啥的
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

    async get_property(name, def_value = null) {
        const property = await this.db.property.get(name);
        return property ? property.value || def_value : def_value;
    }

    async set_property(name, value) {
        await this.db.property.put({name, value});
    }

    async set_dictionary(dic) {
        const db = this.db;
        await db.transaction("rw", db.property, db.entry, async () => {
            // delete old data
            await db.entry.clear();

            // save new data
            this.set_property("dic_meta", dic.meta);
            for(const e of Object.values(dic.entries)){
                await db.entry.put(e)
            }
        })
    }

    async get_dictionary() {
        const db = this.db;
        const meta = await this.get_property("dic_meta")
        const entries = await db.entry.toArray();
        const dic = new Dictionary();
        dic.meta = meta;
        dic.entries = entries;
        return dic;
    }

    subscribe_property(name, options) {
        const observable = this._observers[name] || liveQuery(() => this.db.property.get(name));
        this._observers.bookmark = observable;
        return observable.subscribe(options);
    }
}

const _archives = {}

/**
 * get singleton instance for the archive of name `db_name`
 * @param {*} db_name 
 * @returns 
 */
export const open_archive = async (db_name) => {
    let archive = null;
    if (db_name in _archives) archive = _archives[db_name];
    else archive = new Archive(db_name);
    if (!archive.db.isOpen()) {
        await archive.db.open()
    }
    return archive
}

/**
 * 单例模式类，用于管理 Application level 的信息
 */
class AppData {
    db = null;
    _observers = {};

    constructor() {
        this.db = new Dexie("_app");
        this.db.version(1).stores({
            /**
             * In format of { name: <name>, value: <value> }.well-defined properties 
             * are listed bellow:
             *  - archive_list: an array of archive names
             *  - last_archive: name of last opened or current archive
             */
            property: "name"
        })
    }

    async open() {
        if (!this.db.isOpen()){
            await this.db.open();
        }
    }

    async get_property(name, def_value = null) {
        const property = await this.db.property.get(name);
        return property ? property.value || def_value : def_value;
    }

    async set_property(name, value) {
        await this.db.property.put({name, value})
    }

    async create_archive({
        name,
        dic,
    }) {
        const db = this.db;

        const archive_list = await this.get_property("archive_list", []) ;
        if (archive_list.includes(name)){
            throw new Error("archive existed");
        }

        let archive = await open_archive(name);
        try {
            const adb = archive.db;
            await adb.transaction("rw", [adb.entry, adb.property], async () => {
                await archive.set_property("create_time", new Date());
                await archive.set_dictionary(dic);
            })
        } catch(e) {
            window.indexedDB.deleteDatabase(name);
            throw(e);
        }
        
        try {
            await this.db.transaction("rw", [db.property], async () => {
                archive_list.push(name);
                await this.set_property("archive_list", archive_list)
            })
        } catch (e) {
            archive = null;
            throw(e);
        }

        return archive;
    }

    async delete_archive(name) {
        const db = this.db;

        if((await this.get_property("last_archive")) === name){
            throw new Error("unable to delete an opening archive");
        }

        if (!(await this.get_property("archive_list", [])).includes(name)) {
            throw new Error("archive not existed");
        }

        await db.transaction("rw", [db.property], async () => {
            const archive_list = await this.get_property("archive_list", []);
            archive_list.splice(archive_list.indexOf(name), 1);
            await this.set_property("archive_list", archive_list);
        });

        try {
            const archive = await open_archive(name);
            await archive.db.delete();
        } catch (e) {
            // recovery
            await db.transaction("rw", [db.property], async () => {
                const archive_list = await this.get_property("archive_list", []);
                archive_list.push(name);
                await this.set_property("archive_list", archive_list);
            }).catch((e) => {
                const err = new Error("Recover database error. Inconsistence emerges.");
                err.inner_error = e;
                throw e;
            });

            throw(e);
        }
    }

    subscribe_property(name, options) {
        const observable = this._observers[name] || liveQuery(() => this.db.property.get(name));
        this._observers.bookmark = observable;
        return observable.subscribe(options);
    }
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