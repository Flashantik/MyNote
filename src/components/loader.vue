<template>
<div class='loader'>
  <div>
    <div>
      <div>
        <div>
          <div>
            <div>
              <div>
                <div>
                  <div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default{
}
</script>


<style scoped>
@keyframes rotate2 {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    border-top-color: white;
  }
  50% {
    -webkit-transform: rotate(180deg);
            transform: rotate(180deg);
    border-top-color: rgba(0, 0, 255, 0.5);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
    border-top-color: white;
  }
}
 *{
   box-sizing: border-box;
 }
.loader {
  position: relative;
  width: 150px;
  height: 150px;
  display: block;
  overflow: hidden;
}
.loader div {
  height: 100%;
}
.loader, .loader div {
  border-radius: 50%;
  padding: 8px;
  border: 2px solid transparent;
  animation: rotate linear 3.5s infinite;
  border-radius: 50%;
  padding: 4px;
  animation: rotate2 4s infinite linear;
}
div:hover {
  animation-play-state: paused;
}
.loader, .loader * {
  will-change: transform;
}
</style>