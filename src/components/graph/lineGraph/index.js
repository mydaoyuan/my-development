/* eslint-disable */
let allData = {}
let rootKey = ''
function faldia(message) {
  console.log(message)
}
var state, visibilityChange
if (typeof document.hidden !== 'undefined') {
  visibilityChange = 'visibilitychange'
  state = 'visibilityState'
} else if (typeof document.mozHidden !== 'undefined') {
  visibilityChange = 'mozvisibilitychange'
  state = 'mozVisibilityState'
} else if (typeof document.msHidden !== 'undefined') {
  visibilityChange = 'msvisibilitychange'
  state = 'msVisibilityState'
} else if (typeof document.webkitHidden !== 'undefined') {
  visibilityChange = 'webkitvisibilitychange'
  state = 'webkitVisibilityState'
}
// 添加监听器，在title里显示状态变化

/** 解决浏览器标签切换排列问题 */
var _isNeedReload = false
var _isGraphLoaded = false

/** end 解决浏览器标签切换排列问题 */

/** end 网页当前状态判断 */

var cy
var activeNode

var _rootData, _rootNode

var _COLOR = {
  // node :   {person: '#09ACB2',company:'#128BED',current:'#FD485E'},
  // node :   {person: '#20BDBF',company:'#4EA2F0',current:'#FD485E'},
  node: { person: '#FD485E', company: '#4ea2f0', current: '#ff9e00' },
  // node :   {person: '#a177bf',company:'#4ea2f0',current:'#FD485E'},
  // node :   {person: '#f2af00',company:'#0085c3',current:'#7ab800'},
  // border : {person: '#09ACB2',company:'#128BED',current:'#FD485E'},
  // border : {person: '#57A6A8',company:'#128BED',current:'#FD485E'},
  border: { person: '#FD485E', company: '#128BED', current: '#EF941B' },
  // border : {person: '#7F5AB8',company:'#128BED',current:'#FD485E'},
  // border : {person: '#f2af00',company:'#0085c3',current:'#7ab800'},
  // line:    {invest:'#128BED',employ:'#FD485E',legal:'#09ACB2'},
  // line:    {invest:'#4EA2F0',employ:'#20BDBF',legal:'#D969FF'}
  line: { invest: '#fd485e', employ: '#4ea2f0', legal: '#4ea2f0' }
  // line:    {invest:'#e43055',employ:'#a177bf',legal:'#4ea2f0'}
}
var _currentKeyNo
var _isFocus = false
var _maxChildrenLength = 0

/** **** 工具 ******/

// 去重操作,元素为对象
/* array = [
    {a:1,b:2,c:3,d:4},
    {a:11,b:22,c:333,d:44},
    {a:111,b:222,c:333,d:444}
];
var arr = uniqeByKeys(array,['a','b']); */
function uniqeByKeys(array, keys) {
  // 将对象元素转换成字符串以作比较
  function obj2key(obj, keys) {
    var n = keys.length
    var key = []
    while (n--) {
      key.push(obj[keys[n]])
    }
    return key.join('|')
  }

  var arr = []
  var hash = {}
  for (var i = 0, j = array.length; i < j; i++) {
    var k = obj2key(array[i], keys)
    if (!(k in hash)) {
      hash[k] = true
      arr.push(array[i])
    }
  }
  return arr
}

/** **** 数据处理 ******/

// 数据处理：将原始数据转换成graph数据
function getRootData(list) {
  var graph = {}
  graph.nodes = []
  graph.links = []

  // graph.nodes
  for (var i = 0; i < list.length; i++) {
    var nodes = list[i].graph.nodes
    for (var j = 0; j < nodes.length; j++) {
      var node = nodes[j]
      var o = {}
      o.nodeId = node.id
      o.data = {}
      o.data.obj = node
      // o.data.showStatus = 'NORMAL'; // NORMAL HIGHLIGHT DULL
      o.data.showStatus = null // NORMAL HIGHLIGHT DULL
      o.layout = {}
      o.layout.level = null // 1 当前查询节点
      o.layout.singleLinkChildren = [] // 只连接自己的node
      graph.nodes.push(o)
      // TODO
      // 设置_rootNode
      if (o.data.obj.properties.keyNo == rootKey) {
        _rootNode = o
        // 设置根节点的高亮
        setTimeout(() => {
          _rootNode.data.color= _COLOR.node.current
          _rootNode.data.strokeColor = _COLOR.border.current
        })
      }
    }
  }
  graph.nodes = uniqeByKeys(graph.nodes, ['nodeId'])

  // graph.links
  for (let i = 0; i < list.length; i++) {
    var relationships = list[i].graph.relationships

    for (var k = 0; k < relationships.length; k++) {
      var relationship = relationships[k]
      let o = {}
      o.data = {}
      o.data.obj = relationship
      // o.data.showStatus = 'NORMAL'; // NORMAL HIGHLIGHT DULL
      o.data.showStatus = null // NORMAL HIGHLIGHT DULL
      o.sourceNode = getGraphNode(relationship.startNode, graph.nodes)
      o.targetNode = getGraphNode(relationship.endNode, graph.nodes)
      o.linkId = relationship.id
      o.source = getNodesIndex(relationship.startNode, graph.nodes)
      o.target = getNodesIndex(relationship.endNode, graph.nodes)
      graph.links.push(o)
    }
  }
  graph.links = uniqeByKeys(graph.links, ['linkId'])

  // emplyRevert(graph.links);
  // mergeLinks(graph.links);
  setLevel(graph.nodes, graph.links)
  setCategoryColor(graph.nodes, graph.links)

  return graph
}

