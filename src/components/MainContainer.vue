<template>
  <main>
    <ul v-loading="loading">
      <el-dialog class="el-dialog-wrapper" :title="singlePainting.worksName" :visible.sync="dialogVisible" :before-close="handleClose">
        <div class="intro">{{showIntro}}</div>
        <el-rate @change="rateChange" :allow-half="true" v-model="showRate" text-color="#ff9900">
        </el-rate>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </el-dialog>
      <li v-for="(painting, index) in paintings" :key="index">
        <div class="img-container" @click="showImg(painting)">
          <div class="img-wrapper">
            <img v-lazy="painting.imgUrl[0]" alt="img">
          </div>
          <div class="img-mask">
            <div class="click-item">
              <i class="el-icon-zoom-in"></i>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="worksName">{{painting.worksName}}</div>
          <div class="authorName">
            <span>by {{painting.userName}}</span>
          </div>
          <div class="rate-wrapper" @click="clickToRate(painting)">

            <el-rate class="el-rate-inner" v-model="painting.averageScore" disabled text-color="#ff9900" :max="5">
            </el-rate>
            <button class="button-rate">评分</button>
          </div>
          <div class="rate-people">{{painting.ratingPeople}} 人评分</div>
        </div>
      </li>
    </ul>
    <div class="swipe-container2" v-if="slideShow" @click="slideShowClicked($event)">
      <i class="el-icon-close"></i>
      <swiper :options="swiperOption" class="swiper-inner">
        <swiper-slide class="swiper-slide-inner" v-for="(img, index) in painting.imgUrl" :key="index">
          <img :src="img" alt="图片详情" style="margin-top: 20px;">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-prev" slot="button-prev">
          <i class="el-icon-caret-left"></i>
        </div>
        <div class="swiper-button-next" slot="button-next">
          <i class="el-icon-caret-right"></i>
        </div>
      </swiper>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      serverUrl: 'https://gjs.so/painting2018',
      paintings: [],
      painting: [],
      showRate: 0,
      loading: true,
      dialogVisible: false,
      singlePainting: {},
      currentRate: 0,
      showListLength: 1,
      slideShow: false,
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      showIntro: ''
    }
  },
  methods: {
    getAllPainting() {
      this.$http
        .get(this.serverUrl + '/allpainting')
        .then(response => {
          this.loading = false
          if (response.status == 200) {
            const rowPainting = response.data.map((value, index) => {
              value.imgUrl = JSON.parse(value.imgUrl)
              return value
            })
            
            this.paintings = rowPainting.reverse()
          } else {
            this.loading = false
          }
        })
        .catch(error => {})
    },
    slideShowClicked(e) {
      const classList = e.target.classList
      if (
        classList.contains('swiper-container') ||
        classList.contains('swipe-container') ||
        classList.contains('el-icon-close') ||
        classList.contains('swiper-slide')
      ) {
        this.slideShow = false
      }
    },
    showImg(painting) {
      this.slideShow = true
      this.painting = painting
    },
    clickToRate(painting) {
      this.showIntro = painting.description
      log(painting.description)
      if (!painting.isRated) {
        this.singlePainting = painting
        this.dialogVisible = true
      } else {
        this.warningMessage('您不可以为这个作品投票')
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
    cancel() {
      this.dialogVisible = false
    },
    checkIsRated(id) {
      this.paintings.forEach(painting => {
        if (painting.id == id) {
          painting.isRated = true
        }
      })
    },
    confirm() {
      this.dialogVisible = false
      const rateValue = this.currentRate
      const id = this.singlePainting.id
      const data = {
        id,
        rateValue
      }
      const date = new Date()
      const unixTime = date.getTime()
      if (unixTime > 1538842000000) {
        this.warningMessage('已经过了投票期限啦')
        return
      }
      this.$http.post(this.serverUrl + '/rate', data).then(
        res => {
          this.successMessage('投票成功了')
          this.checkIsRated(id)
        },
        errRes => {
          const status = errRes.response.status
          if (status == 601) {
            this.warningMessage('您已经投过票了')
          } else if (status == 602) {
            this.warningMessage('您不可以为自己的作品投票')
          }
          this.checkIsRated(id)
        }
      )
    },
    warningMessage(messageText) {
      this.$message({
        message: messageText,
        type: 'warning'
      })
    },
    successMessage(messageText) {
      this.$message({
        message: messageText,
        type: 'success'
      })
    },
    rateChange(value) {
      this.showRate = value
      const currentRate = value * 2
      this.currentRate = currentRate
    },
    listenToUserKeyboard(e){
      if (e.key == 'Escape') {
        this.slideShow = false
      }  
    }
  },
  created() {
    this.getAllPainting()
    window.addEventListener('keyup', this.listenToUserKeyboard, false)
  }
}
</script>

<style scoped>
main {
  position: relative;
  height: 100vh;
}
main ul {
  position: absolute;
}
.swiper-button-prev {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: none;
  font-size: 30px;
  z-index: 21;
}
.swiper-inner {
  display: flex;
  align-items: center;
}
.swiper-button-next {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: none;
  font-size: 30px;
  z-index: 21;
}
.el-icon-close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  color: #bababa;
  cursor: pointer;
}
.swipe-container2 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.76);
  z-index: 10;
}
.swipe-container img {
  border: 1px solid red;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
  max-height: 80%;
}
.intro {
  margin-top: -18px;
  margin-bottom: 16px;
  line-height: 1.5;
  text-indent: 1px;
}
.rate-people {
  text-align: left;
  margin-top: 0px;
  line-height: 1.8;
  margin-top: 5px;
}
.authorName {
  text-align: left;
  margin-top: 3px;
}
.authorName span {
  color: #57a3f3;
}
.content {
  padding-left: 3px;
}

