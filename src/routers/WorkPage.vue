<style lang="scss">
  .WorkPage {
    .top {
      border-bottom: 1px solid rgb(68, 68, 68);
      position: absolute;
      width: 100%;
      height: 56px;
      background: rgb(51, 51, 51);

      .file-select {
        position: absolute;
        display: inline-block;
        top: 8px;
        left: 20px;
        text-align: center;
        height: 40px;
        color: white;
        line-height: 40px;
        border-radius: 8px;
        width: 160px;
        background-color: #242424;

        &:hover {
          cursor: pointer;
          box-shadow: 1px 1px 6px #444444;
          transition: all .2s ease-out;
        }

        &:active {
          box-shadow: 2px 2px 6px #666;
        }
      }

      .operate-wrapper {
        position: absolute;
        top: 12px;
        left: 500px;
        width: 580px;
        display: inline-block;

        &:hover {
          cursor: default;
        }

        button {
          border: none;
          background-color: transparent;
          outline: none;

          i {
            font-size: 30px;
            color: #a8a8a8;
          }
        }
      }
    }

    .left {
      overflow: auto;
      background: #333333;
      border-right: solid 1px #444444;
      position: absolute;
      top: 60px;
      width: 196px;
      bottom: 0;
    }

    #webgl {
      position: absolute;
      top: 60px;
      left: 200px;
    }
  }
</style>

<template>
  <div class="WorkPage">
    <div class="top">
      <input type="file" id="file-input" @change="getFilePath"
             style="filter:alpha(opacity=0);opacity:0;width: 0;height: 0;"/>
      <div class="file-select" @click="selectFile">
        {{fileName || '请选择模型'}}
      </div>
      <div class="operate-wrapper">
        <button @click="resetModel">
          <i class="iconfont icon-reset"></i>
        </button>
        <button @click="handleEnlarge">
          <i class="iconfont icon-enlarge"></i>
        </button>
        <button @click="handleNarrow">
          <i class="iconfont icon-narrow"></i>
        </button>
        <button @click="showHide('centerAxis')">
          <i class="iconfont icon-axis"></i>
        </button>
        <button @click="showHide('bottomGrid')">
          <i class="iconfont icon-grid"></i>
        </button>
      </div>
    </div>
    <div class="left">
      <a-button type="primary">
        Primary
      </a-button>
      <a-button>Default</a-button>
      <a-button type="dashed">
        Dashed
      </a-button>
    </div>
    <div id="webgl"></div>
  </div>
</template>

<script>
  export default {
    name: "WorkPage"
  }
</script>
