<template >
  <v-container id="contain">
    <div class="top_header" v-if="pushed">
      <div class="header" @mouseenter="getUp" @mouseout="clearMove">
      </div>
    </div>
    <div class="top_footer" v-if="pushed">  
      <div class="footer" @mouseenter="getDown" @mouseout="clearMove">
      </div>
    </div>
    <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
      <v-card style="overflow:hidden">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{editMode ? 'Изменение записки': 'Добавление записки'}}
          </v-toolbar-title>
             <v-spacer></v-spacer>
          <v-btn color="error" dark v-if="editMode" @click="dialog2 = true">
            Удалить записку
          </v-btn>
          <v-dialog v-model="dialog2" max-width="500px">
        <v-card>
          <v-card-title style="text-align:center; display:block;">
           <h2 style="color:red">ВНИМАНИЕ</h2>
          </v-card-title>
          <v-card-text>
            <h3 style="text-align:center">Вы собираетесь удалить записку! Данное действие является необратимым, и вы не сможете получить доступ к данным этой записке</h3>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" flat @click.stop="dialog2=false">Отмена</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" flat @click.stop="deleteNote">Удалить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
        </v-toolbar>
        <v-container>
          <v-layout row wrap>
            <transition name="fade" mode="out-in">
            <v-flex xs12 sm10 md8 lg6 offset-sm1 offset-md2 offset-lg3 v-if="!seeCards" style="position:relative" key="1">
              <v-layout>
                <v-flex>
                  <h3>Главное</h3>
                  <v-icon 
                  class="eye" 
                  @click='seeCards= true'
                  v-if="valid"
                  >remove_red_eye</v-icon>
                </v-flex>
              </v-layout>
              <v-subheader style="color:black">Заголовок записки</v-subheader>
              <v-form v-model="valid" ref="form" validation>
                <v-text-field label="Название" outline :rules=" [v => !!v || 'Требуется название']" v-model.trim="notesName" required hint="Введите сюда желаемое название записки"></v-text-field>
                <v-subheader style="color:black">Краткое описание записки</v-subheader>
              </v-form>
                <v-textarea label="Описание" hint="Введите сюда краткое описание записки" outline auto-grow rows="2" counter="150" :rules=" [ v => !!v || 'Требуется ввести описание',
                v => (v && v.length >= 10 && v.length <= 150) || 'Длинна описания должна быть от 10 до 150 символов']" v-model="notesDiscription"></v-textarea>
              <v-divider class="divider"></v-divider>
              <v-list three-line subheader>
                <v-list-tile>
                  <p>Прочее</p>
                </v-list-tile>
                Выберети с чем будет связана ваша записка
                <v-combobox v-model="noteRatio" :items="noteRatioList" :search-input.sync="search" hide-selected hint="Масимум 5 тегов" label="Добавьте несколько тегов"
                  multiple persistent-hint small-chips box>
                  <template slot="no-data">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        Нет результатов поиска "
                        <strong>{{ search }}</strong>". Нажмите
                        <kbd>enter</kbd> чтобы создать новый фильтр
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </template>
                </v-combobox>
                <v-list-tile>
                  <v-checkbox v-model="noteNotification" label="Требуются ли уведомления?"></v-checkbox>
                </v-list-tile>
                <v-list-tile-sub-title>Если будет выставленно этот флажок, тогда вам будет показываться что в данный момент вам может потребоваться</v-list-tile-sub-title>
                <v-layout>
                  <v-btn color="warning" @click="trigUpload">{{imageSrc != '' || image != null ? 'Изменить изображение' : 'Добавить изображение'}}</v-btn>
                  <v-btn color="error" icon outline @click="clearImage" v-if="imageSrc != '' || image != null"><v-icon>delete_outline</v-icon></v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="green" :disabled="!valid || loading" :loading="loading" @click="editMode ? changeNote(): createNote()">
                    {{ editMode ? 'Изменить' :'Добавить'}}</v-btn>
                  <input ref="fileInput" type="file" style="display:none" accept="image/*" @change="onFileChange">
                </v-layout>
              </v-list>
            </v-flex>
            <template v-else>
            <v-layout>
              <v-flex>
                <v-container fluid>
        <v-layout row justify-space-between>
         <v-flex xs12 offset-xs0 sm6 offset-sm6>
         <v-card class="mycard" id='template'>
          <v-icon offset-xs1 @click="seeCards = false" class="back">arrow_back</v-icon>
        <v-card-media 
          class="white--text"
          height="200px"
          :src="image != null? imageSrc :'http://via.placeholder.com/350x150'"
        >
        <transition name="fade">
        <v-speed-dial
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
           <v-subheader class="datatime " title="Дата создания записки?">{{editMode ? dateNote :dataTimeNow}}</v-subheader>
          <v-spacer>
          </v-spacer>
          <v-subheader class="datatime " title="Дата последнего редактирования">{{editMode ? dateNote :dataTimeNow}}</v-subheader>
        </v-layout>
        </v-card-actions>
      </v-card>
         </v-flex>
      </v-layout>
         </v-container>
              </v-flex>
            </v-layout>
        </template>
            </transition>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  <v-layout row wrap>
    <v-btn class="btnOnPage" color="primary" @click="dialog=true" v-show="!editMode">Добавить Notes</v-btn>
    <v-btn class="btnOnPage gearBtn" :color="!editMode ? 'error' : 'black'" :outline="!editMode ? false : true" @click="settingsMode">
      {{editMode == false ? 'Редактировать карточки': ''}}
        <v-icon v-if="editMode == true" class="gear">
          settings
        </v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn class="btnOnPage" color="primary" @click="drawerRight = !drawerRight">Настройки
       <v-icon class="arrow" style="transition: transform .5s ease-out" :style="!drawerRight ? 'transform:rotate(0deg)' : 'transform:rotate(180deg)'">arrow_back</v-icon>
       </v-btn>
       <v-btn absolute right flat color="error" icon v-if="!drawerRight && filterByTags.length !=0" title="Убрать все фильтры" style="margin-top:6px;" @click="filterByTags = []">
         <v-icon>close</v-icon>
       </v-btn>
    <v-navigation-drawer
      v-model="drawerRight"
      disable-resize-watcher
      fixed
      right
      clipped
      app
    >
      <v-list>
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>settings</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Настройки</v-list-tile-title>
      </v-list-tile>
      <v-list-group
        prepend-icon="tag"
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>Фильтры</v-list-tile-title>
        </v-list-tile>
        <v-list-group
          no-action
          sub-group
        >
          <v-list-tile slot="activator">
            <v-list-tile-title>По тегам</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            v-for="(val, i) in noteRatioList"
            :key="i"
          >
            <v-list-tile-action>
              <v-switch
              v-model="filterByTags"
              :label="val"
              :value="val"
              hide-details
            ></v-switch>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
      </v-list-group>
      <v-list-group
        prepend-icon="book"
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>Расписание</v-list-tile-title>
        </v-list-tile>
          <v-btn block color="green accent-4" @click="modalTime = true">
            Добавить расписание
          </v-btn>
      </v-list-group>
    </v-list>
    </v-navigation-drawer>
      </v-layout>
    <br>
    <template v-if="!loading">
      {{windowWidth}}
    <grid
    :center="windowWidth"
    :draggable="editMode"
    :sortable="editMode"
    :items="ska"
    :width="100"
    :cellWidth="phoneOrient ? 400 :289.5"
    :cellHeight="phoneOrient ? 289.5 : 400"
    @dragend="sortNotes"
    @dragstart="pressed"
    style="margin-top:25px"
    v-if="notesVuex"
    >
      <template slot="cell" slot-scope="props" >

      <v-card v-if="!phoneOrient" class="mycard note" :class="pushed ? 'grabbable' : ''" :style="pushed ? 'cursor:move; cursor:grabbing' : 'cursor:grab' ">
           <router-link v-if="!editMode" :to="{path: `${props.item.notesName}`, params: {id: id}}" class="link"></router-link>
        <v-card-media 
          class="white--text"
          height="200px"
          :src="props.item.imageSrc ? props.item.imageSrc :'http://via.placeholder.com/350x150'"
        >
        <transition name="fade">
        <v-speed-dial
      :top="true"
      :bottom="false"
      :right="true"
      :left="false"
      direction="bottom"
      :open-on-hover="true"
      transition="slide-x-reverse-transition"
      v-if='props.item.noteRatio.length != 0 && editMode == false && props.item.noteRatio'
      class="speedDialWithPC"
    >
      <v-btn 
        slot="activator"
        color="black darken-2"
        outline
        dark
        fab
      >
        <v-icon color="white">tag</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <v-btn
        v-for="(value, i) in props.item.noteRatio"
        :key="i"
        fab
        dark
        small
        :title="value"
      >
        <span style="font-family: Roboto,sans-serif;">{{value.slice(0, 1).toUpperCase()}}</span>
      </v-btn>
    </v-speed-dial>
    <v-btn fab dark 
    class="editBtn"
    color="info"
    v-else-if="editMode"
    @click.prevent.stop="editCard(props)" 
    >
      <v-icon dark>edit</v-icon>
    </v-btn>
        </transition>
        </v-card-media>
        <v-card-title>
          <div>
            <h3>{{props.item.notesName}}</h3><br>
            <span>{{props.item.notesDiscription != '' ? props.item.notesDiscription : 'Описание вашей записки'}}</span>
          </div>
        </v-card-title>
        <v-card-actions>
        <v-layout>
           <v-subheader class="datatime " title="Дата создания записки" style="text-align:left">{{props.item.noteDate}}</v-subheader>
          <v-spacer>
          </v-spacer>
