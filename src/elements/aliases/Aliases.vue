<script lang="ts" setup>
import type { ElementProps } from '@bitran-js/renderer-vue';
import type { AliasesSchema } from './shared';

defineProps<ElementProps<AliasesSchema>>();

// display: none родительский bitran-blockContainer, когда в editMode
// Присваивать блокам data-element="<name>" атрибут
// Через него уже скрывать, если не в editMode
</script>

<template>
    <div>Aliases Node</div>
</template>
