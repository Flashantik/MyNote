<template>
<v-container id="contain">
  <div class="top_header" v-if="pushed">
    <div class="header"
    @mouseenter="getUp"
    @mouseout="clearMove">
    <span style="transform:translateX(-15px);font-size:30px; display:block; margin-left:50%; color:white">🡹</span>
    </div>
  </div>
  <div class="top_footer" v-if="pushed">
      <div class="footer"
      @mouseenter="getDown"
      @mouseout="clearMove">
      <span style="transform:translateX(-15px);font-size:30px; display:block; margin-left:50%">🡻</span>
      </div>
  </div>
  <v-btn color="info" @click.stop="addNotes">Добавить Notes</v-btn>
<grid id="thek"
  :center="false"
  :draggable="true"
  :sortable="true"
  :items="items"
  :width="100"
  :cellWidth="289.5"
  :cellHeight="400"
  @dragend="sortNotes"
  @dragstart="pressed"
  >
  <template slot="cell" slot-scope="props">
    <v-card class="note">
        <v-card-media
          class="white--text"
          height="200px"
          src="http://via.placeholder.com/350x150"
        >
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12 align-end flexbox>
                <span class="headline">{{props.item}}</span>
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


/*
 
  ######   ######  ########  #### ########  ########     ######   #######  ########  ######## 
 ##    ## ##    ## ##     ##  ##  ##     ##    ##       ##    ## ##     ## ##     ## ##       
 ##       ##       ##     ##  ##  ##     ##    ##       ##       ##     ## ##     ## ##       
  ######  ##       ########   ##  ########     ##       ##       ##     ## ##     ## ######   
       ## ##       ##   ##    ##  ##           ##       ##       ##     ## ##     ## ##       
 ##    ## ##    ## ##    ##   ##  ##           ##       ##    ## ##     ## ##     ## ##       
  ######   ######  ##     ## #### ##           ##        ######   #######  ########  ######## 
 
*/

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
      pushed: false,
      windowHeight: null,
      windowHeightMin: null,
      windowHeightMax: null
    }
  },
  methods: {
    pressed () {
      this.pushed = true
    },
    addNotes () {
      this.items.unshift('lol')
    },
    sortNotes (e) {
      let newNotes = []
      for (var i = 0; i < e.items.length; i++) {
        newNotes.push(e.items[i].item)
      }
      this.sortedNotes = newNotes
      console.log('Отсортированный массив: ' + newNotes)
      this.pushed = false
      this.clearMove()
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
    clearMove () {
      clearInterval(this.up)
      clearInterval(this.down)
    }
  },
  beforeMount () {
    this.$nextTick(() => {
      window.addEventListener('resize', getWindowHeight => {
        this.windowHeight = document.documentElement.clientHeight
        this.windowHeightMax = this.windowHeight * 0.9
        this.windowHeightMin = this.windowHeight * 0.1
      })
    })
  },
  created () {
    for (var i = 0; i < 50; i++) {
      this.items.push(i)
    }
    this.windowHeight = document.documentElement.clientHeight
    this.windowHeightMax = this.windowHeight * 0.9
    this.windowHeightMin = this.windowHeight * 0.1
  },
  mounted () {
    let kyda = false
    let note = document.getElementById('thek')
    note.addEventListener('touchstart', e => {
      e.preventDefault()
      this.pushed = true
    }, false)
    note.addEventListener('touchmove', e => {
      if (e.changedTouches[0].clientY >= this.windowHeightMax) {
        if (kyda === false) {
          this.getDown()
        }
        kyda = true
      } else if (e.changedTouches[0].clientY <= this.windowHeightMin) {
        if (kyda === false) {
          this.getUp()
        }
        kyda = true
      } else if (kyda === true) {
        kyda = false
        this.clearMove()
      }
    }, false)
    document.addEventListener('touchend', () => {
      this.clearMove()
    }, false)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowHeight)
  }
}
</script>


/*
 
  ######   ######   ######      ######   #######  ########  ######## 
 ##    ## ##    ## ##    ##    ##    ## ##     ## ##     ## ##       
 ##       ##       ##          ##       ##     ## ##     ## ##       
 ##        ######   ######     ##       ##     ## ##     ## ######   
 ##             ##       ##    ##       ##     ## ##     ## ##       
 ##    ## ##    ## ##    ##    ##    ## ##     ## ##     ## ##       
  ######   ######   ######      ######   #######  ########  ######## 
 
*/
<style scoped>

.note{
margin: 3%;
}

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
  background-color: rgba(100,100,100,.3);
  top:0;
}
.top_footer{
    background-color: rgba(100,100,100,.3);
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