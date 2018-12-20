<template>
  <main>
    <div v-if="progress != null" class="loading">
      <img src="~assets/images/logo-white.svg" />
      <div :style="{ height: progress * 100 + '%' }">
        <img src="~assets/images/logo-colorful.svg" />
      </div>
    </div>
    <i-header v-show="start" class="index-header" :white="true"></i-header>
    <video ref="video" muted @ended="startRepeat"></video>
    <i-footer v-show="start" class="index-footer" :white="true"></i-footer>
  </main>
</template>
<script>
import iHeader from '@/components/i-header.vue';
import iFooter from '@/components/i-footer.vue';

import webm from '@/assets/videos/index.webm';
import mp4 from '@/assets/videos/index.mp4';

// https://davidwalsh.name/detect-supported-video-formats-javascript
function supportsVideoType(type) {
  const video = document.querySelector('video');

  // Allow user to create shortcuts, i.e. just "webm"
  const formats = {
    ogg: 'video/ogg; codecs="theora"',
    h264: 'video/mp4; codecs="avc1.42E01E"',
    webm: 'video/webm; codecs="vp8, vorbis"',
    vp9: 'video/webm; codecs="vp9"',
    hls: 'application/x-mpegURL; codecs="avc1.42E01E"'
  };

  return video.canPlayType(formats[type] || type) === 'probably';
}

export default {
  components: {
    iHeader,
    iFooter,
  },
  data() {
    return {
      progress: null,
      start: false,
    };
  },
  methods: {
    startRepeat() {
      /** @type {{video: HTMLVideoElement}} */
      const { video } = this.$refs;
      video.currentTime = 14.023;
      video.play();
    },
  },
  mounted() {
    /** @type {{video: HTMLVideoElement}} */
    const { video } = this.$refs;

    const req = new XMLHttpRequest();
    req.open('GET', supportsVideoType('vp9') ? webm : mp4);
    req.responseType = 'blob';
    req.onprogress = e => {
      console.log(e);
      this.progress = e.loaded / e.total;
      if (this.progress === 1) {
        this.progress = null;
      }
    };
    req.onload = () => {
      if ('srcObject' in video) {
        console.dir(req.response);
        try {
          video.srcObject = req.response;
        } catch (error) {
          video.src = URL.createObjectURL(req.response);
        }
      } else {
        video.src = URL.createObjectURL(req.response);
      }
      video.play();
      this.start = true;
    };
    req.send();
  },
  beforeDestroy() {
    /** @type {{video: HTMLVideoElement}} */
    const { video } = this.$refs;
    if (video.src) {
      URL.revokeObjectURL(video.src);
    }
  },
};
</script>
<style lang="scss" scoped>
  @import "~assets/style/px2rem";

  main {
    position: relative;
    background: #010605;
    height: 100vh;
    overflow: hidden;
  }
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }
  .loading {
    width: px2rem(200px);
    height: px2rem(152px);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;

    img {
      width: px2rem(200px);
      height: px2rem(152px);
    }

    div {
      position: absolute;
      overflow: hidden;
      bottom: 0;
      width: 100%;
      height: 100%;

      img {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
  }

  .index-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    animation: index-header_enter .5s 7s both, index-header-flink 3s 8s infinite;
  }
  .index-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    animation: index-footer_enter .5s 10s both;
  }
  @keyframes index-header-flink {
    from { background: rgba(0,0,0, 0) }
    5% { background: rgba(0,0,0, .3) }
    10% { background: rgba(0,0,0, 0) }
    50% { background: rgba(0,0,0, .3) }
  }
  @keyframes index-header_enter {
    from { transform: translateY(-500px); }
  }
  @keyframes index-footer_enter {
    from { transform: translateY(500px); }
  }
</style>
