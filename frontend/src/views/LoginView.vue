<template>
  <div :data-theme="theme" class="login-wrapper">
    <div class="theme-toggle">
      <div class="toggle-switch" :class="{ active: theme === 'light' }" @click="toggleTheme">
        <div class="toggle-knob">{{ theme === 'dark' ? '🌙' : '☀️' }}</div>
      </div>
    </div>

    <div v-if="!kanbanLoaded" class="login-container">
      <!-- Lado esquerdo -->
      <div class="login-left">
        <div class="graphic-element graphic-1"></div>
        <div class="graphic-element graphic-2"></div>
        <div class="graphic-element graphic-3"></div>
        <div class="welcome-content">
          <h1 class="animate-in">Organize suas tarefas com eficiência</h1>
          <p class="animate-in delay-1">Acesse seu Kanban pessoal e aumente sua produtividade</p>
          <ul class="features-list">
            <li class="animate-in delay-2"><i class="fas fa-check"></i><span>Quadros ilimitados para seus projetos</span></li>
            <li class="animate-in delay-3"><i class="fas fa-check"></i><span>Sincronização em tempo real</span></li>
            <li class="animate-in delay-4"><i class="fas fa-check"></i><span>Interface arrasta e solta intuitiva</span></li>
          </ul>
        </div>
      </div>

      <!-- Lado direito -->
      <div class="login-right">
        <div class="login-header animate-in">
          <h2>{{ showRegister ? 'Criar uma conta' : 'Entrar no Kanban' }}</h2>
          <p>{{ showRegister ? 'Preencha os dados abaixo para se registrar' : 'Use suas credenciais para acessar sua conta' }}</p>
        </div>

        <form class="animate-in delay-1" @submit.prevent="showRegister ? register() : login()">
          <div v-if="alert.message" class="alert" :class="alert.type === 'error' ? 'alert-error' : 'alert-success'">
            <i :class="`fas fa-${alert.type === 'error' ? 'exclamation-circle' : 'check-circle'}`"></i>
            {{ alert.message }}
          </div>

          <!-- Nome (apenas para registro) -->
          <div class="form-group" v-if="showRegister">
            <label>Nome completo</label>
            <div class="input-with-icon">
              <i class="fas fa-user"></i>
              <input v-model="registerName" type="text" required placeholder="Seu nome completo" />
            </div>
          </div>

          <!-- E-mail -->
          <div class="form-group">
            <label for="email">E-mail</label>
            <div class="input-with-icon">
              <i class="fas fa-envelope"></i>
              <input
                v-if="!showRegister"
                v-model="loginEmail"
                type="email"
                id="email"
                required
                placeholder="seu@email.com"
              />
              <input
                v-else
                v-model="registerEmail"
                type="email"
                id="email"
                required
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <!-- Senha -->
          <div class="form-group">
            <label for="password">Senha</label>
            <div class="input-with-icon">
              <i class="fas fa-lock"></i>
              <input
                v-if="!showRegister"
                v-model="loginPassword"
                type="password"
                id="password"
                required
                placeholder="Sua senha"
              />
              <input
                v-else
                v-model="registerPassword"
                type="password"
                id="password"
                required
                minlength="6"
                placeholder="Crie uma senha segura"
              />
            </div>
          </div>

          <!-- Confirmar senha (apenas para registro) -->
          <div class="form-group" v-if="showRegister">
            <label>Confirmar senha</label>
            <div class="input-with-icon">
              <i class="fas fa-lock"></i>
              <input
                v-model="registerConfirmPassword"
                type="password"
                required
                placeholder="Digite a senha novamente"
              />
            </div>
          </div>

          <!-- Checkbox + Esqueceu a senha (apenas login) -->
          <div class="options-row" v-if="!showRegister">
            <label class="remember-me">
              <input v-model="remember" type="checkbox" />
              Lembrar-me
            </label>
            <a href="#" class="forgot-password">Esqueceu a senha?</a>
          </div>

          <button type="submit" class="btn-login">
            {{ showRegister ? 'Criar conta' : 'Entrar' }}
          </button>
        </form>

        <div class="divider animate-in delay-2" v-if="!showRegister"><span>Ou continue com</span></div>

        <!-- <div class="social-login animate-in delay-3" v-if="!showRegister">
          <button type="button" class="social-btn"><i class="fab fa-google"></i></button>
          <button type="button" class="social-btn"><i class="fab fa-github"></i></button>
          <button type="button" class="social-btn"><i class="fab fa-microsoft"></i></button>
        </div> -->

        <div class="signup-link animate-in delay-4">
          <span v-if="!showRegister">
            Não tem uma conta? <a href="#" @click.prevent="showRegister = true">Criar conta</a>
          </span>
          <span v-else>
            Já tem uma conta? <a href="#" @click.prevent="showRegister = false">Fazer login</a>
          </span>
        </div>
      </div>
    </div>

    <!-- Kanban carregado -->
    <div v-else id="kanbanContainer" v-html="kanbanHtml"></div>
  </div>
