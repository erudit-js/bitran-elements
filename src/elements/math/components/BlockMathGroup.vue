<script lang="ts" setup>
import type { BlockMathGroup } from '../block';
import MathKatex from './MathKatex.vue';

const props = defineProps<{ group: BlockMathGroup }>();
const customGap = (() => {
    switch (props.group.gap) {
        case 'normal':
            return undefined;
        case 'big':
            return 'calc(2 * var(--bitran_gapBig))';
        case 'small':
            return 'calc(0.5 * var(--bitran_gapBig))';
        default:
            return props.group.gap;
    }
})();
</script>

<template>
    <div :class="$style.mathGroup" :style="{ columnGap: customGap }">
        <template v-for="part of group.parts">
            <MathKatex
                v-if="typeof part === 'string'"
                :displayMath="true"
                :mathHtml="part"
            />
            <BlockMathGroup v-else :group="part" />
        </template>
    </div>
</template>

<style lang="scss" module>
.mathGroup {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    column-gap: var(--bitran_gapBig);
    row-gap: 0;
}
</style>
