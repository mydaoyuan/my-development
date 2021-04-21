export function getKeyMap () {
  const neworold = 1
  const selectMap = {
    '001': '呼吸',
    '002': '脉搏',
    '003': '体温',
    '004': '小便',
    '005': '大便',
    '007': '腹围',
    '008': '血压',
    '009': '体重',
    '012': '特殊标记',
    '013': '标记内容',
    '014': '心率',
    '015': '物理降温',
    '016': '宝宝体重',
    '017': '母乳摄入',
    '018': '人工摄入',
    '019': '混合摄入',
    '020': '糖水摄入',
    '021': '其它摄入',
    '022': '皮肤',
    '023': '眼睛',
    '024': '口腔',
    '025': '脐带',
    '026': '大便颜色',
    '027': '大便性质',
    '028': '小便出量',
    '029': '呕吐次数',
    '030': '身高'
  }
  if (neworold === 2) {
    selectMap['006'] = '入水量'
    selectMap['010'] = '皮试'
    selectMap['011'] = '其他出量'
  } else {
    selectMap['006'] = '入水量'
    // selectMap['006'] = '总入量'
    selectMap['010'] = '药物过敏'
    selectMap['011'] = '出水量'
  }
  return selectMap
}

export function SectionToChinese (section) {
  if (!section) return ''
  var chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  var chnUnitChar = ['', '十', '百', '千', '万', '亿', '万亿', '亿亿']
  var strIns = ''
  var chnStr = ''
  var unitPos = 0
  var zero = true
  while (section > 0) {
    var v = section % 10
    if (v === 0) {
      if (!zero) {
        zero = true
        chnStr = chnNumChar[v] + chnStr
      }
    } else {
      zero = false
      strIns = chnNumChar[v]
      strIns += chnUnitChar[unitPos]
      chnStr = strIns + chnStr
    }
    unitPos++
    section = Math.floor(section / 10)
  }
  return chnStr
}

export function getOS () {
  if (navigator.userAgent.indexOf('Window') > 0) {
    return 'windows'
  } else if (navigator.userAgent.indexOf('Mac OS X') > 0) {
    return 'mac '
  } else if (navigator.userAgent.indexOf('Linux') > 0) {
    return 'linux'
  } else {
    return ''
  }
}