// 数据处理：设置节点层级
function setLevel(svgNodes, svgLinks) {
  function getNextNodes(nodeId, links, parentLevel) {
    var nextNodes = []
    for (var i = 0; i < links.length; i++) {
      var link = links[i]
      if (nodeId == link.sourceNode.nodeId && !link.targetNode.layout.level) {
        link.targetNode.layout.level = parentLevel
        nextNodes.push(link.targetNode)
      } else if (
        nodeId == link.targetNode.nodeId &&
        !link.sourceNode.layout.level
      ) {
        link.sourceNode.layout.level = parentLevel
        nextNodes.push(link.sourceNode)
      }
    }
    nextNodes = uniqeByKeys(nextNodes, ['nodeId'])

    return nextNodes
  }

  var level = 1
  var nodes = []
  nodes.push(_rootNode)
  while (nodes.length) {
    var nextNodes = []
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i]
      node.layout.level = level
      nextNodes = nextNodes.concat(getNextNodes(node.nodeId, svgLinks, level))
    }
    level++
    nodes = nextNodes
  }
}
// 数据处理：设置节点角色
function setCategoryColor(nodes, links) {
  for (var i = 0; i < links.length; i++) {
    var sameLink = {} // 两点间连线信息
    sameLink.length = 0 // 两点间连线数量
    sameLink.currentIndex = 0 // 当前线索引
    sameLink.isSetedSameLink = false
    links[i].sameLink = sameLink
  }

  /* 链接相同两点的线 */
  for (let i = 0; i < links.length; i++) {
    var baseLink = links[i]

    if (baseLink.sameLink.isSetedSameLink == false) {
      baseLink.sameLink.isSetedSameLink = true
      var nodeId1 = baseLink.sourceNode.nodeId
      var nodeId2 = baseLink.targetNode.nodeId

      var sameLinks = []
      sameLinks.push(baseLink)
      for (var j = 0; j < links.length; j++) {
        var otherLink = links[j]
        if (
          baseLink.linkId != otherLink.linkId &&
          !otherLink.sameLink.isSetedSameLink
        ) {
          if (
            (otherLink.sourceNode.nodeId == nodeId1 &&
              otherLink.targetNode.nodeId == nodeId2) ||
            (otherLink.sourceNode.nodeId == nodeId2 &&
              otherLink.targetNode.nodeId == nodeId1)
          ) {
            sameLinks.push(otherLink)
            otherLink.sameLink.isSetedSameLink = true
          }
        }
      }

      for (var k = 0; k < sameLinks.length; k++) {
        var oneLink = sameLinks[k]
        oneLink.sameLink.length = sameLinks.length // 两点间连线数量
        oneLink.sameLink.currentIndex = k // 当前线索引
      }
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    var node = nodes[i]
    if (_currentKeyNo == node.data.obj.properties.keyNo) {
      // 当前节点
      node.data.color = _COLOR.node.current
      node.data.strokeColor = _COLOR.border.current
    } else if (node.data.obj.labels[0] == 'Company') {
      node.data.color = _COLOR.node.company
      node.data.strokeColor = _COLOR.border.company
    } else {
      node.data.color = _COLOR.node.person
      node.data.strokeColor = _COLOR.border.person
    }
  }
}
// 数据处理：设置唯一孩子
function setSingleLinkNodes(links) {
  function isSingleLink(nodeId, links) {
    var hasLinks = 0
    var isSingle = true
    for (var i = 0; i < links.length; i++) {
      var link = links[i]
      if (
        link.targetNode.nodeId == nodeId ||
        link.sourceNode.nodeId == nodeId
      ) {
        hasLinks++
      }
      if (hasLinks > 1) {
        isSingle = false
        break
      }
    }

    return isSingle
  } // isSingleLink

  links.forEach(function(link, i) {
    if (isSingleLink(link.sourceNode.nodeId, links)) {
      link.targetNode.layout.singleLinkChildren.push(link.sourceNode)
    }
    if (isSingleLink(link.targetNode.nodeId, links)) {
      link.sourceNode.layout.singleLinkChildren.push(link.targetNode)
    }
  })
}
// 数据处理：根据nodeId获取node 索引
function getNodesIndex(nodeId, nodes) {
  var index = 0
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i]
    if (nodeId == node.nodeId) {
      index = i
      break
    }
  }
  return index
}
// 数据处理：node是否存在
function isNodeExist(nodeId, nodes) {
  var exist = false
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i]
    if (nodeId == node.nodeId) {
      exist = true
      break
    }
  }
  return exist
}
// 数据处理：根据nodes过滤出相应连线（没有节点的连线删除）
function filterLinksByNodes(nodes, allLinks) {
  function isExists(nodes, nodeId) {
    var exist = false
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i]
      if (node.nodeId == nodeId) {
        exist = true
        break
      }
    }
    return exist
  }
  var selLinks = []
  for (var i = 0; i < allLinks.length; i++) {
    var link = allLinks[i]
    if (
      isExists(nodes, link.sourceNode.nodeId) &&
      isExists(nodes, link.targetNode.nodeId)
    ) {
      // link.source = getNodesIndex(link.sourceNode.nodeId,nodes);
      // link.target = getNodesIndex(link.targetNode.nodeId,nodes);
      selLinks.push(link)
    }
  }
  return selLinks
}
// 数据处理：根据links过滤出相应节点(没有连线的节点删除)
// function filterNodesByLinks(nodes, links) {
//   function isExists(links, nodeId) {
//     var exist = false
//     for (var i = 0; i < links.length; i++) {
//       var link = links[i]
//       if (
//         link.sourceNode.nodeId == nodeId ||
//         link.targetNode.nodeId == nodeId
//       ) {
//         exist = true
//         break
//       }
//     }
//     return exist
//   }
//   var selNodes = []
//   for (var i = 0; i < nodes.length; i++) {
//     var node = nodes[i]
//     if (isExists(links, node.nodeId)) {
//       selNodes.push(node)
//     }
//   }
//   return selNodes
// }
// 数据处理：根据nodeId获取node
function getGraphNode(nodeId, nodes) {
  var node = null
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].nodeId == nodeId) {
      node = nodes[i]
      break
    }
  }
  return node
}
// 数据处理：获取子节点
// function getSubNodes(node, links) {
//   var subNodes = []
//   var nodeId = node.nodeId
//   var level = node.layout.level
//   for (var i = 0; i < links.length; i++) {
//     var link = links[i]
//     if (
//       link.sourceNode.nodeId == nodeId &&
//       link.targetNode.layout.level == level + 1
//     ) {
//       subNodes.push(link.targetNode)
//     }
//     if (
//       link.targetNode.nodeId == nodeId &&
//       link.sourceNode.layout.level == level + 1
//     ) {
//       subNodes.push(link.sourceNode)
//     }
//   }
//   subNodes = uniqeByKeys(subNodes, ['nodeId'])
//   return subNodes
// }

/** 筛选 */
// 数据处理：按状态过滤
function filterNodesByLevel(level, nodes) {
  var selNodes = []
  nodes.forEach(function(node) {
    if (node.layout.level <= level) {
      selNodes.push(node)
    }
  })
  return selNodes
}
// 数据处理：按状态过滤
function filterNodesByStatus(status, nodes) {
  if (status == 'all') {
    return nodes
  }

  var selNodes = []
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i]
    if (
      (node.data.obj.labels == 'Company' &&
        node.data.obj.properties.status == status) ||
      node.nodeId == _rootNode.nodeId
    ) {
      selNodes.push(node)
    }
  }
  return selNodes
}
// 数据处理：按持股数过滤
function filterNodesByStockNum(num, links) {
  var selLinks = []
  for (var i = 0; i < links.length; i++) {
    if (num == links[i].data.obj.properties.stockPercent) {
      selLinks.push(links[i])
    }
  }
  return selLinks
}
// 数据处理：按投资过滤
function filterNodesByInvest(invest, nodes, links) {
  /* 获取直接投资的节点 */
  function getInvestNodes(nodeId, links) {
    var investNodes = []
    for (var i = 0; i < links.length; i++) {
      var link = links[i]
      if (link.sourceNode.nodeId == nodeId && link.data.obj.type == 'INVEST') {
        investNodes.push(link.targetNode)
      }
    }

    // investNodes = uniqeByKeys(investNodes,['nodeId']);
    return investNodes
  }
  /* 获取公司股东 */
  function getCompanyStockholder(nodeId, links) {
    var stockholderNodes = []
    for (var i = 0; i < links.length; i++) {
      var link = links[i]
      if (link.targetNode.nodeId == nodeId && link.data.obj.type == 'INVEST') {
        stockholderNodes.push(link.sourceNode)
      }
    }

    // stockholderNodes = uniqeByKeys(stockholderNodes,['nodeId']);
    return stockholderNodes
  }
  /* 获取董监高法 */
  function getPersonStockholder(nodeId, links) {
    var stockholderNodes = []
    for (var i = 0; i < links.length; i++) {
      var link = links[i]
      if (
        link.targetNode.nodeId == nodeId &&
        link.data.obj.type == 'INVEST' &&
        link.sourceNode.data.obj.labels[0] == 'Person'
      ) {
        stockholderNodes.push(link.sourceNode)
      }
    }

    // stockholderNodes = uniqeByKeys(stockholderNodes,['nodeId']);
    return stockholderNodes
  }

  var selNodes = []
  if (invest === 'all') {
    return nodes
  } else if (invest === 'direct') {
    selNodes = getInvestNodes(_rootNode.nodeId, links)
  } else if (invest === 'stockholder') {
    let nextNodes = []
    let stockholderNodes = getCompanyStockholder(_rootNode.nodeId, links)
    for (var i = 0; i < stockholderNodes.length; i++) {
      nextNodes = nextNodes.concat(
        getInvestNodes(stockholderNodes[i].nodeId, links)
      )
    }
    selNodes = stockholderNodes.concat(nextNodes)
  } else if (invest === 'legal') {
    let nextNodes = []
    let stockholderNodes = getPersonStockholder(_rootNode.nodeId, links)
    for (let i = 0; i < stockholderNodes.length; i++) {
      nextNodes = nextNodes.concat(
        getInvestNodes(stockholderNodes[i].nodeId, links)
      )
    }
    selNodes = stockholderNodes.concat(nextNodes)
  }
  selNodes = selNodes.concat(_rootNode)
  selNodes = uniqeByKeys(selNodes, ['nodeId'])
  return selNodes
}
// 数据处理：根据所有条件过滤
function filter(rootData) {
  function isParentExist(node, nodes, links) {
    var isExist = false
    var parentLevel = node.layout.level - 1

    if (parentLevel < 2) {
      return true
    }

    for (var i = 0; i < links.length; i++) {
      var link = links[i]
      if (
        link.sourceNode.nodeId == node.nodeId &&
        link.targetNode.layout.level == parentLevel &&
        isNodeExist(link.targetNode.nodeId, nodes)
      ) {
        isExist = true
        break
      }
      if (
        link.targetNode.nodeId == node.nodeId &&
        link.sourceNode.layout.level == parentLevel &&
        isNodeExist(link.sourceNode.nodeId, nodes)
      ) {
        isExist = true
        break
      }
    }

    return isExist
  }
  function getFilterData(rootData) {
    //
    var selNodes = []
    for (let i = 0; i < rootData.nodes.length; i++) {
      selNodes.push(rootData.nodes[i])
    }
    var selLinks = []
    for (let i = 0; i < rootData.links.length; i++) {
      selLinks.push(rootData.links[i])
    }

    var level = window.$('#SelPanel').attr('param-level')
    var status = window.$('#SelPanel').attr('param-status')
    var num = window.$('#SelPanel').attr('param-num')
    var invest = window.$('#SelPanel').attr('param-invest')

    // console.log('status:' + status + ' num:' + num + ' invest:' + invest);

    // 层级
    level = parseInt(level) + 1
    selNodes = filterNodesByLevel(level, selNodes)

    // 状态
    if (status) {
      selNodes = filterNodesByStatus(status, selNodes)
    }

    // 持股
    var stockNodes = []
    if (num && num != 0) {
      selLinks = filterLinksByNodes(selNodes, selLinks)
      selLinks = filterNodesByStockNum(num, selLinks)
      for (var i = 0; i < selLinks.length; i++) {
        stockNodes.push(selLinks[i].sourceNode)
        stockNodes.push(selLinks[i].targetNode)
      }
      selNodes = uniqeByKeys(stockNodes, ['nodeId'])
    }

    // 投资
    if (invest) {
      selNodes = filterNodesByInvest(invest, selNodes, selLinks)
    }

    // 父节点不存在则删除
    var selNodes2 = []
    selNodes.forEach(function(node, i) {
      if (isParentExist(node, selNodes, selLinks)) {
        selNodes2.push(node)
      }
    })
    selLinks = filterLinksByNodes(selNodes2, selLinks)

    return { links: selLinks, nodes: selNodes2 }
  }

  var nodesIds = []
  var selGraph = getFilterData(rootData)
  selGraph.nodes.forEach(function(node) {
    nodesIds.push(node.nodeId)
  })
  highLightFilter(nodesIds, cy)

  /* //
    //window.$("#load_data").show();

    // 保证始终存在当前节点
    /!*if(selNodes2.length == 0){
        selNodes2.push(_rootNode);
    }*!/

    // 更新图谱
    /!*window.$("#TrTxt").removeClass('active');
    domUpdate(getFilterData(rootData));*!/

    /!*setTimeout(function () {
        domUpdate({links:selLinks,nodes:selNodes2});
    },5000)*!/; */
}
//
function filterReset() {
  window.$('#SelPanel').attr('param-level', '2')
  window.$('#SelPanel').attr('param-status', '')
  window.$('#SelPanel').attr('param-num', '')
  window.$('#SelPanel').attr('param-invest', '')

  window.$('#ShowLevel a').removeClass('active')
  window
    .$('#ShowLevel a')
    .eq(1)
    .addClass('active')
  window.$('#ShowStatus a').removeClass('active')
  window
    .$('#ShowStatus a')
    .eq(0)
    .addClass('active')
  window.$('#ShowInvest a').removeClass('active')
  window
    .$('#ShowInvest a')
    .eq(0)
    .addClass('active')
  window.$('#inputRange').val(0)
  window.$('#inputRange').css({ backgroundSize: '0% 100%' })
}