</template>



<script>
import { BASE_API_KEY, BASE_URL } from '@/config'

export default {
  name: 'LoginView',
  data() {
    return {
      theme: localStorage.getItem('theme') || 'dark',
      loginEmail: '',
      loginPassword: '',
      remember: false,
      registerName: '',
      registerEmail: '',
      registerPassword: '',
      registerConfirmPassword: '',
      alert: { message: '', type: 'success' },
      showRegister: false,
      kanbanLoaded: false,
      kanbanHtml: '',
      apiUrl: BASE_URL,
      apiKey: BASE_API_KEY
    }
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', this.theme)
    },
    showAlert(message, type = 'success') {
      this.alert = { message, type }
      setTimeout(() => (this.alert.message = ''), 5000)
    },
    resetRegisterForm() {
      this.registerName = ''
      this.registerEmail = ''
      this.registerPassword = ''
      this.registerConfirmPassword = ''
    },
    register() {
      if (!this.registerName || !this.registerEmail || !this.registerPassword || !this.registerConfirmPassword) {
        return this.showAlert('Preencha todos os campos.', 'error')
      }

      if (!this.registerName.includes(' ')) {
        return this.showAlert('Informe seu nome completo.', 'error')
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.registerEmail)) {
        return this.showAlert('E-mail inválido.', 'error')
      }

      if (this.registerPassword.length < 6) {
        return this.showAlert('A senha deve ter no mínimo 6 caracteres.', 'error')
      }

      if (this.registerPassword !== this.registerConfirmPassword) {
        return this.showAlert('As senhas não coincidem.', 'error')
      }

      const [firstName, ...rest] = this.registerName.trim().split(' ')
      const lastName = rest.join(' ')

      fetch(`${this.apiUrl}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify({
          email: this.registerEmail,
          password: this.registerPassword,
          firstName,
          lastName
        })
      })
        .then(response => response.json().then(data => ({ status: response.status, data })))
        .then(({ data }) => {
          console.log(data)
          if (data.token) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('userId', data.userId)
            this.showAlert(data.msg || 'Conta criada com sucesso!', 'success')
            this.resetRegisterForm()
            setTimeout(() => {
              this.showRegister = false
              this.$router.push('/')
            }, 1500)
          } else {
            this.showAlert(data.error || 'Erro ao registrar.', 'error')
          }
        })
        .catch(() => {
          this.showAlert('Erro de conexão.', 'error')
        })
    },
    login() {
      fetch(`${this.apiUrl}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify({
          email: this.loginEmail,
          password: this.loginPassword
        })
      })
        .then(response => response.json().then(data => ({ status: response.status, data })))
        .then(({data }) => {
          console.log(data)
          if (data.token) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('userId', data.userId)
            this.showAlert(data.msg || 'Login realizado com sucesso!', 'success')
            setTimeout(() => this.$router.push('/'), 1000)
          } else {
            this.showAlert(data.error || 'E-mail ou senha incorretos.', 'error')
          }
        })
        .catch(() => {
          this.showAlert('Erro de conexão.', 'error')
        })
    }
  }
}
</script>



