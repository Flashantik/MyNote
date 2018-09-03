<template>
  <v-app :dark="time > 21 || time < 8" :light="time > 8 || time < 21">
  <v-navigation-drawer
      v-model="drawer"
      :mini-variant="mini"
      temporary
      dark
      absolute
      >
      <v-list class="pa-1">
        <v-list-tile v-if="mini" @click.stop="mini = !mini">
          <v-list-tile-action>
            <v-icon>chevron_right</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile avatar tag="div">
          <v-list-tile-avatar>
            <img :src="user && user.avatarSrc ? user.avatarSrc :'http://s1.iconbird.com/ico/0612/GooglePlusInterfaceIcons/w128h1281338911651user.png'">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{user && user.email ? user.email :'Неизвестный'}}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon @click.stop="mini = !mini">
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider light></v-divider>
<!--         
        <v-btn flat 
        v-for="(item,index) in items" 
        :key="index"
        :to="item.url"
        @click="item.methods ? item.methods() : {}"
        class="btn-header">
          <v-icon left>{{item.icon}}</v-icon>
         {{item.title}}</v-btn> -->

        <v-list-tile
        v-for="(item,index) in items" 
        :key="index"
        :to="item.url"
        @click="item.methods ? item.methods() : {}">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{item.title}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar relative app dark class="header">
      <v-toolbar-side-icon
      class="hidden-md-and-up" 
      @click="drawer = !drawer"></v-toolbar-side-icon>
      <router-link to="/" tag="span" class="pointer">
      <v-toolbar-title>MyNote.pro</v-toolbar-title>
      </router-link>
     <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat 
        v-for="(item,index) in items" 
        :key="index"
        :to="item.url"
        @click="item.methods ? item.methods() : {}"
        class="btn-header">
          <v-icon left>{{item.icon}}</v-icon>
         {{item.title}}</v-btn>
         </v-toolbar-items>
    </v-toolbar>
  <v-content>
    <router-view :registration="registration"></router-view>
  </v-content>
  <template v-if="error">
      <v-snackbar
      :timeout="5000"
      :top="true"
      :multi-line="true"
      @input="closeError"
      :value="true"
      color="black"
    >
    {{error}}
      <v-btn flat light color="red" @click.native="closeError">Закрыть 
      </v-btn>
    </v-snackbar>
  </template>
  <template v-if="messageToClient">
      <v-snackbar
      :timeout="5000"
      :bottom="true"
      :right="true"
      :multi-line="true"
      @input="closeMessage"
      :value="true"
      :color="messageToClient.type"
    >
    {{messageToClient.message}}
      <v-btn flat light  @click.native="closeMessage">Закрыть 
      </v-btn>
    </v-snackbar>
    </template>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      mini: false,
      registration: false
    }
  },
  name: 'App',
  computed: {
    time () {
      return new Date().getHours()
    },
    error () {
      return this.$store.getters.error
    },
    messageToClient () {
      return this.$store.getters.messageToClient
    },
    userlogged () {
      return this.$store.getters.userlogged
    },
    items () {
      if (this.userlogged) {
        return [
          { title: 'К запискам', icon: 'home', url: '/notes', methods: '' },
          { title: 'Выйти из аккаунта', icon: 'exit_to_app', url: '/', methods: this.onLogout }]
      } else {
        return [ { title: this.registration === true ? 'Авторизация' : 'Регистрация', icon: this.registration === true ? 'fa-sign-in-alt' : 'fa-user-plus', methods: () => { this.registration = !this.registration } },
        { title: 'О сайте', icon: 'monetization_on' }]
      }
    },
    user () {
      return this.$store.getters.user
    }
  },
  methods: {
    closeError () {
      this.$store.dispatch('clearError')
    },
    closeMessage () {
      this.$store.dispatch('clearMessageToClient')
    },
    onLogout () {
      this.$store.dispatch('logout').then(
        () => {
          this.$router.push('/')
        }
      )
    }
  }
}
</script>


<style>
.btn-header:hover{
  border-bottom: 2.3px solid white;
}
.header{
  z-index: 3;
}
.pointer{
  cursor: pointer;
}
.v-btn--active{
  cursor: default !important;
  border-bottom: 3px solid rgb(25, 118, 210);
}

.v-btn--active:hover{
border-bottom: 3px solid rgb(25, 118, 210);
}

 @keyframes rounded {
  from{}
  to{
    transform:rotate(-180deg)
  }
}

  .round{
    animation: rounded 1s linear infinite;
  }
</style>