/** **** Html 相关 ******/
// 水印居中
function printLogoFixed() {
  var bodyH = window.$('body').height()
  var imgH = window.$('.printLogo img').height()
  var top = (parseFloat(bodyH) - parseFloat(imgH)) / 2
  window.$('.printLogo img').css({ 'margin-top': top + 'px' })
}
// 筛选面板：显示
function selPanelShow() {
  window.$('.tp-sel').fadeIn()
  // window.$('.tp-sel').addClass('zoomIn');
  window.$('#TrSel').addClass('active')
}
// 筛选面板：隐藏
function selPanelHide() {
  window.$('.tp-sel').fadeOut()
  window.$('#TrSel').removeClass('active')
}
// 筛选面板：列表更新
function selPanelUpdateList(nodes, links, isShowCheckbox) {
  window.$('.tp-list').html('')
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i]
    var index = i + 1
    var name = node.data.obj.properties.name
    var keyNo = node.data.obj.properties.keyNo
    var str = ''
    if (isShowCheckbox) {
      str =
        '<div class="checkbox" node_id="' +
        node.nodeId +
        '" keyno="' +
        keyNo +
        '"> <input checked type="checkbox"><label> ' +
        index +
        '.' +
        name +
        '</label> </div>'
      //            var str = '<div class="checkbox" node_id="'+ node.nodeId +'" keyno="'+ keyNo +'"> <label> ' + index + '.' + name + '</label> </div>';
    } else {
      str =
        '<div class="checkbox" node_id="' +
        node.nodeId +
        '" keyno="' +
        keyNo +
        '"><label> ' +
        index +
        '.' +
        name +
        '</label> </div>'
    }

    window.$('.tp-list').append(str)
  }

  window.$('.tp-list > div > label').click(function() {
    var _parent = window.$(this).parent()
    var nodeId = _parent.attr('node_id')

    focusReady(getGraphNode(nodeId, nodes))
  })

  window.$('.tp-list > div > input').click(function() {
    /* var _this = window.$(this);
        var _parent = window.$(this).parent();
        var nodeId = _parent.attr('node_id');
        var checkedNodeIds = window.$('.tp-list').attr('node_ids');
        if(checkedNodeIds){
            checkedNodeIds = checkedNodeIds.split(',');
        } */

    var checkedNodeIds = []
    window.$('.tp-list input:checked').each(function() {
      var _parent = window.$(this).parent()
      var nodeId = _parent.attr('node_id')
      checkedNodeIds.push(nodeId)
    })

    /* if(_this.is(':checked')){
            checkedNodeIds.push(nodeId);
            nodes.splice(1,1);
            console.log('checked');
        } else {
            console.log('un checked');
            var sub_nodes = []
            sub_nodes = nodes.splice(0,1);
            console.log(nodes);
            console.log(sub_nodes);
            graphInit(nodes, links);
        } */
    highLight(checkedNodeIds, cy)
    /* // 需要隐藏的节点及子节点
        var choosedNode = getGraphNode(nodeId,nodes);
        var subNodes = getSubNodes(choosedNode,links);
        subNodes.push(choosedNode);

        // 剩下的节点
        var lastNodes = [];
        for(var i = 0; i < nodes.length; i++){
            var node = nodes[i];
            if(!getGraphNode(node.nodeId,subNodes)){
                lastNodes.push(node);
            }
        }

        // 剩下的连线
        var lastLinks = filterLinksByNodes(lastNodes,links);

        graphInit(lastNodes, lastLinks);
        if(_this.is(':checked')){
            nodes.splice(1,1);
            console.log('checked');
        } else {
            console.log('un checked');
            var sub_nodes = []
            sub_nodes = nodes.splice(0,1);
            console.log(nodes);
            console.log(sub_nodes);
            graphInit(nodes, links);
        }
        console.log(nodeId); */
  })
}
// 筛选面板：聚焦准备
function focusReady(node) {
  filterReset()
  window.$('#FocusInput').val(node.data.obj.properties.name)
  window.$('#FocusInput').attr('node_id', node.nodeId)
  window.$('#FocusBt').text('聚焦')
  window.$('#FocusBt').removeClass('focusDisable')
  window.$('#ClearInput').show()
}
// 筛选面板：取消聚焦
function focusCancel() {
  window.$('#ClearInput').hide()
  window.$('#FocusBt').text('聚焦')
  window.$('#FocusBt').addClass('focusDisable')
  window.$('#FocusInput').val('')
  window.$('#FocusInput').attr('node_id', '')
  selPanelUpdateList(_rootData.nodes, _rootData.links, true)
  cancelHighLight()
}

// function maoScale(type) {
//   /* var c=window.$('canvas').eq(2).attr('id','myCanvas');
//     var c=document.getElementById("myCanvas");
//     console.log(c);
//     var ctx = c.getContext("2d");
//     ctx.font = "5px Arial";
//     ctx.fillText("上海", 1, 10);

//     return; */

//   //
//   var rate = 0.2
//   var scale = cy.zoom()
//   if (type == 1) {
//     scale += rate
//   } else if (type == 2) {
//     scale -= rate
//   }

