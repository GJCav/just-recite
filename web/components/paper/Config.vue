<template>
  <v-container class="ml-6">
    <h2 class="my-6">Paper Config</h2>

    <h3 class="mt-3">Content</h3>
    <v-container>
      <v-row
        v-for="v in content_toggle_list" :key="v.name"
      >
        <v-col cols="6"><h4>{{v.text}}</h4></v-col>
        <v-col cols="6">
          <ToggleBtn 
            :value="content_value(v.name)"
            @toggle="content_toggle(v.name, $event)" 
          />
        </v-col>
      </v-row>
    </v-container>

    <h3 class="mt-3">Rendering</h3>

  </v-container>
</template>

<script>
import ToggleBtn from '../ToggleBtn.vue';
import { open_app_data } from '~/utils/db';

export default {
    name: "PaperConfig",

    components: { ToggleBtn },

    data: () => ({
      config: {},
      config_sub: null,

      content_toggle_list: [
        {
          "name": "hide_rank",
          "text": "Hide Rank"
        },
        {
          "name": "hide_word",
          "text": "Hide words",
        },
        {
          "name": "hide_part_of_speech",
          "text": "Hide part of speech"
        },
        {
          "name": "hide_pron",
          "text": "Hide pronunciations"
        },
        {
          "name": "hide_def",
          "text": "Hide definitions"
        },
        {
          "name": "hide_example",
          "text": "Hide examples"
        },
        {
          "name": "hide_example_trans",
          "text": "Hide example translations"
        },
        {
          "name": "hide_word_in_example",
          "text": "Hide word in examples"
        }
      ],
    }),

    computed: {
      content_value() {
        return (name) => {
          return this.config[name] || false;
        }
      }
    },

    mounted() {
      open_app_data().then(async (app_data) => {
        this.config = await app_data.get_property("paper_config", {})

        this.config_sub = app_data.subscribe_property("paper_config", {
          next: (p) => { this.config = p ? p.value || {} : {}; },
          error: (e) => { throw(e); }
        });
      })
    },

    beforeDestroy() {
      if (this.config_sub) {
        this.config_sub.unsubscribe();
      }
    },

    methods: {
      async content_toggle(name, value) {
        const new_config = {...this.config};
        new_config[name] = value;
        
        const app_data = await open_app_data();
        await app_data.set_property("paper_config", new_config);
      }
    }
}
</script>