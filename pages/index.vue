<template>
  <div>
    <list/>
    <upload-button/>
  </div>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';
import '@mdi/font/css/materialdesignicons.css';
import list from '../components/list.vue';
import uploadButton from '../components/uploadButton.vue';

export default {
  components: {
    list,
    uploadButton
  }
}
</script>
