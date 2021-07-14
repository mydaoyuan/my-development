/* eslint-disable */
// import { getGraph } from 'api'
var width = window.innerWidth
var height = window.innerHeight - 40
var root = {}
var svg
var container
var zoom
var branchNodes = []
var branchLinks = []
var branchExtend = false

var investNodes = []
var investLinks = []
var investExtend = false

var hoperNodes = []
var hoperLinks = []
var hoperExtend = false

var hstockNodes = []
var hstockLinks = []
var hstockExtend = false

var employNodes = []
var employLinks = []
var employExtend = false

var stockNodes = []
var stockLinks = []
var stockExtend = false

var translateX = 0
var translateY = 0

var centerPointX
var centerPointY
var gMinY = 0
var gMaxY = 0

var offsetWidth = 100

var isIE = !!window.ActiveXObject || 'ActiveXObject' in window

function start(data) {
  resizeScreen()
  root = data
  branchNodes = data.branch || [] // 分支机构
  investNodes = data.invest  || [] // 投资
  hoperNodes = data.historyOpers || [] // 历史法人
  hstockNodes = data.historyShareholder || [] // 历史股东
  employNodes = data.employ || []  // 高管
  stockNodes = data.stock || [] // 股东
  initNodes()
  draw()
}

window.onresize = function() {
  resizeScreen()
}


function initNodes() {
  var startX = width / 2
  var startY = height / 2

  var name = root.Name
  var lines = Math.ceil(name.length / 20)
  var blockWidth = 280
  if (lines < 2) {
    blockWidth = 32 + getLength(name) * 6
    offsetWidth = (blockWidth - 80) / 2
  }

  for (var i = 0; i < branchNodes.length; i++) {
    branchNodes[i].x = startX + 220 + offsetWidth
    branchNodes[i].y = startY - 14 + i * 38

    branchLinks.push({
      source: { x: branchNodes[i].x - 25, y: branchNodes[i].y + 14 },
      target: { x: branchNodes[i].x, y: branchNodes[i].y + 14 }
    })

    if (branchNodes[i].y - startY > gMaxY) {
      gMaxY = branchNodes[i].y - startY
    }
  }
  if (branchNodes.length > 0) {
    branchLinks.push({
      source: { x: startX + 170 + offsetWidth, y: startY },
      target: { x: startX + 195 + offsetWidth, y: startY }
    })
    branchLinks.push({
      source: { x: startX + 195 + offsetWidth, y: startY },
      target: {
        x: startX + 195 + offsetWidth,
        y: branchNodes[branchNodes.length - 1].y + 14
      }
    })
  }

  for (let i = 0; i < investNodes.length; i++) {
    investNodes[i].x = startX + 220 + offsetWidth
    investNodes[i].y = startY - 85 - i * 38

    var min = investNodes[i].y
    if (min < translateY) {
      translateY = min
    }

    investLinks.push({
      source: { x: investNodes[i].x - 25, y: investNodes[i].y + 14 },
      target: { x: investNodes[i].x, y: investNodes[i].y + 14 }
    })
    if (investNodes[i].y - startY < gMinY) {
      gMinY = investNodes[i].y - startY
    }
  }
  if (investNodes.length > 0) {
    investLinks.push({
      source: { x: startX + 170 + offsetWidth, y: startY - 71 },
      target: { x: startX + 195 + offsetWidth, y: startY - 71 }
    })
    investLinks.push({
      source: { x: startX + 195 + offsetWidth, y: startY - 71 },
      target: {
        x: startX + 195 + offsetWidth,
        y: investNodes[investNodes.length - 1].y + 14
      }
    })
  }

  var hperY = 0
  for (let i = 0; i < hoperNodes.length; i++) {
    hoperNodes[i].x = startX + 100 + offsetWidth

    if (i == 0) {
      hoperNodes[i].y = startY + 90
    } else {
      let lines = Math.ceil(hoperNodes[i - 1].OperName.length / 6)
      hperY += 22 + 16 * lines
      hoperNodes[i].y = startY + 90 + hperY
    }

    hoperLinks.push({
      source: { x: hoperNodes[i].x - 20, y: hoperNodes[i].y + 14 },
      target: { x: hoperNodes[i].x, y: hoperNodes[i].y + 14 }
    })

    if (hoperNodes[i].y - startY > gMaxY) {
      gMaxY = hoperNodes[i].y - startY
    }
  }
  if (hoperNodes.length > 0) {
    hoperLinks.push({
      source: { x: startX + 80 + offsetWidth, y: startY + 80 },
      target: {
        x: startX + 80 + offsetWidth,
        y: hoperNodes[hoperNodes.length - 1].y + 14
      }
    })
  }

  var hstockY = 0
  for (let i = 0; i < hstockNodes.length; i++) {
    hstockNodes[i].x = startX - 150 - offsetWidth

    if (i == 0) {
      hstockNodes[i].y = startY + 90
    } else {
      let lines = Math.ceil(hstockNodes[i - 1].PartnerName.length / 16)
      hstockY += 22 + 16 * lines
      hstockNodes[i].y = startY + 90 + hstockY
    }

    hstockLinks.push({
      source: { x: hstockNodes[i].x - 20, y: hstockNodes[i].y + 14 },
      target: { x: hstockNodes[i].x, y: hstockNodes[i].y + 14 }
    })

    if (hstockNodes[i].y - startY > gMaxY) {
      gMaxY = hstockNodes[i].y - startY
    }
  }
  if (hstockNodes.length > 0) {
    hstockLinks.push({
      source: { x: startX - 170 - offsetWidth, y: startY + 80 },
      target: {
        x: startX - 170 - offsetWidth,
        y: hstockNodes[hstockNodes.length - 1].y + 14
      }
    })
  }

  for (let i = 0; i < employNodes.length; i++) {
    employNodes[i].x = startX - 220 - offsetWidth
    employNodes[i].y = startY - 14 + i * 38

    var minX = translateX
    if (employNodes[i].Name) {
      if (employNodes[i].Job) {
        minX =
          employNodes[i].x -
          40 -
          employNodes[i].Name.length * 12 -
          employNodes[i].Job.length * 12
      } else {
        minX = employNodes[i].x - 30 - employNodes[i].Name.length * 12
      }
    } else {
      minX = employNodes[i].x - 90
    }

    if (minX < translateX) {
      translateX = minX
    }

    employLinks.push({
      source: { x: employNodes[i].x + 25, y: employNodes[i].y + 14 },
      target: { x: employNodes[i].x, y: employNodes[i].y + 14 }
    })

    if (employNodes[i].y - startY > gMaxY) {
      gMaxY = employNodes[i].y - startY
    }
  }
  if (employNodes.length > 0) {
    employLinks.push({
      source: { x: startX - 170 - offsetWidth, y: startY },
      target: { x: startX - 195 - offsetWidth, y: startY }
    })
    employLinks.push({
      source: { x: startX - 195 - offsetWidth, y: startY },
      target: {
        x: startX - 195 - offsetWidth,
        y: employNodes[employNodes.length - 1].y + 14
      }
    })
  }

  for (let i = 0; i < stockNodes.length; i++) {
    stockNodes[i].x = startX - 220 - offsetWidth
    stockNodes[i].y = startY - 85 - i * 38

    let minX = translateX
    if (stockNodes[i].Name) {
      if (stockNodes[i].Percent) {
        minX =
          stockNodes[i].x -
          40 -
          stockNodes[i].Name.length * 12 -
          stockNodes[i].Percent.length * 12
      } else {
        minX = stockNodes[i].x - 30 - stockNodes[i].Name.length * 12
      }
    } else {
      minX = stockNodes[i].x - 90
    }

    if (minX < translateX) {
      translateX = minX
    }

    let min = stockNodes[i].y
    if (min < translateY) {
      translateY = min
    }

    stockLinks.push({
      source: { x: stockNodes[i].x + 25, y: stockNodes[i].y + 14 },
      target: { x: stockNodes[i].x, y: stockNodes[i].y + 14 }
    })

    if (stockNodes[i].y - startY < gMinY) {
      gMinY = stockNodes[i].y - startY
    }
  }
  if (stockNodes.length > 0) {
    stockLinks.push({
      source: { x: startX - 170 - offsetWidth, y: startY - 71 },
      target: { x: startX - 195 - offsetWidth, y: startY - 71 }
    })
    stockLinks.push({
      source: { x: startX - 195 - offsetWidth, y: startY - 71 },
      target: {
        x: startX - 195 - offsetWidth,
        y: stockNodes[stockNodes.length - 1].y + 14
      }
    })
  }
}

