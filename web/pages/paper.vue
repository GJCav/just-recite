<template>
<v-container fluid>
  <v-row class="justify-center mb-2"><h1>{{dic.meta.name}}</h1></v-row>
  <v-row
    v-for="(entry, rank) in entries" :key="entry.word"
    class="font-setting mb-4"
    dense
  >
    <v-col 
      :lg="2" :cols="3" 
      style="word-break: keep-all; word-wrap: break-word; white-space: pre-wrap;"
    >
      <span>{{ rank + 1}}. {{entry.word}}</span>
    </v-col>
    <!-- pronunciation -->
    <v-col :lg="2" :cols="3">
      <ul class="pron-list pl-0 ">
        <li 
          v-for="pron in entry.prons" :key="pron.value"
          class="pr-1 d-inline-block"
        >
          {{pron.zone}} {{pron.value}}
        </li>
      </ul>
    </v-col>
    <!-- definition -->
    <v-col :lg="8" :cols="6">{{entry.definitions[0].value}}</v-col>
    <!-- examples -->
    <v-col 
      :lg="10" :offset-lg="2" 
      :cols="12" :offset="0"
      class="ml-2 pt-0"
    >
      <ul> <!-- 这里不能用 flex-column 否则会有奇怪的渲染问题-->
        <li 
          v-for="e in entry.definitions[0].examples" :key="e.value"
        >
          <p class="mb-0">{{e.value}}</p>
          <p class="mb-0 text--secondary">{{e.translation}}</p>
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

export default {
  name: "PrintPaper",

  data: () => ({
    // component UI

    // archive level
    archive_name: null,

    // dictionary level
    dic: new Dictionary(),
    dic_sub: null,
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
          list.push(Object.assign({...e}, {
            definitions: [def]
          }))
        }
      }

      return list;
    }
  },

  mounted() {
    this.$store.commit("set_right_drawer_btn", true);

    open_app_data().then(async (app_data) => {
      this.archive_name = await app_data.get_property("last_archive");
      if (this.archive_name) {
        const archive = await open_archive(this.archive_name);
        this.dic = await archive.get_dictionary();
      }
    })
  },

  beforeDestroy() {
    this.$store.commit("set_right_drawer_btn", false);
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