//   cy.zoom({
//     level: scale // the zoom level
//   })
// }

function resizeScreen() {
  if (isFullScreen()) {
    window.$('#TrFullScreen').addClass('active')
    window.$('#TrFullScreen').html('<span class="screen2ed"></span>退出')
  } else {
    window.$('#TrFullScreen').removeClass('active')
    window.$('#TrFullScreen').html('<span class="screen2"></span>全屏')
  }

  // cy.pan();
  /* if(document.body.clientHeight>700){
        window.$('#Main').height(document.body.clientHeight-66);
        console.log(document.body.clientHeight);
    }else{
        window.$('#Main').height(640);
    } */
}

function isFullScreen() {
  if (document.fullscreen) {
    return true
  } else if (document.mozFullScreen) {
    return true
  } else if (document.webkitIsFullScreen) {
    return true
  } else if (document.msFullscreenElement) {
    return true
  } else {
    return false
  }
}
function launchFullScreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  }
}
function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen()
  }
}

// function toggleText() {
//   if (window.$('#TrTxt').hasClass('active')) {
//     window.$('#TrTxt').removeClass('active')
//     cy.collection('edge').removeClass('edgeShowText')
//   } else {
//     window.$('#TrTxt').addClass('active')
//     cy.collection('edge').addClass('edgeShowText')
//   }
// }

