<script lang="ts" setup>
import 'katex/dist/katex.min.css';

defineProps<{
    displayMath: boolean;
    mathHtml: string;
    freeze?: boolean;
}>();
</script>

<template>
    <component
        :is="displayMath ? 'div' : 'span'"
        :class="[
            $style.latexMath,
            displayMath && $style.latexDisplayMath,
            freeze && $style.latexFreeze,
        ]"
        v-html="mathHtml"
        v-once
    ></component>
</template>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/public/scss/bp';

:root {
    --katex-color_blue: light-dark(#0f82ff, #4aa0df);
    --katex-color_red: light-dark(#d73737, #fc6255);
    --katex-color_green: light-dark(#59ae1c, #83c167);
    --katex-color_yellow: light-dark(#c99029, #c1a267);
}

.latexMath {
    //
    // KaTeX math colors
    //

    $katexColorMap: (
        100000: 'red',
        200000: 'green',
        300000: 'blue',
        400000: 'yellow',
    );

    @each $katexCode, $cssVarCode in $katexColorMap {
        [style*=#{('"color:#' + $katexCode + '"')}] {
            color: var(--katex-color_#{$cssVarCode}) !important;
        }
    }
}

.latexDisplayMath {
    overflow: auto;

    &::-webkit-scrollbar {
        height: 7px;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: light-dark(#b6b6b6, #4f4f4f);
    }

    @include bp.below('mobile') {
        overflow-x: scroll;

        &::-webkit-scrollbar {
            height: 5px;
        }
    }

    :global(.base) {
        margin: 0.25em 0;
    }
    :global(.katex-display) {
        margin: 0;
    }

    // Allow automatic line breaks in display math
    &:not(.latexFreeze) {
        :global(.katex-display) > :global(.katex) {
            white-space: normal;
        }
    }
}
</style>
