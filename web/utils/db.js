import Dexie from "dexie";


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

        })
    }

    async open() {
        if (!(await persisted())){
            if (!await persist()){
                throw new Error("unable to make indexedDB persistent")
            }
        }

        if (!this.db.isOpen()){
            await this.db.open()
        }

        return true;
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