<style scoped>
    :root {
      --bg: #0f1724;
      --card: #0b1220;
      --accent: #06b6d4;
      --accent-hover: #0891b2;
      --muted: #94a3b8;
      --text: #e6eef8;
      --error: #ef4444;
      --success: #10b981;
      --radius: 12px;
      --transition: all 0.3s ease;
    }

    [data-theme="light"] {
      --bg: #f8fafc;
      --card: #ffffff;
      --accent: #0ea5e9;
      --accent-hover: #0284c7;
      --muted: #64748b;
      --text: #1e293b;
      --error: #dc2626;
      --success: #059669;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      transition: var(--transition);
      line-height: 1.6;
    }

    /* ===== LAYOUT PRINCIPAL ===== */
    .login-container {
      display: flex;
      width: 100%;
      max-width: 1000px;
      min-height: 600px;
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .login-left {
      flex: 1;
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%);
      color: white;
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .login-right {
      flex: 1;
      background: var(--card);
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    /* ===== ELEMENTOS VISUAIS ===== */
    .graphic-element {
      position: absolute;
      opacity: 0.1;
    }

    .graphic-1 {
      top: -50px;
      right: -50px;
      width: 200px;
      height: 200px;
      border: 8px solid white;
      border-radius: 50%;
    }

    .graphic-2 {
      bottom: -30px;
      left: -30px;
      width: 150px;
      height: 150px;
      border: 6px solid white;
      border-radius: 20px;
      transform: rotate(45deg);
    }

    .graphic-3 {
      top: 50%;
      left: 30%;
      width: 80px;
      height: 80px;
      border: 4px solid white;
      border-radius: 50%;
    }

    /* ===== CONTEÚDO ===== */
    .welcome-content h1 {
      font-size: 2.5rem;
      margin-bottom: 16px;
      font-weight: 800;
    }

    .welcome-content p {
      font-size: 1.1rem;
      opacity: 0.9;
      margin-bottom: 30px;
    }

    .features-list {
      list-style: none;
      margin-top: 30px;
    }

    .features-list li {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      font-size: 1rem;
    }

    .features-list i {
      margin-right: 12px;
      background: rgba(255, 255, 255, 0.2);
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* ===== FORMULÁRIO ===== */
    .login-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .login-header h2 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 10px;
      color: var(--accent);
    }

    .login-header p {
      color: var(--muted);
    }

    .form-group {
      margin-bottom: 24px;
      position: relative;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--text);
    }

    .input-with-icon {
      position: relative;
    }

    .input-with-icon i {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted);
    }

    .input-with-icon input {
      width: 100%;
      padding: 15px 15px 15px 45px;
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius);
      background: var(--bg);
      color: var(--text);
      font-size: 1rem;
      transition: var(--transition);
    }

    [data-theme="light"] .input-with-icon input {
      border-color: rgba(0, 0, 0, 0.1);
    }

    .input-with-icon input:focus {
      border-color: var(--accent);
      outline: none;
      box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2);
    }

    .options-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      font-size: 0.9rem;
    }

    .remember-me {
      display: flex;
      align-items: center;
    }

    .remember-me input {
      margin-right: 8px;
    }

    .forgot-password {
      color: var(--accent);
      text-decoration: none;
      transition: var(--transition);
    }

    .forgot-password:hover {
      color: var(--accent-hover);
      text-decoration: underline;
    }

    .btn-login {
      width: 100%;
      padding: 15px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: var(--radius);
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
    }

    .btn-login:hover {
      background: var(--accent-hover);
      transform: translateY(-2px);
    }

    .btn-login:active {
      transform: translateY(0);
    }

    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 30px 0;
      color: var(--muted);
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--muted);
      opacity: 0.3;
    }

    .divider span {
      padding: 0 15px;
      font-size: 0.9rem;
    }

    .social-login {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 30px;
    }

    .social-btn {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text);
      cursor: pointer;
      transition: var(--transition);
    }

    [data-theme="light"] .social-btn {
      border-color: rgba(0, 0, 0, 0.1);
    }

    .social-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .signup-link {
      text-align: center;
      margin-top: 20px;
      color: var(--muted);
    }

    .signup-link a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
      transition: var(--transition);
    }

    .signup-link a:hover {
      color: var(--accent-hover);
      text-decoration: underline;
    }

    /* ===== ALERTAS ===== */
    .alert {
      padding: 12px 16px;
      border-radius: var(--radius);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }

    .alert-error {
      background-color: rgba(239, 68, 68, 0.1);
      color: var(--error);
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .alert-success {
      background-color: rgba(16, 185, 129, 0.1);
      color: var(--success);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .alert i {
      margin-right: 10px;
    }

    /* ===== THEME TOGGLE ===== */
    .theme-toggle {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 10;
    }

    .toggle-switch {
      position: relative;
      width: 50px;
      height: 24px;
      background: var(--muted);
      border-radius: 12px;
      cursor: pointer;
      transition: var(--transition);
    }

    .toggle-switch.active {
      background: var(--accent);
    }

    .toggle-knob {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    .toggle-switch.active .toggle-knob {
      transform: translateX(26px);
    }

    /* ===== RESPONSIVIDADE ===== */
    @media (max-width: 900px) {
      .login-container {
        flex-direction: column;
        max-width: 500px;
      }
      
      .login-left {
        padding: 30px;
        order: 2;
      }
      
      .login-right {
        padding: 30px;
        order: 1;
      }
      
      .welcome-content h1 {
        font-size: 2rem;
      }
    }

    @media (max-width: 480px) {
      body {
        padding: 10px;
      }
      
      .login-left, .login-right {
        padding: 25px;
      }
      
      .options-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      
      .welcome-content h1 {
        font-size: 1.8rem;
      }
    }

    /* ===== ANIMAÇÕES ===== */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-in {
      animation: fadeIn 0.6s ease forwards;
    }

    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }

    /* ===== MODAL DE REGISTRO ===== */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal {
      background: var(--card);
      border-radius: var(--radius);
      width: 100%;
      max-width: 500px;
      padding: 30px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      position: relative;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .modal-header h2 {
      color: var(--accent);
    }

    .close-modal {
      background: none;
      border: none;
      font-size: 24px;
      color: var(--muted);
      cursor: pointer;
    }

    .modal-footer {
      margin-top: 20px;
      text-align: center;
    }

    /* ===== KANBAN CONTAINER (inicialmente oculto) ===== */
    #kanbanContainer {
      display: none;
      width: 100%;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      background: var(--bg);
    }
</style>