function draw() {
  svg = window.d3.select('svg')

  zoom = window.d3
    .zoom()
    .scaleExtent([0.4, 2])
    .on('zoom', zoomed)
  if (document.getElementsByTagName('svg')[0]) {
    document.getElementsByTagName('svg')[0].innerHTML = ''
  }
  svg.attr('width', width)
  svg.attr('height', height)

  svg
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .call(zoom)

  container = svg.append('g')

  drawRoot()

  drawArrow()

  drawButton()

  drawBranches()

  drawInvest()

  drawHoper()

  drawHstock()

  drawEmploy()

  drawStock()

  function zoomed() {
    container.attr('transform', window.d3.event.transform)
  }
}

function drawRoot() {
  var g = container.append('g')
  var name = root.Name
  var lines = Math.ceil(name.length / 20)
  var blockWidth = 280
  if (lines < 2) {
    blockWidth = 32 + getLength(name) * 6
    offsetWidth = (blockWidth - 80) / 2
  }
  var blockHeight = lines * 15 + 20
  g.append('rect')
    .style('fill', '#128bed')
    .transition()
    .duration(500)
    .attr('width', blockWidth)
    .attr('height', blockHeight)
    .style('opacity', 0.73)
    .attr('rx', 4)
    .attr('ry', 4)

  for (var i = 0; i < lines; i++) {
    g.append('text')
      .attr('x', 10)
      .attr('y', 20 + 15 * i)
      .text(name.substr(i * 20, 20))
      .style('fill', '#ffffff')
      .style('font-size', '13px')
  }
  centerPointX = width / 2 - blockWidth / 2
  centerPointY = height / 2 - blockHeight / 2
  g.attr('transform', 'translate(' + centerPointX + ',+' + centerPointY + ')')
}

