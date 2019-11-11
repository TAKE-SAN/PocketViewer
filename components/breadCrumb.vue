<template>
  <nav class="breadcrumb">
    <ul>
      <li itemscope="itemscope" itemtype="http://data-vocabulary.org/Breadcrumb">
        <a href="javascript:void(0);" itemprop="url" @click="clickRoot()">
          <span itemprop="title">{{ rootPath }}</span>
        </a>
      </li>
      <li v-for="(mPath, index) in mPaths" :key="mPath"
          itemscope="itemscope"
          itemtype="http://data-vocabulary.org/Breadcrumb">
        <a href="javascript:void(0);" itemprop="url" @click="clickPath(index)">
          <span itemprop="title">{{ mPath }}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  data () {
    return {
      mPaths: []
    }
  },

  computed: {
    ...mapGetters({
      rootPath: 'list/rootPath',
      path: 'list/path'
    })
  },

  created () {
    this.mPaths = this.path.split('/').filter(p => p);
  },

  methods: {
    clickRoot () {
      this.$router.push({path: '/'});
    },

    clickPath (index) {
      const query = this.mPaths.slice(0, index + 1).join('/');
      this.$router.push({path: '/', query: {path: query}});
    }
  }
}
</script>

<style scoped>
  .breadcrumb {
    padding: 10px 0 10px;
    margin-left:0;
  }

  .breadcrumb li{
    display:inline;
    list-style: none;
    font-weight: bold;
  }

  .breadcrumb li:after {
    content: '>';
    padding: 0 3px;
    color: #555;
  }

  .breadcrumb li:last-child:after {
    content: '';
  }

  .breadcrumb li a {
    text-decoration: none;
    color: #52b5ee;
  }

  .breadcrumb li a:hover {
    text-decoration: underline;
  }
</style>
