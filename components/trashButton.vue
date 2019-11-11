<template>
  <v-list-tile-action @click.stop="clickTrash(content)">
    <v-btn
      color="red"
      icon
      small>
      <v-icon
        color="white"
        small>
        far fa-trash-alt
      </v-icon>
    </v-btn>
  </v-list-tile-action>
</template>

<script>
export default {
  props: {
    'content': {
      type: Object,
      required: true
    }
  },

  methods: {
    clickTrash (content) {
      // TODO: ファイルもしくはフォルダを削除する
      console.log(content.key)
    },
  }
}
</script>
