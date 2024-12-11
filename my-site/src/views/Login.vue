<template>
  <div class="login-container d-flex align-items-center justify-content-center">
    <b-card no-body class="overflow-hidden login-card">
      <b-row no-gutters>
        <b-col md="6">
          <b-card-body class="p-4">
            <b-img :src="logo" alt="App Icon" fluid class="mb-3 d-block mx-auto logo"></b-img>
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

              <b-button
                :disabled="isLoading"
                type="submit"
                variant="dark"
                class="mt-3 w-100 login-button"
              >
                <span v-if="isLoading">
                  <b-spinner small></b-spinner> Iniciando...
                </span>
                <span v-else>Iniciar Sesión</span>
              </b-button>
            </b-form>

            <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
              {{ errorMessage }}
            </div>
          </b-card-body>
        </b-col>
        <b-col md="6">
          <b-card-img
            :src="illustration"
            alt="Login image"
            class="rounded-0 login-image"
          ></b-card-img>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import authService from "../authService"; 
import logo from "../assets/CrochetifyLogo.png"; 
import illustration from "../assets/login-illustration.jpeg"; 

export default defineComponent({
  name: "LoginView",
  setup() {
    
    const form = reactive({
      email: "",
      password: "",
    });

    const errorMessage = ref<string | null>(null);
    const isLoading = ref(false);
    const router = useRouter();

    const onSubmit = async () => {
      try {        
        if (!form.email || !form.password) {
          errorMessage.value = "Por favor, completa todos los campos";
          return;
        }
//login
        isLoading.value = true;
        
        const message = await authService.login(form.email, form.password);
        
        console.log(message);
                
        setTimeout(() => {
          router.push("/home");
        }, 1000);
      } catch (error) {
        console.error("Error en el login:", error);
        errorMessage.value =
           "Error al iniciar sesion! :("; 
      } finally {
        isLoading.value = false;
      }
    };

    return {
      form,
      errorMessage,
      isLoading,
      onSubmit,
      logo,
      illustration,
    };
  },
});
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

.login-container {
  background: linear-gradient(135deg, #aedcd8 0%, #ffffff 100%);
  min-height: 100vh;
  font-family: "Roboto", sans-serif;
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
  border-color: #30596b;
  box-shadow: none;
}

.login-button {
  background-color: #30596b;
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
