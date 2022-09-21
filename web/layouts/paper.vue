<template>
<v-app>
  <!-- 这种 header、footer 会导致页面元素被遮挡，即是留足间隔，也会在分页时出现遮挡 -->
  <!-- <header 
    class="px-4 pt-1"
    style="left: 0; right: 0; top: 0; position: fixed; z-index: 1000; background-color: white;"
  >
    <div class="d-flex justify-space-between">
      <span>{{header.left}}</span>
      <span>{{header.center}}</span>
      <span>{{header.right}}</span>
    </div>
    <v-divider v-if="header_divider"></v-divider>
  </header> -->

  <v-main>
    <v-container>
      <Nuxt />
    </v-container>
  </v-main>

  <!-- <v-footer app class="d-block">
    <v-divider v-if="footer_divider"></v-divider>
    <div class="d-flex justify-space-between">
      <span>{{footer.left}}</span>
      <span>{{footer.center}}</span>
      <span>{{footer.right}}</span>
    </div>
  </v-footer> -->
</v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "PaperLayout",

  computed: {
    ...mapState("paper", [
      "title",
      "header",
      "footer",
      "footer",
      "header_divider",
      "footer_divider"
    ])
  }
}
</script>