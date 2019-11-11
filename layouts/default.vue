<template>
  <v-app>
    <tool-bar/>
    <nuxt :nuxt-child-key="$route.fullPath"/>
  </v-app>
</template>

<script>
import toolBar from '../components/toolbar.vue'

export default {
  components: {
    toolBar
  }
}
</script>
