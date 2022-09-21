<template>
<div>
  <input id="file" type="file" @change="read_data" />
  <p>{{status}}</p>
</div>
</template>

<script>
import "~/assets/print.scss"
import { read_file } from "~/utils/io.js"
import { from_plain_text } from "~/utils/parser"

export default {
  name: 'IndexPage',

  data: () => ({
    status: "",
  }),
  
  methods:{
    async read_data(evt) {
      this.status = "loading...";
      const files = document.getElementById("file").files;
      if (files.length >= 1) {
        const text = await read_file(files[0])
        this.status = "parsing...";
        const dic = from_plain_text(text);
        dic.meta.name = files[0].name
        this.$store.commit("setDictionary", dic);
      }
      this.status = "done.";
    }
  }
}
</script>

<style scoped lang="scss">
</style>