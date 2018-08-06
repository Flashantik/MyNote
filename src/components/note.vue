<template>
<div>
  <v-container >
    <quill-editor class="notepad" 
        :content="content"
        @change="onEditorChange($event)">
    </quill-editor>
  </v-container>
</div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default{
  components: {
    quillEditor
  },
  data () {
    return {
      content: ''
    }
  },
  methods: {
    onEditorChange ({ quill, html, text }) {
      this.content = html
    }
  }
}
</script>
<style scoped>

.notepad{
  max-height: 85vh;
}

</style>