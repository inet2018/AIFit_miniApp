var app = getApp();
var util = require('../../utils/util.js');
var plugin = requirePlugin("myPlugin");
//var plugin = require("../../plugins/index.js");

var deviceInfo_address = ""
var deviceInfo = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    deviceID_wxml: '',
    array: ['100', '101', '102', '103', '104', '105', '106', '107', '108', '109',
      '110', '111', '112', '113', '114', '115', '116', '117', '118', '119',
      '120', '121', '122', '123', '124', '125', '126', '127', '128', '129',
      '130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
      '140', '141', '142', '143', '144', '145', '146', '147', '148', '149',
      '150', '151', '152', '153', '154', '155', '156', '157', '158', '159',
      '160', '161', '162', '163', '164', '165', '166', '167', '168', '169',
      '170', '171', '172', '173', '174', '175', '176', '177', '178', '179',
      '180', '181', '182', '183', '184', '185', '186', '187', '188', '189',
      '190', '191', '192', '193', '194', '195', '196', '197', '198', '199',
      '200', '201', '202', '203', '204', '205', '206', '207', '208', '209',
      '210', '211', '212', '213', '214', '215', '216', '217', '218', '219'],
    isUnitShow: false,
    isSexShow: false,

    sex: '男',
    man_image: '../Image/radio.png',
    women_image: '../Image/radio-1.png',

    briday: '1990-05-10',
    endTime: '2020-09-01',

    height: '160',
    index: 62,    // 必须写下来用来指向身高数组的下指标

    unit: '%',
    UD_unit:"kg",
    kcal: "kcal",
    kg_unit: '../Image/radio-1.png',
    jin_unit: '../Image/radio.png',

    edition: 'V1.0',

    hasUserInfo: false,
    wanShow: false,
    linksToPrompt: "提示",
  },


  bindViewTap: function () {
    wx.openSetting({
      success: (res) => {
      }
    })
  },

  onShow: function () {
    // 从存储中拿出连接的设备ID
    var that = this;
    var fatData = plugin.getBodyDataByInet(27, 170, 1, 60, 500);//年龄 身高  性别 重量  阻抗  
    console.log("fatData" , fatData);
    var scaleFatData = plugin.getBodyScaleDataByInet(170, 60, 1, fatData.bfr, fatData.rom, fatData.pp);//身高 体重 性别 体脂率 肌肉率 蛋白率
    console.log("scaleFatData", scaleFatData);
    //console.log("height:", obtainHeight("170"));
    //判断蓝牙是否开启
    that.longnv();
    deviceInfo = wx.getStorageSync('deviceInfo');
    deviceInfo_address = wx.getStorageSync('devMacAddress')
    if (deviceInfo != undefined && deviceInfo != null && deviceInfo != "" && deviceInfo != "1") {
      
    } else {
      that.setData({
        linksToPrompt: '未绑定设备',
      });
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //判断蓝牙是否开启
    that.longnv();
    if (wx.getStorageSync('userInfo').avatarUrl == null || wx.getStorageSync('userInfo').nickName == null) {
      that.setData({
        wanShow: !that.data.wanShow
      })
    } else {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }


    // 拿到当前日期（如：2017-06-06）
    var time2 = util.forNowTime(new Date());
    that.setData({
      endTime: time2,
    })

    // 拿到生日
    wx.getStorage({
      key: 'UserBriday',
      success: function (res) {
        that.briday = res.data;
        that.theSaveBriday(that.briday);
      }, fail: function (res) {
        wx.setStorageSync('UserBriday', "1990-05-10")
      }
    })

    // 拿到身高
    wx.getStorage({
      key: 'UserHight',
      success: function (res) {
        that.height = res.data;
        that.theSaveHeight(that.height);
      }, fail: function (res) {
        wx.setStorageSync('UserHight', "160")
      }
    })

    // 拿到性别
    wx.getStorage({
      key: 'UserSex',
      success: function (res) {
        that.sex = res.data;
        that.theSavedSex(that.sex);
      },
    })

    // 拿到单位
    wx.getStorage({
      key: 'UserUnit',
      success: function (res) {
        that.unit = res.data;
        that.theSavedUnit(that.unit);
      },
    })


  },

  // 拿到生日--重新刷UI
  theSaveBriday: function (bridayString) {
    this.setData({
      briday: bridayString,
    });
  },

  // 拿到身高--刷新UI
  theSaveHeight: function (heightString) {
    this.setData({
      index: heightString - 100,
    })
  },

  // 拿到性别--重新刷UI
  theSavedSex: function (sexString) {

    if (sexString == "男") {
      this.setData({
        sex: "男",
        man_image: '../Image/radio-1.png',
        women_image: '../Image/radio.png',
      })
    } else {
      this.setData({
        sex: "女",
        women_image: '../Image/radio-1.png',
        man_image: '../Image/radio.png',
      })
    }
    wx.setStorage({
      key: 'UserSex',
      data: sexString,
    })
  },

  ///////// ****** 调用点击方法 ******* ////////////////
  //** 性别 **//
  sexClick: function (res) {
    this.setData({
      isSexShow: !this.data.isSexShow
    })
  },

  manClick: function () {
    this.setData({
      sex: '男',
      man_image: '../Image/radio-1.png',
      women_image: '../Image/radio.png',
    });
    wx.setStorage({
      key: 'UserSex',
      data: this.data.sex,
    })
  },

  womanClick: function () {
    this.setData({
      sex: '女',
      women_image: '../Image/radio-1.png',
      man_image: '../Image/radio.png',
    });
    wx.setStorage({
      key: 'UserSex',
      data: this.data.sex,
    })
  },

  //** 生日 **//
  bindDateChange: function (res) {
    this.setData({
      briday: res.detail.value
    });
    wx.setStorage({
      key: 'UserBriday',
      data: this.data.briday,
    })
  },

  //** 身高 **//
  bindHightChange: function (res) {
    var numberValue = parseInt(res.detail.value)+100;
    this.setData({
      index: res.detail.value
    });
    wx.setStorage({
      key: 'UserHight',
      data: numberValue,
    })
  },

  //**  解除绑定  **/
  dismissDevice: function (res) {

    wx.navigateTo({
      url: '../BluetoothLink/BluetoothLink'
    })
  },

  /**  搜索蓝牙设备  **/
  linkBleButton: function () {
    wx.navigateTo({
      url: '../BluetoothLink/BluetoothLink'
    })
  },

  /**  自动连接蓝牙设备  **/
  longnv: function () {
    var that = this;

    if (deviceInfo != null && deviceInfo != "1") {
      if (wx.getStorageSync('deviceInfo').name == "icomon15") {
        wx.openBluetoothAdapter({
          success: function (res) {
            deviceInfo_address = wx.getStorageSync('devMacAddress')
            that.setData({
              linksToPrompt: "已绑定广播称:" + wx.getStorageSync('devMacAddress')+"，请上秤",
            });
            //  保持监测
            //   蓝牙已开启  开始
            that.openBluetoothAdapter();
          }, fail: function (res) {
            //    console.log("开启模块失败！");
            that.setData({
              linksToPrompt: '请开启手机蓝牙',
            });
            //重新搜索
            setTimeout(function () {
              that.longnv();
            }, 2000)

          },
        })
      } else {
        //   已绑定连接秤    重新连接
        wx.showLoading({
          title: '重新连接中....',
          icon: 'none',
          duration: 2000,
        })

        wx.openBluetoothAdapter({
          success: function (res) {
            wx.createBLEConnection({
              deviceId: wx.getStorageSync('deviceInfo').macAddress,
              success: function (res) {
                console.log('连接成功');
                console.log(res);
                wx.hideLoading()
                deviceInfo_address = wx.getStorageSync('devMacAddress')
                that.setData({
                  linksToPrompt: '已连接' + wx.getStorageSync('devMacAddress') + ',请上秤',
                  
                });
                that.link_device();
              },
              fail: function (res) {
                console.log('连接秤连接失败');
                console.log(res);
                wx.hideLoading()
                console.log(res);
                wx.showToast({
                  title: '自动连接失败，手动连接',
                  icon: 'none',
                  duration: 2000,
                })
              }
            })
          },
          fail: function () {
            wx.showToast({
              title: '请开启手机蓝牙',
              icon: 'none',
              duration: 2000,
            })
            that.setData({
              linksToPrompt: '请开启手机蓝牙',
            });
          }
        })

      }

    } else {
      that.setData({
        linksToPrompt: '未绑定设备',
      });
    }

  },


  /**  监听蓝牙 广播开始 **/
  openBluetoothAdapter: function () {
    var that = this;
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        that.startBluetoothDevicesDiscovery()
      },
      fail: (res) => {
        if (res.errCode === 10001) {
          wx.onBluetoothAdapterStateChange(function (res) {
            //   console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              this.startBluetoothDevicesDiscovery()
            }
          })
        }
      }
    })
  },

  /**  监听广播 **/
  startBluetoothDevicesDiscovery() {
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      interval: 0,
      success: (res) => {
        console.log('startBluetoothDevicesDiscovery success', res)
        this.onBluetoothDeviceFound()
      },
      fail: (res) => {
        console.log('开始搜索失败', res)
      }
    })
  },

  /**  接收广播数据，解析数据 **/
  onBluetoothDeviceFound() {
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (device.advertisServiceUUIDs == null || device.advertisServiceUUIDs.length == 0) { //判断是否为15设备
          if (deviceInfo != "1" && deviceInfo != null && deviceInfo.macAddress.length != 9) { //判断是否已经绑定设备
            var networkData = plugin.getBbroadcastData(device.advertisData);//获取广播称基础数据
            if (networkData != null && networkData.address == deviceInfo_address) {//判断基础数据是否为空，广播数据的mac地址是否等于绑定设备mac地址
              var sex = obtainSex(this.data.sex);//获取用户性别
              var age = obtainAge(this.data.briday);//获取用户年龄、
              var heigjtObt =  obtainHeight();
              console.log("sex:" + sex + ";age:" + age + ";height：" + heigjtObt);
              if (networkData.cmdType == 3) {//称重数据稳定，阻抗测量结束
                if (networkData.adc > 0) {  //有阻抗时                 
                  var fatData = plugin.getBodyDataByInet(age, heigjtObt ,sex,networkData.weight,networkData.adc);//年龄,身高,性别,重量,阻抗 
                  this.setData({
                    weightsum: networkData.weight.toFixed(1),           ///<重量  + 
                    adc: networkData.adc,           ///<阻抗 
                    BMI: fatData.bmi,                 ///<BMI
                    fatRate: fatData.bfr,            ///<体脂率
                    muscle: fatData.rom,              ///<肌肉率
                    moisture: fatData.moi,             ///<水份
                    boneMass: fatData.bm,            ///<骨量
                    BMR: fatData.bmr,                 ///<基础代谢率
                    visceralFat: fatData.uvi,         ///<内脏脂肪
                    subcutaneousFat: fatData.sfr,     ///<皮下脂肪 
                    proteinRate: fatData.pp,          ///<蛋白率 
                    physicalAge: fatData.pAge,         ///<生理年龄 
                    temp: networkData.temp,    ////温度
                    did: networkData.did,     ////did
                    linksToPrompt: "测量完成",
                    unit: "%"
                  });
                  var scaleFatData = plugin.getBodyScaleDataByInet(heigjtObt, networkData.weight, sex, fatData.bfr, fatData.rom, fatData.pp);//身高 体重 性别 体脂率 肌肉率 蛋白率
                  this.setData({
                    standardWeight: scaleFatData.standardWeight,   //标准体重
                    controlWeight: scaleFatData.controlWeight,     //体重控制量
                    fat: scaleFatData.fat,                 //脂肪量
                    removeFatWeight: scaleFatData.removeFatWeight,    //去脂肪体重
                    muscleMass: scaleFatData.muscleMass,              //肌肉量
                    protein: scaleFatData.protein                    //蛋白量
                  });
                } else {//无阻抗时
                  this.restartData();
                  this.setData({
                    weightsum: networkData.weight.toFixed(1),             ///<重量  
                    adc: networkData.adc,           ///<阻抗
                    temp: networkData.temp,    ////温度
                    did: networkData.did,     ////did
                    linksToPrompt: "阻抗测量失败",
                  })
                }
              } else if (networkData.cmdType == 1) {//称重数据未稳定时
                this.setData({
                  weightsum: networkData.weight.toFixed(1),
                  linksToPrompt: "称量中...",
                  fatdata: "称量中"
                })
              } else if (networkData.cmdType == 2) {//阻抗测量中
                this.restartData();
                this.setData({
                  linksToPrompt: "数据分析中，请不要下秤...",
                  weightsum: networkData.weight,
                  adc: networkData.adc,           ///<阻抗
                  temp: networkData.temp,    ////温度
                  did: networkData.did,     ////did
                })
              }
            }
          }
        }
      })
    })
  },
  restartData(){//设置默认值
    if (this.data.BMI != null && this.data.BMI != ""){
      this.setData({
        BMI:"",                 ///<BMI
        fatRate: "",            ///<体脂率
        muscle: "",              ///<肌肉率
        moisture: "",             ///<水份
        boneMass: "",            ///<骨量
        BMR: "",                 ///<基础代谢率
        visceralFat: "",         ///<内脏脂肪
        subcutaneousFat: "",     ///<皮下脂肪 
        proteinRate: "",          ///<蛋白率 
        physicalAge: "",         ///<生理年龄 
        unit: "%",
        standardWeight: "",   //标准体重
        controlWeight: "",     //体重控制量
        fat: "",                 //脂肪量
        removeFatWeight: "",    //去脂肪体重
        muscleMass: "",         //肌肉量
        protein: ""             //蛋白量
      });
    }
  }
})

function obtainSex(sexTemp) {
  if (sexTemp == "男") {
    return 1;
  } else {
    return 2;
  }
}

/// 获取年龄
function obtainAge(bridayTemp) {
  if (bridayTemp == "") {
    bridayTemp = "1990-05-10";
  }

  var date1 = new Date(bridayTemp)
  var date2 = new Date()
  var s1 = date1.getTime(), s2 = date2.getTime();
  var total = (s2 - s1) / 1000;
  var day = parseInt(total / (24 * 60 * 60));//计算整数天数
  var age = parseInt(day / 365) + 1;

  return age;
}

/// 获取身高
function obtainHeight() {
  var heightTemp =  wx.getStorageSync('UserHight');
  if (heightTemp == null || heightTemp == "") {
    heightTemp = 160;
  }else{
    return heightTemp;
  }
  
}