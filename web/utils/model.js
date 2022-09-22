// eslint-disable-next-line no-unused-vars
export class Pronunciation {
    word = "";
    value = "";
    zone = "UK"; // UK or US
}


// eslint-disable-next-line no-unused-vars
export class Example {
    value = "";
    translation = "";
}


// eslint-disable-next-line no-unused-vars
export class Definition {
    word = "";
    value = "";
    examples = [];


}


// eslint-disable-next-line no-unused-vars
export class Entry {
    word = "";
    prons = [];
    definitions = [];

    constructor(word = "") {
        this.word = word;
    }

    add_pron(pron) {
        pron.word = this.word;
        this.prons.push(pron)
    }

    add_def(def) {
        def.word = this.word;
        this.definitions.push(def)
    }
}


// eslint-disable-next-line no-unused-vars
export class Dictionary {
    meta = {
        name: "",
        /**
         * and other user defined meta data about
         * about the dictionary itself, such as 
         * origin url, difficulty and so on.
         */
    };

    entries = {};

    add(entry, merge_options={}) {
        const word = entry.word;
        if (word in this.entries) { // TODO: some merge rules here, now ignore conflicts
            console.error("entity merge")

            // this.entries[word].prons.push(...entry.prons)
        } else {
            this.entries[word] = entry;
        }
    }
}

export const QUIZ_MODE = {
    CHOOSE_WORD_BY_DEF: 0,

    FILL_WORD_BY_DEF: 100,
    FILL_WORD_BY_PRON: 110, // TODO
    FILL_WORD_IN_EXAMP: 120, // TODO

    // ...
}


/**
 * learning record class
 */
export class Record {
    word = "";
    time = null;
    mode = 0; // quiz_mode
    correct = 0;
}