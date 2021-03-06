## 缩放

1. 首先记录 mousedown 的坐标
2. 当前坐标属于控制点四个方向的哪个控制点
3. mouseup 鼠标的点
4. 只考虑 x 轴方向发送的变换(参考语雀)
5. 缩放的时候参考坐标点是对称点的位置

## 旋转

1. 当选中图形，除了绘制四个控制框，再绘制一个控制当前角度的控制框。
2. 当点击控制角度的控制框时候，移动的时候，重新绘制控制框，使用 translate 来重新定位旋转中心点。
3. 新增一个变量来判断是否点击中旋转控制点。

## 层级

如果 canvas 绘制点图形有层级问题就是绘制先后点问题。查看是否跟绘制点时机有关系

## 图形对象定义

```
{
    type: 'rect',
    x: 50,
    y: 50,
    w: 100,
    h: 100,
    fillStyle: 'green',
    // 表示当前图形的层级，用于重叠时候判断哪个在上面
    zIndex: 0,
    centerX, // 将这
    centerY
}
```

## 分类

1. 一个总的类 canvas 实例
2. 各个功能单独一个类，使用继承的方式来实现多种功能
3. 消息管理，如果让这个几个类都有能拿到最新的信息。

# 设计模式

## 关于 rect 和 circle 相关判断逻辑的，及其下逻辑抽离

- 抽离 circle 类 rect 类，在这个类上调用其对应的方法(将这两个类的逻辑到底做了啥归类为指定的方法)，它们有共通特性，都属于元素形状，可以抽离一个公共的父类

### 归纳不同类型做的事

1. 当拖拽控制点的时候
   - rect 去更新 x,y 和 w,h
   - circle 更新 r 即可

## 状态管理

1. 当前选中的图形
2. 当前选中的第几个图形
3. 有哪些图形列表
4. 当前点击的位置
5. 点击控制点的对角
