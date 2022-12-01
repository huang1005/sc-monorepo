<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { ConfigGlobal } from '@/components/ConfigGlobal';
import { isDark } from '@/utils/is';
import { useDesign } from '@/hooks/web/useDesign';

const { getPrefixCls } = useDesign();

const prefixCls = getPrefixCls('app');

const appStore = useAppStore();

const currentSize = computed(() => appStore.getCurrentSize);

const greyMode = computed(() => appStore.getGreyMode);

// 根据浏览器当前主题设置系统主题色
const setDefaultTheme = () => {
  const isDarkTheme = isDark();
  appStore.setIsDark(isDarkTheme);
};

setDefaultTheme();
</script>

<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
  </ConfigGlobal>
</template>

<style lang="scss">
$prefix-cls: #{cs.genPrefix(app)};

@mixin size {
  width: 100%;
  height: 100%;
}

html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  @include size();

  #app {
    @include size();
  }
}

.#{$prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>
