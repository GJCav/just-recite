<template>
<v-container class="w-100">
  <v-row class="justify-center mb-2"><h1>{{dic.meta.name}}</h1></v-row>
  <v-row
    v-for="(entry, rank) in entries" :key="entry.word"
    class="font-setting p-avoid-break"
    dense
  >
    <v-col :lg="2" :cols="3">{{ rank + 1}}. {{entry.word}}</v-col>
    <v-col :lg="2" :cols="3">{{entry.prons[0].value}}</v-col>
    <v-col :lg="8" :cols="6">{{entry.definitions[0].value}}</v-col>
  </v-row>
</v-container>
</template>

<script>
import "~/assets/print.scss"

export default {
  name: "PrintPaper",
  layout: "paper",

  computed: {
    dic() { return this.$store.state.dictionary; },
    entries() { 
      /**
       * TODO: 这里做各种处理，以满足各类设置需求
       */
      // 
      return Object.values(this.$store.state.dictionary.entries); 
    }
  }
}
</script>

<style lang="scss" scoped>
.font-setting {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
}
</style>