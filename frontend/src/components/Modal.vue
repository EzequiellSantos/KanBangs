<!-- src/components/Modal.vue -->
<template>
  <div
    v-if="visible"
    class="modal-backdrop"
    role="dialog"
    aria-modal="true"
    @click.self="onCancel"
  >
    <div class="modal">
      <div class="modal-title" style="font-weight:700;margin-bottom:16px;">{{ title }}</div>
      <div class="modal-content">
        <slot />
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px">
        <button class="ghost" @click="onCancel">Cancelar</button>
        <button @click="onOk">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    visible: Boolean,
    title: {
      type: String,
      default: 'Título'
    }
  },
  methods: {
    onOk() {
      this.$emit('ok')
    },
    onCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Garante que fica acima de tudo */
}

.modal {
  background: var(--card, #fff);
  color: var(--text, #1e293b);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 32px 24px 20px 24px;
  min-width: 320px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-title {
  font-size: 1.2em;
}

.modal-content {
  margin-bottom: 8px;
}
</style>
