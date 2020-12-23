<style lang="scss">
.LeftBar {
  position: absolute;
  z-index: 0;
  left: 0;
  top: 29px;
  bottom: 0;
  background-color: #474747;
  color: #d5d5d5;
  width: 40px;

  .tool-wrapper {
    flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    padding-top: 10px;

    .icon-wrapper {
      padding: 2px 6px 2px 6px;
      margin-bottom: 2px;
      border-radius: 3px;

      &:active {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
}
</style>

<template>
  <div class="LeftBar">
    <div class="tool-wrapper">
      <a-tooltip placement="right">
        <template slot="title">
          <span>回中</span>
        </template>
        <i class="icon-wrapper iconfont icon-reset" @click="resetModel"></i>
      </a-tooltip>
      <a-tooltip placement="right">
        <template slot="title">
          <span>放大</span>
        </template>
        <i class="icon-wrapper iconfont icon-enlarge" @click="handleEnlarge"></i>
      </a-tooltip>
      <a-tooltip placement="right">
        <template slot="title">
          <span>缩小</span>
        </template>
        <i class="icon-wrapper iconfont icon-narrow" @click="handleNarrow"></i>
      </a-tooltip>
      <a-tooltip placement="right">
        <template slot="title">
          <span>显/隐坐标轴</span>
        </template>
        <i class="icon-wrapper iconfont icon-axis" @click="showHide('centerAxis')"></i>
      </a-tooltip>
      <a-tooltip placement="right">
        <template slot="title">
          <span>显/隐底部网格</span>
        </template>
        <i class="icon-wrapper iconfont icon-grid" @click="showHide('bottomGrid')"></i>
      </a-tooltip>
      <a-tooltip placement="right">
        <template slot="title">
          <span>显/隐包络盒</span>
        </template>
        <i class="icon-wrapper iconfont icon-box" @click="showHide('surroundBox')"></i>
      </a-tooltip>
    </div>
  </div>
</template>

<script>
import {
  handleEnlarge,
  handleNarrow,
  resetModel,
  showHide,
} from '@js/drawFunction';

export default {
  name: "LeftBar",
  data() {
    return {
      handleEnlarge,
      handleNarrow,
      resetModel,
      showHide,
    }
  }
}
</script>