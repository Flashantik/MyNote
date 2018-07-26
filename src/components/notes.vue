<template>
<v-container id="contain">
  <div class="top_header" v-if="pushed  ">
    <div class="header"
    @mouseenter="getUp"
    @mouseout="clearMove">
    </div>
  </div>
  <div class="top_footer" v-if="pushed">
      <div class="footer"
      @mouseenter="getDown"
      @mouseout="clearMove">
      </div>
  </div>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
       <v-btn color="primary" slot="activator">Добавить Notes</v-btn>
      <v-card style="overflow:hidden">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Добавление записки</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
          color="green"
          :disabled="!valid"
          :loading="loading"
          @click="createNote"
          >
          Добавить</v-btn>
        </v-toolbar>
        <v-container>
          <h3>Главное</h3>
          <v-subheader style="color:black">Заголовок записки</v-subheader>
            <v-form v-model="valid" ref="form" validation>
             <v-flex xs12 sm10 md8>
               <v-text-field
            label="Название"
            outline
            :rules=" [v => !!v || 'Требуется название']"
            v-model="notesName"
            required
            hint="Введите сюда желаемое название записки"
          ></v-text-field>
             </v-flex>
             <v-flex xs12 sm10 md8>
          <v-subheader style="color:black">Краткое описание записки</v-subheader>
               <v-textarea
            label="Описание"
            hint="Введите сюда краткое описание записки"
            outline
            auto-grow
            rows="2"
            counter="150"
            :rules=" [ v => !!v || 'Требуется ввести описание',
                v => (v && v.length >= 10 && v.length <= 150) || 'Длинна описания должна быть от 10 до 150 символов']"
            v-model="notesDiscription"
            required
          ></v-textarea>
             </v-flex>
          </v-form>
        <v-divider class="divider"></v-divider>
        <v-list three-line subheader>
          <v-list-tile><p>Прочее</p></v-list-tile>
          <v-flex xs12 sm10 md8>
            Выберети с чем будет связана ваша запискаё
              <v-combobox
              v-model="noteRatio"
              :items="noteRatioList"
              label="Связь"
              :rules="[v => !!v || '']"
              chips
              multiple
              tags
              box
            >
              <template slot="selection" slot-scope="data">
                <v-chip
                small
                >
                  <v-avatar class="accent">{{ data.item.slice(0, 1).toUpperCase() }}</v-avatar>
                  {{ data.item }}
                </v-chip>
              </template>
            </v-combobox>
          </v-flex>

              <v-checkbox v-model="noteNotification" label="Требуются ли уведомления?"></v-checkbox>
              <v-list-tile-sub-title>Если будет выставленно этот флажок, тогда вам будет показываться что в данный момент вам может потребоваться</v-list-tile-sub-title>
          <v-list-tile avatar>
              <v-btn color="warning" @click="trigUpload">Добавить фото</v-btn>
              <input 
          ref="fileInput" 
          type="file" 
          style="display:none" 
          accept="image/*"
          @change="onFileChange"
          >
          </v-list-tile>
        </v-list>
         
         <v-container fluid>
        <v-layout row justify-space-between>
         <v-flex xs12 offset-xs0 sm6 offset-sm6>
         <v-card class="mycard">
        <v-card-media 
          class="white--text"
          height="200px"
          :src="image != null ? imageSrc :'http://via.placeholder.com/350x150'"
        >
        <transition name="fade">
        <v-speed-dial
      v-model="fab"
      :top="true"
      :bottom="false"
      :right="true"
      :left="false"
      direction="bottom"
      :open-on-hover="true"
      transition="slide-x-reverse-transition"
      v-if='noteRatio.length != 0'
    >
      <v-btn 
        slot="activator"
        v-model="fab"
        color="blue darken-2"
        dark
        fab
      >
        <v-icon>account_circle</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <v-btn 
        v-for="(value, i) in noteRatio"
        :key="i"
        fab
        dark
        small
      >
        <span style="font-family: Roboto,sans-serif;">{{value.slice(0, 1).toUpperCase()}}</span>
      </v-btn>
    </v-speed-dial>
        </transition>
        </v-card-media>
        <v-card-title>
          <div>
            <h3>{{notesName != '' ? notesName : 'Название вашей записки'}}</h3><br>
            <span>{{notesDiscription != '' ? notesDiscription : 'Описание вашей записки'}}</span>
          </div>
        </v-card-title>
        <v-card-actions>
        <v-layout>
           <v-subheader class="datatime " title="Дата создания записки?">{{dataTimeNow}}</v-subheader>
          <v-spacer>
          </v-spacer>
          <v-subheader class="datatime " title="Дата последнего редактирования">{{dataTimeNow}}</v-subheader>
        </v-layout>
        </v-card-actions>
      </v-card>
         </v-flex>
      </v-layout>
         </v-container>
        </v-container>
      </v-card>
    </v-dialog>

  <v-btn color="error" @click="editMode = !editMode">Изменить состояние</v-btn>
  <v-btn color="error">other</v-btn>
  <br> 
