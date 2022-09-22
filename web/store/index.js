import { Archive } from "~/utils/db";

export const state = () => ({
    archive: null,
    persistence: false,
});

export const getters = {
    
};

export const mutations = {
    set_persistence(state, v) { state.persistence = v; },
    set_archive(state, a) { state.archive = a; }
}

export const actions = {
// open database action here
// check persistence here
}