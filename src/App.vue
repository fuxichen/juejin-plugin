<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { initTouch } from './hooks/useTouchBtn';
import { ElForm, ElFormItem, ElSwitch, ElPopover, ElLink } from 'element-plus';
import { usePinsBlackPlugin } from './plugin/usePinsBlackPlugin';
import { coralReadingRewards } from './plugin/coralReadingRewards';
import { useHideHotListPlugin } from './plugin/useHideHotListPlugin';
import { ClockInData, useFishPlanPlugin } from './plugin/useFishPlan';

let pinsBlackObj = usePinsBlackPlugin();
let cralReadingRewardsObj = coralReadingRewards();
let hideHotListPlugin = useHideHotListPlugin();
let fishPlanPlugin = useFishPlanPlugin();

let defaultFormData = {
  pinsBlackState: false,
  blackKeyList: ['星期四'],
  coralReadingRewardsState: false,
  hideHotListState: false,
  fishPlanState: true,
};
// 处理入口icon
let state = reactive<{
  top: number;
  left: number;
  panelState: { position: 'left' | 'right' };
  open: boolean;
  moveState: boolean;
  formData: typeof defaultFormData;
  clockInData: ClockInData[];
}>({
  top: 150,
  left: 10,
  panelState: {
    position: 'left',
  },
  open: false,
  moveState: false,
  formData: JSON.parse(localStorage.getItem('fromData') || JSON.stringify(defaultFormData)),
  clockInData: [],
});
let iconContainer = ref<HTMLDivElement>();

onMounted(() => {
  if (iconContainer.value) {
    let data = initTouch(iconContainer.value, { top: 150, left: 10, stick: true });
    watch(data, () => {
      state.top = data.top;
      state.left = data.left;
      state.moveState = data.state !== 'end';
      state.panelState.position = state.left < window.innerWidth / 2 ? 'left' : 'right';
    });
  }
});

function showContent() {
  state.open = !state.open;
}

watch(
  () => state.formData,
  (val) => {
    localStorage.setItem('fromData', JSON.stringify(val));
  },
  { deep: true, immediate: true }
);

watch(
  () => ({ list: state.formData.blackKeyList, state: state.formData.pinsBlackState }),
  (val) => {
    if (val.state) {
      pinsBlackObj.start(val.list);
    } else {
      pinsBlackObj.stop();
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => state.formData.coralReadingRewardsState,
  (val) => {
    if (val) {
      cralReadingRewardsObj.start();
    } else {
      cralReadingRewardsObj.stop();
    }
  },
  { immediate: true }
);

watch(
  () => state.formData.hideHotListState,
  (val) => {
    if (val) {
      hideHotListPlugin.start();
    } else {
      hideHotListPlugin.stop();
    }
  },
  { immediate: true }
);

watch(
  () => state.formData.fishPlanState,
  async (val) => {
    if (val) {
      state.clockInData = await fishPlanPlugin.start();
    } else {
      fishPlanPlugin.stop();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="container" ref="iconContainer" :style="{ '--top': `${state.top}px`, '--left': `${state.left}px` }">
    <div class="icon-container" @click="showContent">
      <img class="icon" :draggable="false"
        src="https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/6c61ae65d1c41ae8221a670fa32d05aa.svg" />
    </div>
    <div class="panel" @click.stop="false" @mousedown.stop="false" @touchstart.stop="false" v-if="state.open"
      :style="{ [`${state.panelState.position}`]: 0 }">
      <ElForm :model="state.formData">
        <ElFormItem label="沸点关键字屏蔽">
          <ElSwitch v-model="state.formData.pinsBlackState"></ElSwitch>
        </ElFormItem>
        <ElFormItem label="关键字列表">
          <ElSelect class="hidden-popper" v-model="state.formData.blackKeyList" multiple filterable allow-create
            default-first-option :reserve-keyword="false" :teleported="false">
            <ElOption v-for="item in state.formData.blackKeyList" :key="item" :label="item" :value="item"></ElOption>
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="会员文章阅读任务">
          <ElSwitch v-model="state.formData.coralReadingRewardsState"></ElSwitch>
        </ElFormItem>
        <ElFormItem label="隐藏榜单">
          <ElSwitch v-model="state.formData.hideHotListState"></ElSwitch>
        </ElFormItem>
        <ElFormItem label="沸点养鱼计划第四期">
          <template #label>
            <a href="https://juejin.cn/post/7216213764776984633">沸点养鱼计划第四期</a>
          </template>
          <ElSwitch v-model="state.formData.fishPlanState"></ElSwitch>
        </ElFormItem>
        <template v-if="state.formData.fishPlanState">
          <ElFormItem label="签到日历"> </ElFormItem>
          <div class="fishList">
            <el-popover v-for="item in state.clockInData" :key="item.dateStr" placement="top-start" title="去打卡" :width="100" trigger="hover" popper-class="fish__tip"
              >
              <div class="link__list">
                <el-link :href="`https://juejin.cn/pin/club/${item.id}`" target="_blank" v-for="item2 in item.topicList">{{ item2.name }}</el-link>
              </div>
              <template #reference>
                <div class="fishItem">
                  <div>{{ item.dateStr }}</div>
                  <div>{{ item.festival }}</div>
                  <div v-if="item.check === 1" class="fish__state active">已打卡</div>
                  <div v-else-if="item.check === -1" class="fish__state deactive">未打卡</div>
                  <div class="fish__state" v-else>待打卡</div>
                </div>
              </template>
            </el-popover>
          </div>
        </template>
      </ElForm>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: fixed;
  top: var(--top);
  left: var(--left);
  z-index: 2058;
  width: auto;
}

.icon-container {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  width: 4rem;
  height: 4rem;
  box-shadow: 0px 0px 10px 0px rgba(113, 151, 221, 0.3);
  cursor: grab;
  user-select: none;
}

.icon {
  width: 26px;
}

.panel {
  position: absolute;
  background-color: #ffffff;
  width: 350px;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(113, 151, 221, 0.3);
  top: calc(4rem + 10px);
}

::v-deep(input[type='text']) {
  border: unset;
}

::v-deep(.hidden-popper .el-popper) {
  display: none;
}

.fishList {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(4, 50px);
  grid-row-gap: 10px;
}

.fishItem {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fish__state {}

.fish__state.active {
  color: #409eff;
}

.fish__state.deactive {
  color: #ff0000;
}
.link__list{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

</style>

<style>
.el-popper.fish__tip{
  z-index: 2059 !important;
}
</style>