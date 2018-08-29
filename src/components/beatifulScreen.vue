<template>
<div class="loadingScreen">
<transition name="letsGoLeft">
  <div class="left" v-if="loading">
    <span class="logo">MyNote.pro
      <v-progress-linear :indeterminate="true" color="white"></v-progress-linear>
    </span>
  </div>
</transition>
<transition name="letsGoRight" >
  <div class="right" v-if="loading"></div>
</transition>
</div>
</template>

<script>
export default{
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

<style scoped>

.loader{
  transform: translateX(50%);
}
.letsGoLeft-enter-active,
  .letsGoLeft-leave-active {
    transition: all .7s ease;
  }

  .letsGoLeft-enter{
    transform: translateX(-100%);
  }

  .letsGoLeft-leave-to {
    transform: translateX(-100%);
  }

.letsGoRight-enter-active,
  .letsGoRight-leave-active {
    transition: all.7s ease;
  }

  .letsGoRight-enter{
    transform: translateX(100%);
  }
  .letsGoRight-leave-to {
    transform: translateX(100%);
  }
.loadingScreen{
  z-index: 99999;
  top: 0;
  left: 0;
  right: 0;
  position: fixed; 
}
.left, .right{
  color:white;
  height: 100vh;
  width: 50vw; 
  position: fixed;
  background-color: black; 
}
.left{
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
}
.right{
  right:0;
  z-index:-1;
}
.logo{
  position: absolute;
  transform:translateX(50%);
  font-size: 20px;
  font-weight: 500;
  letter-spacing: .02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>