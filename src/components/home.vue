<template>
<v-container fluid fill-height>
        <v-layout align-center justify-center style="perspective: 1200px;">
          <v-flex xs12 sm10 md7 lg5>
            <transition name="fade" mode="out-in">
            <v-card class="elevation-12 perspective"
            v-if="!registration">
              <v-toolbar dark >
                <v-toolbar-title>Авторизация *</v-toolbar-title> 
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" validation>
                  <v-text-field prepend-icon="person" 
                  name="E-mail" 
                  label="E-mail"
                  type="text"
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
                <v-toolbar-title>Регистрация *</v-toolbar-title> 
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model.trim="valid" validation>
                  <v-text-field 
                  prepend-icon="person" 
                  name="E-mail" 
                  label="E-mail" 
                  type="text"
                  v-model="regist.email"
                  :rules="emailRules"
                  autofocus
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
                  @click="()=>{step = 2; valid=false}"
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
        
      <v-toolbar dark>
        <v-toolbar-title>Данные аккаунта </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
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
        <v-form ref="form" v-model="valid" validation>
          <v-text-field
              id="nickname"
              name="nickname"
              label="Введите свой никнейм *"
              v-model="regist.nickname"
              :rules="[v => !!v || 'Требуется ввести никнейм']"
            ></v-text-field>
        </v-form>
             <v-text-field
              id="tel"
              name="tel"
              label="Введите номер телефона"
              v-model="regist.tel"
              :mask="'(###) ## - ### - ## - ##'"
            ></v-text-field> 
        </v-flex>
      </v-layout>
      </v-card-text>
      <v-layout>
      <v-spacer></v-spacer><v-btn 
      @click.native="step = 3"
      :disabled="!valid"
      >Продолжить</v-btn>
      </v-layout>
      </v-card>
    </v-stepper-content>

  <v-stepper-step :complete="step > 3" step="3">Select an ad format and name ad unit</v-stepper-step>
    <v-stepper-content step="3" class="elevation-12">
      <v-card>
        <v-card-text>
        <v-dialog
        ref="dialog"
        v-model="regist.modal"
        :return-value.sync="regist.DOB"
        persistent
        lazy
        full-width
        width="290px"
        >
        <v-text-field
          slot="activator"
          label="Введите дату своего рождения"
          prepend-icon="event"
          readonly
          v-model="regist.DOB"
        ></v-text-field>
        <v-date-picker 
        scrollable
        dark
        locale="ru"
        v-model="regist.DOB"
        >
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="regist.modal = false">Закрыть</v-btn>
          <v-btn flat color="primary" @click="$refs.dialog.save(regist.DOB)">OK</v-btn>
        </v-date-picker>
      </v-dialog>
       <v-autocomplete
          :items="regist.country"
          v-model="regist.myCountry"
          label="Выберите страну"
          auto
        >
        </v-autocomplete>
        <v-layout>
          <v-spacer></v-spacer>
         <v-btn 
          @click="onRegist"
          :loading="loading"
          color="success"
          :disabled="!valid || loading"
          >Зарегистрироваться</v-btn>
      </v-layout>
      </v-card-text>
      </v-card>
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
        DOB: '',
        myCountry: '',
        confirmPasswordRules: [
          v => !!v || 'Требуется подтвердить пароль',
          v => v === this.regist.password || 'Пароли должны совпадать'],
        glaz: false,
        glaz2: false,
        modal: false,
        country: ['Россия', 'Украина', 'Беларусь', 'Казахстан', 'Афганистан', 'Албания', 'Алжир', 'Андорра', 'Ангола', 'Ангилья', 'Антигуа и ампир', 'Барбуда', 'Аргентина', 'Армения', 'Аруба', 'Австралия', 'Австрия', 'Азербайджан', 'Багамские острова', 'Бахрейн', 'Бангладеш', 'Белиз', 'Бенин', 'Бермудские острова', 'Бутан', 'Боливия', 'Босния и амфибия', 'Брундия', 'Ботсвана', 'Бразилия', 'Британские Виргинские острова', 'Бруней', 'Болгария', 'Буркина-Фасо', 'Бурунди', 'Камбоджа', 'Камерун', 'Кабо-Верде', 'Каймановы острова', 'Чад', 'Чили', 'Китай', 'Колумбия', 'Конго', 'Острова Кука', 'Коста-Рика', 'Беларусь', 'Кот-д Ивуар', 'Хорватия', 'Круизный корабль', 'Кипр', 'Чехия', 'Дания', 'Джибути', 'Доминика', 'Доминиканская Республика', 'Эквадор', 'Египет', 'Сальвадор', 'Экваториальная Гвинея', 'Фиджи', 'Финляндия', 'Французская Полинезия', 'Французская Вест-Индия', 'Габон', 'Гамбия', 'Грузия', 'Германия', 'Гана', 'Гибралтар', 'Греция', 'Гренландия', 'Гренада', 'Гуам', 'Гватемала', 'Гернси', 'Гвинея', 'Гвинея-Бисау', 'Гайана', 'Гаити', 'Гондурас', 'Гонконг', 'Венгрия', 'Исландия', 'Индия', 'Индонезия', 'Иран', 'Ирак', 'Ирландия', 'Остров Мэн', 'Израиль', 'Италия', 'Ямайка', 'Япония', 'Джерси', 'Иордания', 'Казахстан', 'Кения', 'Кувейт', 'Кыргызская Республика', 'Лаос', 'Латвия', 'Ливан', 'Лесот', 'Либерия', 'Ливия', 'Лихтенштейн', 'Литва', 'Люксембург', 'Макао', 'Македония', 'Мадагаскар', 'Малави', 'Малайзия', 'Мальдивы', 'Мальта', 'Мавритания', 'Маврикий', 'Мексика', 'Молдова', 'Монако', 'Монголия', 'Черногория', 'Монтсеррат', 'Марокко', 'Мозамбик', 'Намибия', 'Непал', 'Нидерланды', 'Нидерландские Антильские острова', 'Новая Каледония', 'Новая Зеландия', 'Никарагуа', ' Нигер', 'Нигерия', 'Норвегия', 'Оман', 'Пакистан', 'Палестина', 'Панама', 'Папуа-Новая Гвинея', 'Парагвай', 'Перу', 'Филиппины', 'Польша', 'Португалия', 'Пуэрто-Рико', 'Катар', 'Руанда', 'Сен-Пьер ', 'Сенегал', 'Сейшельские острова', 'Сьерра-Леоне', 'Сингапур', 'Словакия', 'Словения', 'Сьерра-Леоне', 'Сьерра-Леоне', 'Сальвадор', 'Сан-Марино', 'Спутник', 'Саудовская Аравия', 'Южная Африка', 'Южная Корея', 'Испания', 'Шри-Ланка', 'Сент-Китс и Амп. Невис ', ' Сент-Люсия ', ' Сент-Винсент ', ' Св. Люсия', 'Судан', 'Суринам', 'Свазиленд', 'Швеция', 'Швейцария', 'Сирия', 'Тайвань', 'Таджикистан', 'Танзания', 'Таиланд', 'Тимор', 'Того', 'Тонга', 'Тринидад ', 'Тобаго', 'Тунис', 'Турция', 'Туркменистан', 'Турки и ампер; Кайкос ', ' Уганда ', ' Украина ', ' Объединенные Арабские Эмираты ', ' Соединенное Королевство ', ' Соединенные Штаты ', ' Уругвай ', ' Узбекистан ', ' Венесуэла ', ' Вьетнам ', ' Виргинские острова (США) ', 'Йемен', 'Замбия', 'Зимбабве']
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
    onRegist () {
      if (this.$refs.form.validate()) {
        const user = {
          email: this.regist.email,
          password: this.regist.password,
          nickname: this.regist.nickname,
          tel: this.regist.tel,
          DOB: this.regist.DOB,
          myCountry: this.regist.myCountry,
          avatar: this.regist.avatar
        }
        this.$store.dispatch('registerUser', user)
        .then(() => {
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