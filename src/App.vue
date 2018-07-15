<template>
  <v-app>
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
            <img src="http://s1.iconbird.com/ico/0612/GooglePlusInterfaceIcons/w128h1281338911651user.png">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Неизвестный</v-list-tile-title>
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
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>face</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Регистрация</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>face</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>О сайте</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    
    
    <v-toolbar  relative app dark class="header">
      <v-toolbar-side-icon
      class="hidden-md-and-up" 
      @click="drawer = !drawer"></v-toolbar-side-icon>
      <router-link to="/" tag="span" class="pointer"><v-toolbar-title>MyNote.pro</v-toolbar-title></router-link>
     <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat @click="onLogout"> 
          <v-icon left>face</v-icon>
         Выйти из аккаунта</v-btn>
        <v-btn flat> 
          <v-icon left>face</v-icon>
         Регистрация</v-btn>
        <v-btn flat> 
          <v-icon left>face</v-icon>
         О сайте</v-btn>
      </v-toolbar-items>
    </v-toolbar>
                      <v-content>
                        <router-view></router-view>
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
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      mini: false
    }
  },
  name: 'App',
  computed: {
    error () {
      return this.$store.getters.error
    }
  },
  methods: {
    closeError () {
      this.$store.dispatch('clearError')
    },
    onLogout () {
      this.$store.dispatch('logout')
      this.$router.push('/')
    },
    resized () {
      console.log(1)
    }
  }
}
</script>

<style>
.header{
  z-index: 3;
}
</style>