function drawArrow() {
  var branchArrow = container.append('g')
  branchArrow
    .append('polygon')
    .attr('points', '0,0 15,0 15,-4.25 20.5,1 15,6.25 15,2 0,2')
    .style('fill', '#128bed')
    .style('opacity', 0.73)
    .attr(
      'transform',
      'translate(' + (width / 2 + 50 + offsetWidth) + ',' + height / 2 + ')'
    )

  var employArrow = container.append('g')
  employArrow
    .append('polygon')
    .attr('points', '0,0 15,0 15,-4.25 20.5,1 15,6.25 15,2 0,2')
    .style('fill', '#128bed')
    .style('opacity', 0.73)
    .attr(
      'transform',
      'translate(' +
        (width / 2 - 50 - 20.5 - offsetWidth) +
        ',' +
        height / 2 +
        ')'
    )

  var investArrow = container.append('g')
  investArrow
    .append('polygon')
    .attr('points', '0,0 15,0 15,-4.25 20.5,1 15,6.25 15,2 0,2')
    .style('fill', '#128bed')
    .style('opacity', 0.73)
    .attr(
      'transform',
      'translate(' +
        (width / 2 + 50 + offsetWidth) +
        ',' +
        (height / 2 - 40) +
        '),rotate(-30)'
    )

  var hOperArrow = container.append('g')
  hOperArrow
    .append('polygon')
    .attr('points', '0,0 15,0 15,-4.25 20.5,1 15,6.25 15,2 0,2')
    .style('fill', '#128bed')
    .style('opacity', 0.73)
    .attr(
      'transform',
      'translate(' +
        (width / 2 + 68 + offsetWidth) +
        ',' +
        (height / 2 + 50) +
        '),rotate(-150)'
    )

  var stockArrow = container.append('g')
  stockArrow
    .append('polygon')
    .attr('points', '0,0 15,0 15,-4.25 20.5,1 15,6.25 15,2 0,2')
    .style('fill', '#128bed')
    .style('opacity', 0.73)
    .attr(
      'transform',
      'translate(' +
        (width / 2 - 50 - 20.5 - offsetWidth) +
        ',' +
        (height / 2 - 50) +
        '),rotate(30)'
    )

  var hstockArrow = container.append('g')
  hstockArrow
    .append('polygon')
    .attr('points', '0,0 15,0 15,-4.25 20.5,1 15,6.25 15,2 0,2')
    .style('fill', '#128bed')
    .style('opacity', 0.73)
    .attr(
      'transform',
      'translate(' +
        (width / 2 - 50 - 20.5 - offsetWidth) +
        ',' +
        (height / 2 + 50) +
        '),rotate(-30)'
    )
}

function drawButton() {
  var branchButton = container
    .append('g')
    .attr(
      'transform',
      'translate(' +
        (width / 2 + 80 + offsetWidth) +
        ',' +
        (height / 2 - 15.5) +
        ')'
    )
    .on('click', function() {
      branchExtend = !branchExtend
      drawBranches()
    })
  branchButton
    .append('rect')
    .attr('width', 90)
    .attr('height', 33)
    .style('fill', '#EECB5F')
    .style('opacity', 0.2)
    .attr('rx', 4)
    .attr('ry', 4)

  if (branchNodes.length > 0) {
    branchExtend = true
    branchButton
      .append('circle')
      .attr('cx', 12)
      .attr('cy', 16)
      .attr('r', 6)
      .attr('fill', 'none')
      .attr('stroke', '#666666')
      .attr('stroke-width', '0.5')

    branchButton
      .append('path')
      .attr('id', 'branch-path')
      .attr('d', 'M7 15 H17 V17 H7 Z')
      .attr('fill', '#666666')
  }

  branchButton
    .append('text')
    .attr('x', 25)
    .attr('y', 20)
    .text('分支机构')
    .attr('fill', '#333333')
    .style('font-weight', 'bold')
    .style('font-size', '12px')

  var investButton = container
    .append('g')
    .attr(
      'transform',
      'translate(' +
        (width / 2 + 80 + offsetWidth) +
        ',' +
        (height / 2 - 85) +
        ')'
    )
    .on('click', function() {
      investExtend = !investExtend
      drawInvest()
    })
  investButton
    .append('rect')
    .attr('width', 90)
    .attr('height', 33)
    .style('fill', '#9E77F2')
    .style('opacity', 0.2)
    .attr('rx', 4)
    .attr('ry', 4)

  if (investNodes.length > 0) {
    investExtend = true
    investButton
      .append('circle')
      .attr('cx', 12)
      .attr('cy', 16)
      .attr('r', 6)
      .attr('fill', 'none')
      .attr('stroke', '#666666')
      .attr('stroke-width', '0.5')

    investButton
      .append('path')
      .attr('id', 'invest-path')
      .attr('d', 'M7 15 H11 V11 H13 V15 H17 V17 H13 V21 H11 V17 H7 Z')
      .attr('fill', '#666666')
  }

  investButton
    .append('text')
    .attr('x', 25)
    .attr('y', 20)
    .text('对外投资')
    .attr('fill', '#333333')
    .style('font-weight', 'bold')
    .style('font-size', '12px')

  var hoperButton = container
    .append('g')
    .attr(
      'transform',
      'translate(' +
        (width / 2 + 80 + offsetWidth) +
        ',' +
        (height / 2 + 50) +
        ')'
    )
    .on('click', function() {
      hoperExtend = !hoperExtend
      drawHoper()
    })
  hoperButton
    .append('rect')
    .attr('width', 90)
    .attr('height', 33)
    .style('fill', '#ED6D5C')
    .style('opacity', 0.2)
    .attr('rx', 4)
    .attr('ry', 4)

  if (hoperNodes.length > 0) {
    hoperExtend = true
    hoperButton
      .append('circle')
      .attr('cx', 12)
      .attr('cy', 16)
      .attr('r', 6)
      .attr('fill', 'none')
      .attr('stroke', '#666666')
      .attr('stroke-width', '0.5')

    hoperButton
      .append('path')
      .attr('id', 'hoper-path')
      .attr('d', 'M7 15 H11 V11 H13 V15 H17 V17 H13 V21 H11 V17 H7 Z')
      .attr('fill', '#666666')
  }

  hoperButton
    .append('text')
    .attr('x', 25)
    .attr('y', 20)
    .text('历史法人')
    .style('font-weight', 'bold')
    .attr('fill', '#333333')
    .style('font-size', '12px')

  var hstockButton = container
    .append('g')
    .attr(
      'transform',
      'translate(' +
        (width / 2 - 170 - offsetWidth) +
        ',' +
        (height / 2 + 50) +
        ')'
    )
    .on('click', function() {
      hstockExtend = !hstockExtend
      drawHstock()
    })
  hstockButton
    .append('rect')
    .attr('width', 90)
    .attr('height', 33)
    .style('fill', '#ED6D5C')
    .style('opacity', 0.2)
    .attr('rx', 4)
    .attr('ry', 4)

  if (hstockNodes.length > 0) {
    hstockExtend = true
    hstockButton
      .append('circle')
      .attr('cx', 12)
      .attr('cy', 16)
      .attr('r', 6)
      .attr('fill', 'none')
      .attr('stroke', '#666666')
      .attr('stroke-width', '0.5')

    hstockButton
      .append('path')
      .attr('id', 'hstock-path')
      .attr('d', 'M7 15 H11 V11 H13 V15 H17 V17 H13 V21 H11 V17 H7 Z')
      .attr('fill', '#666666')
  }

  hstockButton
    .append('text')
    .attr('x', 25)
    .attr('y', 20)
    .text('历史股东')
    .attr('fill', '#333333')
    .style('font-weight', 'bold')
    .style('font-size', '12px')

  var employButton = container
    .append('g')
    .attr(
      'transform',
      'translate(' +
        (width / 2 - 170 - offsetWidth) +
        ',' +
        (height / 2 - 15.5) +
        ')'
    )
    .on('click', function() {
      employExtend = !employExtend
      drawEmploy()
    })
  employButton
    .append('rect')
    .attr('width', 90)
    .attr('height', 33)
    .style('fill', '#67AEF5')
    .style('opacity', 0.2)
    .attr('rx', 4)
    .attr('ry', 4)

  if (employNodes.length > 0) {
    employExtend = true
    employButton
      .append('circle')
      .attr('cx', 12)
      .attr('cy', 16)
      .attr('r', 6)
      .attr('fill', 'none')
      .attr('stroke', '#666666')
      .attr('stroke-width', '0.5')

    employButton
      .append('path')
      .attr('id', 'employ-path')
      .attr('d', 'M7 15 H11 V11 H13 V15 H17 V17 H13 V21 H11 V17 H7 Z')
      .attr('fill', '#666666')
  }

  employButton
    .append('text')
    .attr('x', 25)
    .attr('y', 20)
    .text('高管')
    .attr('fill', '#333333')
    .style('font-weight', 'bold')
    .style('font-size', '12px')

  var stockButton = container
    .append('g')
    .attr(
      'transform',
      'translate(' +
        (width / 2 - 170 - offsetWidth) +
        ',' +
        (height / 2 - 85) +
        ')'
    )
    .on('click', function() {
      stockExtend = !stockExtend
      drawStock()
    })
  stockButton
    .append('rect')
    .attr('width', 90)
    .attr('height', 33)
    .style('fill', '#84DB56')
    .style('opacity', 0.2)
    .attr('rx', 4)
    .attr('ry', 4)

  if (stockNodes.length > 0) {
    stockExtend = true
    stockButton
      .append('circle')
      .attr('cx', 12)
      .attr('cy', 16)
      .attr('r', 6)
      .attr('fill', 'none')
      .attr('stroke', '#666666')
      .attr('stroke-width', '0.5')

    stockButton
      .append('path')
      .attr('id', 'stock-path')
      .attr('d', 'M7 15 H17 V17 H7 Z')
      .attr('fill', '#666666')
  }

  stockButton
    .append('text')
    .attr('x', 25)
    .attr('y', 20)
    .text('股东')
    .attr('fill', '#333333')
    .style('font-weight', 'bold')
    .style('font-size', '12px')
}

