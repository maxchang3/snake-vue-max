<template>
  <div class="nixie">
    <div v-for="num in data.scores" :class="`bg-nixie_${num}`" ></div>
    <div class="tiny-screen">
      <div class="line" v-for="line,row in tinyScreen.value">
        <div :class="`dot ${dot == 1 ? 'dot-active' : ''}`" v-for="dot,column in line">
        </div>
      </div>
    </div>
  </div>
  <div class="matrix">
    <div class="line" v-for="(line,row) in MAP.value">
      <div :class="`dot ${dot == 1 ? 'dot-active' : ''}`" v-for="(dot,column) in line">
        <!-- @click="MAP.opposite(row, column)" -->
      </div>
    </div>
  </div>
  <div class="button_area">
    <div class="placeholder"></div>
    <div class="button" @click="touch('w')">⬆</div>
    <div class="placeholder"></div>

    <div class="button" @click="touch('a')">⬅</div>
    <div class="placeholder"><a href="https://github.com/MaxChang3/max-vue-snake"><img style="height:2rem" src="@/assets/github.svg" /></a></div>
    <div class="button" @click="touch('d')">➡</div>

    <div class="placeholder"></div>
    <div class="button" @click="touch('s')">⬇</div>
    <div class="placeholder"></div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import Matrix, { matrix } from '@/utils/matrix';
import { Snake } from '@/components/snake'; // for LinkedList use `@/components/snake_linked`
import { tinyScreenAni,timeToStirng } from '@/components/tinyScreenAni';
import '@/assets/main.css';
import '@/assets/nixies.css'

interface data {
  MAP: Matrix,
  tinyScreen: Matrix,
  snake: Snake | undefined,
  scores: string[],
}

const mapSize: [number, number] = [32, 32]
const data = reactive<data>({
  MAP: new Matrix(...mapSize),
  tinyScreen: new Matrix(9, 5),
  snake: undefined,
  scores: "0000".split(''),
})

const status = {
  starterReady: false,
  starter: false,
  gaming: false,
}

const { MAP, tinyScreen } = data

const tiny:tinyScreenAni = new tinyScreenAni(tinyScreen as Matrix,()=>{
data.scores = (timeToStirng(new Date().getHours()) + timeToStirng(new Date().getMinutes())).split('');
})

const keyMaps = {
  async start() {
    if (status.starter) return;
    status.starter = true
    tiny.clearTimer()
    tinyScreen.lineByLine()
    await MAP.lineByLine()
    newGame()
    status.starter = false
  },
  inGame(keys?: KeyboardEvent, appointKey?: string) {
    let { key } = keys || { key: appointKey || "LEFT" }
    enum Keys {
      ArrowUp = "UP", w = "UP",
      ArrowDown = "DOWN", s = "DOWN",
      ArrowLeft = "LEFT", a = "LEFT",
      ArrowRight = "RIGHT", d = "RIGHT"
    }
    if (key in Keys && data.snake != undefined) {
      data.snake.setDirection(Keys[key as keyof typeof Keys])
    }
  }
}

const touch = (key: string) => {
  navigator.vibrate(80);
  if (status.gaming == true) {
    keyMaps.inGame(undefined, key)
  } else if (status.starterReady == true) {
    keyMaps.start()
  }
}
const setScores = (scores: number) => (scores).toString().padStart(4, '0').split('').slice(0, 4)

MAP.readMap('start').then(async (map: matrix): Promise<void> => {
  await MAP.drawFromTemp(map)
  status.starterReady = true
  window.onkeydown = keyMaps.start
})

const newGame = () => {
  let _snake = data.snake = new Snake(15, 15, mapSize, MAP as Matrix)
  status.gaming = true
  const Game = setInterval(() => {
    data.scores = setScores(_snake.snake.scores)
    const gameOver = _snake.move()
    if (!(gameOver)) return;
    clearInterval(Game)
    MAP.readMap('gameover').then(async (map: matrix): Promise<void> => {
      window.onkeydown = () => { }
      await MAP.drawFromTemp(map)
      status.gaming = false
      window.onkeydown = keyMaps.start
    })
  }, 100)
  window.onkeydown = (keys) => keyMaps.inGame(keys)
}

</script>