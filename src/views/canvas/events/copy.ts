import {
  Actor,
  VectorType,
  ActorItem,
  Animation,
  NullOrNumber
} from './ballType'
class Vector {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
  // x,y轴速度的控制
  add(vector: VectorType) {
    return new Vector(this.x + vector.x, this.y + vector.y)
  }
  subtract(vector: VectorType) {
    return new Vector(this.x - vector.x, this.y - vector.y)
  }
  multiply(scalar: number) {
    return new Vector(this.x * scalar, this.y * scalar)
  }
  dotProduct(vector: VectorType) {
    return this.x * vector.x + this.y * vector.y
  }
  // 平方根
  get magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }
  get direction() {
    return Math.atan2(this.x, this.y)
  }
}
export class Canvas {
  canvas: HTMLCanvasElement
  ctx: any
  constructor(parent = document.body, width = 400, height = 400) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    parent.appendChild(this.canvas)
    this.ctx = this.canvas.getContext('2d')
  }
  drawCircle(actor: Actor) {
    const ctx = this.ctx
    const {
      position: { x, y },
      radius
    } = actor
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fillStyle = actor.color
    ctx.fill()
  }
  sync(state: any) {
    this.clearDisplay()
    this.drawActors(state.actors)
  }
  clearDisplay() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, .4)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.strokeStyle = 'black'
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height)
  }
  drawActors(actors: Actor[]) {
    for (const actor of actors) {
      if (actor.type === 'circle') {
        this.drawCircle(actor)
      }
    }
  }
}
class Ball {
  position!:Vector
  velocity!:Vector
  constructor(config?:any) {
    Object.assign(this,
      {
        type: 'circle',
        position: new Vector(20, 20),
        velocity: new Vector(5, 3),
        radius: 10,
        color: 'red',
      },
      config
    );
  }

  update(state:any, time:any, updateId:any) {

    // Check if hitting left or right of display
    if (this.position.x >= state.display.canvas.width || this.position.x <= 0) {
      this.velocity = new Vector(-this.velocity.x, this.velocity.y);
    }

    // Check if hitting top or bottom of display
    if (this.position.y >= state.display.canvas.height || this.position.y <= 0) {
      this.velocity = new Vector(this.velocity.x, -this.velocity.y);
    }

    return new Ball({
      ...this,
      position: this.position.add(this.velocity),
    });
  }
}

class State {
  display: any
  actors: ActorItem[]
  constructor(display: any, actors: ActorItem[]) {
    this.display = display
    this.actors = actors
  }
  update(time: number) {
    const updateId = Math.floor(Math.random() * 1000000)
    const actors = this.actors.map(actor => {
      return actor.update(this, time, updateId)
    })
    return new State(this.display, actors)
  }
}
const runAnimation = (animation: Animation) => {
  // console.log('animation',animation)
  let lastTime: NullOrNumber = null
  const frame = (time: number) => {
    if (lastTime !== null) {
      const timeStep = Math.min(100, time - lastTime) / 1000

      if (animation(timeStep)) {
        return
      }
    }
    lastTime = time
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}
const canvas = new Canvas()
const ball = new Ball()
const actors = [ball]
let state = new State(canvas, actors)
const startTime = new Date().getTime()
runAnimation(time => {
  state = state.update(time)
  canvas.sync(state)
  return (new Date().getTime() - startTime) > 5 * 1000
})
