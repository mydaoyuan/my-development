import { bodyTemperature, TOP_KEYS, HEAD_HEIGHT, LINE_HEIGHT } from './config'

export default class viewConfig {
  constructor ({
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    marginTop = 20, // top margin, in pixels
    marginRight = 20, // right margin, in pixels
    marginBottom = 50, // bottom margin, in pixels
    marginLeft = 30, // left margin, in pixels
    stroke = 'currentColor', // stroke color of line and dots
    strokeWidth = 2, // stroke width of line and dots
    strokeLinecap = 'round', // stroke line cap of line
    strokeLinejoin = 'round', // stroke line join of line
    renderData
  } = {}) {
    // 基础配置赋值
    this.width = width
    this.height = height
    this.stroke = stroke
    this.strokeWidth = strokeWidth
    this.strokeLinecap = strokeLinecap
    this.renderData = renderData
    this.strokeLinejoin = strokeLinejoin
    this.marginRight = marginRight
    this.marginLeft = marginLeft
    this.marginBottom = marginBottom
    this.marginTop = marginTop
    // 计算属性赋值
    this.contentWidth = width - marginLeft - marginRight
    this.step = this.contentWidth / 8
    this.bottomPos = height - HEAD_HEIGHT - marginTop - (marginBottom - 30) // 底部坐标，30是因为默认的30，忘记计算了，后续的按照30的偏移量计算
    this.tableHeight = height - marginBottom - HEAD_HEIGHT
    const { micoStep, verticalHeight } = this.utilsGetMicoPos(
      this.step,
      this.bottomPos
    )
    this.micoStep = micoStep
    this.verticalHeight = verticalHeight
    this.X_OFFSET = micoStep / 2 // 为了让图标在小格子居中展示，需要进行一个偏移
    this.xRange = [this.step, width - marginLeft - marginRight] // [60, 860]
    this.topPos = marginTop + HEAD_HEIGHT
    this.topKeysPos = LINE_HEIGHT * (TOP_KEYS.length + 1) // 1 是时间那一行
    this.bottomKeysPosStart = this.topKeysPos + verticalHeight
    this.yRange = [this.bottomKeysPosStart, this.topKeysPos]
  }

  // 获取折线区域的高度
  utilsGetMicoPos (step, botpos) {
    const micoStep = (step * 7) / 42 // 折线小格子的宽度
    const verticalLength = bodyTemperature[1] - bodyTemperature[0] // 根据体温来计算格子
    const verticalHeight = micoStep * 5 * verticalLength
    return {
      micoStep,
      verticalHeight
    }
  }
}
