export function getG (svg, translateX, translateY) {
  return svg
    .append('g')
    .attr('transform', `translate(${translateX},${translateY})`)
}

// function generatePointer ({ pathData, type, yScaleInstance }) {
//   return (event) => {
//     var index = Math.round(
//       (d3.pointer(event)[0] - step - textLeftMargin) / xScale.step()
//     )
//     var val = xScale.domain()[index]
//     const i = d3.bisectCenter(d3.range(pathData.length), val)
//     console.log(val, index, '=====', pathData[i], 'pathData[i]')
//     const yPos = yScaleInstance(pathData[i].value) + marginTop + HEAD_HEIGHT
//     console.log(`translate(${xScale(i)},${yPos})`)
//     tooltip.style('display', null)
//     tooltip.attr('class', 'myTooltip')
//     tooltip.attr('transform', `translate(${xScale(i) + micoStep},${yPos})`)

//     const path = tooltip
//       .selectAll('path')
//       .data(['', ''])
//       .join('path')
//       .attr('fill', 'white')
//       .attr('stroke', 'black')

//     const text = tooltip
//       .selectAll('text')
//       .data(['', ''])
//       .join('text')
//       .call((text) =>
//         text
//           .selectAll('tspan')
//           .data([`${type}: ${pathData[i].value}`, `${pathData[i].date}`])
//           .join('tspan')
//           .attr('x', 0)
//           .attr('y', (_, i) => `${i * 1.2}em`)
//           .attr('font-weight', (_, i) => (i ? null : 'bold'))
//           .text((d) => d)
//       )

//     const { x, y, width: w, height: h } = text.node().getBBox()
//     text.attr('transform', `translate(${-w / 2},${15 - y})`)
//     path.attr(
//       'd',
//       `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`
//     )
//   }
// }
export function getTypeData (type, allData = [], isNumber = true) {
  return allData
    .map((rowBOSItem, index) => {
      const rowBOS = rowBOSItem.rowBOS
      const cur =
        rowBOS.find((item) => {
          return item.typeCode === type
        }) || {}
      return {
        index: index,
        date: cur.date,
        value: (isNumber ? +cur.typeValue : cur.typeValue) || null
      }
    })
    .map((item) => {
      if (item.value) {
        // item.value = NaN
      }
      return item
    })
}
// 获取不升
export function getType (type, allData = []) {
  return allData
    .map((rowBOSItem, index) => {
      const rowBOS = rowBOSItem.rowBOS
      const cur =
        rowBOS.find((item) => {
          return item.typeCode === type
        }) || {}
      return {
        index: index,
        date: cur.date,
        value: cur.typeValue === '不升' ? cur.typeValue : null || null
      }
    })
    .map((item) => {
      if (item.value) {
        // item.value = NaN
      }
      return item
    })
}
// 合并标记内容
export function setMergeTag (ymbolTextArr = [], symbolContent = []) {
  const arr = []
  ymbolTextArr.forEach(item => {
    symbolContent.forEach(res => {
      if (item.index === res.index) {
        arr.push({ ...item, ...res, value: item.value ? (item.value ? item.value : '') + (res.value ? res.value : '') : '' })
      }
    })
  })
  return arr
};
// 筛选手术产后日数
export function postpartumDays (type, arr) {
  return arr.filter(item => item.typeCode === type).map(i => i.typeValue)
};
// 筛选体温
export function getTypeAnimalHeat (type, allData = [], code) {
  return allData
    .map((rowBOSItem, index) => {
      const rowBOS = rowBOSItem.rowBOS
      const cur =
        rowBOS.find((item) => {
          return item.typeCode === type
        }) || {}
      return {
        index: index,
        date: cur.date,
        value: (+cur.collectionMode === +code ? +cur.typeValue : null) || null
      }
    })
    .map((item) => {
      if (item.value) {
        // item.value = NaN
      }
      return item
    })
}
// 设置折线
export function getBrokenLine (type, allData = [], arr = [], list = [], topList = []) {
  const result = []
  const getList = allData
    .map((rowBOSItem, index) => {
      const rowBOS = rowBOSItem.rowBOS
      const cur =
          rowBOS.find((item) => {
            return item.typeCode === type
          }) || {}
      return {
        index: index,
        date: cur.date,
        value: +cur.typeValue
      }
    })
    .map((item) => {
      if (item.value) {
        // item.value = NaN
      }
      return item
    })
  const _a = arr.filter(item => item.value)
  const _b = list.filter(item => item.value)
  const _c = topList.filter(item => item.value)
  const mergingData = [..._a, ..._b, ..._c, { index: 42 }].sort((a, b) => a.index - b.index)
  let start = 0
  mergingData.forEach(item => {
    const _p = getList.slice(start, item.index)
    start = item.index
    result.push(_p)
  })
  return result
}
// 处理脉搏心率
export function getHeartRate (type, allData = [], arr = [], topList = [], isNumber = true) {
  const result = []
  const getList = allData
    .map((rowBOSItem, index) => {
      const rowBOS = rowBOSItem.rowBOS
      const cur =
          rowBOS.find((item) => {
            return item.typeCode === type
          }) || {}
      return {
        index: index,
        date: cur.date,
        value: (isNumber ? +cur.typeValue : cur.typeValue) || null
      }
    })
    .map((item) => {
      if (item.value) {
        // item.value = NaN
      }
      return item
    })
  const _a = arr.filter(item => item.value)
  const _c = topList.filter(item => item.value)
  const mergingData = [..._a, ..._c, { index: 42 }].sort((a, b) => a.index - b.index)
  let start = 0
  mergingData.forEach(item => {
    const _p = getList.slice(start, item.index)
    start = item.index
    result.push(_p)
  })
  return result
}
// 筛选35和40~42数据
export function degreesOnline (allData, data, type) {
  const arr = allData.map((item, index) => {
    const cur = data?.find(res => item.value === res.name && +res.isShowPlace === type) || null
    return {
      index: index,
      date: item.date,
      value: cur?.name || null
    }
  })
  return arr
}
// 35或42上断开的事件
export function disconnectEvents (allData, data, code, type) {
  const arr = allData.map((item, index) => {
    const cur = data?.find(res => item.value === res.name && +res.isShowPlace === type && +res[code] === 1) || null
    return {
      index: index,
      date: item.date,
      value: cur?.name || null
    }
  })
  return arr
}
