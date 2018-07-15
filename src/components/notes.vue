<template>
<v-container id="contain">
  <div class="top_header" v-show="pushed">
    <div class="header"
    @mouseenter="getUp"
    @mouseout="clearUp">
    <span style="transform:translateX(-15px);font-size:30px; display:block; margin-left:50%; color:white">🡹</span>
    </div>
  </div>
  <div class="top_footer" v-show="pushed">
      <div class="footer"
      @mouseenter="getDown"
      @mouseout="clearDown">
      <span style="transform:translateX(-15px);font-size:30px; display:block; margin-left:50%">🡻</span>
      </div>
  </div>
<grid
  :onWindowResize="resized" 
  :center="false"
  :draggable="true"
  :sortable="true"
  :items="items"
  :width="80"
  :cellWidth="290"
  :cellHeight="400"
  @dragend="sortNotes"
  @dragstart="pushed=true"
  >
  <template slot="cell" slot-scope="props" >
    <v-card>
        <v-card-media
          class="white--text"
          height="200px"
          src="http://via.placeholder.com/350x150"
        >
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12 align-end flexbox>
                <span class="headline">Top 10 Australian beaches</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-media>
        <v-card-title>
          <div>
            <span class="grey--text">Number 10</span><br>
            <span>Whitehaven Beach</span><br>
            <span>Whitsunday Island, Whitsunday Islands</span>
          </div>
        </v-card-title>
        <v-card-actions>
          
        </v-card-actions>
      </v-card>
</template>
</grid>

</v-container>
</template>

<script>
export default{
  data () {
    return {
      items: [
      ],
      sortedNotes: [
      ],
      down: null,
      up: null,
      pushed: false
    }
  },
  methods: {
    resized (e) {
      this.windowHeight = document.documentElement.clientHeight
    },
    sortNotes (e) {
      let newNotes = []
      for (var i = 0; i < e.items.length; i++) {
        newNotes.push(e.items[i].item)
      }
      this.sortedNotes = newNotes
      console.log('Отсортированный массив: ' + newNotes)
      this.pushed = false
      this.clearDown()
      this.clearUp()
    },
    getDown () {
      this.down = setInterval(function () {
        window.scrollTo(0, window.pageYOffset + 5)
      }, 20)
    },
    getUp () {
      this.up = setInterval(() => {
        window.scrollTo(0, window.pageYOffset - 5)
      }, 20)
    },
    clearUp () {
      clearInterval(this.up)
    },
    clearDown () {
      clearInterval(this.down)
    }
  },
  created () {
    for (var i = 0; i < 25; i++) {
      this.items.push(i)
    }
  }
}
</script>
<style scoped>
.contain{
  position: relative;
  width: 90%;
  margin: auto;
}
.header, .footer, .top_header, .top_footer {
  position: fixed;
  left:0;
  right:0;
  z-index: 100;
  transition: opacity .4s ease;
}
.footer {
  opacity: 0;
  bottom: 0;
  height: 5vh;
  background-color: rgba(48, 213, 200, .3);
  outline: 3px dashed black;
}
.header{
  opacity: 0;
  top:0;
  height: 5vh;
  background-color: rgba(48, 213, 200, .3);
  outline: 3px dashed white;
}
.top_header{
  top:0;
}
.top_footer{
  bottom:0;
}
.top_header, .top_footer {
  height: 10vh;
}
.top_header:hover .header{
  opacity: 1;
}
.top_footer:hover .footer{
  opacity: 1;
}

</style>