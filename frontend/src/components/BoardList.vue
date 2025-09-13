<template>
  <ul class="board-list">
    <li
      v-for="board in boards"
      :key="board._id"
      @click="selectBoard(board._id)"
      class="board-item"
      :class="{'active': board._id === activeBoardId}"
    >
      {{ board.title }}
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  boards: {
    type: Array,
    required: true
  },
  activeBoardId: {
    type: [Number, String],
    default: null
  }
})

const emit = defineEmits(['select-board'])

function selectBoard(boardId) {
  emit('select-board', boardId)

}
</script>

<style scoped>

.board-list {
  list-style: none;
  padding: 0;
  margin-block: 5px;
}

</style>