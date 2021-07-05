/* eslint-disable */
var companyName = '' // 根节点的名字
// var fontSize = 10
const companyNameSize = 18

/**
 * Initialize tree chart object and data loading.
 * @param {Object} d3Object Object for d3, injection used for testing.
 */
var TreeChart = function (d3Object) {
  this.d3 = d3Object
  // Initialize the direction texts.
  this.directions = ['upward', 'downward']
}

/**
 * Set variable and draw chart. graphTree
 */
TreeChart.prototype.drawChart = function (allData) {
  // First get tree data for both directions.
  this.treeData = {}
  this.directions.forEach(direction => {
    this.treeData[direction] = allData[direction]
  })
  companyName = allData.companyName
  this.graphTree(this.getTreeConfig())
}

/**
 * Get tree dimension configuration.获取设置树的宽高数据
 * @return {Object} treeConfig Object containing tree dimension size
 *     and central point location.
 */
TreeChart.prototype.getTreeConfig = function () {
  var treeConfig = { margin: { top: 10, right: 5, bottom: 0, left: 30 } }
  // This will be the maximum dimensions
  treeConfig.chartWidth =
    window.innerWidth - treeConfig.margin.right - treeConfig.margin.left
  treeConfig.chartHeight =
    window.innerHeight - treeConfig.margin.top - treeConfig.margin.bottom
  treeConfig.centralHeight = treeConfig.chartHeight / 2
  treeConfig.centralWidth = treeConfig.chartWidth / 2
  treeConfig.linkLength = 120
  treeConfig.duration = 200
  return treeConfig
}

TreeChart.prototype.setMarker = function (svg) {
  // 箭头(下半部分)
  svg
    .append('marker')
    .attr('id', 'resolvedDown')
    .attr('markerUnits', 'strokeWidth') // 设置为strokeWidth箭头会随着线的粗细发生变化
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('viewBox', '0 -8 16 16') // 坐标系的区域
    .attr('refX', 0) // 箭头坐标
    .attr('refY', 5)
    .attr('markerWidth', 20) // 标识的大小
    .attr('markerHeight', 12)
    .attr('orient', '0') // 绘制方向，可设定为：auto（自动确认方向）和 角度值
    .attr('stroke-width', 2) // 箭头宽度
    .append('path')
    .attr('d', 'M0, -4L-5, -8L0, 10L5,-8 ') // 箭头的路径
    .attr('fill', '#1180ea') // 箭头颜色
  // 箭头(上半部分)
  svg
    .append('marker')
    .attr('id', 'resolvedUp')
    .attr('markerUnits', 'strokeWidth') // 设置为strokeWidth箭头会随着线的粗细发生变化
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('viewBox', '0 -8 16 16') // 坐标系的区域
    .attr('refX', 0) // 箭头坐标
    .attr('refY', -4)
    .attr('markerWidth', 20) // 标识的大小
    .attr('markerHeight', 12)
    .attr('orient', '0') // 绘制方向，可设定为：auto（自动确认方向）和 角度值
    .attr('stroke-width', 2) // 箭头宽度
    .append('path')
    .attr('d', 'M0, -4L-5, -8L0, 10L5,-8 ') // 箭头的路径
    .attr('fill', '#1180ea') // 箭头颜色
}
/**
 * Graph tree based on the tree config.使用配置绘制图
 * @param {Object} config Object for chart dimension and central location.
 */