<!-- /*
 
                               #### ##    ## ######## 
                                ##  ###   ## ##       
                                ##  ####  ## ##       
                                ##  ## ## ## ######   
                                ##  ##  #### ##       
                                ##  ##   ### ##       
                               #### ##    ## ##       
                              Требуется изменить тут дату последнего редактирования
 
*/ -->
          <v-subheader class="datatime " title="Дата последнего редактирования" style="text-align:right">{{dataTimeNow}}</v-subheader>    
        </v-layout>
        </v-card-actions>
      </v-card>

       <v-card color="cyan darken-2" class="white--text note" v-if="phoneOrient" :class="pushed ? 'grabbable' : ''" :style="pushed ? 'cursor:move; cursor:grabbing' : 'cursor:grab' ">
          <router-link v-if="!editMode" :to="{path: `${props.item.notesName}`, params: {id: id}}" class="link"></router-link>
          <v-layout>
            <v-flex xs5>
              <v-card-media
                :src="props.item.imageSrc ? props.item.imageSrc :'http://via.placeholder.com/350x150'"
                height="170px"
                contain
              >
              <transition name="fade">
    <v-btn fab dark 
    class="editBtn"
    color="info"
    v-if="editMode"
    @click.prevent.stop="editCard(props)" 
    >
      <v-icon dark>edit</v-icon>
    </v-btn>
        </transition>
              </v-card-media>
            </v-flex>
            <v-flex xs7>
              <v-card-title primary-title>
                <div>
                  <div class="headline">{{props.item.notesName}}</div>
                  <div>{{props.item.notesDiscription != '' ? props.item.notesDiscription : 'Описание вашей записки'}}</div>
                </div>
              </v-card-title>
            </v-flex>
          </v-layout>
          <v-divider light></v-divider>
          <v-card-actions class="pa-3">
            <v-subheader class="datatime " title="Дата создания записки" style="text-align:left">{{props.item.noteDate}}</v-subheader>
            <v-spacer></v-spacer>
            <v-subheader class="datatime " title="Дата последнего редактирования" style="text-align:right">{{dataTimeNow}}</v-subheader>   
          </v-card-actions>
        </v-card>

      </template>
    </grid>
    </template>
    <app-bs></app-bs>
    <app-time :modal="modalTime" @close="closeModal"></app-time>
  </v-container>
