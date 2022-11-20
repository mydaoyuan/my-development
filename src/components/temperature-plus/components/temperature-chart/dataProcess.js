// 用于处理数据相关函数
// {
// date: "2022-03-02"
// index: 0
// value: 36
// }
export function getMaxList ({
  list = [],
  max = 0,
  min = 0,
  maxDefault = 0,
  minDefault = 0
} = {}) {
  return list.map(item => {
    if (((item.value > max) || (item.value < min)) && item.value !== null) {
      const ismax = item.value > max
      return {
        ...item,
        value: ismax ? maxDefault : minDefault,
        sourceValue: item.value,
        ismax: ismax,
        max,
        min
      }
    } else {
      return null
    }
  })
}

export function levelingData ({
  list = [],
  maxDefault = 0,
  minDefault = 0
}) {
  return list.map(item => {
    if (item.value === null) return item
    if (item.value > maxDefault) {
      item.value = maxDefault
    } else if (item.value < minDefault) {
      item.value = minDefault
    }
    return item
  })
}
