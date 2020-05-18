# 品网蓝牙体脂秤小程序插件 


	版本：V1.0.0

	更新日期：2019年12月7日

	深圳品网科技有限公司版权所有
	本小程序插件的说明书如有变更，恕不另行通知。
	深圳品网科技有限公司保留在不另行通知的情况下，对其中所包含的说明书和材料进行更改的权利，同时由于信任所引用的材料所造成的损害（包括结果性损害），
	包括但不限于印刷上的错误和其他与此出版物相关的错误，品网科技将不承担责任。


# 前言

本文档是品网蓝牙体脂秤小程序插件开发帮助指南，描述了蓝牙体脂秤小程序插件的基本概念、提供的服务以及可用的API

# 1.简介

品网蓝牙体脂秤小程序插件（简称：插件）是一款基于微信小程序原生语言开发，为使用品网蓝牙模块的客户，提供解析蓝牙广播数据功能的插件；

插件详细信息： 

| appid | wxf6042009c5b19c52 |
|--- | --- |
| 名称 | 蓝牙体脂秤sdk |


# 2.使用方式

1.开发者可在"小程序管理后台->设置->第三方服务->插件管理"，提交插件的接入申请

2.引入插件代码包：开发者需要在app.json中申明需要使用的插件

3.js接口使用：使用插件的 js 接口时，可以使用 requirePlugin 方法。

Ps:详细使用方式，参考微信小程序官方开发文档：[https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html)

# 3.功能简介

解析原始蓝牙数据,返回基础数据

通过品网算法，对基础数据进行计算，返回17项身体指标参考结果

通过品网算法，对身体指标进行计算，返回身体指标评级参考结果

# 4.开放接口

## 4.1基础数据

### 4.1.1获取广播称广播基础数据

适用蓝牙芯片协议：

请求方法名：getBbroadcastData

请求参数：

| 参数 | 必选 | 类型 | 说明 |
| --- | --- | --- | --- |
| device.advertisData | 是 | ArrayBuffer | 微信蓝牙接口onBluetoothDeviceFound，获取到的设备蓝牙广播数据流 |

请求示例：
	wx.onBluetoothDeviceFound((res) => {

		res.devices.forEach(device => {

		var fatData= plugin.getBbroadcastData(device.advertisData);

		}
	}

返回数据：

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| adc | int | 阻抗 |
| address | string | 蓝牙地址 |
| algorithmType | int | 算法类型 |
| bleType | string | 蓝牙型号 |
| bleVersion | int | 蓝牙版本 |
| cmdType | int | 蓝牙广播命令标识（1：不稳定数据；2：体重稳定，阻抗测量中；3：稳定数据  ） |
| did | int | 设备标识did |
| temp | float | 温度 |
| unitType | int | 单位类型 |
| weight | float | 重量 |

返回示例：

	{

    "adc": 0,

    "address": "B4:C1:3C:1D:00:0E",

    "algorithmType": 1,

    "bleType": "15",

    "bleVersion": 1,

    "cmdType": 3,

    "did": 0,

    "temp": 6553.5,

    "unitType": 4,

    "weight": 53.7

	}


## 4.2计算数据

### 4.2.1获取10项身体指标数据

请求方法名：getBodyDataByInet

请求参数（请按照顺序，依次传入参数）：

| 参数序号 | 必选 | 参数类型 | 说明 |
| --- | --- | --- | --- |
| 1 | 是 | int | 年龄(取值范围：0< 年龄 <= 120) |
| 2 | 是 | float | 身高（单位：厘米）(取值范围：0< 身高 <= 270) |
| 3 | 是 | int | 性别（1:男；2：女） |
| 4 | 是 | float | 重量（单位：千克）(取值范围：0< 重量 <= 220) |
| 5 | 是 | int | 阻抗（(取值范围：0< 阻抗 <= 1000)） |

请求示例：

	var newinet = plugin.getBodyDataByInet(24, 170, 1, 60, 500);

返回数据：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| bfr | String | 体脂率（单位：%） |
| bm | float | 骨重（单位：kg） |
| bmi | float | 身体质量指数 |
| bmr | int | 基础新陈代谢率（单位：Kcal） |
| moi | float | 水分（单位：%） |
| pAge | string | 身体年龄（单位：年） |
| pp | float | 蛋白率（单位：%） |
| rom | float | 肌肉率（单位：%） |
| sfr | float | 皮下脂肪率（单位：%） |
| uvi | float | 内脏脂肪指数 |

返回示例:

{

    "bfr":  "12.7",

    "bm":  2.6,

    "bmi":  20.7,

    "bmr":  1413,

    "moi":  63.8,

    "pAge":  "26",

    "pp":  18.7,

    "rom":  47.8,

    "sfr":  11.4,

    "uvi":  6

}

### 4.2.2获取身体指标数量数据

请求方法名：getBodyScaleDataByInet

请求参数（请按照顺序，依次传入参数）：

| 参数序号 | 必选 | 参数类型 | 说明 |
| --- | --- | --- | --- |
| 1 | 是 | int | 身高（单位：厘米）(取值范围：0< 身高 <= 270) |
| 2 | 是 | float | 重量（单位：千克）(取值范围：0< 重量 <= 220) |
| 3 | 是 | int | 性别（1:男；2：女） |
| 4 | 是 | float | 体脂率（百分比）(取值范围：0< 体脂率 <= 100) |
| 5 | 是 | float | 肌肉率（百分比）(取值范围：0< 肌肉率 <= 100) |
| 6 | 是 | float | 蛋白率（百分比）(取值范围：0< 蛋白率 <= 100) |

请求示例：

	var scaleFatData = plugin.getBodyScaleDataByInet(170, 60, 1, 12.7, 47.8, 18.7);

返回数据：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| controlWeight | float | 体重控制量（单位：kg） |
| fat | float | 脂肪量（单位：kg） |
| muscleMass | float | 肌肉量（单位：kg） |
| protein | float | 蛋白量（单位：kg） |
| removeFatWeight | float | 去脂体重（单位：kg） |
| standardWeight | float | 标准体重（单位：kg） |

返回示例:

	{

		"controlWeight": -3,

		"fat": 7.6,

		"muscleMass": 28.7,

		"protein": 11.2,

		"removeFatWeight": 52.4,

		"standardWeight": 63

	}