TreeChart.prototype.graphTree = function (config) {
  var self = this
  var d3 = this.d3
  var linkLength = config.linkLength
  var duration = config.duration
  var hasChildNodeArr = []
  // id is used to name all the nodes;
  var id = 0
  var diagonal = d3.svg.diagonal().projection(function (d) {
    return [d.x, d.y]
  })
  // 设置缩放
  var zoom = d3.behavior
    .zoom()
    .scaleExtent([0.2, 2])
    // .scale(1.4)
    .on('zoom', redraw)
  var svg = d3
    .select('#box')
    .append('svg')
    .attr('width', config.chartWidth + config.margin.right + config.margin.left)
    .attr(
      'height',
      config.chartHeight + config.margin.top + config.margin.bottom
    )
    .on('mousedown', disableRightClick)
    .call(zoom)
    .on('dblclick.zoom', null)
  var treeG = svg
    .append('g')
    .attr(
      'transform',
      'translate(' + config.margin.left + ',' + config.margin.top + ')'
    )
  this.setMarker(svg)
  // Initialize the tree nodes and update chart.
  for (var d in this.directions) {
    var direction = this.directions[d]
    var data = self.treeData[direction]
    data.x0 = config.centralWidth
    data.y0 = config.centralHeight
    // Hide all children nodes other than direct generation.
    data.children.forEach(collapse)
    update(data, data, treeG)
  }

  /**
   * Update nodes and links based on direction data.
   * @param {Object} source Object for current chart distribution to identify
   *    where the children nodes will branch from.
   * @param {Object} originalData Original data object to get configurations.
   * @param {Object} g Handle to svg.g.
   */
  function update (source, originalData, g) {
    // Set up the upward vs downward separation.
    var direction = originalData.direction
    var isUp = direction == 'upward'
    var nodeClass = direction + 'Node'
    var linkClass = direction + 'Link'
    var isExpand = false
    // Reset tree layout based on direction, since the downward chart has
    // way too many nodes to fit in the screen, while we want a symmetric
    // view for upward chart.
    var nodeSpace = 130
    var tree = d3.layout
      .tree()
      .sort(sortByDate)
      .nodeSize([nodeSpace, 0])
    /* if (isUp) {
        tree.size([config.chartWidth, config.chartHeight]);//树图定宽
      } */
    var nodes = tree.nodes(originalData)
    var links = tree.links(nodes)
    // Offset x-position for downward to view the left most record.
    var offsetX = -config.centralWidth
    // 向一边发展的树杈
    /* if (!isUp) {
        var childrenNodes = originalData[(originalData.children) ? 'children' : '_children'];
        offsetX = d3.min([childrenNodes[0].x, 0]);
      } */
    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
      const downwardSign = isUp ? -1 : 1
      d.y = downwardSign * (d.depth * linkLength) + config.centralHeight
      d.x = d.x - offsetX
      // Position for origin node.
      if (d.name == 'origin') {
        d.x = config.centralWidth
        d.y += downwardSign * 0 // 上下两树图根节点之间的距离
      }
    })

    // Update the node.
    var node = g.selectAll('g.' + nodeClass).data(nodes, function (d) {
      return d.id || (d.id = ++id)
    })
    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node
      .enter()
      .append('g')
      .attr('class', nodeClass)
      .attr('transform', function (d) {
        return 'translate(' + source.x0 + ',' + source.y0 + ')'
      })
      .style('cursor', function (d) {
        return d.name == 'origin'
          ? ''
          : d.children || d._children
            ? 'pointer'
            : ''
      })
      .on('click', click)
    nodeEnter
      .append('svg:rect')
      .attr('x', function (d) {
        return d.name == 'origin'
          ? -((companyName.length * companyNameSize) / 2)
          : -60
      })
      .attr('y', function (d) {
        return d.name == 'origin' ? -20 : isUp ? -52 : 12
      })
      .attr('width', function (d) {
        return d.name == 'origin'
          ? companyName.length * companyNameSize
          : config.linkLength
      })
      .attr('height', 40)
      .attr('rx', 10)
      .style('stroke', function (d) {
        return d.name == 'origin' ? '#1078AF' : '#999'
      })
      .style('fill', function (d) {
        // 修改颜色 框 color
        return d.name == 'origin' ? '#128bed' : '#f4f4f4'
      })

    nodeEnter.append('circle').attr('r', 1e-6)
    // Add Text stylings for node main texts  公司文字
    nodeEnter
      .append('text')
      .attr('class', 'linkname')
      .attr('x', function (d) {
        return d.name == 'origin' ? '0' : '-55'
      })
      .attr('dy', function (d) {
        return d.name == 'origin' ? '.35em' : isUp ? '-40' : '24'
      })
      .attr('text-anchor', function (d) {
        return d.name == 'origin' ? 'middle' : 'start'
      })
      .attr('fill', '#222')
      .text(function (d) {
        // Text for origin node.
        if (d.name == 'origin') {
          // return ((isUp) ? '根节点TOP' : '根节点Bottom');
          return companyName
        }
        // Text for summary nodes.
        if (d.repeated) {
          return '[Recurring] ' + d.name
        }
        return d.name.length > 10 ? d.name.substr(0, 10) : d.name
      })
      .style({
        'fill-opacity': 1e-6,
        fill: function (d) {
          if (d.name == 'origin') {
            return '#fff'
          }
        },
        'font-size': function (d) {
          return d.name == 'origin' ? companyNameSize : 10
        },
        cursor: 'pointer'
      })
    // .on('click', function() {
    //   alert(1)
    //   // window.open('http://www.baidu.com')
    // })
    // 公司换行的文字
    nodeEnter
      .append('text')
      .attr('class', 'linkname')
      .attr('x', '-55')
      .attr('dy', function (d) {
        // 偏移
        return d.name == 'origin' ? '.35em' : isUp ? '-29' : '35'
      })
      .attr('text-anchor', function () {
        return d.name == 'origin' ? 'middle' : 'start'
      })
      .text(function (d) {
        return d.name.substr(10, d.name.length)
      })
      .style({
        fill: '#333',
        'font-size': function (d) {
          return d.name == 'origin' ? companyNameSize : 10
        },
        cursor: 'pointer'
      })
    // .on('click', function() {
    //   alert(1)
    //   // window.open('http://www.baidu.com')
    // })

    nodeEnter
      .append('text')
      .attr('x', '-55')
      .attr('dy', function (d) {
        return d.name == 'origin' ? '.35em' : isUp ? '-16' : '48'
      })
      .attr('text-anchor', 'start')
      .attr('class', 'linkname')
      .style('fill', '#666')
      .style('font-size', 10)
      .text(function (d) {
        var str =
          d.name == 'origin' ? '' : '认缴金额：' + (d.shouldCapi || '-') + '万'
        return str.length > 13 ? str.substr(0, 13) + '..' : str
      })
    nodeEnter
      .append('text')
      .attr('x', '10')
      .attr('dy', function (d) {
        return d.name == 'origin' ? '.35em' : isUp ? '0' : '10'
      })
      .attr('text-anchor', 'start')
      .attr('class', 'linkname')
      .style('fill', '#128bed')
      .style('font-size', 10)
      .text(d => {
        if (d.name !== 'origin') {
          return getKongGuText(d, isUp)
        }
        return ''
      })

    // Transition nodes to their new position.原有节点更新到新位置
    var nodeUpdate = node
      .transition()
      .duration(duration)
      .attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
    nodeUpdate
      .select('circle')
      .attr('r', function (d) {
        return d.name == 'origin' ? 0 : hasChildNodeArr.indexOf(d) == -1 ? 0 : 6
      })
      .attr('cy', function (d) {
        return d.name == 'origin' ? -20 : isUp ? -59 : 59
      })
      .style('fill', function (d) {
        return hasChildNodeArr.indexOf(d) != -1 ? '#fff' : ''
        // if (d._children || d.children) { return "#fff"; } else { return "rgba(0,0,0,0)"; }
      })
      .style('stroke', function (d) {
        return hasChildNodeArr.indexOf(d) != -1 ? '#128bed' : ''
        // if (d._children || d.children) { return "#8b4513"; } else { return "rgba(0,0,0,0)"; }
      })
      .style('fill-opacity', function (d) {
        if (d.children) {
          return 0.35
        }
      })
      // Setting summary node style as class as mass style setting is
      // not compatible to circles.
      .style('stroke-width', function (d) {
        if (d.repeated) {
          return 5
        }
      })
    // 代表是否展开的+-号
    nodeEnter
      .append('svg:text')
      .attr('class', 'isExpand')
      .attr('x', '0')
      .attr('dy', function (d) {
        return isUp ? -54 : 62
      })
      .attr('text-anchor', 'middle')
      .style('fill', '#128bed')
      .text(function (d) {
        if (d.name == 'origin') {
          return ''
        }
        return hasChildNodeArr.indexOf(d) != -1 ? '+' : ''
      })

    nodeUpdate.select('text').style('fill-opacity', 1)

    //* *****************************************最终受益人 start******************************************//
    // 提示框
    nodeEnter
      .append('svg:rect')
      .attr('x', -60)
      .attr('y', function (d) {
        return isUp ? -86 : -20
      })
      .attr('width', function (d) {
        if (d.name == 'origin') {
          return 0
        } else {
          return d.hasHumanholding ? 120 : 0 // 如果有最终受益人
        }
      })
      .attr('height', 20)
      .style('stroke', function (d) {
        return '#1078AF'
      })
      .style('fill', function (d) {
        return '#46A2D2'
      })
    // 三角形
    nodeEnter
      .append('svg:path')
      .attr('fill', '#1078AF')
      .attr('d', function (d) {
        if (d.name == 'origin') {
          return ''
        } else {
          return d.hasHumanholding
            ? isUp
              ? 'M-60 -66 L-40 -66 L-50 -52 Z'
              : 'M-60 0 L-40 0 L-50 12 Z'
            : '' // 如果有最终受益人
        }
      })
    nodeEnter
      .append('svg:text')
      .attr('x', '-58')
      .attr('dy', function (d) {
        return isUp ? '-73' : '-7'
      })
      .attr('text-anchor', 'start')
      .style('fill', '#fff')
      .style('font-size', 10)
      .text(function (d) {
        var str =
          '我是最终受益人'.length > 6
            ? '我是最终受益人'.substr(0, 6) + '..'
            : '我是最终受益人'
        return d.hasHumanholding ? '最终受益人:' + str : '' // 如果有最终受益人
      })
    //* *****************************************最终受益人 end******************************************//

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr('transform', function (d) {
        return 'translate(' + source.x + ',' + source.y + ')'
      })
      .remove()
    nodeExit.select('circle').attr('r', 1e-6)
    nodeExit.select('text').style('fill-opacity', 1e-6)

    // Update the links.----------------------------------------------------------------------------
    var link = g.selectAll('path.' + linkClass).data(links, function (d) {
      return d.target.id
    })

    // Enter any new links at the parent's previous position.
    link
      .enter()
      .insert('path', 'g')
      .attr('class', linkClass)
      .attr('d', function (d) {
        var o = { x: source.x0, y: source.y0 }
        return diagonal({ source: o, target: o })
      })
      .attr('marker-end', function (d) {
        return isUp ? 'url(#resolvedUp)' : 'url(#resolvedDown)'
      }) // 根据箭头标记的id号标记箭头;
      .attr('id', function (d, i) {
        return 'mypath' + i
      })
    // Transition links to their new position.
    link
      .transition()
      .duration(duration)
      .attr('d', diagonal)
    // Transition exiting nodes to the parent's new position.
    link
      .exit()
      .transition()
      .duration(duration)
      .attr('d', function (d) {
        var o = { x: source.x, y: source.y }
        return diagonal({ source: o, target: o })
      })
      .remove()
    // Stash the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x
      d.y0 = d.y
    })

    /**
     * Tree function to toggle on click.
     * @param {Object} d data object for D3 use.
     */
    function click (d) {
      if (isUp) {
        if (d._children) {
          console.log('股东--ok')
        } else {
          console.log('股东--no')
        }
      } else {
        if (d._children) {
          console.log('对外投资--ok')
        } else {
          console.log('对外投资--no')
        }
      }
      if (d.name == 'origin') {
        return
      }

      isExpand = !isExpand
      if (isExpand) {
        d3.select(this)
          .select('.isExpand')
          .text('-')
      } else {
        d3.select(this)
          .select('.isExpand')
          .text('+')
      }

      if (d.children) {
        d._children = d.children
        d.children = null
      } else {
        d.children = d._children
        d._children = null
        // expand all if it's the first node
        if (d.name == 'origin') {
          d.children.forEach(expand)
        }
      }
      update(d, originalData, g)
    }
  }
  // Collapse and Expand can be modified to include touched nodes.
  /**
   * Tree function to expand all nodes.
   * @param {Object} d data object for D3 use.
   */
  function expand (d) {
    if (d._children) {
      d.children = d._children
      d.children.forEach(expand)
      d._children = null
    }
  }

  /**
   * Tree function to collapse children nodes.
   * @param {Object} d data object for D3 use.
   */
  function collapse (d) {
    if (d.children && d.children.length != 0) {
      d._children = d.children
      d._children.forEach(collapse)
      d.children = null
      hasChildNodeArr.push(d)
    }
  }

  /**
   * Tree function to redraw and zoom.
   */
  function redraw () {
    treeG.attr(
      'transform',
      'translate(' + d3.event.translate + ')' + ' scale(' + d3.event.scale + ')'
    )
  }
  /**
   * Tree functions to disable right click.
   */
  function disableRightClick () {
    // stop zoom
    if (d3.event.button == 2) {
      console.log('No right click allowed')
      d3.event.stopImmediatePropagation()
    }
  }

  /**
   * Tree sort function to sort and arrange nodes.
   * @param {Object} a First element to compare.
   * @param {Object} b Second element to compare.
   * @return {Boolean} boolean indicating the predicate outcome.
   */
  function sortByDate (a, b) {
    // Compare the individuals based on participation date
    // (no need to compare when there is only 1 summary)
    // var aNum = a.name.substr(a.name.lastIndexOf('(') + 1, 4)
    // var bNum = b.name.substr(b.name.lastIndexOf('(') + 1, 4)
    // Sort by date, name, id.
    // return (
    //   d3.ascending(aNum, bNum) ||
    //   d3.ascending(a.name, b.name) ||
    //   d3.ascending(a.id, b.id)
    // )
    return b.shouldCapi - a.shouldCapi
  }
}

function getKongGuText (item, isUp) {
  const percent = item.percent
  if (!isUp) {
    return percent + '(控股)'
  }
  return percent
}
export default TreeChart
