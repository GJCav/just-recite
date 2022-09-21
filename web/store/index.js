import { Dictionary } from "~/utils/model";

export const state = () => ({
    dictionary: new Dictionary()
});


export const mutations = {
    setDictionary(state, dic){
        state.dictionary = dic;
    }
}