/** **** 图谱 相关 ******/
/* function highlight( node ){
    var oldNhood = lastHighlighted;

    var nhood = lastHighlighted = node.closedNeighborhood();
    var others = lastUnhighlighted = cy.elements().not( nhood );

    var reset = function(){
        cy.batch(function(){
            others.addClass('hidden');
            nhood.removeClass('hidden');

            allEles.removeClass('faded highlighted');

            nhood.addClass('highlighted');

            others.nodes().forEach(function(n){
                var p = n.data('orgPos');

                n.position({ x: p.x, y: p.y });
            });
        });

        return Promise.resolve().then(function(){
            if( isDirty() ){
                return fit();
            } else {
                return Promise.resolve();
            };
        }).then(function(){
            return Promise.delay( aniDur );
        });
    };

    var runLayout = function(){
        var p = node.data('orgPos');

        var l = nhood.filter(':visible').makeLayout({
            name: 'concentric',
            fit: false,
            animate: true,
            animationDuration: aniDur,
            animationEasing: easing,
            boundingBox: {
                x1: p.x - 1,
                x2: p.x + 1,
                y1: p.y - 1,
                y2: p.y + 1
            },
            avoidOverlap: true,
            concentric: function( ele ){
                if( ele.same( node ) ){
                    return 2;
                } else {
                    return 1;
                }
            },
            levelWidth: function(){ return 1; },
            padding: layoutPadding
        });

        var promise = cy.promiseOn('layoutstop');

        l.run();

        return promise;
    };

    var fit = function(){
        return cy.animation({
            fit: {
                eles: nhood.filter(':visible'),
                padding: layoutPadding
            },
            easing: easing,
            duration: aniDur
        }).play().promise();
    };

    var showOthersFaded = function(){
        return Promise.delay( 250 ).then(function(){
            cy.batch(function(){
                others.removeClass('hidden').addClass('faded');
            });
        });
    };

    return Promise.resolve()
        .then( reset )
        .then( runLayout )
        .then( fit )
        .then( showOthersFaded )
        ;

}//hilight */
function drawGraph(elements) {
  cy = window.cytoscape({
    container: document.getElementById('MainCy'),
    motionBlur: false,
    textureOnViewport: false,
    wheelSensitivity: 0.1,
    elements: elements,
    minZoom: 0.4,
    maxZoom: 2.5,
    layout: {
      name: 'preset',
      componentSpacing: 40,
      nestingFactor: 12,
      padding: 10,
      edgeElasticity: 800,
      stop: function(e) {
        // 解决浏览器标签切换排列问题
        if (document[state] == 'hidden') {
          _isNeedReload = true
          //                        console.log('stop _isNeedReload=true');
        } else {
          _isNeedReload = false
        }
        setTimeout(function() {
          if (document[state] == 'hidden') {
            _isGraphLoaded = false
            console.log('stop _isGraphLoaded=false')
          } else {
            _isGraphLoaded = true
          }
        }, 1000)
      }
    },
    style: [
      {
        selector: 'node',
        style: {
          shape: 'ellipse',
          width: function(ele) {
            // 当前节点有图片
            if (
              ele.data('type') == 'Person' &&
              _currentKeyNo == ele.data('keyNo') &&
              ele.data('hasImage')
            ) {
              return 80
            }
            // 有图片
            if (ele.data('hasImage') && ele.data('type') == 'Person') {
              return 60
            }
            // 普通
            if (ele.data('type') == 'Company') {
              return 60
            }
            return 45
          },
          height: function(ele) {
            // 当前节点有图片
            if (
              ele.data('type') == 'Person' &&
              _currentKeyNo == ele.data('keyNo') &&
              ele.data('hasImage')
            ) {
              return 80
            }
            // 有图片
            if (ele.data('hasImage') && ele.data('type') == 'Person') {
              return 60
            }
            // 普通
            if (ele.data('type') == 'Company') {
              return 60
            }
            return 45
          },
          'background-color': function(ele) {
            console.log(ele);
            return ele.data('color')
          },
          'background-fit': 'cover',
          'background-image': function(ele) {
            var hasImage = ele.data('hasImage')
            var keyNo = ele.data('keyNo')
            var type = ele.data('type')
            if (hasImage && type == 'Person') {
              return (
                'https://co-image.qichacha.com/PersonImage/' + keyNo + '.jpg'
              )
            } else {
              return 'none'
            }
          },
          // 'background-image-crossorigin': 'use-credentials',
          'border-color': function(ele) {
            return ele.data('borderColor')
          },
          'border-width': function(ele) {
            if (ele.data('hasImage') && ele.data('type') == 'Person') {
              return 3
            } else {
              return 1
            }
          },
          'border-opacity': 1,
          label: function(ele) {
            var label = ele.data('name')
            var length = label.length

            if (length <= 5) {
              // 4 5 4排列
              return label
            } else if (length >= 5 && length <= 9) {
              return (
                label.substring(0, length - 5) +
                '\n' +
                label.substring(length - 5, length)
              )
            } else if (length >= 9 && length <= 13) {
              return (
                label.substring(0, 4) +
                '\n' +
                label.substring(4, 9) +
                '\n' +
                label.substring(9, 13)
              )
            } else {
              return (
                label.substring(0, 4) +
                '\n' +
                label.substring(4, 9) +
                '\n' +
                label.substring(9, 12) +
                '..'
              )
            }
          },
          'z-index-compare': 'manual',
          'z-index': 20,
          color: '#fff',
          // 'padding-top':0,
          padding: function(ele) {
            if (ele.data('type') == 'Company') {
              return 3
            }
            return 0
          },
          'font-size': 12,
          // 'min-height':'400px',
          // 'ghost':'yes',
          // 'ghost-offset-x':300,
          // 'font-weight':800,
          // 'min-zoomed-font-size':6,
          'font-family': 'microsoft yahei',
          'text-wrap': 'wrap',
          'text-max-width': 60,
          'text-halign': 'center',
          'text-valign': 'center',
          'overlay-color': '#fff',
          'overlay-opacity': 0,
          'background-opacity': 1,
          'text-background-color': '#000',
          'text-background-shape': 'roundrectangle',
          'text-background-opacity': function(ele) {
            if (ele.data('hasImage') && ele.data('type') == 'Person') {
              return 0.3
            } else {
              return 0
            }
          },
          'text-background-padding': 0,
          'text-margin-y': function(ele) {
            // 当前节点有图片
            if (
              ele.data('type') == 'Person' &&
              _currentKeyNo == ele.data('keyNo') &&
              ele.data('hasImage')
            ) {
              return 23
            }
            // 有图片
            if (ele.data('hasImage') && ele.data('type') == 'Person') {
              return 16
            }
            //
            if (ele.data('type') == 'Company') {
              return 4
            }
            return 2
          }
        }
      },
      {
        selector: 'edge',
        style: {
          'line-style': function(ele) {
            return 'solid'
            /* if(ele.data('data').obj.type == 'INVEST'){
                            return 'solid';
                        } else {
                            return 'dashed'
                        } */
          },
          'curve-style': 'bezier',
          'control-point-step-size': 20,
          'target-arrow-shape': 'triangle-backcurve',
          'target-arrow-color': function(ele) {
            return ele.data('color')
          },
          'arrow-scale': 0.5,
          'line-color': function(ele) {
            // return '#aaaaaa';
            return ele.data('color')
          },
          label: function(ele) {
            return ''
          },
          'text-opacity': 0.8,
          'font-size': 12,
          'background-color': function(ele) {
            return '#ccc'
          },
          width: 0.3,
          'overlay-color': '#fff',
          'overlay-opacity': 0,
          'font-family': 'microsoft yahei'
        }
      },
      {
        selector: '.autorotate',
        style: {
          'edge-text-rotation': 'autorotate'
        }
      },
      {
        selector: '.nodeActive',
        style: {
          /* 'background-color':function (ele) {
                        if(ele.data("category")==1){
                            return "#5c8ce4"
                        }
                        return "#d97a3a";
                    }, */
          // 'z-index':300,
          'border-color': function(ele) {
            return ele.data('color')
          },
          'border-width': 10,
          'border-opacity': 0.5
        }
      },
      {
        selector: '.edgeShow',
        style: {
          color: '#999',
          'text-opacity': 1,
          'font-weight': 400,
          label: function(ele) {
            return ele.data('label')
          },
          'font-size': 10
        }
      },
      {
        selector: '.edgeActive',
        style: {
          'arrow-scale': 0.8,
          width: 1.5,
          color: '#330',
          'text-opacity': 1,
          'font-size': 12,
          'text-background-color': '#fff',
          'text-background-opacity': 0.8,
          'text-background-padding': 0,
          'source-text-margin-y': 20,
          'target-text-margin-y': 20,
          // 'text-margin-y':3,
          'z-index-compare': 'manual',
          'z-index': 1,
          'line-color': function(ele) {
            return ele.data('color')
          },
          'target-arrow-color': function(ele) {
            return ele.data('color')
          },
          label: function(ele) {
            /* if(ele.data('data').obj.type == 'INVEST'){
                            return 'solid';
                        } else {
                            return 'dashed'
                        } */
            return ele.data('label')
          }
        }
      },
      {
        selector: '.hidetext',
        style: {
          'text-opacity': 0
        }
      },
      {
        selector: '.dull',
        style: {
          'z-index': 1,
          opacity: 0.2
        }
      },
      {
        selector: '.nodeHover',
        style: {
          shape: 'ellipse',
          'background-opacity': 0.9
        }
      },
      {
        selector: '.edgeLevel1',
        style: {
          label: function(ele) {
            return ele.data('label')
          }
        }
      },
      {
        selector: '.edgeShowText',
        style: {
          label: function(ele) {
            return ele.data('label')
          }
        }
      },
      {
        selector: '.lineFixed', // 加载完成后，加载该类，修复线有锯齿的问题
        style: {
          'overlay-opacity': 0
        }
      }
    ]
  })

  window.cy = cy

  cy.on('click', 'node', function(evt) {
    if (evt.target._private.style['z-index'].value == 20) {
      // 非暗淡状态
      _isFocus = true
      var node = evt.target

      highLight([node._private.data.id], cy)

      if (node.hasClass('nodeActive')) {
        activeNode = null
        window.$('#company-detail').hide()
        node.removeClass('nodeActive')
        cy.collection('edge').removeClass('edgeActive')
      } else {
        var nodeData = node._private.data
        if (nodeData.type == 'Company') {
          showDetail2(nodeData.keyNo, 'company_muhou3')
          cy.collection('node').addClass('nodeDull')
        } else {
          showDetail2(nodeData.keyNo, 'company_muhou3', 'person')
          cy.collection('node').addClass('nodeDull')
        }

        activeNode = node
        cy.collection('node').removeClass('nodeActive')

        cy.collection('edge').removeClass('edgeActive')
        node.addClass('nodeActive')
        node.neighborhood('edge').removeClass('opacity')
        node.neighborhood('edge').addClass('edgeActive')
        node
          .neighborhood('edge')
          .connectedNodes()
          .removeClass('opacity')
      }
      // _firstTab = false;
    } else {
      _isFocus = false
      activeNode = null
      cy.collection('node').removeClass('nodeActive')
      window.$('.tp-detail').fadeOut()
      cancelHighLight()
    }
  })
  var showTipsTime = null
  cy.on('mouseover', 'node', function(evt) {
    if (evt.target._private.style['z-index'].value == 20) {
      // 非暗淡状态
      //
      window.$('#Main').css('cursor', 'pointer')

      //
      var node = evt.target
      node.addClass('nodeHover')
      if (!_isFocus) {
        cy.collection('edge').removeClass('edgeShow')
        cy.collection('edge').removeClass('edgeActive')
        node.neighborhood('edge').addClass('edgeActive')
      }

      // 提示
      clearTimeout(showTipsTime)
      // if(node._private.data.name.length > 13 || (node._private.data.keyNo[0] == 'p' && node._private.data.name.length > 3) || node._private.data.layout.revel > 2){
      if (
        node._private.data.name.length > 13 ||
        (node._private.data.keyNo &&
          node._private.data.keyNo[0] == 'p' &&
          node._private.data.name.length > 3)
      ) {
        showTipsTime = setTimeout(function() {
          var name = node._private.data.name

          // 显示在节点位置
          /* var tipWidth = name.length * 12 + 16;
                    var x = node._private.data.d3x + 655 - (tipWidth / 2);
                    var y = node._private.data.d3y + 598;
                    if(node._private.data.type == 'Person'){
                        y = node._private.data.d3y + 590;
                    } */

          // 显示在鼠标位置
          var event = evt.originalEvent || window.event
          var x = event.clientX + 10
          var y = event.clientY + 10

          var html =
            "<div class='tips' style='font-size:12px;background:white;box-shadow:0px 0px 3px #999;border-radius:1px;opacity:1;padding:1px;padding-left:8px;padding-right:8px;display:none;position: absolute;left:" +
            x +
            'px;top:' +
            y +
            "px;'>" +
            name +
            '</div>'
          window.$('body').append(window.$(html))
          window.$('.tips').fadeIn()
        }, 600)
      }
    }
  })
  cy.on('mouseout', 'node', function(evt) {
    window.$('#Main').css('cursor', 'default')

    // 提示
    window.$('.tips').fadeOut(function() {
      window.$('.tips').remove()
    })

    clearTimeout(showTipsTime)

    //
    var node = evt.target
    node.removeClass('nodeHover')
    if (!_isFocus) {
      cy.collection('edge').removeClass('edgeActive')
      /* if(moveTimeer){
                clearTimeout(moveTimeer);
            } */
      /* moveTimeer = setTimeout(function() {
                cy.collection("edge").addClass("edgeActive");
                //cy.collection("edge").addClass("edgeShow");
            }, 300);
            if(activeNode){
                activeNode.neighborhood("edge").addClass("edgeActive");
            } */
    }
  })
  cy.on('mouseover', 'edge', function(evt) {
    if (!_isFocus) {
      var edge = evt.target
      /* if(moveTimeer){
                clearTimeout(moveTimeer);
            } */
      cy.collection('edge').removeClass('edgeActive')
      edge.addClass('edgeActive')
      /* if(activeNode){
                activeNode.neighborhood("edge").addClass("edgeActive");
            } */
    }
  })
  cy.on('mouseout', 'edge', function(evt) {
    if (!_isFocus) {
      var edge = evt.target
      edge.removeClass('edgeActive')
      // moveTimeer = setTimeout(function() {
      //     cy.collection("edge").addClass("edgeActive");
      //     //cy.collection("edge").addClass("edgeShow");
      // }, 400);
      if (activeNode) {
        activeNode.neighborhood('edge').addClass('edgeActive')
      }
    }
  })
  cy.on('vmousedown', 'node', function(evt) {
    var node = evt.target
    if (!_isFocus) {
      highLight([node._private.data.id], cy)
    }
  })
  cy.on('tapend', 'node', function(evt) {
    if (!_isFocus) {
      cancelHighLight()
    }
  })

  cy.on('click', 'edge', function(evt) {
    _isFocus = false
    activeNode = null
    cy.collection('node').removeClass('nodeActive')
    window.$('.tp-detail').fadeOut()
    cancelHighLight()
  })
  cy.on('click', function(event) {
    var evtTarget = event.target

    if (evtTarget === cy) {
      _isFocus = false
      activeNode = null
      cy.collection('node').removeClass('nodeActive')
      window.$('.tp-detail').fadeOut()
      cancelHighLight()
      focusCancel()
      filterReset()

      // cy.collection("edge").addClass("edgeActive");
    } else {
      // console.log('tap on some element');
    }
  })

  cy.on('zoom', function() {
    if (cy.zoom() < 0.5) {
      cy.collection('node').addClass('hidetext')
      cy.collection('edge').addClass('hidetext')
    } else {
      cy.collection('node').removeClass('hidetext')
      cy.collection('edge').removeClass('hidetext')
    }

    // 加载完成后，加载该类，修复线有锯齿的问题
    setTimeout(function() {
      cy.collection('edge').removeClass('lineFixed')
      cy.collection('edge').addClass('lineFixed')
    }, 200)
  })

  cy.on('pan', function() {
    // 加载完成后，加载该类，修复线有锯齿的问题
    setTimeout(function() {
      cy.collection('edge').removeClass('lineFixed')
      cy.collection('edge').addClass('lineFixed')
    }, 200)
  })

  // 定位
  cy.nodes().positions(function(node, i) {
    // 保持居中
    if (node._private.data.keyNo == _currentKeyNo) {
      var position = cy.pan()
      cy.pan({
        x: position.x - node._private.data.d3x,
        y: position.y - node._private.data.d3y
      })
    }

    //
    return {
      x: node._private.data.d3x,
      y: node._private.data.d3y
    }
  })

  cy.ready(function() {
    if (!window.$('#TrTxt').hasClass('active')) {
      window.$('#TrTxt').click()
    }

    cy.zoom({
      level: 1.0000095043745896 // the zoom level
    })
    window.$('#load_data').hide()
    // cy.window.$('#'+id).emit('tap');
    // cy.center(cy.window.$('#'+id));
    // cy.collection("edge").addClass("edgeActive");

    // 加载完成后，加载该类，修复线有锯齿的问题
    setTimeout(function() {
      cy.collection('edge').addClass('lineFixed')
    }, 400)

    // 首页的插入图谱默认高亮第一层
    if (_rootData && _rootData.nodes.length > 30) {
      highLight([_rootNode.nodeId], cy)
    }
  })

  cy.nodes(function(node) {
    /*
        // 当前查询节点关系文字显示
        if(node._private.data.nodeId == _rootNode.nodeId){
            node.neighborhood("edge").addClass("edgeLevel1");
        } */
  })
}
function highLight(nodeIds, cy) {
  cy.collection('node').removeClass('nodeActive')
  cy.collection('edge').removeClass('edgeActive')
  cy.collection('node').addClass('dull')
  cy.collection('edge').addClass('dull')

  for (var i = 0; i < nodeIds.length; i++) {
    var nodeId = nodeIds[i]
    cy.nodes(function(node) {
      var nodeData = node._private.data
      if (nodeData.id == nodeId) {
        node.removeClass('dull')
        node.addClass('nodeActive');
        node.neighborhood('edge').removeClass('dull')
        node.neighborhood('edge').addClass('edgeActive')
        node
          .neighborhood('edge')
          .connectedNodes()
          .removeClass('dull')
        node.neighborhood("edge").connectedNodes().addClass("nodeActive");
      }
    })
  }
}
function highLightFilter(nodeIds, cy) {
  function isInNodeIds(nodeId) {
    for (var i = 0; i < nodeIds.length; i++) {
      if (nodeId == nodeIds[i]) {
        return true
      }
    }
    return false
  }

  cy.collection('node').removeClass('nodeActive')
  cy.collection('edge').removeClass('edgeActive')
  cy.collection('node').addClass('dull')
  cy.collection('edge').addClass('dull')

  for (var i = 0; i < nodeIds.length; i++) {
    var nodeId = nodeIds[i]
    cy.nodes(function(node) {
      var nodeData = node._private.data
      if (nodeData.id == nodeId) {
        node.removeClass('dull')
        // node.addClass('nodeActive');
        /* node.neighborhood("edge").removeClass("dull");
                node.neighborhood("edge").addClass("edgeActive");
                node.neighborhood("edge").connectedNodes().removeClass("dull"); */
        // node.neighborhood("edge").connectedNodes().addClass("nodeActive");
      }
    })
  }

  cy.edges(function(edge) {
    var data = edge._private.data
    if (isInNodeIds(data.target) && isInNodeIds(data.source)) {
      edge.removeClass('dull')
      edge.addClass('edgeActive')
    }
  })
}
function cancelHighLight() {
  cy.collection('node').removeClass('nodeActive')
  cy.collection('edge').removeClass('edgeActive')
  cy.collection('node').removeClass('dull')
  cy.collection('edge').removeClass('dull')
}

