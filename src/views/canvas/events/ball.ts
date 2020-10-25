import {
  Actor,
  VectorType,
  BallInstance,
  Animation,
  NullOrNumber,
  BallConfig
} from './ballType'
// 黑盒子用于计算两球相撞后的速度
const collisionVector = (b1: BallInstance, b2: BallInstance) => {
  return (
    b1.velocity

      // Take away from the starting velocity
      .subtract(
        // Subtract the positions
        b1.position
          .subtract(b2.position)

          /**
           * Multiply by the dot product of
           * the difference between the velocity
           * and position of both vectors
           **/
          .multiply(
            b1.velocity
              .subtract(b2.velocity)
              .dotProduct(b1.position.subtract(b2.position)) /
              b1.position.subtract(b2.position).magnitude ** 2
          )

          /**
           * Multiply by the amount of mass the
           * object represents in the collision.
           **/
          .multiply((2 * b2.sphereArea) / (b1.sphereArea + b2.sphereArea))
      )
  )
}
// 控制小球方向
export class Vector {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
  // 小球位置的增加
  add(vector: VectorType) {
    return new Vector(this.x + vector.x, this.y + vector.y)
  }
  // 接收另外一个球的坐标作为参数，计算出两个点x、y轴之间坐标的间距
  subtract(vector: VectorType) {
    return new Vector(this.x - vector.x, this.y - vector.y)
  }
  multiply(scalar: number) {
    return new Vector(this.x * scalar, this.y * scalar)
  }
  dotProduct(vector: VectorType) {
    return this.x * vector.x + this.y * vector.y
  }
  // 平方根，一般在使用 subtract 后使用，用于计算两点的距离
  get magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }
  get direction() {
    return Math.atan2(this.x, this.y)
  }
}
/**
 * 创建 canvas 元素
 * 绘制图形、绘制元素影子效果
 */
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
/**
 * 实例化小球，给小球 type、position 等属性来控制当前小球的状态
 * update 方法来控制小球位置
 */
class Ball {
  id!: number
  // 当前小球的位置信息
  position!: Vector
  // 当前小球的x,y轴速度(控制小球运动的快慢和方向)
  velocity!: Vector
  color!: string
  radius!: number
  collisions!: number[]
  // 将 BallConfig 都设置为可选
  constructor(config?: Partial<BallConfig>) {
    Object.assign(
      this,
      {
        id: Math.floor(Math.random() * 1000000),
        type: 'circle',
        position: new Vector(20, 20),
        velocity: new Vector(5, 3),
        radius: 10,
        color: 'red',
        collisions: []
      },
      config
    )
  }

  update(state: State, time: number, updateId: number) {
    // 将当前球和所有的球进行距离的对比判断是否触碰
    for (const actor of state.actors) {
      // 如果遍历的 actors 是当前球，则跳过
      if (this === actor || this.collisions.includes(actor.id + updateId)) {
        continue
      }
      // 获取目标点中心点和当前小球的中心点的间距
      const distance = this.position.subtract(actor.position).magnitude
      if (distance <= this.radius + actor.radius) {
        // 计算两球相撞后的速度
        const v1 = collisionVector(this, actor)
        const v2 = collisionVector(actor, this)
        // 将相撞后的小球速度更新到两个小球上
        this.velocity = v1
        actor.velocity = v2
        this.collisions.push(actor.id + updateId)
        actor.collisions.push(this.id + updateId)
      }
    }
    // 当x轴触碰到边界就是改变 x 轴都运动方向
    if (this.position.x >= state.display.canvas.width || this.position.x <= 0) {
      this.velocity = new Vector(-this.velocity.x, this.velocity.y)
    }

    // 当y轴触碰到边界就是改变 y 轴都运动方向
    if (
      this.position.y >= state.display.canvas.height ||
      this.position.y <= 0
    ) {
      this.velocity = new Vector(this.velocity.x, -this.velocity.y)
    }
    // 通过 this.position.add 更新当前小球的位置，并且返回一个新的Ball实例便于链式操作
    return new Ball({
      ...this,
      position: this.position.add(this.velocity)
    })
  }
  get sphereArea() {
    return 4 * Math.PI * this.radius ** 2
  }
}


/**
 * 控制小球状态，触发小球的 update 方法来检查小球的边界值
 */

class State {
  display: Canvas
  actors: BallInstance[]
  constructor(display: Canvas, actors: BallInstance[]) {
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

/**
 *
 * @param animation 每帧动画的回调函数
 */
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
const ball1 = new Ball({
  position: new Vector(40, 100),
  velocity: new Vector(1, 0)
})
const ball2 = new Ball({
  position: new Vector(200, 100),
  velocity: new Vector(-1, 0),
  color: 'blue'
})
const ball3 = new Ball({
  position: new Vector(270, 10),
  velocity: new Vector(-5, 10),
  color: 'blue'
})

const ball = new Ball()
const actors = [ball1, ball2,ball3]
let state = new State(canvas, actors)
const startTime = new Date().getTime()
runAnimation(time => {
  // 通过 state.update 检查小球当前的边界值，并且更新小球的 position 坐标
  state = state.update(time)
  // 将小球携带的信息绘制到 canvas 上
  canvas.sync(state)
  // return new Date().getTime() - startTime > 5 * 1000
  return false
})
