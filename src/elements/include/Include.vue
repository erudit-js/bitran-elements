<script lang="ts" setup>
import { Render, type ElementProps } from '@bitran-js/renderer-vue';

import type { IncludeSchema } from './shared';

const props = defineProps<ElementProps<IncludeSchema>>();
const { blocks } = props.node.parseData;
</script>

<template>
    <Render v-if="blocks" v-for="node of blocks.children" :node />
    <div v-else>No blocks</div>
</template>
