import { Dictionary, Entry, Definition, Example, Pronunciation } from "./model.js"

export const from_plain_text = (text) => {
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


export const get_test_data = () => {
    const dic = new Dictionary();
    dic.meta = {
        name: "test dataset",
        origin: "https://github.com/gjcav/",
        tags: ["tag1", "tag2"]
    }
    for (let i = 0;i < 10;i++){
        const e = new Entry();
        e.word = `pseudoword-${i}`;
        for (let j = 1;j <= 5;j++){
            e.add_pron({
                value: "pron " + j, 
                zone: "US " + j
            })
        }
        for (let j = 1;j <= 2;j++){
            const def = new Definition();
            def.value = `def of "${e.word}": abcdefgh ${j}`
            def.examples.push({
                value: "example 1, example 1example 1example 1example 1example 1example 1example 1example 1example 1example 1example 1",
                translation: "example 1, trans"
            })
            def.examples.push({
                value: "example 2",
                translation: "example 2, trans trans trans trans trans trans trans trans trans trans trans trans trans trans trans trans trans trans trans trans trans trans trans trans trans trans trans trans "
            })
            e.add_def(def)
        }
        dic.add(e)
    }
    return dic;
}