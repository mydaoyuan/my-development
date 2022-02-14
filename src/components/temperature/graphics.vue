<template>
  <div class="table_wrap">
    <div
      :key="'comKey' + comKey"
      class="container"
      :style="{
        marginTop: marginTop + 'px'
      }"
    >
      <svg width="100%" height="100%"></svg>
    </div>
    <table class="temperatureChart">
      <caption>
        <p style="font-size: 20px; font-weight: bold">{{ info.originName }}</p>
        <p style="font-size: 20px; font-weight: bold">体温单</p>
        <p style="position: relative; text-align: left">
          <span class="tbale-label">姓名：</span
          ><span
            style="display: inline-block; width: 50px; text-align: left"
            >{{ info.name }}</span
          >
          <span class="tbale-label">年龄：</span>
          <span
            style="display: inline-block; width: 35px; text-align: left"
            >{{ info.age + "" + info.ageunit }}</span
          >
          <span class="tbale-label">科室：</span>
          <span
            style="display: inline-block; width: 65px; text-align: left"
            >{{ info.officeName || "-" }}</span
          >
          <span class="tbale-label">性别：</span>
          <span
            style="display: inline-block; width: 35px; text-align: left"
            >{{ info.sex }}</span
          >
          <span class="tbale-label">诊断：</span>
          <span
            style="display: inline-block; width: 160px; text-align: left"
            >{{ info.inDiagName || "-" }}</span
          >
          <span class="tbale-label">床号：</span>
          <span
            style="display: inline-block; width: 60px; text-align: left"
            >{{ info.cwh }}</span
          >
          <span class="tbale-label">住院号：</span>
          <span
            style="display: inline-block; width: 100px; text-align: left"
            >{{ info.hospCode }}</span
          >
        </p>
      </caption>

      <thead></thead>
      <tbody>
        <tr>
          <td
            ref="topTd"
            :colspan="index === 0 ? 8 : 6"
            :class="[index && 'redLineTd', !index && 'table-just']"
            v-for="(item, index) in inHospitalTime"
            :key="index + '|indays'"
          >
            {{
              index === 0
                ? "日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期"
                : item
            }}
          </td>
        </tr>
        <tr>
          <td
            :colspan="index === 0 ? 8 : 6"
            :class="[index && 'redLineTd', !index && 'table-just']"
            v-for="(item, index) in inHospitalDays"
            :key="index + '|inHospitalDays'"
          >
            {{ index === 0 ? "住院天数" : item }}
          </td>
        </tr>
        <tr>
          <td
            :colspan="index === 0 ? 8 : 6"
            :class="[index && 'redLineTd', !index && 'table-just']"
            v-for="(item, index) in surgeryDays"
            :key="index + '|surgeryDays'"
          >
            {{ index === 0 ? "手术或产后日数" : item }}
          </td>
        </tr>
        <tr>
          <td class="table-just" rowspan="2" colspan="8">
            时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间
          </td>
          <td colspan="3">上午</td>
          <td colspan="3" class="redLineTd">下午</td>
          <td colspan="3">上午</td>
          <td colspan="3" class="redLineTd">下午</td>
          <td colspan="3">上午</td>
          <td colspan="3" class="redLineTd">下午</td>
          <td colspan="3">上午</td>
          <td colspan="3" class="redLineTd">下午</td>
          <td colspan="3">上午</td>
          <td colspan="3" class="redLineTd">下午</td>
          <td colspan="3">上午</td>
          <td colspan="3" class="redLineTd">下午</td>
          <td colspan="3">上午</td>
          <td colspan="3" class="redLineTd">下午</td>
        </tr>
        <tr>
          <td class="focusText">3</td>
          <td>7</td>
          <td>11</td>
          <td>15</td>
          <td class="focusText">19</td>
          <td class="focusText redLineTd">23</td>
          <td class="focusText">3</td>
          <td>7</td>
          <td>11</td>
          <td>15</td>
          <td class="focusText">19</td>
          <td class="focusText redLineTd">23</td>
          <td class="focusText">3</td>
          <td>7</td>
          <td>11</td>
          <td>15</td>
          <td class="focusText">19</td>
          <td class="focusText redLineTd">23</td>
          <td class="focusText">3</td>
          <td>7</td>
          <td>11</td>
          <td>15</td>
          <td class="focusText">19</td>
          <td class="focusText redLineTd">23</td>
          <td class="focusText">3</td>
          <td>7</td>
          <td>11</td>
          <td>15</td>
          <td class="focusText">19</td>
          <td class="focusText redLineTd">23</td>
          <td class="focusText">3</td>
          <td>7</td>
          <td>11</td>
          <td>15</td>
          <td class="focusText">19</td>
          <td class="focusText redLineTd">23</td>
          <td class="focusText">3</td>
          <td>7</td>
          <td>11</td>
          <td>15</td>
          <td class="focusText">19</td>
          <td class="focusText">23</td>
        </tr>

        <!-- <record></record> -->
        <tr class="recorde temperature_mark">
          <td colspan="2" rowspan="45">
            <div class="num_wrapper">
              <p style="margin-top: 0">呼吸<br />●</p>
              <p style="margin-top: 32px" v-html="'&nbsp;'"></p>
              <p v-html="'&nbsp;'"></p>
              <p v-html="'&nbsp;'"></p>
              <p v-html="'&nbsp;'"></p>
              <p>50</p>
              <p>40</p>
              <p>30</p>
              <p style="margin-top: 48px">20</p>
            </div>
          </td>
          <td colspan="3" rowspan="45">
            <div style="color: red" class="num_wrapper">
              <p style="margin-top: 0">脉搏<br />●</p>
              <p style="margin-top: 32px">160</p>
              <p>140</p>
              <p>120</p>
              <p>100</p>
              <p>80</p>
              <p>60</p>
              <p>40</p>
              <p style="margin-top: 48px">20</p>
            </div>
          </td>
          <td colspan="3" rowspan="45">
            <div style="color: blue" class="num_wrapper">
              <p style="margin-top: 0">体温<br />x</p>
              <p style="margin-top: 32px">41</p>
              <p>40</p>
              <p>39</p>
              <p>38</p>
              <p>37</p>
              <p>36</p>
              <p>35</p>
              <p style="margin-top: 48px">34</p>
              <!-- <div class="pain_wrapper">
                <div
                  style="
                    float: left;
                    width: 48%;
                    height: 100%;
                    border-right: 1px solid #ccc;
                    padding-top: 3px;
                  "
                >
                  疼<br />痛<br />强<br />度
                </div>
                <div
                  style="
                    float: right;
                    width: 48%;
                    font-size: 10px;
                    -webkit-transform: scale(0.8);
                    position: relative;
                    top: -3px;
                  "
                >
                  <div>10</div>
                  <div>8</div>
                  <div>6</div>
                  <div>4</div>
                  <div>2</div>
                </div>
              </div> -->
            </div>
          </td>
          <td
            v-for="(item, y) in tdList"
            :key="y + 'td0'"
            :class="[y % 6 === 5 && y != tdList.length && 'redLineTd']"
          >
            <div class="recorde-text">{{ getSymbolTextArr(y) }}</div>
          </td>
        </tr>
        <tr
          class="recorde"
          v-for="(tr, index) in [0, 0, 0]"
          :key="index + 'tr1'"
        >
          <td
            v-for="(item, y) in tdList"
            :key="y + 'td1'"
            :class="[y % 6 === 5 && y != tdList.length && 'redLineTd']"
          ></td>
        </tr>

        <tr class="recorde">
          <template v-for="(item, index) of tdList">
            <td
              :key="index + 'td2'"
              v-if="index % 6 === 5 && index != tdList.length"
              style="
                border-right: 1px solid #ff6e71;
                border-bottom: 1px solid #7e7eff;
              "
            ></td>
            <td
              :key="index + 'td2'"
              v-else
              style="border-bottom: 1px solid #7e7eff"
            ></td>
          </template>
        </tr>

        <tr
          class="recorde"
          v-for="(tr, index) in [0, 0, 0, 0]"
          :key="index + 'tr2'"
        >
          <td
            v-for="(item, y) in tdList"
            :key="y + 'td3'"
            :class="[y % 6 === 5 && y != tdList.length && 'redLineTd']"
          ></td>
        </tr>
        <tr class="recorde">
          <template v-for="(item, index) of tdList">
            <td
              :key="index + 'td4'"
              v-if="index % 6 === 5 && index != tdList.length"
              style="
                border-right: 1px solid #ff6e71;
                border-bottom: 1px solid #7e7eff;
              "
            ></td>
            <td
              :key="index + 'td4'"
              v-else
              style="border-bottom: 1px solid #7e7eff"
            ></td>
          </template>
        </tr>

        <tr
          class="recorde"
          v-for="(tr, index) in [0, 0, 0, 0]"
          :key="index + 'tr3'"
        >
          <td
            v-for="(item, y) in tdList"
            :key="y + 'td5'"
            :class="[y % 6 === 5 && y != tdList.length && 'redLineTd']"
          ></td>
        </tr>

        <tr class="recorde">
          <template v-for="(item, index) of tdList">
            <td
              :key="index + 'td6'"
              v-if="index % 6 === 5 && index != tdList.length"
              style="
                border-right: 1px solid #ff6e71;
                border-bottom: 1px solid #7e7eff;
              "
            ></td>
            <td
              :key="index + 'td6'"
              v-else
              style="border-bottom: 1px solid #7e7eff"
            ></td>
          </template>
        </tr>

        <tr
          class="recorde"
          v-for="(tr, index) in [0, 0, 0, 0]"
          :key="index + 'tr4'"
        >
          <td
            v-for="(item, y) in tdList"
            :key="y + 'td7'"
            :class="[y % 6 === 5 && y != tdList.length && 'redLineTd']"
          ></td>
        </tr>

        <tr class="recorde">
          <template v-for="(item, index) of tdList">
            <td
              :key="index + 'td8'"
              v-if="index % 6 === 5 && index != tdList.length"
              style="
                border-right: 1px solid #ff6e71;
                border-bottom: 1px solid #7e7eff;
              "
            ></td>
            <td
              :key="index + 'td8'"
              v-else
              style="border-bottom: 1px solid #7e7eff"
            ></td>
          </template>
        </tr>

        <tr
          class="recorde"
          v-for="(tr, index) in [0, 0, 0, 0]"
          :key="index + 'tr5'"
        >
          <td
            v-for="(item, y) in tdList"
            :key="y + 'td9'"
            :class="[y % 6 === 5 && y != tdList.length && 'redLineTd']"
          ></td>
        </tr>

        <tr class="recorde">
          <template v-for="(item, index) of tdList">
            <td
              :key="index + 'td10'"
              v-if="index % 6 === 5 && index != tdList.length"
              style="
                border-right: 1px solid #ff6e71;
                border-bottom: 1px solid #7e7eff;
              "
            ></td>
            <td
              :key="index + 'td10'"
              v-else
              style="border-bottom: 1px solid #7e7eff"
            ></td>
          </template>
        </tr>
        <tr
          class="recorde"
          v-for="(tr, index) in [0, 0, 0, 0]"
          :key="index + 'tr6'"
        >
          <td
            v-for="(item, y) in tdList"
            :key="y + 'td11'"
            :class="[y % 6 === 5 && y != tdList.length && 'redLineTd']"
          ></td>
        </tr>
        <tr class="recorde">
          <template v-for="(item, index) of tdList">
            <td
              :key="index + 'td11'"
              v-if="index % 6 === 5 && index != tdList.length"
              style="
                border-right: 1px solid #ff6e71;
                border-bottom: 1px solid #7e7eff;
              "
            ></td>
            <td
              :key="index + 'td11'"
              v-else
              style="border-bottom: 1px solid #7e7eff"
            ></td>
          </template>
        </tr>

        <tr
          class="recorde"
          v-for="(tr, index) in [0, 0, 0, 0]"
          :key="index + 'tr7'"
        >
          <td
            v-for="(item, y) in tdList"
            :key="y"
            :class="[y % 6 === 5 && y != tdList.length && 'redLineTd']"
          ></td>
        </tr>
        <tr class="recorde">
          <template v-for="(item, index) of tdList">
            <td
              :key="index + 'td12'"
              v-if="index % 6 === 5 && index != tdList.length"
              style="
                border-right: 1px solid #ff6e71;
                border-bottom: 1px solid #7e7eff;
              "
            ></td>
            <td
              :key="index + 'td12'"
              v-else
              style="border-bottom: 1px solid #7e7eff"
            ></td>
          </template>
        </tr>
        <tr
          class="recorde"
          v-for="(tr, index) in [0, 0, 0, 0]"
          :key="index + 'tr8'"
        >
          <td
            v-for="(item, y) in tdList"
            :key="y + 'td13'"
            :class="[y % 6 === 5 && y != tdList.length && 'redLineTd']"
          ></td>
        </tr>
        <tr class="recorde">
          <template v-for="(item, index) of tdList">
            <td
              :key="index + 'td14'"
              v-if="index % 6 === 5 && index != tdList.length"
              style="
                border-right: 1px solid #ff6e71;
                border-bottom: 1px solid #7e7eff;
              "
            ></td>
            <td
              :key="index + 'td14'"
              v-else
              style="border-bottom: 1px solid #7e7eff"
            ></td>
          </template>
        </tr>
        <tr
          class="recorde"
          v-for="(tr, index) in [0, 0, 0, 0, 0]"
          :key="index + 'tr9'"
        >
          <td
            v-for="(item, y) in tdList"
            :key="y + 'td15'"
            :class="[y % 6 === 5 && y != tdList.length && 'redLineTd']"
          ></td>
        </tr>

        <tr></tr>
        <tr>
          <td
            :colspan="index === 0 ? 8 : 6"
            v-for="(item, index) in [0, 1, 2, 3, 4, 5, 6, 7]"
            :class="[index && 'redLineTd']"
            :key="index + '|008'"
          >
            {{
              index === 0
                ? "血压(mmHg)"
                : typesViewData["008"] && typesViewData["008"][index - 1]
            }}
          </td>
        </tr>
        <tr>
          <td
            :colspan="index === 0 ? 8 : 6"
            v-for="(item, index) in [0, 1, 2, 3, 4, 5, 6, 7]"
            :class="[index && 'redLineTd']"
            :key="index + '|006'"
          >
            {{
              index === 0
                ? "入水量(ml)"
                : typesViewData["006"] && typesViewData["006"][index - 1]
            }}
          </td>
        </tr>
        <tr>
          <td
            :colspan="index === 0 ? 8 : 6"
            v-for="(item, index) in [0, 1, 2, 3, 4, 5, 6, 7]"
            :class="[index && 'redLineTd']"
            :key="index + '|011'"
          >
            {{
              index === 0
                ? "出水量(ml)"
                : typesViewData["011"] && typesViewData["011"][index - 1]
            }}
          </td>
        </tr>
        <tr>
          <td
            :colspan="index === 0 ? 8 : 6"
            v-for="(item, index) in [0, 1, 2, 3, 4, 5, 6, 7]"
            :class="[index && 'redLineTd']"
            :key="index + '|005'"
          >
            {{
              index === 0
                ? "大便(次)"
                : typesViewData["005"] && typesViewData["005"][index - 1]
            }}
          </td>
        </tr>

        <tr>
          <td
            :colspan="index === 0 ? 8 : 6"
            v-for="(item, index) in [0, 1, 2, 3, 4, 5, 6, 7]"
            :class="[index && 'redLineTd']"
            :key="index + '|004'"
          >
            {{
              index === 0
                ? "小便(次)"
                : typesViewData["004"] && typesViewData["004"][index - 1]
            }}
          </td>
        </tr>
        <tr>
          <td
            :colspan="index === 0 ? 8 : 6"
            v-for="(item, index) in [0, 1, 2, 3, 4, 5, 6, 7]"
            :class="[index && 'redLineTd']"
            :key="index + '|030'"
          >
            {{
              index === 0
                ? "身高(cm)"
                : typesViewData["030"] && typesViewData["030"][index - 1]
            }}
          </td>
        </tr>
        <tr>
          <td
            :colspan="index === 0 ? 8 : 6"
            v-for="(item, index) in [0, 1, 2, 3, 4, 5, 6, 7]"
            :class="[index && 'redLineTd']"
            :key="index + '|009'"
          >
            {{
              index === 0
                ? "体重(kg)"
                : typesViewData["009"] && typesViewData["009"][index - 1]
            }}
          </td>
        </tr>
        <tr>
          <td
            :colspan="index === 0 ? 8 : 6"
            v-for="(item, index) in [0, 1, 2, 3, 4, 5, 6, 7]"
            :class="[index && 'redLineTd']"
            :key="index + '|010'"
          >
            {{
              index === 0
                ? "过敏药物"
                : typesViewData["010"] && typesViewData["010"][index - 1]
            }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="legend">
      <span>标注：</span>
      <div class="legend-text">
        <div class="legend-item" style="color: blue">体温: x</div>
        <div class="legend-item">呼吸: ●</div>
        <div class="legend-item">物理降温： ○</div>
        <div class="legend-item" style="color: red">心率：○</div>
        <div class="legend-item" style="color: red">脉搏：●</div>
      </div>
      <div style="font-size: 20px; font-weight: bold">
        {{ `第${SectionToChinese(+info.weekNo + 1)}周` }}
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import dayjs from 'dayjs'
import { getKeyMap, SectionToChinese } from './utils'

export default {
  props: {
    value: Object
  },
  data () {
    return {
      marginTop: 0,
      keyMap: getKeyMap(),
      info: {
        age: 0,
        ageunit: '',
        beginDate: '',
        hospCode: '',
        hospDate: 0,
        inDate: 0,
        inDiagName: null,
        name: '',
        officeName: '',
        sex: '',
        weekNo: ''
      },
      xyList: [],
      typesInfo: [],
      typesViewData: {},
      breathData: [],
      tdList: new Array(42).fill(0),
      comKey: 1,
      symbolTextArr: []
    }
  },
  computed: {
    // 日期
    inHospitalTime () {
      const initday = dayjs(this.info.beginDate)
      return [
        null, // 文案天
        initday.format('YYYY-MM-DD'),
        initday.add(1, 'day').format('MM-DD'),
        initday.add(2, 'day').format('MM-DD'),
        initday.add(3, 'day').format('MM-DD'),
        initday.add(4, 'day').format('MM-DD'),
        initday.add(5, 'day').format('MM-DD'),
        initday.add(6, 'day').format('MM-DD')
      ]
    },
    // 住院天数
    inHospitalDays () {
      const initday = this.info.hospDays || 0
      return [
        null, // 文案天
        initday + 1,
        initday + 2,
        initday + 3,
        initday + 4,
        initday + 5,
        initday + 6,
        initday + 7
      ]
    },
    // 手术天数
    surgeryDays () {
      const initday = this.info.operaDays
      if (!initday) {
        return new Array(8).fill(null)
      } else {
        return [
          null, // 文案天
          initday,
          initday + 1,
          initday + 2,
          initday + 3,
          initday + 4,
          initday + 5,
          initday + 6
        ]
      }
    }
  },
  mounted () {
    this.initData()
    this.init()
    console.log(this.info)
    const marginTop =
      (Math.round(this.$refs.topTd[0].getBoundingClientRect().height) - 18) *
        10 +
      28
    this.marginTop = marginTop
    setTimeout(() => {
      this.$emit('done')
    })
  },
  methods: {
    SectionToChinese,
    getSymbolTextArr (index) {
      const current = this.symbolTextArr.find(i => i.x === index)
      if (current) {
        return current.y
      } else {
        return ''
      }
    },
    temperatureConverter (c) {
      const value = (c * 9) / 5 + 32
      return value.toFixed(1)
    },
    refresh () {
      this.comKey++
      this.$forceUpdate()
      this.initData()
      this.init()
      console.log('object=====')
    },
    initData () {
      this.info = this.value.grParamBOS[0]
      this.rowsInfo = this.value.rows || []
      this.typesInfo = this.value.types || []
    },
    init () {
      var width = 690
      var height = 682
      // SVG画布边缘与图表内容的距离
      var padding = { top: 50, right: 0, bottom: 50, left: 50 }
      // 创建一个分组用来组合要画的图表元素
      var main = d3
        .select('.container svg')
        .append('g')
        .classed('main', true)
        .attr('transform', 'translate(' + 80 + ',' + 80 + ')')
      // 模拟数据 体温
      var dataset = getTypeData('003', this.rowsInfo)
      console.log(dataset, '体温')
      var datasetAnus = getTypeData('015', this.rowsInfo)
      console.log(datasetAnus, '物理降温【黑空圆】')
      var datasetHeartrate = getTypeData('014', this.rowsInfo)
      console.log(datasetHeartrate, '心率【红空圆】')
      var datasetPulse = getTypeData('002', this.rowsInfo)
      console.log(datasetPulse, '脉搏【红实圆】')
      var symbolTextArr = getTypeData('012', this.rowsInfo, false)
      this.symbolTextArr = symbolTextArr
      console.log(symbolTextArr, '【特殊标记】')
      // 呼吸【黑实圆】
      var datasetPain = getTypeData('001', this.rowsInfo)
      this.breathData = datasetPain
      console.log(datasetPain, '呼吸【黑实圆】')
      const circleNode = document.createElement('circle')
      circleNode.setAttribute('cx', '179.2439024390244')
      circleNode.setAttribute('cy', '582')
      circleNode.setAttribute('r', '4')
      circleNode.setAttribute('stroke', '#000000')
      circleNode.setAttribute('stroke-width', '1')
      circleNode.setAttribute('fill', '#FFFFFF')
      document.querySelector('.main').appendChild(circleNode)
      // 创建x轴的比例尺(线性比例尺)
      var xScale = d3.scale
        .linear()
        .domain([0, 41])
        .range([9, width - padding.left - padding.right + 75])
      // 创建y轴的比例尺(线性比例尺)

      /* var yScale = d3.scale.linear()
                        .domain([0, d3.max(dataset,function(d) {
                            return d.y;
                        })])
                        .range([height - padding.top - padding.bottom, 0]); */
      // 体温
      var yScale = d3.scale
        .linear()
        .domain([33, 42])
        .range([height - padding.top - padding.bottom, -56])
      // 脉搏
      var yScale1 = d3.scale
        .linear()
        .domain([0, 180])
        .range([height - padding.top - padding.bottom, -55])
      // 呼吸
      var yScale2 = d3.scale
        .linear()
        .domain([0, 100])
        .range([height - padding.top + 22, -55])
      // 创建x轴
      var xAxis = d3.svg
        .axis()
        .scale(xScale)
        .orient('bottom')
      // 创建y轴
      var yAxis = d3.svg
        .axis()
        .scale(yScale)
        .orient('left')
      var yAxis1 = d3.svg
        .axis()
        .scale(yScale1)
        .orient('left')
      var yAxis2 = d3.svg
        .axis()
        .scale(yScale2)
        .orient('left')

      // 添加SVG元素并与x轴进行“绑定”
      main
        .append('g')
        .attr('class', 'axis')
        .attr(
          'transform',
          'translate(0,' + (height - padding.top - padding.bottom) + ')'
        )
        .call(xAxis)

      // 添加SVG元素并与y轴进行“绑定”
      main
        .append('g')
        .attr('class', 'axis')
        .call(yAxis)
      main
        .append('g')
        .attr('class', 'axis')
        .call(yAxis1)
      main
        .append('g')
        .attr('class', 'axis')
        .call(yAxis2)

      // 添加折线
      var line = d3.svg
        .line()
        .x(function (d) {
          return xScale(d.x)
        })
        .y(function (d) {
          return yScale(d.y)
        })
      var line1 = d3.svg
        .line()
        .x(function (d) {
          return xScale(d.x)
        })
        .y(function (d) {
          return yScale1(d.y)
        })
      var line2 = d3.svg
        .line()
        .x(function (d) {
          return xScale(d.x)
        })
        .y(function (d) {
          return yScale2(d.y)
        })
        .interpolate('linear')
      // var line3 = d3.svg
      //   .line()
      //   .x(function (d) {
      //     return xScale(d.x)
      //   })
      //   .y(function (d) {
      //     return yScale(d.y)
      //   })
      // 选择线条的类型

      // 添加path元素，并通过line()计算出值来赋值
      main
        .append('path')
        .attr('class', 'line tiwenline')
        .attr('d', line(dataset))
      main
        .append('path')
        .attr('class', 'line')
        .attr('d', line(datasetAnus))
      main
        .append('path')
        .attr('class', 'line')
        .attr('d', line2(datasetPain))
      main
        .append('path')
        .attr('class', 'line lineColor')
        .attr('d', line1(datasetHeartrate))
      main
        .append('path')
        .attr('class', 'line lineColor')
        .attr('d', line1(datasetPulse))
      // main.append('path').attr('class', 'line').attr('d', line3(dataset))

      // 添加点

      /* 黑实圆--start */
      // main
      //   .selectAll('rect')
      //   .data(dataset_mouth)
      //   .enter()
      //   .append('circle')
      //   .attr('cx', function (d) {
      //     return xScale(d.x)
      //   })
      //   .attr('cy', function (d) {
      //     return yScale(d.y)
      //   })
      //   .attr('r', 4)
      //   .attr('fill', function (d, i) {
      //     return 'black'
      //   })
      /* 黑实圆--end */

      /* 黑空圆--start */
      main
        .selectAll('rect')
        .data(datasetAnus)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
          return xScale(d.x)
        })
        .attr('cy', function (d) {
          return yScale(d.y)
        })
        .attr('r', 4)
        .attr('stroke', '#000000')
        .attr('stroke-width', 1)
        .attr('fill', '#FFFFFF')
      /* 黑空圆--end */

      /* 红空圆--start */
      main
        .selectAll('rect')
        .data(datasetHeartrate)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
          return xScale(d.x)
        })
        .attr('cy', function (d) {
          return yScale1(d.y)
        })
        .attr('r', 4)
        .attr('stroke', '#EE0000')
        .attr('stroke-width', 1)
        .attr('fill', '#FFFFFF')
      /* 红空圆--end */

      /* 红实圆--start */
      main
        .selectAll('rect')
        .data(datasetPulse)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
          return xScale(d.x)
        })
        .attr('cy', function (d) {
          return yScale1(d.y)
        })
        .attr('r', 4)
        .attr('fill', '#EE0000')
        .on('mouseover', function (d) {
          // (1)取得提示显示的位置
          var xPosition = parseFloat(d3.select(this).attr('cx')) + 698
          var yPosition = parseFloat(d3.select(this).attr('cy')) + 24

          // (2)创建提示条SVG
          d3.select('.container svg')
            .append('text')
            .attr('id', 'tooltip') // 设置id便于移除提示
            .attr('x', xPosition)
            .attr('y', yPosition)
            .attr('text-anchor', 'middle')
            .attr('font-family', 'sans-setif')
            .attr('font-size', '11px')
            .attr('font-weight', 'bold')
            .attr('fill', 'white')
            .text(d.value)
        })
      // (3)移除提示条SVG

      /* 红实圆--end */
      /* 黑实圆--start */
      main
        .selectAll('rect')
        .data(datasetPain)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
          return xScale(d.x)
        })
        .attr('cy', function (d) {
          return yScale2(d.y)
        })
        .attr('r', 4)
        .attr('stroke', '#000000')
        .attr('fill', '#000000')
      /* 黑实圆--end */
      this.drawx(main, dataset, xScale, yScale)
      this.initTypes()
      // this.hoverEvent(main)
    },
    drawx (main, dataset, xScale, yScale) {
      /* 【叉形】--start */
      main
        .selectAll('rect')
        .data(dataset)
        .enter()
        .append('line')
        .attr('x1', function (d) {
          return xScale(d.x) - 4
        })
        .attr('y1', function (d) {
          return yScale(d.y) - 4
        })
        .attr('x2', function (d) {
          return xScale(d.x) + 4
        })
        .attr('y2', function (d) {
          return yScale(d.y) + 4
        })
        // .attr({
        //   x2: function (d) {
        //     return xScale(d.x) + 4
        //   },
        //   y2: function (d) {
        //     return yScale(d.y) + 4
        //   }
        // })
        .attr('stroke', function (d, i) {
          return 'blue'
        })

      main
        .selectAll('rect')
        .data(dataset)
        .enter()
        .append('line')
        .attr('x1', function (d) {
          return xScale(d.x) + 4
        })
        .attr('y1', function (d) {
          return yScale(d.y) - 4
        })
        .attr({
          x2: function (d) {
            return xScale(d.x) - 4
          },
          y2: function (d) {
            return yScale(d.y) + 4
          }
        })
        .attr('stroke', function (d, i) {
          return 'blue'
        })
      /* 体温【叉形】--end */
    },
    hoverEvent (main) {
      /* 鼠标悬停直线--start
              var dataset_line = [{x: 0,y: 0}]
              main.selectAll('rect')
                .data(dataset_line)
                .enter()
                .append('line')
                .attr({
                  'x1':100,'y1':-56,
                  'x2':100,'y2':582
                })
                .attr('stroke', function(d, i) {
                  return 'black';
                });
              鼠标悬停直线--end */
      document.querySelector('.lineColor').style.stroke = 'red'
      const recordeNode = document.createElement('div')
      recordeNode.setAttribute('class', 'recorde-text')
      document.querySelector('.recorde td').append(recordeNode)
      const allTrtd = document.querySelectorAll('.temperatureChart tr td');
      [...allTrtd].map(ele => {
        ele.setAttribute('title', ele.innerText)
      })
      /* 鼠标悬停提示框 */
      var tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0.0)

      main
        .on('mouseover', function (d) {
          console.log(d3.event, 'dinfo')
          console.log(this, d, this.data, 'this dinfo')
          /*
                    鼠标移入时，
                    （1）通过 selection.html() 来更改提示框的文字
                    （2）通过更改样式 left 和 top 来设定提示框的位置
                    （3）设定提示框的透明度为1.0（完全不透明）
                    */
          tooltip
            .html('呼吸：19次/分<br/>录入信息：2017-11-02<br/>姓名：张三')
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY + 20 + 'px')
            .style('opacity', 1.0)
          console.log(d3.event.target)
        })
        .on('mousemove', function (d) {
          /* 鼠标移动时，更改样式 left 和 top 来改变提示框的位置 */
          tooltip
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY + 20 + 'px')
          // console.log(d3.event.target);
        })
        .on('mouseout', function (d) {
          /* 鼠标移出时，将透明度设定为0.0（完全透明） */

          tooltip.style('opacity', 0.0)
        })
    },
    initTypes () {
      const keyMap = {}
      this.typesInfo.map(item => {
        const key = item.typeCode
        if (keyMap[key]) {
          keyMap[key].push(item.typeValue)
        } else {
          keyMap[key] = [item.typeValue]
        }
      })
      this.typesViewData = keyMap
    }
  }
}

