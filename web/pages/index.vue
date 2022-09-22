<template>
<div>
  <!-- TODO: nice UI here -->
</div>
</template>

<script>
import "~/assets/print.scss"
import { read_file } from "~/utils/io.js"
import { from_plain_text, get_test_data } from "~/utils/parser"
import { open_app_data } from "~/utils/db"


export default {
  name: 'IndexPage',

  data: () => ({
    status: "",
  }),

  mounted() {
    open_app_data().then((app_data) => {
      app_data.get_property("last_open").then((value) => console.log(value));
    });
  },
  
  methods:{
    async read_data(evt) {
      // TODO: delete this
      this.status = "loading...";
      const files = document.getElementById("file").files;
      if (files.length >= 1) {
        const text = await read_file(files[0])
        this.status = "parsing...";
        const dic = from_plain_text(text);
        dic.meta.name = files[0].name
        // this.$store.commit("setDictionary", dic); // TODO: use archive instead
      }
      this.status = "done.";
    },
  },
}
</script>

<style scoped lang="scss">
</style>