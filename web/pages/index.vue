<template>
<div>
  <!-- TODO: nice UI here -->
</div>
</template>

<script>
import "~/assets/print.scss"
import { read_file } from "~/utils/io.js"
import { from_plain_text, get_test_data } from "~/utils/parser"
import { Archive } from "~/utils/db"

// just for trying
let archive = null;


export default {
  name: 'IndexPage',

  data: () => ({
    status: "",
  }),

  mounted() {
    const a = new Archive("test");
    a.open().then(() => {
      console.log("open database")
      archive = a;
    }).catch((e) => {
      console.log(e)
      alert("unable to open database");
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