function drawBranches() {
  var nodes = []
  var links = []

  if (branchExtend) {
    nodes = branchNodes
    links = branchLinks
    window.d3.select('#branch-path').attr('d', 'M7 15 H17 V17 H7 Z')
  } else {
    nodes = []
    links = []
    window.d3
      .select('#branch-path')
      .attr('d', 'M7 15 H11 V11 H13 V15 H17 V17 H13 V21 H11 V17 H7 Z')
  }

  var branchContainer = container.selectAll('.branch-node').data(nodes)

  var enterNodes = branchContainer.enter()
  var exitNodes = branchContainer.exit()

  var enterNodeContainer = enterNodes
    .append('g')
    .attr('class', 'branch-node')
    .attr('transform', function(d) {
      return (
        'translate(' +
        (width / 2 + 80 + offsetWidth) +
        ',' +
        (height / 2 - 15.5) +
        ')'
      )
    })

  enterNodeContainer.on('click', function(d) {
    if (d.KeyNo) {
      showDetail(d.KeyNo, 'company_businessmap')
    }
  })
  enterNodeContainer
    .append('rect')
    .attr('width', function(d) {
      if (d.Name) {
        return 30 + getLength(d.Name) * 6
      }
      return 90
    })
    .attr('height', 28)
    .style('fill', '#EECB5F')
    .style('opacity', 0)
    .attr('rx', 4)
    .attr('ry', 4)

  enterNodeContainer
    .append('text')
    .attr('x', 15)
    .attr('y', 18)
    .text(function(d) {
      return d.Name
    })
    .attr('fill', '#333333')
    .style('font-size', '12px')
    .style('opacity', 0)

  var enterNodesTransition = enterNodeContainer
    .transition()
    .duration(500)
    .attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })

  enterNodesTransition.select('rect').style('opacity', 0.2)
  enterNodesTransition.select('text').style('opacity', 1)

  var exitNodesTransition = exitNodes
    .transition()
    .duration(500)
    .attr('transform', function(d) {
      return (
        'translate(' +
        (width / 2 + 80 + offsetWidth) +
        ',' +
        (height / 2 - 15.5) +
        ')'
      )
    })
    .remove()
  exitNodesTransition.select('rect').style('fill-opacity', 0)

  exitNodesTransition.select('text').style('fill-opacity', 0)

  var linksSet = container.selectAll('.branch-link').data(links)
  var enterLinks = linksSet.enter()
  var exitLinks = linksSet.exit()

  enterLinks
    .append('line')
    .attr('class', 'branch-link')
    .attr('x1', function(d) {
      return d.source.x
    })
    .attr('y1', function(d) {
      return d.source.y
    })
    .attr('x2', function(d) {
      return d.source.x
    })
    .attr('y2', function(d) {
      return d.source.y
    })
    .transition()
    .duration(500)
    .attr('x2', function(d) {
      return d.target.x
    })
    .attr('y2', function(d) {
      return d.target.y
    })
    .style('stroke', '#B4B4B4')
    .style('stroke-width', 1)

  exitLinks
    .transition()
    .duration(500)
    .attr('x1', function(d) {
      return d.source.x
    })
    .attr('y1', function(d) {
      return d.source.y
    })
    .attr('x2', function(d) {
      return d.source.x
    })
    .attr('y2', function(d) {
      return d.source.y
    })
    .remove()
}