</template>

/*
 
  ######   ######  ########  #### ########  ######## 
 ##    ## ##    ## ##     ##  ##  ##     ##    ##    
 ##       ##       ##     ##  ##  ##     ##    ##    
  ######  ##       ########   ##  ########     ##    
       ## ##       ##   ##    ##  ##           ##    
 ##    ## ##    ## ##    ##   ##  ##           ##    
  ######   ######  ##     ## #### ##           ##    
 
*/


<script>
// Лучше кароч сделать один лист и его менять как мне кажется чтобы небыло бага при изменении фильтрации карточек
  import appTime from './time.vue'
  export default {
    components: {appTime},
    data () {
      return {
        notesName: '',
        notesDiscription: '',
        noteRatio: [],
        noteNotification: false,
        dateNote: '',
        id: '',
        indexNote: '',
        dataTimeNow: '',
        imageSrc: '',
        delImage: '',
        image: null,
        notes: [],
        sortedNotes: [],
        dialog: false,
        dialogName: 'Добавление записки',
        down: null,
        up: null,
        editMode: false,
        pushed: false,
        windowHeight: null,
        windowHeightMin: null,
        windowHeightMax: null,
        windowWidth: null,
        phoneOrient: false,
        valid: false,
        search: null,
        seeCards: false,
        dialog2: false,
        modalTime: false,
        drawerRight: false,
        filterByTags: [],
        newListItems: [],
        ska: []
      }
    },
    computed: {
      noteRatioList () {
        if (this.notesVuex) {
          let mas = []
          this.notesVuex.forEach(val => {
            val.noteRatio.forEach(value => {
              if (mas.some(item => {
                return item === value
              }) === false) {
                mas.push(value)
              }
            })
          })
          return mas
        }
      },
      loading () {
        return this.$store.getters.loading
      },
      user () {
        return this.$store.getters.user
      },
      notesVuex () {
        this.ska = this.$store.getters.notes
        return this.$store.getters.notes
      }
    },
    watch: {
      filterByTags: function (value) {
        value.length >= 1 ? this.ska = this.notesVuex.filter((v, key) => v.noteRatio.some(item => value.some(vs => vs === item))) : this.ska = this.$store.getters.notes
      },
      notesVuex: function (value) { // Мне сказали что это пиздец, божи абысните как по другому
        setTimeout(() => {
          if ((window.innerWidth / window.innerHeight) > 1.5 && window.innerWidth < 1000) {
            this.phoneOrient = true
          } else {
            this.phoneOrient = false
          }
          let x = document.getElementById('contain').clientWidth
          if ((x / 289.5).toFixed(2) - this.ska.length > 1) {
            this.windowWidth = false
          } else {
            this.windowWidth = true
          }
          let kyda = false
          var note = Array.from(document.getElementsByClassName('note'))
          console.log(note)
          for (var i = 0; i < note.length; i++) {
            note[i].addEventListener('touchstart', e => {
              if (this.editMode) {
                this.pushed = true
              }
            }, false)
            note[i].addEventListener('touchmove', e => {
              e.preventDefault()
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
        }, 0)
      }
    },
    methods: {
      editCard (val) {
        this.notesName = val.item.notesName
        this.notesDiscription = val.item.notesDiscription
        this.noteRatio = val.item.noteRatio
        this.noteNotification = val.item.noteNotification
        this.dateNote = val.item.noteDate
        this.imageSrc = val.item.imageSrc
        this.image = val.item.image
        this.id = val.item.id
        this.index = val.index
        this.dialog = true
      },
      settingsMode () {
        if (this.editMode === false) {
          this.$store.dispatch('setMessageToClient', {message: 'Внимание вы перешли в режим разработчика', type: 'info'})
        } else {
          this.$store.dispatch('setMessageToClient', {message: 'Вы вышли из режима разработчика', type: 'success'})
          this.notesName = ''
          this.notesDiscription = ''
          this.noteRatio = []
          this.noteNotification = false
          this.imageSrc = ''
          this.image = null
        }
        this.editMode = !this.editMode
      },
      clearImage () {
        this.delImage = this.imageSrc
        this.image = null
        this.imageSrc = ''
      },
      createNote () {
        if (this.$refs.form.validate()) {
          const note = {
            notesName: this.notesName,
            notesDiscription: this.notesDiscription,
            noteRatio: this.noteRatio,
            noteNotification: this.noteNotification,
            image: this.image,
            noteDate: this.dataTimeNow,
            uid: this.user.uid
          }
          this.$store.dispatch('createNote', note).then(() => {
            this.dialog = false
            if (this.notesVuex.length < 1) {
              this.$store.dispatch('setMessageToClient', {message: 'Вами создана ваша первая записка </br> Congratz', type: 'green'})
            } else {
              this.$store.dispatch('setMessageToClient', {message: 'Успешно создана записка', type: 'info'})
            }
            this.clear()
          })
        }
      },
      changeNote () {
        if (this.$refs.form.validate()) {
          const note = {
            notesName: this.notesName,
            notesDiscription: this.notesDiscription,
            noteRatio: this.noteRatio,
            noteNotification: this.noteNotification,
            image: this.image,
            noteDate: this.dateNote,
            uid: this.user.uid,
            id: this.id,
            index: this.index,
            imageSrc: this.delImage
          }
          this.$store.dispatch('changeNote', note).then(() => {
            this.dialog = false
            this.$store.dispatch('setMessageToClient', {message: 'Записка успешно изменена', type: 'green'})
            this.clear()
          })
        }
      },
      deleteNote () {
        this.$store.dispatch('deleteNote', {index: this.index, id: this.id, imageSrc: this.imageSrc})
        this.dialog = false
        this.$store.dispatch('setMessageToClient', {message: 'Записка удалена', type: 'error'})
        this.clear()
      },
      clear () {
        this.notesName = ''
        this.notesDiscription = ''
        this.noteRatio = []
        this.noteNotification = false
        this.imageSrc = ''
        this.image = null
        this.delImage = ''
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
        // console.log('Отсортированный массив: ' + newNotes)
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
      },
      getWindowHeight () {
        if (this.notesVuex) {
          if (document.getElementById('contain')) {
            let x = document.getElementById('contain').clientWidth
            if ((x / 289.5).toFixed(2) - this.ska.length > 1) {
              this.windowWidth = false
            } else {
              this.windowWidth = true
            }
            this.windowHeight = document.documentElement.clientHeight
            this.windowHeightMax = this.windowHeight * 0.9
            this.windowHeightMin = this.windowHeight * 0.1
          }
        }
        if ((window.innerWidth / window.innerHeight) > 1.5 && window.innerWidth < 1000) {
          this.phoneOrient = true
        } else {
          this.phoneOrient = false
        }
      },
      closeModal () {
        this.modalTime = false
      }
    },
    beforeMount () {
      this.$nextTick(() => {
        window.addEventListener('resize', this.getWindowHeight)
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
    beforeDestroy () {
      window.removeEventListener('resize', this.getWindowHeight)
    }
  }
</script>

/*
 
  ######  ######## ##    ## ##       ######## 
 ##    ##    ##     ##  ##  ##       ##       
 ##          ##      ####   ##       ##       
  ######     ##       ##    ##       ######   
       ##    ##       ##    ##       ##       
 ##    ##    ##       ##    ##       ##       
  ######     ##       ##    ######## ######## 
 
*/

<style scoped>

#template{
  transform: translateX(-50%);
}
.back{
  position: absolute;
  transform: translate(-100%);
  font-size:3em; 
  color:black;
}
  .eye {
    position: absolute;
    right: 0;
    color: black;
    font-size: 3em;
    perspective: 1000px;
    animation: blink 2s ease infinite alternate;
    animation-fill-mode:backwards;
    cursor: pointer;
    transition: all .4s ease;
  }

  @keyframes blink {
    0% {
      transform: rotateX(0deg)
    }
    70% {
      transform: rotateX(0deg)
    }
    95% {
      transform: rotateX(90deg)
    }
    100% {
    }
  }

 @keyframes rounded {
  from{}
  to{
    transform:rotate(180deg)
  }
}

  .gear{
    animation: rounded 1.2s linear infinite;
  }
  .gearBtn:hover .gear{
    animation-play-state:paused;
  }

.eye:hover{
  animation-direction: reverse;
  animation-duration: 1.5s;
}

  .error--text .v-input__slot {
    border: 2px solid rgba(100, 0, 0, .54) !important;
  }


  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .2s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .speedDialWithPC, .editBtn {
    z-index: 9999;
    transform: translateX(15%) translateY(-12.5%) scale(.9);
    position: absolute;
    top: 0px;
    right: 0px;
  }
.editBtn{
  transform: translateX(-30%) translateY(-55%) scale(.9);
    left: 0px;
}
  .v-card__media {
    overflow: visible;
  }

  .v-btn--floating {
    position: relative;
  }

  .datatime {
    cursor: help;
  }

  .mycard {
    max-width: 280px;
  }

  @media (max-width: 599px) {
    .mycard {
      transform: unset;
      margin: auto;
    }
  }
.container{
    transition: all .4s ease;
}
  .link {
    position: absolute;
    width: 100%;
    z-index: 999;
    height: 100%;
  }

  .note {
    margin: 3%;
    cursor: move;
  }

  .contain {
    background-color: transparent;

    position: relative;
    width: 90%;
    margin: auto;
  }

  .header,
  .footer,
  .top_header,
  .top_footer {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 998;
    transition: opacity .4s ease;
  }

  .footer {
    bottom: 0;
    outline: 3px dashed black;
  }

  .header {
    top: 0;
    outline: 3px dashed white;
  }

  .header,
  .footer {
    opacity: 0;
    height: 5vh;
    z-index: 999;

    background-color: rgba(48, 213, 200, .3);
  }

  .top_header {
    top: 0;
  }

  .top_footer {
    bottom: 0;
  }

  .top_header,
  .top_footer {
    height: 10vh;
  }

  .top_header:hover .header {
    opacity: 1;
  }

  .top_footer:hover .footer {
    opacity: 1;
  }
  .grabbing{
  cursor: -webkit-grabbing;
  cursor: -moz-grabbing;
  cursor: -o-grabbing;
  cursor: -ms-grabbing;
  cursor: grabbing;
}
</style>