/** 其他 */

function getD3Position(graph) {
  getLayoutNode(graph)

  function filterLinks1(graph) {
    // 筛选用于布局的links
    var layoutLinks = []
    for (var i = 0; i < graph.links.length; i++) {
      var link = graph.links[i]
      var sourceLevel = link.sourceNode.layout.level
      var targetLevel = link.targetNode.layout.level
      // var sourceNode = link.sourceNode
      // var targetNode = link.targetNode
      //            sourceNode.layout.isSetLink = false;
      //            targetNode.layout.isSetLink = false;

      //            if(!sourceNode.layout.isSetLink && !targetNode.layout.isSetLink){
      if (
        (sourceLevel == 1 && targetLevel == 2) ||
        (sourceLevel == 2 && targetLevel == 1)
      ) {
        //                    sourceNode.layout.isSetLink = true;
        //                    targetNode.layout.isSetLink = true;
        layoutLinks.push(link)
      }
      if (
        (sourceLevel == 2 && targetLevel == 3) ||
        (sourceLevel == 3 && targetLevel == 2)
      ) {
        //                    sourceNode.layout.isSetLink = true;
        //                    targetNode.layout.isSetLink = true;
        layoutLinks.push(link)
      }
      //            }
    }

    layoutLinks.forEach(function(link, i) {
      if (link.targetNode.layout.level == 3) {
        layoutLinks.forEach(function(alink, j) {
          if (
            alink.linkId != link.linkId &&
            (alink.targetNode.nodeId == link.targetNode.nodeId ||
              alink.sourceNode.nodeId == link.targetNode.nodeId)
          ) {
            layoutLinks.splice(j, 1)
          }
        })
      }

      if (link.sourceNode.layout.level == 3) {
        layoutLinks.forEach(function(alink, j) {
          if (
            alink.linkId != link.linkId &&
            (alink.targetNode.nodeId == link.sourceNode.nodeId ||
              alink.sourceNode.nodeId == link.sourceNode.nodeId)
          ) {
            layoutLinks.splice(j, 1)
          }
        })
      }
    })

    return layoutLinks
  }

  // function filterLinks2(graph) {
  //   // 筛选用于布局的links
  //   var layoutLinks = []
  //   for (var i = 0; i < graph.links.length; i++) {
  //     var link = graph.links[i]
  //     var sourceLevel = link.sourceNode.layout.level
  //     var targetLevel = link.targetNode.layout.level
  //     var sourceNode = link.sourceNode
  //     var targetNode = link.targetNode

  //     if (
  //       (sourceLevel == 1 && targetLevel == 2) ||
  //       (sourceLevel == 2 && targetLevel == 1)
  //     ) {
  //       layoutLinks.push(link)
  //     }
  //     if (
  //       (sourceLevel == 2 && targetLevel == 3) ||
  //       (sourceLevel == 3 && targetLevel == 2)
  //     ) {
  //       layoutLinks.push(link)
  //     }
  //   }

  //   return layoutLinks
  // }

  function initD3Data(graph) {
    //
    function getIndex(val, arr) {
      var index = 0
      for (var i = 0; i < arr.length; i++) {
        var obj = arr[i]
        if (val == obj.nodeId) {
          index = i
          break
        }
      }
      return index
    }

    /* 封装符合d3的数据 */
    for (var i = 0; i < graph.nodes.length; i++) {
      var node = graph.nodes[i]
      node.id = node.nodeId
    }

    for (let i = 0; i < graph.links.length; i++) {
      var link = graph.links[i]
      link.source = getIndex(link.sourceNode.nodeId, graph.nodes)
      link.target = getIndex(link.targetNode.nodeId, graph.nodes)
      link.index = i //
    }

    graph.layoutLinks = filterLinks1(graph)

    // 围绕节点最大数值
    setSingleLinkNodes(graph.layoutLinks)
    graph.nodes.forEach(function(node, i) {
      if (
        node.layout.singleLinkChildren.length &&
        _maxChildrenLength < node.layout.singleLinkChildren.length
      ) {
        _maxChildrenLength = node.layout.singleLinkChildren.length
      }
    })
    // console.log('围绕节点最大数值:' + _maxChildrenLength);
  }

  initD3Data(graph) //

  var width = window.$('#MainD3 svg').width()
  var height = window.$('#MainD3 svg').height()

  var strength = -600
  var distanceMax = 330
  var theta = 0
  var distance = 130
  var colideRadius = 35
  // 根据节点数量调节
  if (graph.nodes.length < 50) {
    strength = -800
    distanceMax = 400
  } else if (graph.nodes.length > 50 && graph.nodes.length < 100) {
    strength = -800
    distanceMax = 350
    distance = 130
    colideRadius = 35
  } else if (graph.nodes.length > 100 && graph.nodes.length < 150) {
    strength = -900
    distanceMax = 450
  } else if (graph.nodes.length > 150 && graph.nodes.length < 200) {
    strength = -1000
    distanceMax = 500
  } else if (graph.nodes.length > 200) {
    strength = -1600
    distanceMax = 500
    distance = 100
    colideRadius = 35
    theta = 0.6
  }
  // 根据围绕数量调节
  if (_maxChildrenLength > 50 && _maxChildrenLength < 100) {
    strength = -2000
    distanceMax = 500
  } else if (_maxChildrenLength > 1000 && _maxChildrenLength < 2000) {
    strength = -4000
    distanceMax = 1500
  }

  window.d3
    .forceSimulation(graph.nodes)
    .force(
      'charge',
      window.d3
        .forceManyBody()
        .strength(strength)
        .distanceMax(distanceMax)
        .theta(theta)
    )
    .force('link', window.d3.forceLink(graph.layoutLinks).distance(distance))
    .force('center', window.d3.forceCenter(width / 2, height / 2))
    .force(
      'collide',
      window.d3.forceCollide().radius(function() {
        return colideRadius
      })
    )
  // .on('tick',ticked);
}

