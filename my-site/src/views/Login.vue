<template>
  <div class="login-container d-flex align-items-center justify-content-center">
    <b-card no-body class="overflow-hidden login-card">
      <b-row no-gutters>
        <b-col md="6">
          <b-card-body class="p-4">
            <b-img src="/src/assets/CrochetifyLogo.png" alt="Logo" fluid class="mb-3 d-block mx-auto logo"></b-img>
            <h3 class="text-center mb-4">¡Bienvenido de vuelta!</h3>

            <b-form @submit.prevent="onSubmit">
              <b-form-group
                id="input-group-email"
                label="Email:"
                label-for="input-email"
              >
                <b-form-input
                  id="input-email"
                  v-model.trim="form.email"
                  type="text"
                  placeholder="Ingresa tu email"
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
                  v-model.trim="form.password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  required
                ></b-form-input>
              </b-form-group>

              <b-button type="submit" variant="dark" class="mt-3 w-100 login-button">Iniciar Sesión</b-button>
            </b-form>

            <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
              {{ errorMessage }}
            </div>
          </b-card-body>
        </b-col>
        <b-col md="6">
          <b-card-img src="/src/assets/login-illustration.jpeg" alt="Login image" class="rounded-0 login-image"></b-card-img>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import axios from '../http-common';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'LoginView',
  setup() {
    const form = reactive({
      email: '',
      password: ''
    });

    const errorMessage = ref<string | null>(null);
    const router = useRouter();

    const onSubmit = async () => {
      try {
        if (!form.email || !form.password) {
          errorMessage.value = 'Por favor, completa todos los campos';
          return;
        }

        // Realiza la solicitud de login al backend
        const response = await axios.post('http://localhost:8080/api/crochetify/login', {
          email: form.email,
          password: form.password
        });

        // Verifica si la autenticación fue exitosa
        if (response.data.success && response.data.response.token) {
          // Guarda el token en localStorage
          localStorage.setItem('authToken', response.data.response.token);

          console.log('Login exitoso:', response.data.message);

          // Redirige al usuario a la página principal (Home)
          router.push('/home');
        } else {
          // Muestra un mensaje de error si la autenticación falló
          errorMessage.value = response.data.message || 'Error en la autenticación. Por favor, inténtalo de nuevo.';
        }
      } catch (error) {
        console.error('Error en el login:', error);
        errorMessage.value = 'Credenciales inválidas o error en el servidor';
      }
    };

    return {
      form,
      errorMessage,
      onSubmit
    };
  }
});
</script>

<style scoped>
/* Tus estilos existentes */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.login-container {
  background: linear-gradient(135deg, #AEDCD8 0%, #ffffff 100%);
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
}

.login-card {
  max-width: 800px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.logo {
  max-width: 100px;
}

.login-image {
  object-fit: cover;
  height: 100%;
}

h3 {
  font-size: 24px;
  font-weight: 500;
  color: #333;
}

.b-form-input {
  border: 2px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  transition: border-color 0.3s ease;
}

.b-form-input:focus {
  border-color: #30596B;
  box-shadow: none;
}

.login-button {
  background-color: #30596B;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #1d3b48;
}
</style>
