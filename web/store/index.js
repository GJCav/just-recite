
export const state = () => ({
    persistence: false,

    title: "Just Recite",

    top_alert: {
        enable: false,
        dismissible: true,
        type: "error",
        message: "",
        component: null, // remember to register component in ~/layout/default.vue
    },

    right_drawer_btn: false,
});

export const getters = {
    
};

export const mutations = {
    set_persistence(state, v) { state.persistence = v; },

    set_title(state, title) { state.title = title; },

    set_top_alert(state, option) {
        const t = {enable: true, ...option}
        if ("component" in option) {
            t.message = "";
        }
        if ("message" in option) {
            t.component = null;
        }
        state.top_alert = t;
    },

    set_right_drawer_btn(state, visible) { state.right_drawer_btn = visible; },
}

export const actions = {
// open database action here
// check persistence here
}