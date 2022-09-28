<script>
export default {
    props: {
        id: String,
        label: String,
        modelValue: String,
        type: String
    },
    emits: ['update:modelValue'],
}
</script>

<template>
    <div class="flex flex-col mb-4">
        <label :for="id" class="my-1">{{ label }}</label>
        <input :id="id" :type="type" class="border rounded py-1 px-2" :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)" />
    </div>
</template>