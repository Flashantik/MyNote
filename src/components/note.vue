<template>
<div @mousewheel.ctrl.prevent="zoomed" class="main">
      <v-slider
      class="slider zoomSlider"
      step="0.1"
      max= "9"
      thumb-label
      ticks
      prepend-icon="zoom_out"
      append-icon="zoom_in"
      color="black"
      v-model="sliderValue"
      @change="zoomIn"
      ></v-slider>
  <v-container class="maxHeight">
    <quill-editor
      class="editor-example snow"
      ref="myTextEditor"
      :content="content"
      :options="editorOption"
      @change="onEditorChange($event)"
      >
    </quill-editor>
  </v-container>
</div>
</template>

<script>
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor'

export default{
  components: {
    quillEditor
  },
  data () {
    return {
      content: '',
      beforeContent: '',
      editorOption: {
        theme: 'snow',
        placeholder: 'Начните писать тут...'
      },
      html: null,
      ql: null,
      qlZoomValue: 1,
      sliderValue: 1,
      saving: false,
      counter: 0
      // horizontal: 100
      // vertical: 100
    }
  },
  computed: {
    noteById () {
      return this.$store.getters.noteById(this.$router.currentRoute.params['id'])
    }
  },
  watch: {
    noteById: function () {
      this.$store.dispatch('fetchText', this.noteById.id).then(() => {
        this.content = this.$store.getters.noteText
        this.beforeContent = this.content.length
      })
    }
  },
  methods: {
    ctrl () {
      this.ctrl = !this.ctrl
    },
    onEditorChange ({ quill, html, text }) {
      this.content = html
      this.counter++
      if (this.counter > 200 || this.content.length - this.beforeContent > 200 || this.content.length - this.beforeContent < -200) {
        this.counter = 0
        this.beforeContent = this.content.length
        this.$store.dispatch('pushText', {text: this.content, id: this.noteById.id})
      }
    },
    zoomed (e, target) {
      let perem = e.deltaY * -1
      let movedTo = +(perem / 7000).toFixed(2)
      let i = 0
      this.qlZoomValue < 0.16 ? this.qlZoomValue = 0.16 : this.qlZoomValue = this.qlZoomValue
      this.qlZoomValue > 9 ? this.qlZoomValue = 9 : this.qlZoomValue = this.qlZoomValue
      if (this.qlZoomValue >= 0.16 && this.qlZoomValue <= 9) {
        let interval = setInterval(() => {
          if (i === 10 || this.qlZoomValue <= 0.16 || this.qlZoomValue >= 9) {
        // this.ql.transform = `scale(${this.qlZoomValue})`
            this.qlZoomValue < 0.16 ? this.qlZoomValue = 0.16 : this.qlZoomValue = this.qlZoomValue
            this.qlZoomValue > 9 ? this.qlZoomValue = 9 : this.qlZoomValue = this.qlZoomValue
            this.ql.zoom = `${this.qlZoomValue}`
            clearInterval(interval)
          }
          // { if (e.deltaY > 0) {
            //   this.horizontal += 2
          //   // this.vertical -= 2
          // } else {
            //   this.horizontal -= 2
          //   // this.vertical += 2
          // }}
          i++
          // this.ql.transform = `scale(${this.qlZoomValue}`                       // Версия с transition... Много проблем однако при большом количестве символов работает значительно лучше чем Zoom
          this.ql.zoom = `${this.qlZoomValue}`
          this.sliderValue = this.ql.zoom
          // this.html.width = `${this.horizontal}`
          // this.ql.height = `${this.vertical}%`
          // this.ql.margin = `${this.vertical}% ${this.horizontal}%`
          this.qlZoomValue += movedTo
        }, 20)
      }
    },
    zoomIn () {
      this.ql.zoom = this.sliderValue
      this.qlZoomValue = this.sliderValue
    }
  },
  created () {
    if (this.noteById) {
      this.$store.dispatch('fetchText', this.noteById.id).then(() => {
        this.content = this.$store.getters.noteText
        this.beforeContent = this.content.length
      })
    }
  },
  mounted () {
    this.ql = document.getElementsByClassName('ql-editor')[0].style
    this.html = document.getElementsByTagName('html')[0].style
    // this.ql.transform = 'scale(1)
    // this.$store.dispatch('fetchText')
  },
  beforeDestroy () {
    if (this.content.length !== this.beforeContent) {
      this.$store.dispatch('pushText', {text: this.content, id: this.noteById.id})
    }
  }
}
</script>

<style scoped>
.container {
  padding-bottom: 0;
}
.main{
  height:100%;
  overflow: hidden;
  }

/* .maxHeight{
height: calc(100vh - 100px);
} */

.zoomSlider{
position: fixed;
bottom: -15px;
right: 15px;
z-index: 999;
}

</style>