function drawInvest() {
  var nodes = []
  var links = []

  if (investExtend) {
    nodes = investNodes
    links = investLinks
    window.d3.select('#invest-path').attr('d', 'M7 15 H17 V17 H7 Z')
  } else {
    nodes = []
    links = []
    window.d3
      .select('#invest-path')
      .attr('d', 'M7 15 H11 V11 H13 V15 H17 V17 H13 V21 H11 V17 H7 Z')
  }
  var investContainer = container.selectAll('.invest-node').data(nodes)

  var enterNodes = investContainer.enter()
  var exitNodes = investContainer.exit()

  var enterNodeContainer = enterNodes
    .append('g')
    .attr('class', 'invest-node')
    .attr('transform', function(d) {
      return (
        'translate(' +
        (width / 2 + 80 + offsetWidth) +
        ',' +
        (height / 2 - 85) +
        ')'
      )
    })

  enterNodeContainer.on('click', function(d) {
    if (d.KeyNo) {
      showDetail(d.KeyNo, 'company_businessmap')
    }
  })

  enterNodeContainer
    .append('rect')
    .attr('width', function(d) {
      if (d.Name) {
        return 30 + getLength(d.Name) * 6
      }
      return 90
    })
    .attr('height', 28)
    .style('fill', '#9E77F2')
    .style('opacity', 0)
    .attr('rx', 4)
    .attr('ry', 4)

  enterNodeContainer
    .append('text')
    .attr('x', 15)
    .attr('y', 18)
    .text(function(d) {
      return d.Name
    })
    .attr('fill', '#333333')
    .style('font-size', '12px')
    .style('opacity', 0)

  var enterNodesTransition = enterNodeContainer
    .transition()
    .duration(500)
    .attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })

  enterNodesTransition.select('rect').style('opacity', 0.2)
  enterNodesTransition.select('text').style('opacity', 1)

  var exitNodesTransition = exitNodes
    .transition()
    .duration(500)
    .attr('transform', function(d) {
      return (
        'translate(' +
        (width / 2 + 80 + offsetWidth) +
        ',' +
        (height / 2 - 85) +
        ')'
      )
    })
    .remove()
  exitNodesTransition.select('rect').style('fill-opacity', 0)

  exitNodesTransition.select('text').style('fill-opacity', 0)

  var linksSet = container.selectAll('.invest-link').data(links)
  var enterLinks = linksSet.enter()
  var exitLinks = linksSet.exit()

  enterLinks
    .append('line')
    .attr('class', 'invest-link')
    .attr('x1', function(d) {
      return d.source.x
    })
    .attr('y1', function(d) {
      return d.source.y
    })
    .attr('x2', function(d) {
      return d.source.x
    })
    .attr('y2', function(d) {
      return d.source.y
    })
    .transition()
    .duration(500)
    .attr('x2', function(d) {
      return d.target.x
    })
    .attr('y2', function(d) {
      return d.target.y
    })
    .style('stroke', '#B4B4B4')
    .style('stroke-width', 1)

  exitLinks
    .transition()
    .duration(500)
    .attr('x1', function(d) {
      return d.source.x
    })
    .attr('y1', function(d) {
      return d.source.y
    })
    .attr('x2', function(d) {
      return d.source.x
    })
    .attr('y2', function(d) {
      return d.source.y
    })
    .remove()
}