function getTypeData (type, allData = [], isNumber = true) {
  return allData
    .map((rowBOSItem, index) => {
      const rowBOS = rowBOSItem.rowBOS
      const cur =
        rowBOS.find(item => {
          return item.typeCode === type
        }) || {}
      return { x: index, y: (isNumber ? +cur.typeValue : cur.typeValue) || '' }
    })
    .filter(item => {
      return item.y !== ''
    })
}
</script>

<style lang="less" scoped>
.table_wrap {
  line-height: normal;
}
table {
  font-weight: normal;
  border-collapse: collapse;
  font-size: 8px;
  text-align: center;
  width: 100%;
  table-layout: fixed;
  border: 2px #2f4f4f solid;
}
td {
  border: 1px solid #ccc;
  width: 12px;
  height: 11px;
}

.redLineTd {
  border-right: 1px solid #ff6e71;
}

.recorde-text {
  width: 13px;
  height: 8px;
  color: #ff0000;
  font-size: 10px;
  position: relative;
  top: -4px;
}
.table_wrap {
  position: relative;
  margin: 0 auto;
  width: 835px;
}

.container {
  // 高度最好动态计算，不然很容易错位
  margin: 30px auto;
  // margin-top: 48px;
  margin-top: 28px;
  width: 800px;
  height: 758px;
  position: absolute;
  top: 170px;
  left: 40px;
}

