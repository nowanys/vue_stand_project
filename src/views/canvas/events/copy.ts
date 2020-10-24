import { Actor } from './ballType'
export class Canvas{
  canvas:HTMLCanvasElement
  ctx:any
  constructor(parent=document.body,width=400,height=400){
    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    parent.appendChild(this.canvas)
    this.ctx = this.canvas.getContext('2d')
  }
  drawCircle(actor:Actor) {
    const ctx = this.ctx
    const { position:{x,y},radius } = actor
    ctx.beginPath()
    ctx.arc(x,y,radius,0,Math.PI*2)
    ctx.closePath()
    ctx.fillStyle = actor.color
    ctx.fill()
  }
}
class Ball{
  color:string
  position:{
    x:number,
    y:number
  }
  radius:number
  constructor(radius=1,x=20,y=20,color='red'){
    this.color = color
    this.position = {x,y}
    this.radius = radius
  }
}

const canvas = new Canvas()
const ball = new Ball(5)
canvas.drawCircle(ball)