function drawHoper() {
  var nodes = []
  var links = []

  if (hoperExtend) {
    nodes = hoperNodes
    links = hoperLinks
    window.d3.select('#hoper-path').attr('d', 'M7 15 H17 V17 H7 Z')
  } else {
    nodes = []
    links = []
    window.d3
      .select('#hoper-path')
      .attr('d', 'M7 15 H11 V11 H13 V15 H17 V17 H13 V21 H11 V17 H7 Z')
  }
  var hoperContainer = container.selectAll('.hoper-node').data(nodes)

  var enterNodes = hoperContainer.enter()
  var exitNodes = hoperContainer.exit()

  var enterNodeContainer = enterNodes
    .append('g')
    .attr('class', 'hoper-node')
    .attr('transform', function(d) {
      return (
        'translate(' +
        (width / 2 + 80 + offsetWidth) +
        ',' +
        (height / 2 + 55) +
        ')'
      )
    })

  enterNodeContainer.on('click', function(d) {
    if (d.KeyNo) {
      showDetail2(d.KeyNo, 'company_muhou4', 'person')
    }
  })

  enterNodeContainer
    .append('rect')
    .attr('width', function(d) {
      if (d.OperName) {
        if (Math.ceil(d.OperName.length / 6) > 1) {
          return 90
        } else {
          return 30 + getLength(d.OperName) * 6
        }
      }
      return 90
    })
    .attr('height', function(d) {
      if (d.OperName) {
        if (Math.ceil(d.OperName.length / 6) > 1) {
          return 12 + 16 * Math.ceil(d.OperName.length / 6)
        }
      }
      return 28
    })
    .style('fill', '#ED6D5C')
    .style('opacity', 0)
    .attr('rx', 4)
    .attr('ry', 4)

  enterNodeContainer.each(function(d) {
    for (var i = 0; i < Math.ceil(d.OperName.length / 6); i++) {
      window.d3
        .select(this)
        .append('text')
        .text(function(d) {
          return d.OperName.substr(i * 6, 6)
        })
        .attr('x', 15)
        .attr('y', 18 + i * 16)
        .attr('fill', '#333333')
        .style('font-size', '12px')
        .style('opacity', 0)
    }
  })

  var enterNodesTransition = enterNodeContainer
    .transition()
    .duration(500)
    .attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })

  enterNodesTransition.select('rect').style('opacity', 0.2)
  enterNodesTransition.selectAll('text').style('opacity', 1)

  var exitNodesTransition = exitNodes
    .transition()
    .duration(500)
    .attr('transform', function(d) {
      return (
        'translate(' +
        (width / 2 + 80 + offsetWidth) +
        ',' +
        (height / 2 + 55) +
        ')'
      )
    })
    .remove()
  exitNodesTransition.select('rect').style('fill-opacity', 0)

  exitNodesTransition.selectAll('text').style('fill-opacity', 0)

  var linksSet = container.selectAll('.hoper-link').data(links)
  var enterLinks = linksSet.enter()
  var exitLinks = linksSet.exit()

  enterLinks
    .append('line')
    .attr('class', 'hoper-link')
    .attr('x1', function(d) {
      return d.source.x
    })
    .attr('y1', function(d) {
      return d.source.y
    })
    .attr('x2', function(d) {
      return d.source.x
    })
    .attr('y2', function(d) {
      return d.source.y
    })
    .transition()
    .duration(500)
    .attr('x2', function(d) {
      return d.target.x
    })
    .attr('y2', function(d) {
      return d.target.y
    })
    .style('stroke', '#B4B4B4')
    .style('stroke-width', 1)

  exitLinks
    .transition()
    .duration(500)
    .attr('x1', function(d) {
      return d.source.x
    })
    .attr('y1', function(d) {
      return d.source.y
    })
    .attr('x2', function(d) {
      return d.source.x
    })
    .attr('y2', function(d) {
      return d.source.y
    })
    .remove()
}

function drawHstock() {
  var nodes = []
  var links = []

  if (hstockExtend) {
    nodes = hstockNodes
    links = hstockLinks
    window.d3.select('#hstock-path').attr('d', 'M7 15 H17 V17 H7 Z')
  } else {
    nodes = []
    links = []
    window.d3
      .select('#hstock-path')
      .attr('d', 'M7 15 H11 V11 H13 V15 H17 V17 H13 V21 H11 V17 H7 Z')
  }
  var hstockContainer = container.selectAll('.hstock-node').data(nodes)

  var enterNodes = hstockContainer.enter()
  var exitNodes = hstockContainer.exit()

  var enterNodeContainer = enterNodes
    .append('g')
    .attr('class', 'hstock-node')
    .attr('transform', function(d) {
      return (
        'translate(' +
        (width / 2 - 170 - offsetWidth) +
        ',' +
        (height / 2 + 55) +
        ')'
      )
    })

  enterNodeContainer.on('click', function(d) {
    if (d.KeyNo) {
      if (d.Org == 2) {
        showDetail2(d.KeyNo, 'company_muhou4', 'person')
      } else {
        showDetail(d.KeyNo, 'company_businessmap')
      }
    }
  })

  enterNodeContainer
    .append('rect')
    .attr('width', function(d) {
      if (d.PartnerName) {
        if (Math.ceil(d.PartnerName.length / 16) > 1) {
          return 222
        }
        return 30 + getLength(d.PartnerName) * 6
      }
      return 90
    })
    .attr('height', function(d) {
      if (d.PartnerName) {
        if (Math.ceil(d.PartnerName.length / 16) > 1) {
          return 12 + 16 * Math.ceil(d.PartnerName.length / 16)
        }
      }
      return 28
    })
    .style('fill', '#ED6D5C')
    .style('opacity', 0)
    .attr('rx', 4)
    .attr('ry', 4)

  enterNodeContainer.each(function(d) {
    for (var i = 0; i < Math.ceil(d.PartnerName.length / 16); i++) {
      window.d3
        .select(this)
        .append('text')
        .text(function(d) {
          return d.PartnerName.substr(i * 16, 16)
        })
        .attr('x', 15)
        .attr('y', 18 + i * 16)
        .attr('fill', '#333333')
        .style('font-size', '12px')
        .style('opacity', 0)
    }
  })

  var enterNodesTransition = enterNodeContainer
    .transition()
    .duration(500)
    .attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })

  enterNodesTransition.select('rect').style('opacity', 0.2)
  enterNodesTransition.selectAll('text').style('opacity', 1)

  var exitNodesTransition = exitNodes
    .transition()
    .duration(500)
    .attr('transform', function(d) {
      return (
        'translate(' +
        (width / 2 - 170 - offsetWidth) +
        ',' +
        (height / 2 + 55) +
        ')'
      )
    })
    .remove()
  exitNodesTransition.select('rect').style('fill-opacity', 0)

  exitNodesTransition.selectAll('text').style('fill-opacity', 0)

  var linksSet = container.selectAll('.hstock-link').data(links)
  var enterLinks = linksSet.enter()
  var exitLinks = linksSet.exit()

  enterLinks
    .append('line')
    .attr('class', 'hstock-link')
    .attr('x1', function(d) {
      return d.source.x
    })
    .attr('y1', function(d) {
      return d.source.y
    })
    .attr('x2', function(d) {
      return d.source.x
    })
    .attr('y2', function(d) {
      return d.source.y
    })
    .transition()
    .duration(500)
    .attr('x2', function(d) {
      return d.target.x
    })
    .attr('y2', function(d) {
      return d.target.y
    })
    .style('stroke', '#B4B4B4')
    .style('stroke-width', 1)

  exitLinks
    .transition()
    .duration(500)
    .attr('x1', function(d) {
      return d.source.x
    })
    .attr('y1', function(d) {
      return d.source.y
    })
    .attr('x2', function(d) {
      return d.source.x
    })
    .attr('y2', function(d) {
      return d.source.y
    })
    .remove()
}

