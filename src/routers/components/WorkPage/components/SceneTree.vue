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
import {mapMutations} from 'vuex';
import _ from 'lodash';
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
    // 图层数据变化后重新绘制图层节点树
    data(val) {
      this.data = val;
      this.createTree();
    },
    // 处理复选框变化
    checkedKeys(val) {
      this.allCheckedData.forEach(item => {
        if (item.fatherNode || val.includes(item.name)) {
          showHide(item.name, true);
        } else {
          showHide(item.name, false);
        }
      })
      // 过滤数据，比如子图层全选会有父图层节点重复加入，原因是antd这个checkedKeys数据结构暴露出来的参数是扁平化的结构
      const filterData = (data) => {
        // 首先逆序排序，比如相同的会是：水平切片3、水平切片2、水平切片1、水平切片0、水平切片
        data.sort((a, b) => {
          return b.localeCompare(a);
        });
        // 组装需要导出的索引名称，先判断前面数据是否包含子节点，因为排序后父节点注定会在子节点后面，最后通过切分字符串返回数组
        return data.reduce((pre, cur) => {
          if (pre.includes(cur)) {
            return pre;
          } else {
            return pre + '-' + cur;
          }
        }).split('-');
      }
      this.updateIndexData(filterData(_.cloneDeep(this.checkedKeys)));
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
    ...mapMutations({
      updateIndexData: 'commonData/updateIndexData',
    }),
    createTree() {
      this.treeData = [];
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
          const judgeFatherNode = (data) => {
            let result = false;
            data.forEach(item => {
              if (item instanceof Three.Group) {
                result = true;
              }
            })
            return result;
          }
          // 首先判断是否为父节点，其次判断是否为可见，当不为父节点且可见则将当前选中图层加入数组
          !judgeFatherNode(source[key].children) && source[key].visible && this.checkedKeys.push(currentName); // 当visible为可见时才可进入数组
          if (source[key].children.length) {
            // 只有子数据含有Group类型数组才为父节点否则都是最子节点
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

