<template>
  <v-list
    two-line
    subheader>
    <bread-crumb/>
    <v-subheader>Directory</v-subheader>
    <div
      v-for="dir in items.dirs"
      :key="dir.key"
    >
      <v-list-tile
        avatar
        @click="clickDir(dir)">
        <v-list-tile-avatar>
          <v-icon :class="[dir.icon.option]">{{ dir.icon.param }}</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{ dir.name }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ dir.timestamp }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </div>
    <v-divider/>
    <v-subheader>File</v-subheader>
    <div
      v-for="file in items.files"
      :key="file.key"
    >
      <v-list-tile
        avatar
        @click="clickFile(file)">
        <v-list-tile-avatar>
          <v-icon :class="[file.icon.option]">{{ file.icon.param }}</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{ file.name }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ file.timestamp }}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action @click.stop="clickInfo(file)">
          <v-btn
            color="light-blue"
            icon
            small>
            <v-icon
              color="white"
              small>
              fas fa-link
            </v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </div>
    <v-divider/>
  </v-list>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import breadCrumb from './breadCrumb.vue';

export default {
  components: {
    breadCrumb
  },

  computed: {
    ...mapGetters({
      rootPath: 'list/rootPath',
      items: 'list/contents'
    })
  },

  // TODO: actionも親コンポーネントから呼んだ方がいいかも
  async created () {
    const path = this.$route.query.path || '';
    this.updatePath(path);
    await this.getList();
  },

  // TODO: イベントもここで直接処理するより親のコンポーネントに伝搬するだけの方がいいかも
  methods: {
    clickDir (dir) {
      this.$router.push({path: '/', query: {path: dir.key}});
    },

    clickFile (file) {
      const newWindow = window.open(`${this.rootPath}/${file.key}`, '_top');
      newWindow.opener = null;
    },

    clickInfo (file) {
      const mRootPath = this.rootPath.replace('https', 'http');
      const newWindow = window.open(`${mRootPath}/${file.key}`, '_top');
      newWindow.opener = null;
    },

    ...mapActions({
      updatePath: 'list/updatePath',
      getList: 'list/getList'
    })
  }
}
</script>
