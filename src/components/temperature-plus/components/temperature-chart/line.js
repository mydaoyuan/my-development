import * as d3 from 'd3-6'
import { iconDrawObj, getG, getData, drawTopMask, drawBottomMask, initArrow, lineArrow, drawSpecialText, drawBottomSpecialText } from './drawfn'
import { getMaxList } from './dataProcess'
import {
  timeNumber,
  nightTime,
  leftTEXT,
  bodyTemperature,
  starNumEnv,
  endNumEnv,
  heartRange,
  INFO_KEYS,
  TOP_KEYS,
  BOTTOM_KEYS,
  HEAD_HEIGHT,
  LINE_HEIGHT,
  textLeftMargin,
  TEXT_MARGIN_BOTTOM
} from './config'
import ViewConfig from './ViewConfig'
export function init (data = []) {
  const ajaxData = getData(data)
  const chart = ConnectedScatterplot({
    x: (d) => d.year,
    y: (d) => d.gas,
    xType: d3.scaleBand,
    yDomain: [starNumEnv, endNumEnv],
    width: 980,
    height: 1180,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 80,
    duration: 5000, // for the intro animation; 0 to disable
    renderData: ajaxData
  })
  document.getElementById('my_dataviz').appendChild(chart)
}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/connected-scatterplot
// width = 640, // outer width, in pixels
// height = 400, // outer height, in pixels
// marginTop = 20, // top margin, in pixels
// marginRight = 20, // right margin, in pixels
// marginBottom = 50, // bottom margin, in pixels
// marginLeft = 30, // left margin, in pixels
// stroke = 'currentColor', // stroke color of line and dots
// strokeWidth = 2, // stroke width of line and dots
// strokeLinecap = 'round', // stroke line cap of line
// strokeLinejoin = 'round', // stroke line join of line
// renderData,
function ConnectedScatterplot (options) {
  // 计算出各种位置常量
  const viewConfig = new ViewConfig(options)
  let tooltip
  const svg = d3
    .create('svg')
    .attr('id', 'printsvg')
    .attr('width', viewConfig.width)
    .attr('height', viewConfig.height)
    .attr('viewBox', [0, 0, viewConfig.width, viewConfig.height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
    .attr('transform', `translate(0,${viewConfig.marginTop})`)

  setTimeout(() => {
    tooltip = svg.append('g').style('pointer-events', 'none')
  })

  const xScale = d3
    .scaleBand()
    .domain(d3.range(viewConfig.renderData.rowsData.length))
    .rangeRound(viewConfig.xRange)
  // 体温的 scale
  const bodyScale = d3.scaleLinear(
    [bodyTemperature[0], bodyTemperature[1]],
    viewConfig.yRange
  )
  // 心率的 Scale
  const heartScale = d3.scaleLinear(
    [heartRange[0], heartRange[1]],
    viewConfig.yRange
  )
  // 心率上限
  const bodyOverflowData = getMaxList({
    list: viewConfig.renderData.datasetHeartRate.flat(Infinity),
    max: heartRange[1],
    min: heartRange[0],
    maxDefault: 180,
    minDefault: 40
  })
  // 脉搏上限
  const datasetPulse = getMaxList({
    list: viewConfig.renderData.datasetPulse.flat(Infinity),
    max: heartRange[1],
    min: heartRange[0],
    maxDefault: 180,
    minDefault: 40
  })
  // 口温下限
  const bodyData = getMaxList({
    list: viewConfig.renderData.bodyData,
    max: bodyTemperature[1],
    min: bodyTemperature[0],
    maxDefault: 42,
    minDefault: 35
  })
  // 腋温下限
  const datasetAnus = getMaxList({
    list: viewConfig.renderData.datasetAnus,
    max: bodyTemperature[1],
    min: bodyTemperature[0],
    maxDefault: 42,
    minDefault: 35
  })
  // 肛温下限
  const datasetHeartrate = getMaxList({
    list: viewConfig.renderData.datasetHeartrate,
    max: bodyTemperature[1],
    min: bodyTemperature[0],
    maxDefault: 42,
    minDefault: 35
  })

  // 耳温下限
  const earCool = getMaxList({
    list: viewConfig.renderData.earCool,
    max: bodyTemperature[1],
    min: bodyTemperature[0],
    maxDefault: 42,
    minDefault: 35
  })
  const allTemperature = [bodyOverflowData, datasetPulse, bodyData, datasetAnus, datasetHeartrate, earCool]
  // viewConfig.renderData.bodyData = levelingData({
  //   list: viewConfig.renderData.bodyData,
  //   maxDefault: 43,
  //   minDefault: 33
  // })
  // console.log(viewConfig.renderData.bodyData,'bodydata');

  initArrow(svg)
  // ==========================
  //      开始调用绘制函数
  // ==========================
  // 1、绘制竖线格子
  // 2、绘制折线图
  // 3、绘制上下的字段属性（遮挡住超出的线条）【需要控制一个上下限，不超过遮罩层，体温【43°,】】
  // 4、绘制被遮挡的竖线格子
  // 一定要按照循序调用
  // 绘制脉搏体温
  drwaPulse(svg)
  // 绘制折线区域格子
  drawbgLine(svg)
  // 绘制红色竖线
  drwaVerticallLine(svg)
  // 绘制折线
  viewConfig.renderData.brokenLineData.forEach(item => {
    brokenLine(svg, item)
  })
  // 绘制脉搏线条
  viewConfig.renderData.datasetPulse.forEach(item => {
    drawHeart(svg, item)
  })
  // 绘制心率线条
  viewConfig.renderData.datasetHeartRate.forEach(item => {
    drawHeartRate(svg, item)
  })
  // 绘制口温线条
  drawPathBody(svg, viewConfig.renderData.bodyData)
  // 绘制腋温线条
  drawAnus(svg, viewConfig.renderData.datasetAnus)
  // // 绘制肛温线条
  drawJuhua(svg, viewConfig.renderData.datasetHeartrate)

  // 绘制耳温
  thermometer(svg, viewConfig.renderData.earCool)
  // 需要放在绘制折线后，起到遮挡折线的作用
  // 绘制呼吸格子
  drwaBreathing(svg, viewConfig.renderData.datasetPain)
  // 需要放在绘制呼吸后，绘制下划线
  // 绘制底部横线和值
  // ===================== //
  // 遮罩层挡住超出的折线     //
  // =====================//
  drawTopMask(svg, viewConfig)
  drawBottomMask(svg, viewConfig)
  drwaBottomLineData(svg)
  //   // 绘制顶部值
  drwaTopData(svg)

  // 绘制特殊事件文字
  drawSpecialText(svg, viewConfig, viewConfig.renderData.mergeTag)
  // drawBottomSpecialText(svg, viewConfig, viewConfig.renderData.symbolDegreesOnline);
  drawBottomSpecialText(svg, viewConfig, viewConfig.renderData.symbolGoUp)
  drawBottomSpecialText(svg, viewConfig, viewConfig.renderData.symbolDegreesEvents)
  // 绘制降温的红圈和虚线
  drawCoolBody(svg, viewConfig.renderData.dataCool, viewConfig.renderData.allTemperatureData)
  drwaOtherInfo(svg, viewConfig.renderData.infoData)
  // 最后一步
  // 绘制四周加粗边框
  drwaTabelBorder(svg)
  // ========== //
  // 最后展示浮层的内容
  // ========== //
  allTemperature.forEach(item => {
    lineArrow({
      svg,
      viewConfig,
      scale: xScale,
      data: item
    })
  })

  // ==========================
  //      结束调用绘制函数
  // ==========================

  return svg.node()
  // 绘制最外面边框
  function drwaTabelBorder (svg) {
    const g = svg
      .append('g')
      .attr(
        'transform',
        `translate(${viewConfig.marginLeft},${viewConfig.topPos})`
      )

    g.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', viewConfig.contentWidth)
      .attr('height', viewConfig.tableHeight)
      .attr('stroke', viewConfig.stroke)
      .attr('fill', 'none')
      .attr('style', 'stroke-width: 2')
  }
  // 绘制所有竖线
  function drwaVerticallLine (svg) {
    const g = getG(svg, viewConfig)
    let start = viewConfig.step
    g.attr('class', 'maskline2')
    while (start < viewConfig.contentWidth) {
      g.append('line')
        .attr('x1', start)
        .attr('y1', 0)
        .attr('y2', viewConfig.tableHeight)
        .attr('x2', start)
        .attr('stroke', start > viewConfig.step ? 'red' : viewConfig.stroke)
      start = start + viewConfig.step
    }
  }
  // 绘制底部的线条和文字
  function drwaBottomLineData (svg) {
    const g = getG(svg, viewConfig)
    // 绘制底部的横向线条
    g.selectAll('line')
      .data([...BOTTOM_KEYS])
      .join('line')
      .attr('x1', 0)
      .attr('y1', (d, i) => {
        return viewConfig.bottomKeysPosStart + (i + 2) * LINE_HEIGHT // 2是呼吸，占了2行
      })
      .attr('y2', (d, i) => {
        return viewConfig.bottomKeysPosStart + (i + 2) * LINE_HEIGHT
      })
      .attr(
        'x2',
        viewConfig.width - viewConfig.marginLeft - viewConfig.marginRight
      )
      .attr('fill', 'none')
      .attr('class', 'dataLine')
      .attr('stroke', viewConfig.stroke)
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', viewConfig.strokeLinejoin)
      .attr('stroke-linecap', viewConfig.strokeLinecap)
    const textArr = BOTTOM_KEYS
    const repeatArr = d3.range(8)
    // 绘制文字
    textArr.map(({ key, name }, index) => {
      g.append('g')
        .selectAll('text')
        .data(repeatArr)
        .join('text')
        .attr('style', 'font-size:14px')
        .attr('class', 'mytext')
        .text((i) => {
          if (i == 0) {
            return name
          } else {
            return getTypeValue(key, viewConfig.renderData.typesData)[i - 1]
              ?.typeValue
          }
        })
        .attr('x', (i) => i * viewConfig.step + textLeftMargin)
        .attr('y', () => {
          return (
            viewConfig.bottomKeysPosStart +
            (index + 3) * LINE_HEIGHT -
            TEXT_MARGIN_BOTTOM
          )
        })
    })
  }
  // 绘制呼吸
  function drwaBreathing (svg, breathData) {
    const g = getG(svg, viewConfig)
    // 遮罩层挡住超出的折线
    g.append('rect')
      .attr('class', 'mask-rect')
      .attr('x', 0)
      .attr('y', viewConfig.bottomKeysPosStart)
      .attr(
        'width',
        viewConfig.width - viewConfig.marginRight - viewConfig.marginLeft
      )
      .attr('height', viewConfig.micoStep * 2 - 1)
      .attr('stroke', viewConfig.stroke)
      .attr('fill', '#fff')
      .attr('style', 'stroke-width: 0')
    // 绘制横线
    g.append('line')
      .attr('x1', 0)
      .attr('y1', viewConfig.bottomKeysPosStart)
      .attr('y2', viewConfig.bottomKeysPosStart)
      .attr(
        'x2',
        viewConfig.width - viewConfig.marginLeft - viewConfig.marginRight
      )
      .attr('fill', 'none')
      .attr('class', 'dataLine')
      .attr('stroke', viewConfig.stroke)
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', viewConfig.strokeLinejoin)
      .attr('stroke-linecap', viewConfig.strokeLinecap)
    const textYPos =
      viewConfig.bottomKeysPosStart + LINE_HEIGHT + TEXT_MARGIN_BOTTOM
    // 绘制汉字
    g.append('text')
      .attr('style', 'font-size:14px')
      .text('呼吸(次/分)')
      .attr('x', textLeftMargin)
      .attr('y', textYPos)
    // 绘制数据
    const data = d3.range(42)
    g.append('g')
      .selectAll('text')
      .data(data)
      .join('text')
      .attr('style', 'font-size:14px')
      .attr('class', 'mytext')
      .text((d) => {
        return breathData[d]?.value
      })
      .attr('x', (i) => {
        return viewConfig.step + i * viewConfig.micoStep + 3
      })
      .attr('y', (i) => {
        if (i % 2) {
          return textYPos + 10
        } else {
          return textYPos - 10
        }
      })
    // 绘制呼吸竖线
    g.append('g')
      .selectAll('line')
      .data(data)
      .join('line')
      .attr('x1', (d, i) => {
        return viewConfig.step + i * viewConfig.micoStep
      })
      .attr('y1', viewConfig.bottomKeysPosStart + 2 * LINE_HEIGHT)
      .attr('x2', (d, i) => {
        return viewConfig.step + i * viewConfig.micoStep
      })
      .attr('y2', viewConfig.bottomKeysPosStart)
      .attr('fill', 'none')
      .attr('class', 'dataLine')
      .attr('stroke', viewConfig.stroke)
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', viewConfig.strokeLinejoin)
      .attr('stroke-linecap', viewConfig.strokeLinecap)
  }
  // 绘制脉搏体温文字
  function drwaPulse (svg) {
    // 左侧的文字
    const g = getG(svg, viewConfig)
    g.append('line')
      .attr('class', 'slefline')
      .attr('y1', viewConfig.topKeysPos) // 这个还要修改一下
      .attr('x1', viewConfig.step / 2)
      .attr('y2', viewConfig.bottomKeysPosStart)
      .attr('x2', viewConfig.step / 2)
      .attr('stroke', viewConfig.stroke)

    leftTEXT.map((texts, index) => {
      g.append('g')
        .selectAll('text')
        .data(texts)
        .join('text')
        .attr('style', `font-size:14px;fill:${['red', 'blue'][index]}`)
        .attr('class', 'mytext')
        .html((d, i) => {
          if (i === 0) {
            const value = d.split(',')
            return `<tspan>${value[0]}</tspan><tspan dx="${
              -35 + index * 10
            }" dy="20">${value[1]}</tspan>`
          }
          return `${d}`
        })
        .attr('x', viewConfig.micoStep * Math.max(index * 4, 1))
        .attr('y', (d, i) => {
          if (i === 0) {
            return viewConfig.topKeysPos + viewConfig.micoStep * 1
          }
          return viewConfig.topKeysPos + viewConfig.micoStep * 5 * i
        })
    })
  }
  // 绘制折线的背景格子
  function drawbgLine (svg) {
    const g = getG(svg, viewConfig)
    // 绘制横线
    const horizontallength = (bodyTemperature[1] - bodyTemperature[0] + 1) * 5
    const horizontalData = [...new Array(horizontallength).keys()]
    g.append('g')
      .attr('class', 'line-content')
      .selectAll('line')
      .data(horizontalData)
      .join('line')
      .attr('x1', viewConfig.step)
      .attr('y1', (d, i) => {
        return viewConfig.topKeysPos + i * viewConfig.micoStep
      })
      .attr('y2', (d, i) => {
        return viewConfig.topKeysPos + i * viewConfig.micoStep
      })
      .attr(
        'x2',
        viewConfig.width - viewConfig.marginLeft - viewConfig.marginRight
      )
      .attr('fill', 'none')
      .attr('class', 'dataLine')
      .attr('stroke', viewConfig.stroke)
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', viewConfig.strokeLinejoin)
      .attr('stroke-linecap', viewConfig.strokeLinecap)
      .attr('style', (d, i) => {
        if (i % 5 == 0 && i != 0) {
          return 'stroke-width: 1; stroke: blue;'
        }
        return 'stroke-width: 1'
      })
    // 竖线绘制
    const verticalData = [...new Array(42).keys()]
    g.append('g')
      .selectAll('line')
      .data(verticalData)
      .join('line')
      .attr('x1', (d, i) => {
        return viewConfig.step + i * viewConfig.micoStep
      })
      .attr('y1', viewConfig.topKeysPos)
      .attr('x2', (d, i) => {
        return viewConfig.step + i * viewConfig.micoStep
      })
      .attr('y2', viewConfig.bottomKeysPosStart)
      .attr('fill', 'none')
      .attr('class', 'dataLine')
      .attr('stroke', viewConfig.stroke)
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', viewConfig.strokeLinejoin)
      .attr('stroke-linecap', viewConfig.strokeLinecap)

    g.append('line')
      .attr('class', 'myline')
      .attr('x1', 0)
      .attr('y1', viewConfig.topKeysPos)
      .attr(
        'x2',
        viewConfig.width - viewConfig.marginLeft - viewConfig.marginRight
      )
      .attr('y2', viewConfig.topKeysPos)
      .attr('stroke', viewConfig.stroke)
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', viewConfig.strokeLinejoin)
      .attr('stroke-linecap', viewConfig.strokeLinecap)
  }
  // 绘制顶部数据
  function drwaTopData (svg) {
    const g = getG(svg, viewConfig)
    // 绘制横向线条
    g.selectAll('line')
      .data(TOP_KEYS)
      .join('line')
      .attr('x1', 0)
      .attr('y1', (d, i) => {
        return LINE_HEIGHT * (i + 1)
      })
      .attr('y2', (d, i) => {
        return LINE_HEIGHT * (i + 1)
      })
      .attr(
        'x2',
        viewConfig.contentWidth
      )
      .attr('fill', 'none')
      .attr('class', 'newline')
      .attr('stroke', viewConfig.stroke)
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', viewConfig.strokeLinejoin)
      .attr('stroke-linecap', viewConfig.strokeLinecap)
    // 数据的值
    const repeatArr = [...new Array(8).keys()]
    console.log(viewConfig.renderData)
    // 绘制文字
    TOP_KEYS.map(({ getValue, name }, index) => {
      g.append('g')
        .selectAll('text')
        .data(repeatArr)
        .join('text')
        .attr('style', 'font-size:14px;text-anchor:middle;')
        .attr('class', 'mytext')
        .text((i) => {
          if (i == 0) {
            return name
          } else {
            return getValue(i - 1, viewConfig.renderData)
          }
        })
        .attr('x', (i) => i * viewConfig.step + viewConfig.step / 2)
        .attr('y', () => {
          return LINE_HEIGHT * (index + 1) - TEXT_MARGIN_BOTTOM
        })
    })
    // 绘制时间字段
    // 绘制汉字
    g.append('text')
      .attr('style', 'font-size:14px;text-anchor:middle;')
      .text('时 间')
      .attr('x', viewConfig.step / 2)
      .attr('y', viewConfig.topKeysPos - TEXT_MARGIN_BOTTOM)
    // 绘制竖线和时间汉字
    const data = new Array(timeNumber.length * 7)
      .fill('')
      .map((d, i) => timeNumber[i % timeNumber.length])
    g.append('g')
      .selectAll('text')
      .data(data)
      .join('text')
      .attr('style', 'font-size:14px')
      .attr('class', 'mytext')
      .attr('fill', (d) => {
        if (nightTime.includes(d)) {
          return 'red'
        } else {
          return viewConfig.stroke
        }
      })
      .text((d) => {
        return d
      })
      .attr('x', (d, i) => {
        return viewConfig.step + i * viewConfig.micoStep + 3
      })
      .attr('y', (d, i) => {
        return viewConfig.topKeysPos - TEXT_MARGIN_BOTTOM
      })
    // 线条
    g.append('g')
      .attr('class', 'textYPos')
      .selectAll('line')
      .data(data)
      .join('line')
      .attr('x1', (d, i) => {
        return viewConfig.step + i * viewConfig.micoStep
      })
      .attr('y1', viewConfig.topKeysPos - LINE_HEIGHT)
      .attr('x2', (d, i) => {
        return viewConfig.step + i * viewConfig.micoStep
      })
      .attr('y2', viewConfig.topKeysPos)
      .attr('fill', 'none')
      .attr('class', 'dataLine')
      .attr('stroke', viewConfig.stroke)
      .attr('stroke-width', (d, i) => {
        return i % 6 ? 1 : 0
      })
      .attr('stroke-linejoin', viewConfig.strokeLinejoin)
      .attr('stroke-linecap', viewConfig.strokeLinecap)
  }
  // 获取折线区域的高度
  // function utilsGetMicoPos (step, botpos) {
  //   const micoStep = (step * 7) / 42 // 折线小格子的宽度
  //   const verticalLength = bodyTemperature[1] - bodyTemperature[0] + 1 // 根据体温来计算格子
  //   const verticalHeight = micoStep * 5 * verticalLength
  //   return {
  //     micoStep,
  //     verticalHeight
  //   }
  // }
  // 绘制折线
  function brokenLine (svg, pathData) {
    const I = d3.map(pathData, (_, i) => i)
    const g = getG(svg, viewConfig)
    const line = d3
      .line()
      .defined((i) => pathData[i].value)
      .x((i) => {
        return xScale(pathData[i].index) + viewConfig.X_OFFSET
      })
      .y((i) => bodyScale(pathData[i].value))
    g.attr('class', 'body-line')
    getDrawPath({
      content: g,
      line: line(I.filter(i => pathData[i].value))
    })
  }
  // 绘制口温
  function drawPathBody (svg, pathData) {
    const g = getG(svg, viewConfig)
    g.on(
      'pointerenter pointermove',
      generatePointer({
        pathData,
        type: '口温',
        yScaleInstance: bodyScale
      })
    ).on('pointerleave', pointerleft)
    iconDrawObj.getDrawRoundIcon({
      content: g,
      data: d3.range(pathData.length),
      x: (i) => {
        return xScale(pathData[i].index) + viewConfig.X_OFFSET
      },
      y: (i) => bodyScale(pathData[i].value),
      r: 3
    })
  }
  // 绘制肛温
  function drawJuhua (svg, pathData) {
    const g = getG(svg, viewConfig)
    g.on(
      'pointerenter pointermove',
      generatePointer({
        pathData,
        type: '肛温',
        yScaleInstance: bodyScale
      })
    ).on('pointerleave', pointerleft)
    iconDrawObj.getDrawRoundDotIcon({
      content: g,
      data: d3.range(pathData.length),
      x: (i) => xScale(pathData[i].index) + viewConfig.X_OFFSET,
      y: (i) => bodyScale(pathData[i].value),
      fill: 'white',
      deepFill: 'blue',
      r: 3
    })
  }
  // 绘制 耳温
  function thermometer (svg, pathData) {
    const g = getG(svg, viewConfig)
    g.on(
      'pointerenter pointermove',
      generatePointer({
        pathData,
        type: '耳温',
        yScaleInstance: bodyScale
      })
    ).on('pointerleave', pointerleft)
    iconDrawObj.drawThreeIcon({
      content: g,
      data: d3.range(pathData.length),
      x: (i) => {
        return xScale(pathData[i].index) + viewConfig.X_OFFSET
      },
      y: (i) => {
        return bodyScale(pathData[i].value)
      },
      riangle: 24
    })
  }
  // 绘制脉搏
  function drawHeart (svg, pathData) {
    const I = d3.map(pathData, (_, i) => i)
    const g = getG(svg, viewConfig)
    g.on(
      'pointerenter pointermove',
      generatePointer({
        pathData: viewConfig.renderData.datasetPulse.flat(Infinity),
        type: '脉搏',
        yScaleInstance: heartScale
      })
    ).on('pointerleave', pointerleft)
    const line = d3
      .line()
      .defined((i) => pathData[i].value)
      .x((i) => {
        return xScale(pathData[i].index) + viewConfig.X_OFFSET
      })
      .y((i) => heartScale(pathData[i].value || 0))
    getDrawPath({
      content: g,
      line: line(I.filter(i => pathData[i].value)),
      stroke: 'red'
    })

    iconDrawObj.getDrawRoundIcon({
      content: g,
      data: d3.range(pathData.length),
      x: (i) => {
        return xScale(pathData[i].index) + viewConfig.X_OFFSET
      },
      y: (i) => {
        return heartScale(pathData[i].value)
      },
      fill: 'red',
      stroke: 'red'
    })
  }
  // 绘制心率
  function drawHeartRate (svg, pathData) {
    const I = d3.map(pathData, (_, i) => i)
    const g = getG(svg, viewConfig)
    g.on(
      'pointerenter pointermove',
      generatePointer({
        pathData: viewConfig.renderData.datasetHeartRate.flat(Infinity),
        type: '心率',
        yScaleInstance: heartScale
      })
    ).on('pointerleave', pointerleft)
    const line = d3
      .line()
      .defined((i) => pathData[i].value)
      .x((i) => {
        return xScale(pathData[i].index) + viewConfig.X_OFFSET
      })
      .y((i) => heartScale(pathData[i].value || 0))
    getDrawPath({
      content: g,
      line: line(I.filter(i => pathData[i].value)),
      stroke: 'red'
    })

    iconDrawObj.getDrawRoundIcon({
      content: g,
      data: d3.range(pathData.length),
      x: (i) => {
        return xScale(pathData[i].index) + viewConfig.X_OFFSET
      },
      y: (i) => {
        return heartScale(pathData[i].value)
      },
      fill: 'white',
      stroke: 'red'
    })
  }
  // 腋温
  function drawAnus (svg, pathData) {
    const g = getG(svg, viewConfig)
    g.on(
      'pointerenter pointermove',
      generatePointer({
        pathData,
        type: '腋温',
        yScaleInstance: bodyScale
      })
    ).on('pointerleave', pointerleft)
    iconDrawObj.getDrawXIcon({
      content: g,
      data: d3.range(pathData.length),
      x: (i) => {
        return xScale(pathData[i].index) + viewConfig.X_OFFSET
      },
      y: (i) => bodyScale(pathData[i].value ? pathData[i].value : 0)
    })
  }

  // 绘制一个线条
  function getDrawPath ({ content, line, stroke = 'blue' }) {
    content
      .append('path')
      .attr('class', 'mylines')
      .attr('fill', 'none')
      .attr('stroke', stroke)
      .attr('stroke-width', viewConfig.strokeWidth)
      .attr('stroke-linejoin', viewConfig.strokeLinejoin)
      .attr('stroke-linecap', viewConfig.strokeLinecap)
      .attr('d', line)
  }

  // 绘制降温的红圈和虚线
  function drawCoolBody (svg, coolData, allData) {
    const g = getG(svg, viewConfig)
    // 获取同个位置记录的温度
    const temArrMap = allData.reduce((data, items) => {
      items.map((item) => {
        if (item.value) {
          data[item.index] = item.value
        }
      })
      return data
    }, {})
    const vaildData = coolData.filter((item) => item.value)
    const lineData = vaildData.filter(
      ({ index, value }) => temArrMap[index] != value
    )
    g.append('g')
      .selectAll('line')
      .data(lineData)
      .join('line')
      .attr('class', 'xuxianliane')
      .attr('x1', function ({ index }) {
        return xScale(index) + viewConfig.X_OFFSET
      })
      .attr('y1', function ({ value }) {
        return bodyScale(value)
      })
      .attr('x2', function ({ index }) {
        return xScale(index) + viewConfig.X_OFFSET
      })
      .attr('y2', function ({ index }) {
        const bodyValue = temArrMap[index]
        console.log(bodyValue, index, 'bodyValue', bodyScale(bodyValue))
        return bodyScale(bodyValue)
      })

      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .style('stroke-dasharray', '3, 3')
      .attr('stroke-linejoin', viewConfig.strokeLinejoin)
      .attr('stroke-linecap', viewConfig.strokeLinecap)
    // 绘制icon
    iconDrawObj.getDrawRoundIcon({
      content: g,
      data: d3.range(vaildData.length),
      x: (i) => {
        return xScale(vaildData[i].index) + viewConfig.X_OFFSET
      },
      y: (i) => {
        return bodyScale(vaildData[i].value)
      },
      fill: 'transparent',
      stroke: 'red',
      r: 6
    })
  }
  // 绘制表格区域外面的信息数据
  function drwaOtherInfo (svg, data) {
    console.log(data, 'data')
    const g = svg
      .append('g')
      .attr(
        'transform',
        `translate(${viewConfig.marginLeft},${viewConfig.marginTop})`
      )
      .attr('style', 'font-size:14px;')
    // 绘制第几周
    getG(svg, viewConfig)
      .append('text')
      .attr('style', 'font-size:24px;')
      .attr('class', 'mytext')
      .text(`第${+data.weekNo + 1}周`)
      .attr('x', viewConfig.width / 2 - 40)
      .attr('y', viewConfig.bottomPos + TEXT_MARGIN_BOTTOM + 1.5 * LINE_HEIGHT)
    // 绘制标注
    getG(svg, viewConfig)
      .attr(
        'transform',
        `translate(${viewConfig.marginLeft},${
          viewConfig.bottomPos + viewConfig.marginTop + HEAD_HEIGHT
        })`
      )
      .attr('style', 'font-size:14px;')
      .call((g) => {
        const dataList = [
          {
            name: '口温',
            fn: iconDrawObj.getDrawRoundIcon,
            params: {
              content: g,
              data: [0]
            }
          },
          {
            name: '腋温',
            fn: iconDrawObj.getDrawXIcon,
            params: {
              content: g,
              data: [0]
            }
          },
          {
            name: '肛温',
            fn: iconDrawObj.getDrawRoundDotIcon,
            params: {
              content: g,
              data: [0]
            }
          },
          {
            name: '耳温',
            fn: iconDrawObj.drawThreeIcon,
            params: {
              content: g,
              data: [0]
            }
          },
          {
            name: '心率',
            fn: iconDrawObj.getDrawRoundIcon,
            params: {
              content: g,
              data: [0],
              fill: 'white',
              stroke: 'red'
            }
          },
          {
            name: '脉搏',
            fn: iconDrawObj.getDrawRoundIcon,
            params: {
              content: g,
              data: [0],
              fill: 'red',
              stroke: 'red'
            }
          }
        ]
        g.append('text').text('标注：')
        dataList.map((item, i) => {
          g.append('text')
            .text(item.name)
            .attr('x', 40 + i * 80)
          item.fn({
            ...item.params,
            x: () => 80 + i * 80,
            y: () => -4
          })
        })
      })
      .attr('x', viewConfig.width / 2 - 40)
      .attr('y', viewConfig.bottomPos + TEXT_MARGIN_BOTTOM)
    // 绘制顶部的信息数据
    g.append('text')
      .attr('class', 'mytext')
      .attr('x', 0)
      .attr('y', () => {
        return HEAD_HEIGHT - TEXT_MARGIN_BOTTOM - 6
      })
      .html(() => {
        return INFO_KEYS.map(({ name, key }, index) => {
          return `<tspan dx="${index === 0 ? 0 : 20}" dy="${0}">${name}: ${
            data[key] ? data[key] : ''
          }</tspan>`
        }).join('')
      })
    // 绘制标题
    g.append('text')
      .attr('style', 'font-size:26px;text-anchor: middle;')
      .attr('class', 'mytext')
      .attr('x', viewConfig.width / 2)
      .attr('y', () => {
        return HEAD_HEIGHT - 4 * LINE_HEIGHT
      })
      .text(viewConfig.renderData.title)
    // 体温单
    g.append('text')
      .attr('style', 'font-size:22px;text-anchor: middle;')
      .attr('class', 'mytext')
      .attr('x', viewConfig.width / 2)
      .attr('y', () => {
        return HEAD_HEIGHT - 2 * LINE_HEIGHT
      })
      .text('体温单')
  }

  function generatePointer ({ pathData, type, yScaleInstance }) {
    return (event) => {
      var index = Math.round(
        (d3.pointer(event)[0] - viewConfig.step - textLeftMargin) /
          xScale.step()
      )
      var val = xScale.domain()[index]
      const i = d3.bisectCenter(d3.range(pathData.length), val)
      const yPos = yScaleInstance(+pathData[i].value) + viewConfig.marginTop + HEAD_HEIGHT
      console.log(`translate(${xScale(i)},${yPos})`)
      tooltip.style('display', null)
      tooltip.attr('class', 'myTooltip')
      tooltip.attr(
        'transform',
        `translate(${xScale(i) + viewConfig.micoStep},${yPos})`
      )

      const path = tooltip
        .selectAll('path')
        .data(['', ''])
        .join('path')
        .attr('fill', 'white')
        .attr('stroke', 'black')

      const text = tooltip
        .selectAll('text')
        .data(['', ''])
        .join('text')
        .call((text) =>
          text
            .selectAll('tspan')
            .data([`${type}: ${pathData[i].value}`, `${pathData[i].date}`])
            .join('tspan')
            .attr('x', 0)
            .attr('y', (_, i) => `${i * 1.2}em`)
            .attr('font-weight', (_, i) => (i ? null : 'bold'))
            .text((d) => d)
        )

      const { y, width: w, height: h } = text.node().getBBox()
      text.attr('transform', `translate(${-w / 2},${15 - y})`)
      path.attr(
        'd',
        `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`
      )
    }
  }

  function pointerleft () {
    tooltip.style('display', 'none')
  }
}
function getTypeValue (type, allData = [], isNumber = true) {
  return allData.filter(item => item.typeCode == type || null)
}
