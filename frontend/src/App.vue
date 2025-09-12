<!-- src/App.vue -->
<template>

  <div :data-theme="theme" class="app">

    <router-view />

  </div>

</template>

<script setup>

</script>

<style>

    /* ===== Basic layout ===== */
    :root {
      --bg: #0f1724;
      --card: #0b1220;
      --accent: #06b6d4;
      --muted: #94a3b8;
      --glass: rgba(255,255,255,0.03);
      --radius: 12px;
      --gap: 12px;
      --max-width: 1200px;
      --text: #e6eef8;
      --border: rgba(255,255,255,0.04);
      --hover: rgba(255,255,255,0.05);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      color: var(--text);
    }

    [data-theme="light"] {
      --bg: #f8fafc;
      --card: #ffffff;
      --accent: #0ea5e9;
      --muted: #64748b;
      --glass: rgba(0,0,0,0.03);
      --text: #1e293b;
      --border: rgba(0,0,0,0.08);
      --hover: rgba(0,0,0,0.05);
    }

    html, body {
      height: 100%;
      margin: 0;
      background: var(--bg);
      transition: background 0.3s ease;
    }

    .app {
      max-width: var(--max-width);
      margin: 28px auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 18px;
      padding: 18px;
      min-height: calc(100vh - 200px);
    }

    /* Sidebar */
    .sidebar {
      width: 240px;
      background: var(--card);
      border-radius: var(--radius);
      padding: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      border: 1px solid var(--border);
    }

    .brand {
      font-weight: 700;
      letter-spacing: 0.4px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .boards-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 40vh;
      overflow: auto;
      padding-right: 4px;
    }

    .board-item {
      padding: 8px 10px;
      border-radius: 10px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .board-item:hover {
      background: var(--hover);
    }

    .board-item.active {
      background: var(--accent);
      color: white;
    }

    .muted {
      color: var(--muted);
      font-size: 13px;
    }

    .small {
      font-size: 13px;
    }

    .controls {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }

    button {
      background: var(--accent);
      border: none;
      padding: 8px 12px;
      border-radius: 10px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    button:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .ghost {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--muted);
    }

    .ghost:hover {
      background: var(--hover);
      color: var(--text);
    }

    /* Theme Toggle */
    .theme-toggle {
      margin-top: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toggle-switch {
      position: relative;
      width: 50px;
      height: 24px;
      background: var(--muted);
      border-radius: 12px;
      cursor: pointer;
      transition: background 0.3s ease;
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

    /* Settings */
    .settings-section {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }

    /* Main area */
    .main {
      flex: 1;
      width: 100%;
      min-width: 400px;
      min-height: 60vh;
      background: var(--card);
      border-radius: var(--radius);
      padding: 16px;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--border);
    }

    .main-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .board-title {
      font-size: 20px;
      font-weight: 700;
    }

    /* Columns */
    .columns-wrap {
      display: flex;
      gap: var(--gap);
      margin-top: 16px;
      overflow: auto;
      padding-bottom: 12px;
    }

    .column {
      min-width: 260px;
      background: var(--glass);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: all 0.2s ease;
    }

    .column:hover {
      border-color: var(--accent);
    }

    .column-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .column-title {
      font-weight: 700;
    }

    .column-count {
      color: var(--muted);
      font-size: 13px;
    }

    .tasks {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 20px;
    }

    .task {
      background: var(--card);
      padding: 10px;
      border-radius: 10px;
      cursor: grab;
      border: 1px solid var(--border);
      position: relative;
      transition: all 0.2s ease;
    }

    .task:hover {
      border-color: var(--accent);
      transform: translateY(-1px);
    }

    .task.dragging {
      opacity: 0.6;
      transform: rotate(5deg);
    }

    .task-actions {
      position: absolute;
      top: 4px;
      right: 4px;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .task:hover .task-actions {
      opacity: 1;
    }

    .delete-task {
      background: #ef4444;
      border: none;
      border-radius: 4px;
      color: white;
      padding: 2px 6px;
      font-size: 12px;
      cursor: pointer;
    }

    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60vh;
      color: var(--muted);
      font-size: 16px;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: var(--card);
      padding: 24px;
      border-radius: 12px;
      min-width: 400px;
      max-width: 90vw;
      border: 1px solid var(--border);
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    }

    input[type=text], textarea, input[type=url] {
      width: 100%;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--bg);
      color: var(--text);
      margin-bottom: 12px;
    }

    /* Footer */
    .footer {
      margin-top: auto;
      padding: 20px;
      background: var(--card);
      border-top: 1px solid var(--border);
      text-align: center;
    }

    .spotify-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }

    .spotify-player {
      border-radius: 12px;
      overflow: hidden;
    }

    /* Drop hints */
    .drop-hint {
      outline: 3px dashed var(--accent);
      border-radius: 12px;
      padding: 6px;
      opacity: 0.7;
    }

    /* Keyboard shortcuts help */
    .shortcuts {
      margin-top: 12px;
      font-size: 11px;
      color: var(--muted);
      line-height: 1.4;
    }

    /* Responsiveness */
    @media (max-width: 880px) {
      .app {
        flex-direction: column;
        padding: 12px;
      }
      
      .sidebar {
        width: auto;
        order: 2;
      }
      
      .columns-wrap {
        flex-direction: column;
      }
      
      .column {
        min-width: auto;
      }
    }
  
    /* --- Additions: shortcuts FAB & motivation area --- */
    .shortcuts-fab{
      position:fixed;bottom:20px;right:20px;width:44px;height:44px;
      border-radius:50%;background:var(--accent, #06b6d4);color:#fff;
      display:flex;align-items:center;justify-content:center;cursor:pointer;
      z-index:9999; box-shadow:0 6px 18px rgba(0,0,0,.25);
    }
    .shortcuts-popup{
      display:none;position:absolute;bottom:52px;right:0;
      background:var(--card, rgba(0,0,0,.8));border:1px solid var(--border, rgba(255,255,255,.1));
      padding:10px;border-radius:8px;font-size:12px;backdrop-filter: blur(6px);
    }
    .shortcuts-fab:hover .shortcuts-popup{display:block;}

    /* Updated motivation area styles */
    .motivation-container {
      margin-top: 20px;
      padding: 20px;
      border: 2px dashed var(--border, rgba(255,255,255,.15));
      border-radius: 12px;
      text-align: center;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .motivation-image {
      max-width: 100%;
      max-height: 300px;
      border-radius: 8px;
      margin-bottom: 10px;
      object-fit: contain;
    }

    .motivation-placeholder {
      color: var(--muted);
      font-size: 14px;
      margin-bottom: 10px;
    }

    .motivation-actions {
      display: flex;
      gap: 10px;
    }

    /* File input styling */
    .file-input-label {
      display: inline-block;
      padding: 8px 12px;
      background: var(--accent);
      color: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s ease;
    }

    .file-input-label:hover {
      opacity: 0.9;
    }

    input[type="file"] {
      display: none;
    }

    /* Floating Action Button for shortcuts */
    .fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--accent);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 1000;
    }

    .shortcuts-panel {
      position: fixed;
      bottom: 80px;
      right: 20px;
      background: var(--card);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      border: 1px solid var(--border);
      display: none;
      z-index: 999;
      max-width: 300px;
    }

    .shortcuts-panel.show {
      display: block;
    }

</style>
