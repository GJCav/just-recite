<template>
<v-container fluid>
  <v-row class="justify-center mb-2"><h1>{{dic.meta.name}}</h1></v-row>
  <v-row
    v-for="(entry, rank) in entries" :key="entry._key"
    class="font-setting mb-4"
    dense
  >
    <!-- word -->
    <v-col 
      :lg="2" :cols="3" 
      style="word-break: keep-all; word-wrap: break-word; white-space: pre-wrap;"
    >
      <div class="d-flex flex-row">
        <span v-if="!hide_content('hide_rank')">{{ rank + 1}}.</span>
        <div class="d-flex flex-column">
          <span>{{ hide_content('hide_word') ? _.pad('', length=entry.word.length, chars='_') : entry.word}}</span>
          <span 
            v-if="!hide_content('hide_part_of_speech')"
            class="font-italic mt-1 pr-2 align-self-end"
          >{{ entry.definitions[0].part_of_speech }}</span>
        </div>
      </div>
    </v-col>
    <!-- pronunciation -->
    <v-col v-if="!hide_content('hide_pron')" :lg="2" :cols="3">
      <ul class="pron-list pl-0 ">
        <li 
          v-for="pron in entry.definitions[0].prons" :key="pron.value"
          class="pr-1 d-inline-block"
        >
          {{pron.zone}} {{pron.value}}
        </li>
      </ul>
    </v-col>
    <!-- definition -->
    <v-col 
      v-if="!hide_content('hide_def')"
      :lg="cols_def_lg" :cols="cols_def"
    >
      {{entry.definitions[0].value}}
    </v-col>
    <!-- examples -->
    <v-col 
      v-if="!hide_content('hide_example')"
      :lg="10" :offset-lg="2" 
      :cols="12" :offset="0"
      class="ml-2 pt-0"
    >
      <ul> <!-- 这里不能用 flex-column 否则会有奇怪的渲染问题-->
        <li 
          v-for="e in entry.definitions[0].examples" :key="e.value"
        >
          <p class="mb-0">
            {{ hide_content('hide_word_in_example') ? 
              _.replace(e.value, entry.word, _.pad('', entry.word.length, '_')) 
              : e.value }}
          </p>
          <p v-if="!hide_content('hide_example_trans')" class="mb-0 text--secondary">
            {{ e.translation}}
          </p>
        </li>
      </ul>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import "~/assets/print.scss"
import { open_app_data, open_archive } from "~/utils/db";
import { Dictionary } from "~/utils/model";
import { use_rd_tools } from "~/utils/tools";

export default {
  name: "PrintPaper",

  data: () => ({
    // component UI

    // archive level
    archive_name: null,
    paper_config: {},
    paper_config_sub: null,

    // dictionary level
    dic: new Dictionary(),
    dic_sub: null,

    // others
  }),

  computed: {
    entries() { 
      /**
       * TODO: 这里做各种处理，以满足各类设置需求
       * TODO: 把 example 中预处理一下，去除单词自身（单词变形暂时不处理），用于生成填空题
       *  SUBTODO: 处理单词时态变形
       */
      // 
      
      const raw_data = Object.values(this.dic.entries);

      // 这里将所有定义展开
      const list = [];
      for(const e of raw_data){
        for(const def of e.definitions){
          list.push({
            ...e,  // 复制数据
            _key: e.word + def.value, // 给一个 key 避免 v-for 报错
            ...{   // 覆盖原来的 definitions
              definitions: [def]
            }
          })
        }
      }


      return list;
    },

    hide_content() {
      return (name) => {
        return (this.paper_config || {})[name] || false;
      }
    },

    cols_def() {
      return (this.paper_config || {}).hide_pron ? 9 : 6;
    },

    cols_def_lg () {
      return (this.paper_config || {}).hide_pron ? 10 : 8;
    },
  },

  mounted() {
    use_rd_tools(this).push();
    this.$store.commit("set_right_drawer", {
      btn: true,
      comp: "PaperConfig"
    });

    open_app_data().then(async (app_data) => {
      this.archive_name = await app_data.get_property("last_archive");
      if (this.archive_name) {
        const archive = await open_archive(this.archive_name);
        this.dic = await archive.get_dictionary();
      }

      this.paper_config = await app_data.get_property("paper_config");
      this.paper_config_sub = await app_data.subscribe_property("paper_config", {
        next: (p) => { this.paper_config = p ? p.value || {} : {} }
      })
    })
  },

  beforeDestroy() {
    use_rd_tools(this).pop();
    
    if (this.paper_config_sub) {
      this.paper_config_sub.unsubscribe();
    }
  },
}
</script>

<style lang="scss" scoped>
.font-setting {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
}

.pron-list {
  list-style: none;
}
</style>