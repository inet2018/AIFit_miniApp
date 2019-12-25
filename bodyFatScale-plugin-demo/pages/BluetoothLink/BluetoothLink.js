
var plugin = requirePlugin("myPlugin")
//var plugin = require("../../plugins/index.js");
const app = getApp();

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}



Page({
  data: {
    list: [],
    devices: [], //
    dev1: "已发现",
    dev2: "台设备",
    data: {},
    dainji: "绑定设备",
    shebei: "",
    headTip: '下拉刷新',
    indx: "0",
    //  显示隐藏
    showView: true,

    deviceInfo: ({
      macAddress: "",
      name: "",
      advertisData: "",
    })


  },
  onLoad: function() {

    var that = this;
    // that.setData({
    //   list: [],
    //   devices: [],
    // });

    //  获取设备列表
    // that.openBluetoothAdapter();
    // console.log("openBluetoothAdapter");
  },

  //   点击切换显示隐藏   


  onShow: function() {
    var that = this;


    that.setData({
      list: [],
      devices: [],
    });

    //    that.refreshInterface();

    that.openBluetoothAdapter();

    setTimeout(() => {
      var deviceInfo = wx.getStorageSync('deviceInfo')
      console.log(deviceInfo);
      if (deviceInfo == "1" || deviceInfo == null) {
        that.setData({
          dainji: "绑定设备",
        });
      } else {
        // if (deviceInfo.macAddress.length == 9) {
        //   that.setData({
        //     dainji: "绑定设备",
        //   });
        // }else{
        //   that.setData({
        //     dainji: "绑定设备",

        //     dev1: "已发现：",
        //     dev2: "台设备，已连接", 
        //     shebei:wx.getStorageSync('deviceInfo').macAddress
        //   });
        // }
      }
    }, 1000)

  },

  onHide: function() {
    var that = this;
    that.stopBluetoothDevicesDiscovery();

  },






  onPullDownRefresh: function() {
    console.log('下拉刷新')
    var that = this;
    that.setData({
      list: [],
      devices: [],
    });

    that.openBluetoothAdapter();
    wx.showNavigationBarLoading() //在标题栏中显示加载

    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 3000)

  },



  //    官方广播称开始

  openBluetoothAdapter: function() {
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        this.startBluetoothDevicesDiscovery()
        this.setData({ //     我们不一样
          shebei: "，请稍后",
          dev1: "已发现",
          dev2: "台设备",
        })
      },
      fail: (res) => {

        if (res.errCode === 10001) {
          wx.onBluetoothAdapterStateChange(function(res) {
            console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              this.startBluetoothDevicesDiscovery()
            }
          })
        }
        this.setData({ //     我们不一样
          shebei: "请开启手机蓝牙",
          dev1: "",
          dev2: "",
        })
      }
    })
  },
  getBluetoothAdapterState() {
    wx.getBluetoothAdapterState({
      success: (res) => {
        //   console.log('getBluetoothAdapterState', res)
        if (res.discovering) {
          this.onBluetoothDeviceFound()
        } else if (res.available) {
          this.startBluetoothDevicesDiscovery()
        }
      }
    })
  },
  startBluetoothDevicesDiscovery() {

    wx.startBluetoothDevicesDiscovery({
      // services: [AICARE_SERVICE_UUID, aicare_service_uuid_android],
      allowDuplicatesKey: true,
      success: (res) => {
        console.log('startBluetoothDevicesDiscovery success', res)
        this.onBluetoothDeviceFound()
      },
    })
  },

  onBluetoothDeviceFound() {
    
    console.log("reresresresresress");
    wx.onBluetoothDeviceFound((res) => {
      console.log(res);
      res.devices.forEach(device => {
        if (device.advertisServiceUUIDs == null || device.advertisServiceUUIDs.length == 0) {
          var data15 = plugin.getBbroadcastData(device.advertisData);
          if (data15 != null) {
            console.log("广播秤");
            device.advertisData = data15.address;
            device.name = "icomon15";
            const foundDevices = this.data.devices
            const idx = inArray(foundDevices, 'deviceId', device.deviceId)
            const data = {}
            if (idx === -1) {
              data[`devices[${foundDevices.length}]`] = device
            } else {
              data[`devices[${idx}]`] = device
            }
            console.log(device);
            this.setData(data)
          }
        } else {
          console.log("不是我们的秤");
        }
      })
    })


  },

  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery(
      console.log("蓝牙搜索已关闭")
    )
  },
  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter()
    console.log("蓝牙模块已关闭")
  },




  //点击绑定设备处理
  bindViewTap: function(e) {
    var that = this;
    console.log('点击事件--绑定对应的秤');

    wx.closeBLEConnection({
      deviceId: wx.getStorageSync('deviceInfo').macAddress,
      success(res) {
        console.log(res)
      }
    })
    
    that.stopBluetoothDevicesDiscovery();  //  关闭蓝牙搜索
    console.log(e.currentTarget.dataset.title);
    console.log(e.currentTarget.dataset.name);
    console.log(e.currentTarget.dataset.macaddress);

    if (e.currentTarget.dataset.name != "icomon15") {

      console.log('点击连接--连接秤');

      wx.showLoading({
        title: '正在连接....',
      })
      //  初适化蓝牙模块
      wx.openBluetoothAdapter({
        success: function(res) {},
        fail: function() {
          wx.showToast({
            title: '启动蓝牙失败，请开启蓝牙',
            icon: 'noine',
            duration: 1500,
          })
        }
      })

      wx.createBLEConnection({
        deviceId: e.currentTarget.dataset.title,
        success: function(res) {
          console.log('连接成功');
          console.log(res);
          wx.hideLoading()
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 1000,
          })

          that.setData({ //     我们不一样
            deviceInfo: ({
              macAddress: e.currentTarget.dataset.title,
              name: e.currentTarget.dataset.name,
              advertisData: e.currentTarget.dataset.advertisData,
              macdidname: e.currentTarget.dataset.macdidname
            })
          })

          wx.setStorageSync("deviceInfo", that.data.deviceInfo);
          console.log("新绑定设备信息：")
          console.log(wx.getStorageSync('deviceInfo'))

          wx.switchTab({
            url: '../index/index'
          })

        },
        fail: function(res) {
          console.log('连接秤连接失败');
          console.log(res);
          wx.hideLoading()
          console.log(res);
          wx.showToast({
            title: '连接失败，再试试',
            icon: 'none',
            duration: 2000,
          })
        }
      })
    } else {
      // 广播秤BM15 连接  
      //  初适化蓝牙模块
      wx.showLoading({
        title: '正在绑定广播....',
      })

      wx.closeBluetoothAdapter({
        success: function(res) {
          console.log(res)
          wx.hideLoading()
          wx.showToast({
            title: '广播秤绑定成功',
            icon: 'success',
            duration: 1000,
          })

          that.setData({ //     我们不一样
            deviceInfo: ({
              macAddress: e.currentTarget.dataset.title,
              name: e.currentTarget.dataset.name,
              advertisData: e.currentTarget.dataset.advertisData,
              macdidname: e.currentTarget.dataset.macdidname,
            })
          })

          wx.setStorageSync("deviceInfo", that.data.deviceInfo);
          wx.setStorageSync("devMacAddress", e.currentTarget.dataset.macaddress);
          console.log("新绑定设备信息：" + e.currentTarget.dataset.macaddress);
          
          // wx.switchTab({
          //   url: '../index/index'
          // })
          wx.navigateTo({
            url: '../index/index'
          })
        }
      })

    }







    //   跳转回主界面
    // wx.switchTab({
    //   url: '../measure/measure'
    // })

  },




})