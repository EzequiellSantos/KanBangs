<template>

  <div :data-theme="theme" class="container-view">

    <div :data-theme="theme" class="app">
      <Sidebar
        :boards="boards"
        :activeBoardId="activeBoardId"
        :pageTitle="pageTitle"
        @import-json="importarJson"
        @delete-board="apagarQuadro"
        @open-settings="abrirConfiguracoes"
        @select-board="selecionarQuadro"
        @carregar-boards="carregarBoards"
      />
      <Main
        :currentBoard="currentBoard"
        @refresh-board="carregarBoards"
        @add-task="adicionarTask"
        @delete-task="deletarTask"
        @rename-task="renomearTask"
      />
      <Shortcuts />
    </div>
    <Footer />      
  </div>
</template>

<script>
import { useUIStore } from '@/store/ui'
import { BASE_URL, BASE_API_KEY } from '@/config'
import Sidebar from '@/components/Sidebar.vue'
import Main from '@/components/Main.vue'
import Footer from '@/components/Footer.vue'
import Shortcuts from '@/components/ShortcutsFAB.vue'
import store from '@/store/index.js'

export default {
  name: 'KanbanView',
  components: {
    Sidebar,
    Main,
    Footer,
    Shortcuts
  },
  data() {
    return {
      boards: [],
      activeBoardId: null,
      pageTitle: 'Kanban — Domarco',
      userToken: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      apiUrl: BASE_URL,
      apiKey: BASE_API_KEY
    }
  },
  computed: {
    currentBoard() {

      return this.boards.find(b => b._id === this.activeBoardId) || null

    },
    theme() {
      // Corrigido para Pinia
      return useUIStore().darkMode ? 'dark' : 'light'
    }
  },
  mounted(){
    if(store.state.authenticated){
      this.carregarBoards()
    } else {
      this.$router.push('/login')
    }
  },
  methods: {
    selecionarQuadro(boardId) {
      this.activeBoardId = boardId
    },
    async carregarBoards() {

      await fetch(`${this.apiUrl}/api/boards/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.userToken}`,
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      })
        .then(res => res.json())
        .then(data => {
          this.boards = data.data
          if (this.boards.length > 0 && !this.activeBoardId) {
            this.activeBoardId = this.boards[0]._id
          }
        })
        .catch(err => {
          console.error('Erro ao carregar quadros:', err)
        })

    },
    importarJson() {},
    async apagarQuadro() {

      await fetch(`${this.apiUrl}/api/boards/${this.activeBoardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.userToken}`,
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      })
        .then(res => res.json())
        .then(data => {
          this.carregarBoards()
        })
        .catch(err => {
          console.error('Erro ao deletar quadro:', err)
        })

    },
    abrirConfiguracoes() {},
    exportarBoard() {},
    async deletarTask(colId, taskId, taskTitle) {

      await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.userToken}`,
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      })
        .then(resp => resp.json())
        .then(data => {
          this.carregarBoards()
        })
        .catch(err => {
          console.error('Erro ao apagar tarefa:', err)
        })

    },
    async adicionarTask(colId, taskTitle) {

      await fetch(`${BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.userToken}`,
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify({
          userId: this.userId,
          columnId: colId,
          title: taskTitle
        })
      })
        .then(resp => resp.json())
        .then(data => {
          this.carregarBoards()
        })
        .catch(err => {
          console.error('Erro ao adicionar tarefa:', err)
        })
    },
    async renomearTask(colId, taskId, newTitle) {

      await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.userToken}`,
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify({
          columnId: colId,
          title: newTitle
        })
      })
        .then(resp => resp.json())
        .then(data => {
          this.carregarBoards()
        })
        .catch(err => {
          console.error('Erro ao renomear tarefa:', err)
        })
    },
    toggleTheme() {
      useUIStore().toggleDarkMode()
    }
  }
}
</script>
