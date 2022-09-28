<template>
<v-container>
  <!-- TODO: add some animation here -->

  <!-- title, logo -->
  <v-row class="justify-center mt-10">
    <span class="text-h3 text-sm-h2">Just Recite</span>
  </v-row>
  <v-row class="justify-center mt-2 mt-sm-6">
    <span class="text-subtitle-1 text--secondary text-h6 text-sm-h5 text-center">
      Open-source, simple, <br class="d-sm-none"/> yet powerful volcabulary learning tools !
    </span>
  </v-row>

  <!-- archives -->
  <v-row class="justify-center mt-12 mt-sm-16">
    <span class="text-h5 text-sm-h4">Archives</span>
  </v-row>
  <v-row>
    archive list here
  </v-row>
</v-container>
</template>

<script>
import "~/assets/print.scss"

export default {
  name: 'IndexPage',

  data: () => ({
    status: "",
  }),

  mounted() {
    this.$store.commit("set_title", "Welcome")
  },

  beforeDestroy(){
    this.$store.commit("set_title", "Just Recite");
  },
  
  methods:{
  }
}
</script>

<style scoped lang="scss">
</style>