function drawEmploy() {
  var nodes = []
  var links = []

  if (employExtend) {
    nodes = employNodes
    links = employLinks
    window.d3.select('#employ-path').attr('d', 'M7 15 H17 V17 H7 Z')
  } else {
    nodes = []
    links = []
    window.d3
      .select('#employ-path')
      .attr('d', 'M7 15 H11 V11 H13 V15 H17 V17 H13 V21 H11 V17 H7 Z')
  }
  var employContainer = container.selectAll('.employ-node').data(nodes)

  var enterNodes = employContainer.enter()
  var exitNodes = employContainer.exit()

  var enterNodeContainer = enterNodes
    .append('g')
    .attr('class', 'employ-node')
    .attr('transform', function(d) {
      return (
        'translate(' +
        (width / 2 - 170 - offsetWidth) +
        ',' +
        (height / 2 - 15.5) +
        ')'
      )
    })

  enterNodeContainer.on('click', function(d) {
    if (d.KeyNo) {
      showDetail2(d.KeyNo, 'company_muhou4', 'person')
    }
  })

  enterNodeContainer
    .append('rect')
    .attr('width', function(d) {
      if (d.Name) {
        if (d.Job) {
          return 40 + getLength(d.Name) * 6 + getLength(d.Job) * 6
        }
        return 30 + d.Name.length * 12
      }
      return 90
    })
    .attr('height', 28)
    .attr('x', function(d) {
      if (d.Name) {
        if (d.Job) {
          return 0 - 40 - getLength(d.Name) * 6 - getLength(d.Job) * 6
        }
        return 0 - 30 - getLength(d.Name) * 6
      }
      return -90
    })
    .style('fill', '#67AEF5')
    .style('opacity', 0)
    .attr('rx', 4)
    .attr('ry', 4)

  if (isIE) {
    enterNodeContainer
      .append('text')
      .attr('x', function(d) {
        if (d.Name) {
          if (d.Job) {
            return 15 - 40 - getLength(d.Name) * 6 - getLength(d.Job) * 6
          }
          return 15 - 30 - getLength(d.Name) * 6
        }
        return -70
      })
      .attr('y', 18)
      .text(function(d) {
        return d.Name
      })
      .attr('class', 'employ-name')
      .attr('fill', '#333333')
      .style('font-size', '12px')
      .style('opacity', 0)
  } else {
    enterNodeContainer
      .append('text')
      .attr('x', function(d) {
        if (d.Name) {
          if (d.Job) {
            return 15 - 40 - getLength(d.Name) * 6 - getLength(d.Job) * 6
          }
          return 15 - 30 - getLength(d.Name) * 6
        }
        return -70
      })
      .attr('y', 18)
      .html(function(d) {
        return d.Name
      })
      .attr('class', 'employ-name')
      .attr('fill', '#333333')
      .style('font-size', '12px')
      .style('opacity', 0)
  }

  enterNodeContainer
    .append('text')
    .attr('x', function(d) {
      if (d.Name) {
        return 15 - 30 - getLength(d.Job) * 6
      }
      return -70
    })
    .attr('y', 18)
    .text(function(d) {
      return d.Job
    })
    .attr('class', 'employ-job')
    .attr('fill', '#8a8a8a')
    .style('font-size', '12px')
    .style('opacity', 0)

  var enterNodesTransition = enterNodeContainer
    .transition()
    .duration(500)
    .attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })

  enterNodesTransition.select('rect').style('opacity', 0.2)
  enterNodesTransition.select('.employ-name').style('opacity', 1)

  enterNodesTransition.select('.employ-job').style('opacity', 1)

  var exitNodesTransition = exitNodes
    .transition()
    .duration(500)
    .attr('transform', function(d) {
      return (
        'translate(' +
        (width / 2 - 170 - offsetWidth) +
        ',' +
        (height / 2 - 15.5) +
        ')'
      )
    })
    .remove()
  exitNodesTransition.select('rect').style('fill-opacity', 0)

  exitNodesTransition.select('.employ-name').style('fill-opacity', 0)

  exitNodesTransition.select('.employ-job').style('fill-opacity', 0)

  var linksSet = container.selectAll('.employ-link').data(links)
  var enterLinks = linksSet.enter()
  var exitLinks = linksSet.exit()

  enterLinks
    .append('line')
    .attr('class', 'employ-link')
    .attr('x1', function(d) {
      return d.source.x
    })
    .attr('y1', function(d) {
      return d.source.y
    })
    .attr('x2', function(d) {
      return d.source.x
    })
    .attr('y2', function(d) {
      return d.source.y
    })
    .transition()
    .duration(500)
    .attr('x2', function(d) {
      return d.target.x
    })
    .attr('y2', function(d) {
      return d.target.y
    })
    .style('stroke', '#B4B4B4')
    .style('stroke-width', 1)

  exitLinks
    .transition()
    .duration(500)
    .attr('x1', function(d) {
      return d.source.x
    })
    .attr('y1', function(d) {
      return d.source.y
    })
    .attr('x2', function(d) {
      return d.source.x
    })
    .attr('y2', function(d) {
      return d.source.y
    })
    .remove()
}

