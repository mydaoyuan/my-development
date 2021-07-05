```
{
  "companyName": "xxxx技术有限公司",  // 中间节点名字
  "downward": {   // 下方的数据节点
    "direction": "downward",  
    "name": "origin", 
    "children": [    // 嵌套的子节点
      {
        "name": "XXX药业股份有限公司",
        "hasHumanholding": true,  // 最终受益人
        "shouldCapi": "300w",
        "percent": "50%控股",
        "children": [
          {
            "name": "公司或股东名字写这里",
            "children": [],
            "shouldCapi": "150w",
            "percent": "50%控股"
          },
          {
            "name": "公司或股东名字写这里",
            "children": [],
            "shouldCapi": "150w",
            "percent": "50%控股"
          }
        ]
      },
      {
        "name": "公司或股东名字",
        "money": "300w",
        "percent": "20%控股",
        "children": []
      },
      {
        "name": "公司或股东名字hasChildren",
        "percent": "30%控股",
        "children": [
          {
            "name": "公司或股东名字",
            "children": []
          },
          {
            "name": "公司或股东名字",
            "money": "300w",
            "children": []
          },
          {
            "name": "公司或股东名字",
            "children": []
          }
        ]
      }
    ]
  },
  "upward": {   // 上方的数据节点
    "direction": "upward",
    "name": "origin",
    "children": [
      {
        "level": 1,
        "tags": [],
        "percent": "53%",
        "stockRightNum": "",
        "detailCount": 0,
        "shortStatus": "",
        "shouldCapi": "159",
        "children": [],
        "org": 2,
        "companyCode": "",
        "percentTotal": "53%",
        "keyNo": "p2edes6482s3cb0e4fccccd59ddc63d3adc635",
        "name": "XXX"
      },
      {
        "name": "公司或股东名字",
        "children": [
          {
            "name": "公司或股东名字",
            "children": []
          },
          {
            "name": "公司或股东名字",
            "children": [
              {
                "name": "公司或股东名字",
                "children": []
              },
              {
                "name": "公司或股东名字",
                "children": [
                  {
                    "name": "xxxxx",
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "name": "公司或股东名字",
            "children": []
          }
        ]
      }
    ]
  }
}

```