<template>
<v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark >
                <v-toolbar-title>Авторизация</v-toolbar-title> 
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" validation>
                  <v-text-field prepend-icon="person" name="E-mail" label="E-mail" type="text"
                  v-model="email"
                  :rules="emailRules"
                  autofocus
                  ></v-text-field>
                  <v-text-field id="password"
                  prepend-icon="lock"
                  name="password"
                  label="Пароль"
                  type="password"
                  v-model="password"
                  @keydown.enter='onSubmit'
                  :counter="14"
                  :rules="passwordRules"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                to="/notes"
                >Войти</v-btn>
                
                <v-btn 
                @click="onSubmit"
                v-on:keydown.enter.prevent='onSubmit'
                :loading="loading"
                :disabled="!valid || loading"
                >Войти</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
</template>

<script>
export default{
  data () {
    return {
      email: '',
      password: '',
      valid: false,
      emailRules: [v => !!v || 'Требуется электронная почта',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail Должен быть верным'],
      passwordRules: [ v => !!v || 'Требуется ввести пароль',
        v => (v && v.length >= 5 && v.length <= 14) || 'Длинна пароля должна быть от 5 до 14 символов']
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    user () {
      return this.$store.getters.user
    }
  },
  methods: {
    onSubmit () {
      if (this.$refs.form.validate()) {
        const user = {
          email: this.email,
          password: this.password
        }
        this.$store.dispatch('loginUser', user)
        .then(() => {
          this.$router.push('/notes')
        })
        .catch(() => {})
      }
    }
  },
  beforeCreate () {
    console.log(this.$store.getters.user)
  }
}
</script>
<style scoped>
</style>