function drawStock() {
  var nodes = []
  var links = []

  if (stockExtend) {
    nodes = stockNodes
    links = stockLinks
    window.d3.select('#stock-path').attr('d', 'M7 15 H17 V17 H7 Z')
  } else {
    nodes = []
    links = []
    window.d3
      .select('#stock-path')
      .attr('d', 'M7 15 H11 V11 H13 V15 H17 V17 H13 V21 H11 V17 H7 Z')
  }
  var stockContainer = container.selectAll('.stock-node').data(nodes)

  var enterNodes = stockContainer.enter()
  var exitNodes = stockContainer.exit()

  var enterNodeContainer = enterNodes
    .append('g')
    .attr('class', 'stock-node')
    .attr('transform', function(d) {
      return (
        'translate(' +
        (width / 2 - 170 - offsetWidth) +
        ',' +
        (height / 2 - 85) +
        ')'
      )
    })

  enterNodeContainer.on('click', function(d) {
    if (d.KeyNo) {
      if (d.Org == 2) {
        showDetail2(d.KeyNo, 'company_muhou4', 'person')
      } else {
        showDetail(d.KeyNo, 'company_businessmap')
      }
    }
  })

  enterNodeContainer
    .append('rect')
    .attr('width', function(d) {
      if (d.Name) {
        if (d.Percent) {
          return 40 + getLength(d.Name) * 6 + getLength(d.Percent) * 6
        }
        return 30 + d.Name.length * 12
      }
      return 90
    })
    .attr('height', 28)
    .attr('x', function(d) {
      if (d.Name) {
        if (d.Percent) {
          return (
            0 - 40 - getLength(d.Name) * 6 - getLength(d.Percent) * 6
          )
        }
        return 0 - 30 - getLength(d.Name) * 6
      }
      return -90
    })
    .style('fill', '#84DB56')
    .style('opacity', 0)
    .attr('rx', 4)
    .attr('ry', 4)

  enterNodeContainer
    .append('text')
    .attr('x', function(d) {
      if (d.Name) {
        if (d.Percent) {
          return (
            15 - 40 - getLength(d.Name) * 6 - getLength(d.Percent) * 6
          )
        }
        return 15 - 30 - getLength(d.Name) * 6
      }
      return -70
    })
    .attr('y', 18)
    .text(function(d) {
      return d.Name
    })
    .attr('class', 'stock-name')
    .attr('fill', '#333333')
    .style('font-size', '12px')
    .style('opacity', 0)

  enterNodeContainer
    .append('text')
    .attr('x', function(d) {
      if (d.Name) {
        return 15 - 30 - getLength(d.Percent) * 6
      }
      return -70
    })
    .attr('y', 18)
    .text(function(d) {
      return d.Percent
    })
    .attr('class', 'stock-job')
    .attr('fill', '#8a8a8a')
    .style('font-size', '12px')
    .style('opacity', 0)

  var enterNodesTransition = enterNodeContainer
    .transition()
    .duration(500)
    .attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })

  enterNodesTransition.select('rect').style('opacity', 0.2)
  enterNodesTransition.select('.stock-name').style('opacity', 1)

  enterNodesTransition.select('.stock-job').style('opacity', 1)

  var exitNodesTransition = exitNodes
    .transition()
    .duration(500)
    .attr('transform', function(d) {
      return (
        'translate(' +
        (width / 2 - 170 - offsetWidth) +
        ',' +
        (height / 2 - 85) +
        ')'
      )
    })
    .remove()
  exitNodesTransition.select('rect').style('fill-opacity', 0)

  exitNodesTransition.select('.stock-name').style('fill-opacity', 0)

  exitNodesTransition.select('.stock-job').style('fill-opacity', 0)

  var linksSet = container.selectAll('.stock-link').data(links)
  var enterLinks = linksSet.enter()
  var exitLinks = linksSet.exit()

  enterLinks
    .append('line')
    .attr('class', 'stock-link')
    .attr('x1', function(d) {
      return d.source.x
    })
    .attr('y1', function(d) {
      return d.source.y
    })
    .attr('x2', function(d) {
      return d.source.x
    })
    .attr('y2', function(d) {
      return d.source.y
    })
    .transition()
    .duration(500)
    .attr('x2', function(d) {
      return d.target.x
    })
    .attr('y2', function(d) {
      return d.target.y
    })
    .style('stroke', '#B4B4B4')
    .style('stroke-width', 1)

  exitLinks
    .transition()
    .duration(500)
    .attr('x1', function(d) {
      return d.source.x
    })
    .attr('y1', function(d) {
      return d.source.y
    })
    .attr('x2', function(d) {
      return d.source.x
    })
    .attr('y2', function(d) {
      return d.source.y
    })
    .remove()
}

function getLength(str) {
  if (str) {
    var hanLength = 0
    if (/[\u0391-\uFFE5]/i.test(str)) {
      hanLength = str.match(/[\u0391-\uFFE5]/g).length
    }
    var upcaseLength = 0
    if (/[A-Z]/i.test(str)) {
      upcaseLength = str.match(/[A-Z]/g).length
    }
    return str.length + hanLength + upcaseLength / 3
  } else {
    return 0
  }
}

function resizeScreen() {
  if (document.body.clientHeight > 700) {
    document.getElementById('screenArea').style.height =
      document.body.clientHeight - 66
  } else {
    document.getElementById('screenArea').style.height = 640
  }
}
function showDetail2() {
  console.log('showDetail2')
}
function showDetail() {
  console.log('showDetail1')
}
export default start
