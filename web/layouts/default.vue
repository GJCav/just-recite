<template>
  <v-app>
    <!-- 左侧边栏 -->
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="true"
      fixed
      app
      class="d-print-none"
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 右设置栏 -->
    <!-- 记得在下面注册组件，否则动态组件无法正常工作 -->
    <v-navigation-drawer
      v-model="right_drawer_show"
      clipped temporary fixed app right
      :width="600" bottom mobile-breakpoint="xs"
      class="d-print-none"
    >
      <keep-alive>
        <component 
          :is="right_drawer.comp"
          @toggle-right-drawer="toggleRightDrawer"
        >
        </component>
      </keep-alive>
    </v-navigation-drawer>

    <!-- 顶部工具栏 -->
    <v-app-bar :clipped-left="true" fixed app class="d-print-none">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-show="right_drawer.btn" icon @click.stop="right_drawer_show = !right_drawer_show">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="pa-print-0">
      <!-- 顶部警告框 -->
      <v-alert 
        :value="top_alert.enable"
        :type="top_alert.type" 
        :dismissible="top_alert.dismissible" 
        border="left"
        transition="slide-y-transition"
        @input="top_alert_change"
      >
        <span v-if="!top_alert.component">{{top_alert.message}}</span>
        <component :is="top_alert.component" v-else></component>
      </v-alert>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <!-- 脚注 -->
    <!-- <v-footer absolute app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import "~/assets/print.scss"
import IndexConfig from "~/components/Config.vue";
import PaperConfig from "~/components/paper/Config.vue"

export default {
  name: 'DefaultLayout',

  components: { IndexConfig, PaperConfig },

  data() {
    return {
      drawer: false,
      right_drawer_show: false, // event: toggle-right-drawer
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: "mdi-folder",
          title: "Manage",
          to: "/manage"
        },
        {
          icon: 'mdi-printer',
          title: 'Paper',
          to: "/paper"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
    }
  },

  computed: {
    ...mapState(["title", "top_alert", "right_drawer"]),
  },

  mounted() {
  },

  methods: {
    // event: toggle-right-drawer
    toggleRightDrawer(v) {
      this.right_drawer_show = v;
    },

    top_alert_change(value) {
      if(!value){
        this.$store.commit("set_top_alert", { enable: false })
      }
    },
  }
}
</script>


<style lang="scss">
</style>