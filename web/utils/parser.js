import { Dictionary, Entry, Definition, Example, Pronunciation } from "./model.js"

export const fromPlainText = (text) => {
    /**
     * Syntax:
     *  <word> | <pron> | <explain> [| <example>...]
     */

    const lines = text.split("\n")
        .map((val) => val.trim())
        .filter((val) => Boolean(val));

    const dic = new Dictionary();
    const err = [];
    
    for (const line of lines) {
        const arr = line.split("|")
            .map((val) => val.trim());
        if (arr.length < 3) {
            err.push(line);
            continue;
        }
        const entry = new Entry(arr[0]);

        const pron = new Pronunciation();
        pron.value = arr[1];
        pron.zone = "";
        entry.add_pron(pron);

        const def = new Definition();
        def.value = arr[2];
        for(let i = 3;i < arr.length;i++){
            if(arr[i]){
                const e = new Example();
                e.val = arr[i];
                def.examples.push(e);
            }
        }
        entry.add_def(def);

        dic.add(entry)
    }

    return dic;
}