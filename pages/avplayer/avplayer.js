// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
    /**
     * 页面的初始数据
     */
    data: {
        // src: 'https://lzscuw.changba.com/1053405325.mp3',
        src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46',
        isAudioDiskRotating: false, // 音频背景旋转标志
        isPlaying: false,
        playStatusText: ["暂停", "播放中", "缓冲中", "暂无信息"], //0 未播放 1 播放中 2 缓冲中
        playStatus: 0,
        defaultAudioBgUrl: "/images/card.png",
        currentTime: '00:00',
        totalTime: '00:00',
        sliderValue: 0,
        sliderMax: 0,
        seekPos: 0,
        isMovingSlider: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(params) {
        console.log("page ---onLoad---")
        let self = this
        self.innerAudioContext = wx.createInnerAudioContext()
        // self.innerAudioContext.autoplay = true
        // self.innerAudioContext.loop = true
        self.innerAudioContext.src = 'https://lzscuw.changba.com/1053405325.mp3'
        // self.setData({
        //   totalTime: self.formatTime(self.innerAudioContext.duration),
        // })
        self.innerAudioContext.onPlay(() => {
            self.setData({
              isPlaying: true
            })
            wx.hideLoading()
            console.log('开始播放')
        })
        self.innerAudioContext.onPause(() => {
          self.setData({
            isPlaying: false
          })
          wx.hideLoading()
          console.log('暂停播放')
        })
        self.innerAudioContext.onWaiting(() => {
          wx.showLoading({
            title: '加载中...'
          })
          console.log('onwaiting')
        })
        self.innerAudioContext.onStop((res) => {
          console.log('stop')
          console.log(res)
        })
        self.innerAudioContext.onEnded((res) => {
          console.log('end')
          let self = this
          self.resetPlayer()
        })
        self.innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
        self.innerAudioContext.onTimeUpdate((res) => {
            console.log('timeupdate' + self.data.isMovingSlider)
            if(!self.data.isMovingSlider) {
              self.setData({
                currentTime: self.formatTime(self.innerAudioContext.currentTime),
                totalTime: self.formatTime(self.innerAudioContext.duration),
                sliderMax: Math.floor(self.innerAudioContext.duration) - 1 || 0,
                sliderValue: Math.floor(self.innerAudioContext.currentTime),
              })
            }
        })
        self.innerAudioContext.onSeeked((res)=>{
          wx.hideLoading()
          console.log('seeked')
          self.setData({
            currentTime: self.formatTime(self.data.seekPos),
            sliderValue: Math.floor(self.data.seekPos),
          })
          self.playorpause() //解决播放时拖拽onTimeUpdate不更新问题
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        console.log("page ---onReady---")
        wx.setNavigationBarTitle({ title: '播放器' })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        console.log("page ---onShow---")
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log("page ---onHide---");
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        console.log("page ---onUnload---");
    },

    onPageScroll: function (e) {
        let self = this
    },
    onReachBottom: function () {
        // Do something when page reach bottom.
        let self = this
        console.log('bottom')
    },
    playorpause: function () {
      let self = this
      console.log('duration' + self.innerAudioContext.duration)
      if(self.data.isPlaying) {
        self.innerAudioContext.pause()
        console.log('pause')
      } else {
        self.innerAudioContext.play()
        console.log('play')
      }
      
    },
    sliderMoveStart: function(e) {
      let self = this
      self.setData({
        isMovingSlider: true
      });
    },
    sliderMoveEnd: function (e) {
      let self = this
      self.setData({
        isMovingSlider: false
      });
    },
    sliderChange: function(e) {
      console.log(e)
      
      let self = this
      let pos = e.detail.value
      self.seekCurrentAudio(pos)
      console.log(pos+'ssss')
    },
    // seek 当前播放位置
    seekCurrentAudio: function(pos) {
      let self = this
      let audioPos = Math.floor(pos)
      wx.hideLoading()
      if (self.data.isPlaying) {
        self.playorpause()
      }
      self.innerAudioContext.seek(audioPos)
      self.setData({
        seekPos: audioPos
      })
      console.log(audioPos)
    },
    // 重置播放器
    resetPlayer: function () {
      let self = this
      self.seekCurrentAudio(0)
      // self.setData({
      //   isPlaying: false,
      //   currentTime: '00:00',
      //   sliderValue: 0,
      //   seekPos: 0
      // })
    },
    formatTime: function (time) {
      let hour =0
      let minute = 0
      let second = 0
      let resT = ''

      hour = Math.floor(time/60/60)
      minute = Math.floor((time/60)%60)
      second = Math.floor(time%60)
      if(hour < 10) {
        hour = '0' + hour
      }
      if(minute < 10) {
        minute = '0' + minute
      }
      if (second < 10) {
        second = '0' + second
      }
      // console.log(hour)
      // console.log(minute)
      // console.log(second)

      resT = minute + ':' + second
      return resT
    }
})

