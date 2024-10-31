<template>
    <div class="login-container d-flex align-items-center justify-content-center">
      <b-card no-body class="overflow-hidden" style="max-width: 800px;">
        <b-row no-gutters>
          <b-col md="6">
            <b-card-body class="p-4">
              <b-img src="/src/assets/CrochetifyLogo.png" alt="Logo" fluid class="mb-3 d-block mx-auto" style="max-width: 100px;"></b-img>
              <h3 class="text-center mb-4">¡Bienvenido de vuelta!</h3>
              
              <b-form @submit.prevent="onSubmit">
                <b-form-group
                  id="input-group-username"
                  label="Username:"
                  label-for="input-username"
                >
                  <b-form-input
                    id="input-username"
                    v-model="form.username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    required
                  ></b-form-input>
                </b-form-group>
  
                <b-form-group
                  id="input-group-password"
                  label="Contraseña:"
                  label-for="input-password"
                  class="mt-3"
                >
                  <b-form-input
                    id="input-password"
                    v-model="form.password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    required
                  ></b-form-input>
                </b-form-group>
  
                <b-button type="submit" variant="dark" class="mt-3 w-100">Iniciar Sesión</b-button>
              </b-form>
            </b-card-body>
          </b-col>
          <b-col md="6">
            <b-card-img src="/src/assets/login-illustration.jpeg" alt="Login image" class="rounded-0"></b-card-img>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, reactive } from 'vue'
  
  export default defineComponent({
    name: 'LoginView',
    setup() {
      const form = reactive({
        username: '',
        password: ''
      })
  
      const onSubmit = () => {
        console.log('Form submitted:', form)
      }
  
      return {
        form,
        onSubmit
      }
    }
  })
  </script>
  
  <style scoped>
  .login-container {
    background-color: #AEDCD8;
    min-height: 100vh;
  }
  </style>
  