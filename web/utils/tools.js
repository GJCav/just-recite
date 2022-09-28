/**
 * some frequently used code fragement
 */


const _right_drawer_state = []

export const use_rd_tools = (comp) => {
    return {
        /**
         * save right drawer state, need `this` context
         */
        push: (function() {
            _right_drawer_state.push({...this.$store.state.right_drawer});
        }).bind(comp),

        /**
         * restore right drawer state, need `this` context
         */
        pop: (function() {
            this.$store.commit("set_right_drawer", _right_drawer_state.pop() ?? {});
        }).bind(comp)
    }
} 