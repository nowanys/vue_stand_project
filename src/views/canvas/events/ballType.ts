export interface Actor {
  position: {
    x: number
    y: number
  }
  radius: number
  color: string
  type?: string
}

export interface VectorType {
  x: number
  y: number
}
export interface ActorItem {
  // 声明 update 函数类型，并且声明函数返回值类型
  update: (arg1: any, time: number, updateId: number) => ActorItem
}

export type Animation = (time: number) => boolean

export type NullOrNumber = null | number
