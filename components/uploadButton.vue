<template>
  <div v-if="$ua.isFromPc()">
    <div class="btn-flat-border">
      <div>アップロード</div>
      <div class="btn-upload-wrapper">
        <v-btn @click="pickFile">ファイル</v-btn>
        <input
          ref="file"
          type="file"
          style="display: none"
          multiple
          @change="onFilesPicked">
        <v-btn @click="pickDir">ディレクトリ</v-btn>
        <input
          ref="dir"
          type="file"
          style="display: none"
          webkitdirectory
          @change="onFilesPicked">
      </div>
    </div>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="headline">確認画面</v-card-title>
        <v-card-text>
          {{ rootPath }}/{{ path }}にアップロードしますか？
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="red darken-1"
            flat="flat"
            @click="cancel"
          >
            キャンセル
          </v-btn>
          <v-btn
            color="green darken-1"
            flat="flat"
            @click="upload"
          >
            アップロード
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import s3Client, {bucket} from '../plugins/s3Client';

export default {
  data () {
    return {
      dialog: false,
      targetFiles: null
    }
  },

  computed: {
    ...mapGetters({
      path: 'list/path',
      rootPath: 'list/rootPath'
    })
  },

  methods: {
    pickFile () {
      this.$refs.file.click();
    },

    pickDir () {
      this.$refs.dir.click();
    },

    onFilesPicked (e) {
      this.targetFiles = Array.from(e.target.files);
      this.dialog = true;
    },

    async upload () {
      try {
        const putObjPromises = this.targetFiles.map(file => {
          const fileKey = file.webkitRelativePath || file.name;
          const param = {
            Bucket: bucket,
            Key: `${this.path}${fileKey}`,
            ACL: 'public-read',
            ContentType: file.type,
            Body: file
          };

          return s3Client.putObject(param).promise();
        });

        await Promise.all(putObjPromises);
        this.getList();
      } catch (err) {
        console.log('S3 putObject error:', err);
      }
      this.clearParams()
    },

    cancel () {
      this.clearParams()
    },

    clearParams () {
      this.dialog = false;
      this.targetFiles = null;
      this.$refs.file.value = '';
      this.$refs.dir.value = '';
    },

    ...mapActions({
      getList: 'list/getList'
    })
  }
}
</script>

<style scoped>
  .btn-flat-border {
    display: block;
    width: 300px;
    padding: 0.3em 1em;
    color: #67c5ff;
    border: solid 2px #67c5ff;
    border-radius: 3px;
    margin:0 16px 0;
  }

  .btn-upload-wrapper {
    display: inline;
    margin:0 16px 0;
  }
</style>
