import { Vector } from './ball'
// 并不会执行，在编译时候进行 console.log('Vector',Vector)
export interface Actor {
  position: {
    x: number
    y: number
  }
  radius: number
  color: string
  type?: string
}

export interface BallConfig {
  type: string
  position: Vector
  velocity: Vector
  radius: number
  color: string
}
export interface VectorType {
  x: number
  y: number
}
export interface BallInstance {
  color: string
  radius: number
  position: Vector
  // 声明 update 函数类型，并且声明函数返回值类型
  update: (arg1: any, time: number, updateId: number) => BallInstance
}

export type Animation = (time: number) => boolean

export type NullOrNumber = null | number