/** window.d3 svg */
/* var svg = window.d3.select('svg');
svg.selectAll('g').remove();// 清空
var svg_g = svg.append("g")

// 结点
var svg_nodes = svg_g.selectAll('circle')
    .enter().append('circle')
    .attr('r', function (d) {
        if(d.data.obj.labels[0] == 'Company'){
            return 33;
        } else {
            return 24;
        }
    })
    .attr('fill', function(d, i) {
        return d.data.color;
    })
    .style('opacity',1) */
/** end window.d3 svg */

/* function ticked() {
    svg_nodes.attr("cx", function(d) {  return d.x; })
        .attr("cy", function(d) { return d.y; });
} */

// 设置符合Layout的node
function getLayoutNode(graphData) {
  var layoutNode = {
    current: _rootNode,
    level1: [],
    level2: [],
    level3: [],
    level4: [],
    level5: [],
    other: []
  }

  graphData.nodes.forEach(function(node, i) {
    switch (node.layout.level) {
      case 1:
        layoutNode.level1.push(node)
        break
      case 2:
        layoutNode.level2.push(node)
        break
      case 3:
        layoutNode.level3.push(node)
        break
      case 4:
        layoutNode.level4.push(node)
        break
      case 5:
        layoutNode.level5.push(node)
        break
      default:
        layoutNode.other.push(node)
        break
    }
  })

  return layoutNode
}
// 将rootData转换成cy图谱框架所需要的数据结构
function transformData(graphData) {
  function getLinkColor(type) {
    if (type == 'INVEST') {
      return _COLOR.line.invest
    } else if (type == 'EMPLOY') {
      return _COLOR.line.employ
    } else if (type == 'LEGAL') {
      return _COLOR.line.legal
    }
  }
  function getLinkLabel(link) {
    var type = link.data.obj.type
    var role = link.data.obj.properties.role
    if (type == 'INVEST') {
      return '投资'
    } else if (type == 'EMPLOY') {
      return role || '任职'
    } else if (type == 'LEGAL') {
      return '法定代表人'
    }
  }
  // getLayoutNode(graphData);

  //
  // id = graphData.nodes[0].nodeId
  var els = {}
  els.nodes = []
  els.edges = []

  graphData.links.forEach(function(link, i) {
    var color = getLinkColor(link.data.obj.type)
    var label = getLinkLabel(link)
    console.log(label)
    els.edges.push({
      data: {
        data: link.data,
        color: color,
        id: link.linkId,
        label: label,
        source: link.sourceNode.nodeId,
        target: link.targetNode.nodeId
      },
      classes: 'autorotate'
    })
  })

  graphData.nodes.forEach(function(node) {
    els.nodes.push({
      data: {
        nodeId: node.nodeId,
        type: node.data.obj.labels[0],
        keyNo: node.data.obj.properties.keyNo,
        data: node.data,
        id: node.nodeId,
        name: node.data.obj.properties.name,
        category: node.data.category,
        color: node.data.color,
        borderColor: node.data.strokeColor,
        layout: node.layout,
        d3x: node.x,
        d3y: node.y,
        hasImage: node.data.obj.properties.hasImage
        // labelLine:1 // 解决文字行距问题，第1行
      }
    })
  })

  return els
}
// 图谱、筛选面板更新
function domUpdate(graphData) {
  getD3Position(graphData)

  setTimeout(function() {
    const data = transformData(graphData)
    console.log(data);
    drawGraph(data)
  }, 500)

  selPanelUpdateList(graphData.nodes, graphData.links, true)
}

// 截图2
// function downImg(imgdata) {
//   var type = 'png'
//   // 将mime-type改为image/octet-stream,强制让浏览器下载
//   var fixtype = function(type) {
//     type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg')
//     var r = type.match(/png|jpeg|bmp|gif/)[0]
//     return 'image/' + r
//   }
//   imgdata = imgdata.replace(fixtype(type), 'image/octet-stream')
//   // 将图片保存到本地
//   var saveFile = function(data, filename) {
//     var link = document.createElement('a')
//     link.href = data
//     link.download = filename
//     var event = document.createEvent('MouseEvents')
//     event.initMouseEvent(
//       'click',
//       true,
//       false,
//       window,
//       0,
//       0,
//       0,
//       0,
//       0,
//       false,
//       false,
//       false,
//       false,
//       0,
//       null
//     )
//     link.dispatchEvent(event)
//   }
//   var filename = new Date().toLocaleDateString() + '.' + type
//   saveFile(imgdata, filename)
// }
// 截图2 IE
// function downloadimgIE(canvas) {
//   function post(URL, PARAMS) {
//     var temp = document.createElement('form')
//     temp.action = URL
//     temp.enctype = 'multipart/form-data'
//     temp.method = 'post'
//     temp.style.display = 'none'
//     for (var x in PARAMS) {
//       var opt = document.createElement('textarea')
//       opt.name = x
//       opt.value = PARAMS[x]
//       temp.appendChild(opt)
//     }
//     document.body.appendChild(temp)
//     temp.submit()
//     return temp
//   }