<grid
  :center="true"
  :draggable="editMode"
  :sortable="editMode"
  :items="notes"
  :width="100"
  :cellWidth="289.5"
  :cellHeight="400"
  @dragend="sortNotes"
  @dragstart="pressed"
  >
  <template slot="cell" slot-scope="props">
    <v-card class="note">
      <router-link v-if="!editMode" to="/" class="link"></router-link>
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
      notesName: '',
      notesDiscription: '',
      noteRatioList: [
        'Математика',
        'Физика',
        'Геометрия'
      ],
      noteRatio: [],
      noteNotification: false,
      dataTimeNow: '',
      imageSrc: '',
      image: null,
      notes: [1
      ],
      sortedNotes: [
      ],
      dialog: false,
      down: null,
      up: null,
      editMode: false,
      pushed: false,
      windowHeight: null,
      windowHeightMin: null,
      windowHeightMax: null,
      fab: false,
      valid: false
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    createNote () {
      if (this.$refs.form.validate()) {
        const note = {
          notesName: this.notesName,
          notesDiscription: this.notesDiscription,
          noteRatio: this.noteRatio,
          noteNotification: this.noteNotification,
          noteDate: this.dataTimeNow,
          image: this.image
        }
        this.$store.dispatch('createNote', note)
      }
    },
    pressed () {
      this.pushed = true
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
    getDown (e, value = 10) {
      this.down = setInterval(function () {
        window.scrollTo(0, window.pageYOffset + value)
      }, 20)
    },
    getUp (e, value = 10) {
      this.up = setInterval(() => {
        window.scrollTo(0, window.pageYOffset - value)
      }, 20)
    },
    clearMove () {
      clearInterval(this.up)
      clearInterval(this.down)
    },
    trigUpload () {
      this.$refs.fileInput.click()
    },
    onFileChange (event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = e => {
        this.imageSrc = reader.result
      }
      reader.readAsDataURL(file)
      this.image = file
    },
    date () {
      let date = new Date().toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      this.dataTimeNow = date.substring(0, date.length - 3)
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
  beforeUpdate () {
    this.date()
  },
  created () {
    this.date()
    this.windowHeight = document.documentElement.clientHeight
    this.windowHeightMax = this.windowHeight * 0.9
    this.windowHeightMin = this.windowHeight * 0.1
  },
  mounted () {
    let kyda = false
    let note = document.getElementsByClassName('note')
    for (var i = 0; i < note.length; i++) {
      note[i].addEventListener('touchstart', e => {
        if (this.editMode) {
          e.preventDefault()
          this.pushed = true
        }
      }, false)

      note[i].addEventListener('touchmove', e => {
        if (e.changedTouches[0].clientY >= this.windowHeightMax) {
          if (kyda === false) {
            this.getDown(undefined, 15)
          }
          kyda = true
        } else if (e.changedTouches[0].clientY <= this.windowHeightMin) {
          if (kyda === false) {
            this.getUp(undefined, 15)
          }
          kyda = true
        } else if (kyda === true) {
          kyda = false
          this.clearMove()
        }
      }, false)
    }
    document.addEventListener('touchend', () => {
      this.clearMove()
      this.pushed = false
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
.error--text .v-input__slot{
  border: 2px solid rgba(100,0,0,.54) !important;
}


.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
} 

 .v-speed-dial {
   z-index: 9999;
   transform: translateX(50%) translateY(-50%) scale(.9);
    position: absolute;
    top:0px;
    right: 0px;
  }
  .v-card__media {
    overflow: visible;
  }
 .v-btn--floating {
    position: relative;
  }

.datatime{
cursor: help;
}
.mycard{
  max-width: 280px;
  transform: translateX(-50%)
}

@media (max-width: 599px) {
  .mycard { 
    transform: unset;
    margin: auto;
  }
}

.link{
  position: absolute;
  width: 100%;
  z-index: 999;
  height: 100%;
  background-color: rgba(48, 213, 200, .3);
}
.note{
margin: 3%;
cursor: move;
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
  z-index: 998;
  transition: opacity .4s ease;
}
.footer {
  bottom: 0;
  outline: 3px dashed black;
}
.header{
  top:0;
  outline: 3px dashed white;
}

.header, .footer {
  opacity: 0;
  height: 5vh;
  z-index: 999;

  background-color: rgba(48, 213, 200, .3);
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