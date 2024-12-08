<template>
    <b-container fluid class="d-flex align-items-center justify-content-center vh-100 bg-light">
      <b-card
        bg-variant="white"
        border-variant="light"
        class="shadow p-4 text-center error-card"
      >
        <b-card-title class="display-1 text-danger">404</b-card-title>
        <b-card-sub-title class="h4 mb-3 text-secondary">Página no encontrada</b-card-sub-title>
        <b-card-text class="mb-4">
          Lo sentimos, la página que buscas no existe. 
          Es posible que la dirección esté incorrecta o que la página haya sido movida.
        </b-card-text>
        <b-button variant="primary" to="/" class="px-4">
          <b-icon icon="arrow-left-circle" class="me-2"></b-icon>
          Volver al inicio
        </b-button>
      </b-card>
    </b-container>
  </template>
  
  <script>
  export default {
    name: "ErrorPage",
  };
  </script>
  
  <style scoped>
  .error-card {
    max-width: 600px;
  }
  </style>