<template>
<v-container fluid fill-height>
        <v-layout align-center justify-center style="perspective: 1200px;">
          <v-flex xs12 sm10 md7 lg5>
            
            <transition name="fade" mode="out-in">
            <v-card class="elevation-12 perspective"
            v-if="!registration" key='1'>
              <v-toolbar >
                <v-toolbar-title>Авторизация *</v-toolbar-title> 
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" validation>
                  <v-text-field 
                  prepend-icon="person" 
                  name="E-mail" 
                  label="E-mail"
                  type="text"
                  v-model="email"
                  :rules="emailRules"
                  autofocus
                  color="gray"
                  ></v-text-field>
                  <v-text-field id="password"
                  :prepend-icon="valid ? 'lock_open' : 'lock'"
                  name="password"
                  label="Пароль"
                  v-model="password"
                  @keydown.enter='onSubmit'
                  :counter="14"
                  :rules="passwordRules"
                  color="gray"
                  :type="glaz ? 'text' : 'password'"
                  :append-icon="glaz ? 'visibility' : 'visibility_off'"
                  @click:append="() => (glaz = !glaz)"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-dialog
                v-model="passReset"
      width="500"
    >
      <v-btn
        slot="activator"
        flat
      >
        Забыли пароль?
      </v-btn>

      <v-card>
        <v-card-title
          class=" grey lighten-2"
          primary-title
        >
          <h2>Введите ваш Email для восстановления пароля</h2>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model.trim="valid2" validation>
        <v-text-field
          prepend-icon="person" 
          name="E-mail" 
          label="E-mail"
          type="text"
          v-model="email"
          :rules="emailRules"
          autofocus
          color="gray"
        ></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
          flat
          @click="passReset = false"
          >
            Закрыть
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="green"
            flat
            :disabled="!valid2 || loading"
            @click="passwordReset"
          >
            Отправить ключ восстановления
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
          <v-spacer></v-spacer>
          <v-btn 
          @click="onSubmit"
          v-on:keydown.enter.prevent='onSubmit'
          :loading="loading"
          :disabled="!valid || loading"
          >Войти</v-btn>
        </v-card-actions>
      </v-card>
      <v-card class="elevation-12 perspective" key='2' v-else>
        <v-toolbar>
          <v-toolbar-title>Регистрация</v-toolbar-title> 
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model.trim="valid" validation :lazy-validation="false">
            <v-text-field 
            prepend-icon="person" 
            name="E-mail" 
            label="E-mail" 
            type="text"
            v-model="regist.email"
            :rules="emailRules"
            autofocus
            color="gray"
            ></v-text-field>
            <v-text-field id="password" 
            prepend-icon="lock" 
            name="password"
            label="Пароль"
            :type="regist.glaz ? 'text' : 'password' "
            :append-icon="regist.glaz ? 'visibility' : 'visibility_off'"
            @click:append="() => (regist.glaz = !regist.glaz)"
            v-model="regist.password"
            :counter="14"
            :rules="regist.passwordRulesConfirmed"
            color="gray"
            >
            </v-text-field>
            <v-text-field id="confirmPassword" 
            prepend-icon="lock" 
            name="password" 
            label="Подтвердите пароль"
            v-model="regist.confirmPassword"
            :counter="14"
            :rules="regist.confirmPasswordRules"
            :append-icon="regist.glaz2 ? 'visibility' : 'visibility_off'"
            @click:append="() => (regist.glaz2 = !regist.glaz2)"
            :type="regist.glaz2 ? 'text' : 'password'"
            color="gray"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
         <v-btn 
          @click="onRegist"
          :loading="loading"
          color="success"
          :disabled="!valid || loading"
          >Зарегистрироваться</v-btn>
              </v-card-actions>
            </v-card>
          </transition>
          </v-flex>
        </v-layout>
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
// Доделываем регистрацию, в карточке с регистрацией есть ошибки, нужно дописать проверку валидностей форм ибо если конфирм true и при изменении pass ввести разное все равно form valid
export default{
  props: ['registration'],
  data () {
    return {
      regist: {
        email: '',
        password: '',
        confirmPassword: '',
        confirmPasswordRules: [
          v => !!v || 'Требуется подтвердить пароль',
          v => v === this.regist.password || 'Пароли должны совпадать'],
        passwordRulesConfirmed: [ v => !!v || 'Требуется ввести пароль',
          v => (v && v.length >= 5 && v.length <= 14) || 'Длинна пароля должна быть от 5 до 14 символов'],
        glaz: false,
        glaz2: false
      },
      email: '',
      password: '',
      valid: false,
      valid2: false,
      passReset: false,
      glaz: false,
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
    passwordReset () {
      this.$store.dispatch('resetPassword', this.email)
    },
    onRegist () {
      if (this.$refs.form.validate()) {
        const user = {
          email: this.regist.email,
          password: this.regist.password
        }
        this.$store.dispatch('registerUser', user)
        .then(() => {
          let date = new Date().toLocaleString('ru', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
          date = date.substring(0, date.length - 3)
          let testNote = {
            notesName: 'Тестовая записка',
            notesDiscription: 'Тут мы научимся пользоваться сервисом',
            noteRatio: ['MyNote.pro', 'Тест'],
            noteNotification: false,
            noteDate: date,
            uid: this.user.uid
          }
          this.$store.dispatch('createNote', testNote)
          this.$router.push('/notes')                 // тут можно передать парамтеры и далее провести обучение ;)
        })
        .catch(() => {})
      }
    },

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
    },

    trigUpload () {
      this.$refs.fileInput.click()
    },

    onFileChange (event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = e => {
        this.regist.avatarSrc = reader.result
      }
      reader.readAsDataURL(file)
      this.regist.avatar = file
    }
  }
}
</script>
/*
 
  ######   ######   ######  
 ##    ## ##    ## ##    ## 
 ##       ##       ##       
 ##        ######   ######  
 ##             ##       ## 
 ##    ## ##    ## ##    ## 
  ######   ######   ######  
 
*/
<style scoped>
.v-label{
  cursor: pointer !important;
}
.fade-enter-active,
  .fade-leave-active {
    transition: transform .3s ease-out;
  }

  .fade-enter{
    transform: rotateY(-90deg);
  }

  .fade-leave-to {
    transform: rotateY(90deg);
  }
  .perspective{
    transform-style: preserve-3d !important;
  }
  .flexis{
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

img{
  min-width: 150px;
  max-width: 160px;
  background-color: rgb(250, 250, 250);
  cursor: url("https://firebasestorage.googleapis.com/v0/b/mynote-f85c1.appspot.com/o/siteImages%2Fcursors%2FimageHover.png?alt=media&token=8a2a5aec-6364-48bb-80b1-56f8aa540307"), auto;
  transition: all 1s ease;
  border-radius:50%;
}

.pulse:hover{
    filter: brightness(40%);
    animation: pulse 1s infinite;
    box-sizing: content-box;
    position: relative;
  }

@keyframes pulse {
  0% {
  transform: scale(1);
  }

  70% {
    transform: scale(0.9) ;
  }

  100%{ 
      transform: scale(1);
  }
}

</style>