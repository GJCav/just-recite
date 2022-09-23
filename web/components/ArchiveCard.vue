<template>
  <v-card outlined>
    <!-- card title -->
    <v-card-title class="pb-0">
      <span>{{name}}</span>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-login-variant</v-icon>
      </v-btn>
      <v-btn 
        icon :color="bookmark ? 'pink' : 'gray'"
        @click="bookmark = !bookmark"
      >
        <v-icon>{{bookmark ? "mdi-heart" : "mdi-heart-outline"}}</v-icon>
      </v-btn>
      <!-- <v-btn icon>
        <v-icon>mdi-pencil</v-icon>
      </v-btn> -->
      <v-btn icon @click="del_archive">
        <!-- TODO: delete this -->
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn 
        icon
        @click="show = !show"
      >
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text class="pb-0">
      <span class="text--secondary text-subtitle-1 font-italic">
        {{ dic_meta.name }}
      </span>
    </v-card-text>

    <v-card-text class="text--primary pt-0">
      <!-- learning statistic -->
      <v-row class="justify-space-between" no-gutters>
        <p>
          <v-icon>mdi-close-circle-outline</v-icon>fake data
        </p>
        <p>
          <v-icon>mdi-help-circle-outline</v-icon>fake data
        </p>
        <p>
          <v-icon>mdi-check-circle-outline</v-icon>fake data
        </p>
      </v-row>

      <v-alert 
        v-model="error" type="error" dense
        dismissible
      >
        {{errmsg}}
      </v-alert>
    </v-card-text>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-card-text>
          <!-- archive properties -->
          <v-row no-gutters>
            <span class="text-subtitle-1">Archive Properties: </span>
          </v-row>
          <v-row 
            v-for="(val, key) in arc_property"
            :key="key" 
            no-gutters
          >
            <v-col cols="6">
              <span>{{key}}</span>
            </v-col>
            <v-col cols="6">
              <span>{{val}}</span>
            </v-col>
          </v-row>

          <!-- Dic properties -->
          <v-row no-gutters class="mt-2">
            <span class="text-subtitle-1">Dictionary Properties: </span>
          </v-row>
          <v-row 
            v-for="(val, key) in dic_property"
            :key="key" 
            no-gutters
          >
            <v-col cols="6">
              <span>{{key}}</span>
            </v-col>
            <v-col cols="6">
              <span>{{val}}</span>
            </v-col>
          </v-row>
        </v-card-text>
      </div>
    </v-expand-transition>

  </v-card>
</template>

<script>
/**
 * just read the archive once. The component is blind of any changes
 * in the relevant archive.
 */

import { open_app_data, open_archive } from '~/utils/db';

export default {
  name: "ArchiveCard",

  props: {
    name: { type: String, default: null }
  },

  data: () => ({
    show: false, // property 框控制
    error: false,
    errmsg: "",
    
    dic_meta: {},
    entry_count: -1,
    
    bookmark: false,
    arc_property_arr: [],
  }),

  computed: {
    dic_property() {
      const obj = {...this.dic_meta};

      const excludes = ['name'];
      for (const name of excludes) {
        delete obj[name];
      }

      obj["Entry Count"] = this.entry_count;

      return obj;
    },

    arc_property() {
      const rules = {
        "last_open_time": { rename: "Last Open", default: "missing data" },
        "create_time": { rename: "Create", default: "missing data" },
        "dic_meta": { delete: true }
      }

      const obj = {};
      for(const p of this.arc_property_arr) {
        obj[p.name] = p.value;
      }

      this.transform_object(rules, obj);
      return obj;
    }
  },

  mounted() {
    open_archive(this.name).then(async (archive) => {
      const app_data = await open_app_data();

      this.dic_meta = await archive.get_property("dic_meta", {});
      this.entry_count = await archive.db.entry.count();
      
      this.bookmark = (await app_data.get_property("bookmarks", [])).includes(this.name);
      this.arc_property_arr = (await archive.db.property.toArray());
    }).catch(e => this.show_error(e));
  },

  methods: {
    show_error(e) {
      this.error = true;
      this.errmsg = e.message;
    },

    /**
     * procedure
     * 1. delete --> end procedure
     * 2. set default value
     * 3. call map function
     * 4. rename key
     * 
     * @param {*} rules 
     * @param {*} obj 
     */
    transform_object(rules, obj) {
      for (const key in rules){
        const rule = rules[key];

        if (rule.delete) {
          delete obj[key];
          continue;
        }

        if (rule.default && (obj[key] == null || obj[key] === undefined)) {
          obj[key] = rule.default;
        }

        if (rule.map) {
          obj[key] = rule.map(obj[key], key, obj);
        }

        if (rule.rename) {
          obj[rule.rename] = obj[key];
          delete obj[key];
        }
      }

      return obj;
    },

    async del_archive() {
      const app_data = await open_app_data();
      await app_data.delete_archive(this.name);
    }
  },
}
</script>