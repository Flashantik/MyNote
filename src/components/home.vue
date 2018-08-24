<template>
<v-container fluid fill-height>
        <v-layout align-center justify-center style="perspective: 1200px;">
          <v-flex xs12 sm10 md7 >
            <transition name="fade" mode="out-in">
            <v-card class="elevation-12 perspective"
            v-if="!registration">
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
                @click="onSubmit"
                v-on:keydown.enter.prevent='onSubmit'
                :loading="loading"
                :disabled="!valid || loading"
                >Войти</v-btn>
              </v-card-actions>
            </v-card>
            <v-stepper class="perspective" v-model="step" vertical v-else>
              <v-stepper-step :complete="step > 1" step="1">
     Введите свои данные которые потребуются в следующем при входе в ваш аккаунт
      <small>Не валидные E-mail приняты не будут</small>
    </v-stepper-step>
    <v-stepper-content step="1" class="elevation-12">
            <v-card >
              <v-toolbar dark>
                <v-toolbar-title>Регистрация</v-toolbar-title> 
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model.trim="valid" validation>
                  <v-text-field 
                  prepend-icon="person" 
                  name="E-mail" 
                  label="E-mail" 
                  type="text"
                  v-model="regist.email"
                  :rules="emailRules"></v-text-field>
                  <v-text-field id="password" 
                  prepend-icon="lock" 
                  name="password"
                  label="Пароль"
                  :type="regist.glaz ? 'text' : 'password' "
                  :append-icon="regist.glaz ? 'visibility' : 'visibility_off'"
                  @click:append="() => (regist.glaz = !regist.glaz)"
                  v-model="regist.password"
                  :counter="14"
                  :rules="passwordRules && regist.confirmPasswordRules"
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
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                  @click="step = 2"
                  :disabled="!valid"
                >Продолжить</v-btn>
              </v-card-actions>
            </v-card>
    </v-stepper-content>

               <v-stepper-step :complete="step > 2" step="2">Введите данные о себе
       <small>Данные являются полностью конфиденицальными, мы не рассылаем рекламу</small>
    </v-stepper-step>
    <v-stepper-content step="2" class="elevation-12">
      <v-card>
        <v-form ref="form"  validation>
      <v-toolbar dark>
                <v-toolbar-title>Данные аккаунта</v-toolbar-title> 
              </v-toolbar>
        <v-layout row wrap>
        <v-flex xs12 md4 class="flexis">
      <v-tooltip right v-if="!regist.avatarSrc">
      <img  class='pulse' src="https://firebasestorage.googleapis.com/v0/b/soft-planet.appspot.com/o/user.png?alt=media&token=7b08396f-755e-46f6-92b1-14f4f6213991"
      slot="activator" 
      alt="avatar" 
      @click="trigUpload">
        <input 
          ref="fileInput" 
          type="file" 
          style="display:none" 
          accept="image/*"
          @change="onFileChange"
          >
        <span>Нажмите для загрузки аватара</span>
          </v-tooltip>
          <img :src=regist.avatarSrc  v-else>
          </v-flex>
          <v-flex xs12 md8>
          <v-text-field
              id="nickname"
              name="nickname"
              label="Введите свой никнейм"
              v-model="regist.nickname"
              :rules="[v => !!v || 'Требуется ввести никнейм']"
            ></v-text-field> 
             <v-text-field
              id="tel"
              name="tel"
              label="Введите номер телефона"
              v-model="regist.tel"
              :mask="'(###) ## - ### - ## - ##'"
            ></v-text-field> 
        </v-flex>
      </v-layout>
      <v-layout>
      <v-spacer></v-spacer><v-btn 
      @click.native="step = 3"
      >Продолжить</v-btn>
      </v-layout>
      </v-form>
      </v-card>
    </v-stepper-content>

              <v-stepper-step :complete="step > 3" step="3">Select an ad format and name ad unit</v-stepper-step>

              <v-stepper-content step="3">
                <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
                <v-btn color="primary" @click="step = 4">Continue</v-btn>
                <v-btn flat>Cancel</v-btn>
              </v-stepper-content>
            </v-stepper>
          </transition>
          </v-flex>
        </v-layout>
      </v-container>
</template>

<script>
// Доделываем регистрацию, в карточке с регистрацией есть ошибки, нужно дописать проверку валидностей форм ибо если конфирм true и при изменении pass ввести разное все равно form valid
// А еще проверить удаление из бд изображений если они были заменены
export default{
  props: ['registration'],
  data () {
    return {
      regist: {
        email: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        tel: '',
        avatarSrc: '',
        avatar: null,
        confirmPasswordRules: [
          v => !!v || 'Требуется подтвердить пароль',
          v => v === this.regist.password || 'Пароли должны совпадать'],
        glaz: false,
        glaz2: false
      },
      email: '',
      password: '',
      valid: false,
      emailRules: [v => !!v || 'Требуется электронная почта',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail Должен быть верным'],
      passwordRules: [ v => !!v || 'Требуется ввести пароль',
        v => (v && v.length >= 5 && v.length <= 14) || 'Длинна пароля должна быть от 5 до 14 символов'],
      step: 1
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

<style scoped>
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
    transform-style: preserve-3d;
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
  cursor: url("https://firebasestorage.googleapis.com/v0/b/soft-planet.appspot.com/o/cursor%2FUntitled-1.png?alt=media&token=f3a9c5d6-e533-4510-867c-17ba0d996ece"), auto;
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