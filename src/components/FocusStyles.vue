<template>

</template>

<script setup>
</script>

<style scoped>

.focus-primary {
  transition: all 0.2s ease;
}

.focus-primary:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

.focus-button {
  transition: all 0.2s ease;
}

.focus-button:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

.focus-input {
  transition: all 0.2s ease;
}

.focus-input:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

.focus-link {
  transition: all 0.2s ease;
}

.focus-link:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

.focus-glow {
  transition: all 0.2s ease;
}

.focus-glow:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

.focus-error {
  transition: all 0.2s ease;
}

.focus-error:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

.focus-success {
  transition: all 0.2s ease;
}

.focus-success:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

.focus-warning {
  transition: all 0.2s ease;
}

.focus-warning:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}

.focus-disabled:focus {
  outline: 3px solid #666 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(102, 102, 102, 0.3) !important;
}

.focus-none:focus {
  outline: none !important;
  box-shadow: none !important;
}

.focus-custom {
  transition: all 0.2s ease;
  --focus-color: #FF9800;
  --focus-width: 3px;
  --focus-offset: 2px;
  --focus-shadow-opacity: 0.3;
}

.focus-custom:focus {
  outline: var(--focus-width) solid var(--focus-color) !important;
  outline-offset: var(--focus-offset);
  box-shadow: 0 0 0 1px rgba(from var(--focus-color) r g b / var(--focus-shadow-opacity)) !important;
}
</style>