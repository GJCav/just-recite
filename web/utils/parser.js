import { Dictionary, Entry, Definition, Example, Pronunciation } from "./model.js"

export const from_plain_text = (text) => {
    /**
     * Syntax:
     *  <word> | <part_of_speech> | <pron> | <explain> [| <example>...]
     */

    const lines = text.split("\n")
        .map((val) => val.trim())
        .filter((val) => Boolean(val));

    const dic = new Dictionary();
    const err = [];
    
    for (const line of lines) {
        const arr = line.split("|")
            .map((val) => val.trim());
        if (arr.length < 4) {
            err.push(line);
            continue;
        }
        const entry = new Entry(arr[0]);

        const speech = arr[1];

        const pron = new Pronunciation();
        pron.value = arr[2];
        pron.zone = "";

        const def = new Definition();
        def.value = arr[3];
        def.add_pron(pron);
        def.part_of_speech = speech;
        for(let i = 4;i < arr.length;i++){
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
        for (let j = 1;j <= 2;j++){
            const def = new Definition();
            def.part_of_speech = "adj."
            for (let j = 1;j <= 5;j++){
                def.add_pron({
                    value: "pron " + j, 
                    zone: "US " + j
                })
            }
            def.value = `def of "${e.word}": abcdefgh ${j}`
            def.examples.push({
                value: "example 1, example 1e" + e.word + "le 1example 1example 1example 1example 1example 1example 1example 1example 1",
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