.temperature_mark td p {
  position: relative;
  top: 0;
  margin-top: 58px;
}
.num_wrapper {
  width: 35px;
  height: 636px;
  position: relative;
}
.pain_wrapper {
  position: absolute;
  width: 100%;
  height: 70px;
  right: 0;
  bottom: -3px;
  border: 1px solid #ccc;
}
.zeroline {
  fill: none;
  stroke: red;
  stroke-width: 0.5px;
  stroke-dasharray: 5 5;
}

.zerolinetext {
  fill: red;
}

.overlay {
  fill: none;
  stroke: none;
  pointer-events: all;
}

.tooltip {
  font-family: "宋体";
  font-size: 10px;
  line-height: 16px;
  color: #736269;
  width: auto;
  height: auto;
  padding: 4px;
  position: absolute;
  text-align: left;
  border: 1px solid #736269;
  background-color: #e7e9f3;
  border-radius: 2px;
  background: linear-gradient(
    #fefdff,
    #e5e5f1
  ); /* 标准的语法（必须放在最后） */
}
</style>
<style lang="less">
.table_wrap {
  font-family: "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  .tick,
  .domain {
    display: none;
  }
  .tbale-label {
    font-weight: 700;
  }
  .table-just {
    // text-align: justify;
    // text-align-last: justify;
  }
  .focusLine {
    fill: none;
    stroke: red;
    stroke-width: 0.5px;
  }
  .focusText {
    color: red;
  }
  .breath_td_odd {
    vertical-align: top;
    font-size: 10px;
  }
  .breath_td_even {
    vertical-align: bottom;
    font-size: 10px;
  }
  .line {
    fill: none;
    stroke: black;
    stroke-width: 2px;
  }
  .line.tiwenline {
    stroke: blue;
    fill: none;
  }
  .axis path,
  .axis line,
  .line {
    stroke: #000;
    fill: none;
  }
  .legend {
    display: flex;
    .legend-text {
      display: flex;
    }
    .legend-item {
      margin-right: 20px;
    }
  }
}
</style>
