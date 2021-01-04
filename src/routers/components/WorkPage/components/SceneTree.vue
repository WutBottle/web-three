<style lang="scss">
.SceneTree {

}
</style>

<template>
  <div class="SceneTree">
    <a-tree
      v-model="checkedKeys"
      checkable
      :auto-expand-parent="true"
      :tree-data="treeData"
    />
  </div>
</template>

<script>
import * as Three from 'three';
import {
  showHide
} from '@js/drawFunction';

export default {
  name: "SceneTree",
  props: {
    data: {
      type: Array,
      default: () => [],
    }
  },
  watch: {
    data: {
      handler(val) {
        this.data = val;
        this.createTree();
      },
      deep: true //true 深度监听
    },
    // 处理复选框变化
    checkedKeys(val) {
      this.allCheckedData.forEach(item => {
        // 此处写法解决tree val第一次更改后自动回退到前一步数据问题，原因暂时未知
        showHide(item.name, true);
        if(!(item.fatherNode || val.includes(item.name))) {
          showHide(item.name, false);
        }
      })
    },
  },
  data() {
    return {
      treeData: [],
      checkedKeys: [],
      allCheckedData: [],
    }
  },
  mounted() {
    // 生成菜单树
    this.createTree();
  },
  methods: {
    createTree() {
      this.treeData = []; // 初始化树形数据
      this.checkedKeys = []; // 初始化绑定显隐数组
      this.allCheckedData = []; // 初始化树形显隐控制数组
      this.traverseScene(this.data, this.treeData); // 遍历scene进行控制
    },
    // 遍历场景
    traverseScene(source, treeData) {
      for (let key in source) {
        if (source[key] instanceof Three.Group) {
          const currentName = source[key].name;
          const currentKey = source[key].name;
          source[key].visible && this.checkedKeys.push(currentName); // 当visible为可见时才可进入数组
          if (source[key].children.length) {
            // 只有子数据含有Group类型数组才为父节点否则都是最子节点
            const judgeFatherNode = (data) => {
              let result = false;
              data.forEach(item => {
                if(item instanceof Three.Group) {
                  result = true;
                }
              })
              return result;
            }
            this.allCheckedData.push({
              name: currentName,
              fatherNode: judgeFatherNode(source[key].children)
            })
            treeData.push({
              title: currentName,
              key: currentKey,
              children: [],
            });
            const currentIndex = treeData.findIndex(value => value.title === currentName);
            this.traverseScene(source[key].children, treeData[currentIndex].children, treeData[currentIndex].key);
          } else {
            this.allCheckedData.push({
              name: currentName,
              fatherNode: false,
            })
            treeData.push({
              title: currentName,
              key: currentKey,
            });
          }
        }
      }
    },
  }
}
</script>