main ul li .img-container img {
  width: 100%;
}
.worksName {
  text-align: left;
  font-size: 22px;
  line-height: 28px;
  border-top: 0px solid transparent;
  margin-top: 5px;
}
.button-rate {
  background-color: #98bbf0;
  border: none;
  padding: 6px 12px;
  color: #fff;
}
.swiper-slide-inner {
  overflow: hidden;
}
@media screen and (max-width: 435px) {
  .rate-wrapper {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    padding-right: 16px;
    align-items: center;
    cursor: pointer;
  }
  .swiper-slide-inner img {
    width: 86%;
  }
  main ul li .img-container {
    height: 210px;
    overflow: hidden;
  }
  main {
    display: flex;
    justify-content: center;
  }
  .rate-people {
    font-size: 14px;
    margin-top: -2px;
  }
  .authorName span {
    font-size: 16px;
  }
  main ul {
    width: 76%;
  }
  main ul li {
    width: 88%;
    margin-right: auto;
    margin-left: auto;
    height: 340px;
  }
}
@media screen and (min-width: 436px) {
  .swiper-slide-inner img {
    margin-top: 60px;
    width: 60%;
  }
  .authorName span {
    font-size: 16px;
  }
  .content {
    margin-top: 30px;
  }
  main ul li .img-container {
    position: relative;
    height: 200px;
  }
  main ul li .img-container .img-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    height: 200px;
    width: 100%;
    overflow: hidden;
  }
  .img-container:hover .img-mask {
    z-index: 9;
    height: 200px;
    width: 100%;
    position: absolute;
    transition: all 0.5s;
    display: block;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .click-item {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
  .el-icon-zoom-in {
    display: none;
    transition: all 0.3s;
  }
  .img-container:hover .click-item {
    cursor: pointer;
    width: 30px;
    height: 30px;
    background-color: #f5f5f5;
    transition: all 0.6s;
  }
  .img-container:hover .el-icon-zoom-in {
    display: block;
  }
  .click-item:hover .el-icon-zoom-in {
    color: #98bbf0;
    transition: all .4s
  }
  .rate-wrapper {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 15px;
    margin-top: 14px;
  }
  .el-rate-inner {
    cursor: pointer;
    font-size: 20px;
  }
  main {
    display: flex;
    justify-content: center;
  }
  .button-rate {
    cursor: pointer;
    font-size: 14px;
  }
  main ul {
    width: 83%;
    max-width: 1180px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-wrap: wrap;
  }
  main ul li {
    height: 322px;
    width: 270px;
    margin-right: 13px;
    margin-top: 10px;
  }
  main ul li .img-container {
    height: 170px;
    width: 100%;
  }
  .img-container {
    position: relative;
  }
  .img-container img {
    display: block;
    position: absolute;
  }
  .content {
    font-size: 14px;
  }
}
</style>
