<template>
  <v-container class="ml-6">
    <h2 class="my-6">Paper Config</h2>

    <h3 class="mt-3">Content</h3>
    <v-container>
      <v-row
        v-for="v in content_toggle_list" :key="v.name"
      >
        <v-col cols="9" sm="6">
          <h4 class="d-inline-block">{{v.text}}</h4>
          <v-tooltip v-if="v.tooltip" bottom>
            <template #activator="{ on, attrs }">
              <v-icon small v-bind="attrs" v-on="on">mdi-alert-circle-outline</v-icon>
            </template>
            <span>{{v.tooltip}}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="3" sm="6">
          <ToggleBtn 
            :value="content_value(v.name)"
            @toggle="set_value(v.name, $event)" 
          />
        </v-col>
      </v-row>
    </v-container>

    <h3 class="mt-3">
      Rendering <v-btn icon small @click="reset_render_option"><v-icon>mdi-refresh</v-icon></v-btn>
    </h3>
    <v-container>
      <v-row class="py-0" dense>
        <v-col>
        <span 
          class="text-caption text--secondary font-italic"
        >Hint: click the number and scroll your mouse wheel.</span>
        </v-col>
      </v-row>
      <v-row 
        v-for="v in render_option_list" :key="v.name"
        class="align-center py-1" dense 
      >
        <v-col cols="9" sm="6">
          <h4 class="d-inline-block">{{v.text}}</h4>
        </v-col>
        <v-col cols="3" sm="6">
          <v-btn tile icon small @click="dec_render_value(v.name)"><v-icon>mdi-minus</v-icon></v-btn>
          <v-text-field 
            class="d-inline-block input-text-center" style="width: 2em;"
            readonly single-line dense hide-details
            :value="render_value(v.name)"
            @wheel="whell_event($event, v.name)"
          >
          </v-text-field>
          <v-btn tile icon small @click="inc_render_value(v.name)"><v-icon>mdi-plus</v-icon></v-btn>
        </v-col>
      </v-row>
    </v-container>

  </v-container>
</template>

<script>
import ToggleBtn from '../ToggleBtn.vue';
import { open_app_data } from '~/utils/db';

export const render_option_list = [
  {
    name: "render_font_size",
    text: "Font size",
    default: 16,
  },
  {
    name: "render_line_height",
    text: "Line height",
    default: 24
  },
  {
    name: "render_entry_spacing",
    text: "Entry spacing",
    default: 16
  },
  {
    name: "render_example_spacing",
    text: "Example spacing",
    default: 0
  },
  {
    name: "render_translation_spacing",
    text: "Translation spacing",
    default: 0
  }
]

export default {
    name: "PaperConfig",

    components: { ToggleBtn },

    data: () => ({
      config: {},
      config_sub: null,

      content_toggle_list: [
        {
          name: "hide_rank",
          text: "Hide rank"
        },
        {
          name: "hide_word",
          text: "Hide words",
        },
        {
          name: "hide_part_of_speech",
          text: "Hide part of speech"
        },
        {
          name: "hide_pron",
          text: "Hide pronunciations"
        },
        {
          name: "hide_def",
          text: "Hide definitions"
        },
        {
          name: "hide_example",
          text: "Hide examples"
        },
        {
          name: "hide_example_trans",
          text: "Hide example translations"
        },
        {
          name: "hide_word_in_example",
          text: "Hide word in examples",
          "tooltip": (
            "This function simply replace the word with underlines in " 
            + "the examples, reguardless of all the transformations to the word. "
            + "Don't rely on the function especially in case that verbs are extensively "
            + "used in your examples."
          ),
        }
      ],

      render_option_list
    }),

    computed: {
      content_value() {
        return (name) => {
          return this.config?.[name] ?? false;
        }
      },

      render_value() {
        return (name) => {
          return this.config?.[name] ?? this.render_option_list.find(v => v.name === name).default;
        }
      }
    },

    mounted() {
      open_app_data().then(async (app_data) => {
        this.config = await app_data.get_property("paper_config", {})

        this.config_sub = app_data.subscribe_property("paper_config", {
          next: (p) => { this.config = p?.value ?? {}; },
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
      async set_value(name, value) {
        const new_config = {...this.config};
        new_config[name] = value;
        
        const app_data = await open_app_data();
        await app_data.set_property("paper_config", new_config);
      },

      async inc_render_value(name, step=1) {
        await this.set_value(name, this.render_value(name) + step)
      },

      async dec_render_value(name, step=1) {
        await this.set_value(name, this.render_value(name) - step)
      },

      async whell_event(event, name) {
        if(event.deltaY > 0) {
          await this.dec_render_value(name);
        } else if (event.deltaY < 0) {
          await this.inc_render_value(name);
        }
      },

      async reset_render_option() {
        const new_config = {...this.config}
        for(const v of this.render_option_list){
          new_config[v.name] = v.default;
        }
        const app_data = await open_app_data();
        await app_data.set_property("paper_config", new_config);
      }
    }
}
</script>

<style lang="scss">
.input-text-center {
  input {
    text-align: center;
  }
}
</style>