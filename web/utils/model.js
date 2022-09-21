// eslint-disable-next-line no-unused-vars
export class Pronunciation {
    word = "";
    value = "";
    zone = "UK"; // UK or US
}


// eslint-disable-next-line no-unused-vars
export class Example {
    value = "";
    translations = [];
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
        // .. and other user defined meta data
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
