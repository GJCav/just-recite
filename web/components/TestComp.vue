<template>
<div>
  hello world
  <v-btn @click.stop="closeConfig">Close</v-btn>
</div>
</template>

<script>
export default {
  name: "TestComp",

  methods: {
    closeConfig(){
      console.log("clicked")
      this.$emit("toggle-right-drawer", false);
    }
  }
}
</script>