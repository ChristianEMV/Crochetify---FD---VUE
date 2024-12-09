<script lang="ts">
import Logotipo from '../assets/CrochetifyLogo.png';
export default {
  name: 'LandingPage',
  data() {
    return {
      Logotipo
    };
  }
};
</script>

<template>
    <div>
      <!-- Navbar -->
      <b-navbar toggleable="lg" type="dark" variant="custom" class="navbar-custom">
        <b-navbar-brand href="#" class="navbar-text-custom">
          <b-img :src="Logotipo" alt="Crochetify Logo" class="navbar-logo"></b-img>
          Crochetify
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="#hero" class="items-navbar">Inicio</b-nav-item>
            <b-nav-item href="#features" class="items-navbar">Características</b-nav-item>
            <b-nav-item href="#cta" class="items-navbar">Regístrate</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
  
      <!-- Hero Section -->
      <section id="hero" class="hero py-5 text-center text-white bg-pastel-primary">
        <div >
          <h1 class="display-4 animate__animated animate__fadeInDown">Bienvenido a Crochetify</h1>
          <h2 class="lead animate__animated animate__fadeInUp">"Crochetify: Donde la creatividad toma forma, un punto a la vez."</h2>
        </div>
      </section>
  
      <!-- Features Section -->
      <section id="features" class="features py-5">
        <div class="container">
          <div class="row">
            <div class="col-md-4 mb-4">
              <b-card class="text-center animate__animated animate__bounceIn feature-card">
                <b-icon icon="star-fill" variant="warning" font-scale="3"></b-icon>
                <h3 class="mt-3">Calidad Premium</h3>
                <p>Todos los productos están hechos a mano con materiales de la más alta calida y 100% ecologicos.</p>
              </b-card>
            </div>
            <div class="col-md-4 mb-4">
              <b-card class="text-center animate__animated animate__bounceIn feature-card">
                <b-icon icon="basket-fill" variant="info" font-scale="3"></b-icon>
                <h3 class="mt-3">Variedad de Productos</h3>
                <p>Descubre una amplia gama de productos para todos los gustos y ocasiones.</p>
              </b-card>
            </div>
            <div class="col-md-4 mb-4">
              <b-card class="text-center animate__animated animate__bounceIn feature-card">
                <b-icon icon="shield-fill-check" variant="success" font-scale="3"></b-icon>
                <h3 class="mt-3">Compra Segura</h3>
                <p>Tu seguridad es nuestra prioridad con pagos encriptados y soporte 24/7.</p>
              </b-card>
            </div>
          </div>
        </div>
      </section>
  
      <!-- CTA Section -->
      <section id="cta" class="cta py-5 text-center text-white bg-dark">
        <div class="container">
          <h2 class="mb-3 animate__animated animate__fadeInUp">¿Listo para empezar?</h2>
          <p class="lead animate__animated animate__fadeInUp">Únete a la comunidad de Crochetify y encuentra productos que amarás.</p>
          <b-button size="lg" variant="light" class="mt-3 animate__animated animate__zoomIn" href="https://drive.google.com/file/d/1VVj3E36gCGV4Amu2vpGP-TAM5EtQ54A_/view" target="_blank">Regístrate Ahora</b-button>
        </div>
      </section>
    </div>
  </template>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

.navbar-custom {
  background-color: #ffffff;
  transition: background-color 0.5s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.navbar-text-custom {
  color: #6d6875;
}

.navbar-logo {
  height: 40px;
  margin-right: 10px;
}

.items-navbar {
  color: #6d6875;
  cursor: pointer;
  transition: color 0.3s ease;
}

.hero {
  background-size: cover;
  animation: fadeIn 2s;
  background-color: #f8c8dc;
  color: #6d6875;
}

.features {
  background-color: #f8f9fa;
  animation: fadeIn 2s;
}

.feature-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.feature-card:hover {
  transform: scale(1.05) rotate(10deg);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.cta {
  background: url('path/to/your/cta-image.jpg') no-repeat center center;
  background-size: cover;
  animation: fadeIn 2s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.bg-pastel-primary {
  background-color: #f8c8dc;
}

.btn-pastel {
  background-color: #ffcbf2;
  border-color: #ffcbf2;
  color: #6d6875;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-pastel:hover {
  background-color: #ffb3c6;
  border-color: #ffb3c6;
}


</style>