//   var qual = 1
//   if (canvas.width > 3000) {
//     qual = 0.5
//   } else if (canvas.width > 5000) {
//     qual = 0.4
//   }
//   // 设置保存图片的类型
//   var imgdata = canvas.toDataURL('image/jpeg', qual)
//   // var filename = '{{window.$smarty.get.name}}的关联图谱_'+new Date().toLocaleDateString() + '.jpeg';
//   // var filename = _FILENAME + '的关联图谱.png';
//   var filename = '企查查_图谱.png'
//   post(INDEX_URL + 'cms_downloadimg?filename=' + filename, { img: imgdata })
// }
// 截图1
function canvasImg(imgData) {
  var img = new Image()

  img.onload = function(e) {
    var canvas = document.createElement('canvas') // 准备空画布
    canvas.width = img.width
    canvas.height = img.height
    var context = canvas.getContext('2d') // 取得画布的2d绘图上下文
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)

    // 画水印
    // var shuiying = new Image();
    // shuiying.src="/material/theme/chacha/cms/v2/images/shuiying2.png";
    // if(canvas.width>320){
    //     context.drawImage(shuiying, canvas.width/2-160, canvas.height/2-80,320,160);
    // }else{
    //     context.drawImage(shuiying, canvas.width/2-80, canvas.height/2-40,160,80);
    // }

    var shuiying = new Image()
    shuiying.src = '/material/theme/chacha/cms/v2/images/shuiying2.png'
    for (var i = 0; i < canvas.width + 100; i += 600) {
      for (var j = 0; j < canvas.height + 100; j += 456) {
        context.drawImage(shuiying, i, j)
      }
    }

    // 画图谱
    context.drawImage(img, 0, 0)

    if (canvas.width > 400) {
      var marker = '关联图谱由企查查基于公开信息利用大数据分析引擎独家生成'
      context.font = '28px 微软雅黑'
      context.fillStyle = '#aaaaaa'
      context.fillText(
        marker,
        canvas.width / 2 - context.measureText(marker).width / 2,
        canvas.height - 30
      )
    }

    // downloadimgIE(canvas)

    /* if(!!window.ActiveXObject || "ActiveXObject" in window){ // ie
            context.drawImage(shuiying, canvas.width/2-160, canvas.height/2-80,320,160);
            downloadimgIE(canvas);
        } else {
            downImg(canvas.toDataURL('image/jpeg',1));
        } */
  }

  img.src = imgData
}

function getData(keyNo, param) {
  // var defaultParam = {
  //   keyNo: keyNo
  // }

  // if (keyNo.substr(0, 1) == 'p') {
  //   defaultParam.startLabel = 'Person'
  // }

  // param = window.$.extend(defaultParam, param)

  // window.$('#load_data').show()

  // var url = INDEX_URL + '/company_muhouPersonAction'
  // if (_TUPU_URL) {
  //   url = _TUPU_URL
  // }
  // if (typeof _INSERT_URL != 'undefined' && _INSERT_URL) {
  //   url = _INSERT_URL
  // }
  const data = Promise.resolve(allData)
  data.then(re => {
    re = re.success
    if (
      !re ||
      re.results == undefined ||
      !re.results[0] ||
      !re.results[0].data.length ||
      re.results[0].data[0].graph.nodes.length == 0
    ) {
      window.$('#load_data').hide()
      window.$('.printLogo').hide()
      window.$('.tp-foot').hide()
      window.$('#Main').hide()
      window.$('#no_data').show()
      return
    } else {
      window.$('.printLogo').show()
      window.$('.tp-foot').show()
      window.$('#Main').show()
      window.$('#no_data').hide()
    }

    _rootData = getRootData(re.results[0].data)

    domUpdate(_rootData)
  })
}

function refresh(keyNo) {
  window.$('.company-detail').fadeOut()
  window.$('#MainCy').html('')
  _currentKeyNo = keyNo
  window.$('#TrTxt').removeClass('active')
  getData(_currentKeyNo)
  focusCancel()
  filterReset()

  // 页面
  // try {
  //   hideSearchBoxHide()
  // } catch (e) {}
}

/** 详情弹窗 */
// function showPerTupu(type) {
//   var canshow = window.$('#ShowPerTupu').attr('canshow')
//   if (canshow) {
//     var keyNo = window.$('#ShowPerTupu').attr('keyno')
//     refresh(keyNo)
//   }
// }
/* 关闭详情 */
// function popclose(dom) {
//   window.$(dom)
//     .parent()
//     .parent()
//     .fadeOut()
// }
/* 人物头像没有时处理 */
// function personImgErr() {
//   var name = window.$('.ea_name').text()
//   window.$('#face_oss').hide()
//   window.$('.ea_defaultImg').show()
//   window.$('.ea_defaultImg').text(name[0])
// }
/** END 详情弹窗 */

window.onresize = function() {
  resizeScreen()
  printLogoFixed()
}

function start(data, key) {
  rootKey = key
  allData = data
  printLogoFixed()
  getData(key)

  /** 筛选面板 */

  // 层级筛选
  window.$('#ShowLevel > a').click(function() {
    window.$('#ShowLevel > a').removeClass('active')
    window.$(this).addClass('active')

    var level = parseInt(window.$(this).attr('level'))
    window.$('#SelPanel').attr('param-level', level)
    filter(_rootData)
  }) // #ShowLevel
  // 状态筛选
  window.$('#ShowStatus > a').click(function() {
    window.$('#ShowStatus > a').removeClass('active')
    window.$(this).addClass('active')

    var status = window.$(this).attr('status')
    window.$('#SelPanel').attr('param-status', status)
    filter(_rootData)
  }) // #ShowLevel
  // 持股筛选
  var inputEvent =
    !!window.ActiveXObject || 'ActiveXObject' in window ? 'change' : 'input'
  window.$('#inputRange').bind(inputEvent, function(e) {
    var value = window.$('#inputRange').val()
    window.$('#rangeValue').text(value)
    window.$('#inputRange').css('background-size', value + '% 100%')
    window.$('#RangeLabel span').text(value + '%')

    window.$('#SelPanel').attr('param-num', value)
    filter(_rootData)
  })
  // 投资筛选
  window.$('#ShowInvest > a').click(function() {
    window.$('#ShowInvest > a').removeClass('active')
    window.$(this).addClass('active')

    var invest = window.$(this).attr('invest')
    window.$('#SelPanel').attr('param-invest', invest)
    filter(_rootData)
  }) // #ShowLevel
  // 关闭
  window.$('.tp-sel-close span').click(function() {
    selPanelHide()
  })
  // 聚焦
  window.$('#FocusBt').click(function() {
    var status = window.$('#FocusBt').text()
    if (!window.$(this).hasClass('focusDisable')) {
      if (status == '聚焦') {
        if (!window.$('#FocusInput').val()) {
          faldia({ content: '请点击选取结点' })
          return
        }

        var nodeId = window.$('#FocusInput').attr('node_id')
        if (!nodeId) {
        } else {
          window.$('#FocusBt').text('取消')
          highLight([nodeId], cy)
        }
      } else if (status == '取消') {
        focusCancel()
      }
    }
  })
  // 输入框
  window.$('#FocusInput').keyup(function() {
    window.$('.tp-list').html('')
    var _this = window.$(this)
    var keyword = _this.val()

    if (keyword) {
      window.$('#ClearInput').show()
    } else {
      window.$('#ClearInput').hide()
    }

    setTimeout(function() {
      var selNodes = []
      _rootData.nodes.forEach(function(node) {
        var name = node.data.obj.properties.name
        if (name.match(keyword)) {
          selNodes.push(node)
        }
      })

      selPanelUpdateList(selNodes, _rootData.links, false)
    }, 500)
  })
  window.$('#ClearInput').click(function() {
    focusCancel()
  })

  /** 详情面板 */

  window.$('.tp-detail-close span').click(function() {
    // cancelHighLight();
    window.$('.tp-detail').fadeOut()
  })
  /* window.$('#ViewTupu').click(function () {
        var guid = window.$(this).attr('guid');
        init(guid);
    }); */

  /** 侧边栏 */

  window.$('#TrSel').click(function() {
    var _this = window.$(this)
    if (_this.hasClass('active')) {
      selPanelHide()
    } else {
      selPanelShow()
    }
  })
  window.$('#TrFullScreen').click(function() {
    var old = cy.pan()
    var distance = 60
    if (isFullScreen()) {
      cy.pan({
        x: old.x,
        y: old.y - distance
      })
      exitFullScreen()
    } else {
      cy.pan({
        x: old.x,
        y: old.y + distance
      })
      launchFullScreen(window.$('#Main')[0])
    }
  })
  window.$('#TrRefresh').click(function() {
    refresh(_currentKeyNo)
  })
  window.$('#TrSave').click(function() {
    if (!window.$('#TrTxt').hasClass('active')) {
      window.$('#TrTxt').click()
    }

    canvasImg(cy.png({ full: true, bg: '#0000', scale: 1.8 }))
  })
  document.addEventListener(
    visibilityChange,
    function() {
      if (document[state] == 'visible') {
        if (_isNeedReload) {
          window.$('#MainCy').html('')
          window.$('#TrTxt').removeClass('active')
          getData(_currentKeyNo)
        }
        // document.title = 'hidden-not-loaded'
      } else {
        if (!_isGraphLoaded) {
          _isNeedReload = true
        }
      }
    },
    false
  )
}

function showDetail2(params) {}

export default start
