import axios from 'axios';

class AuthService {
  private instance;

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://100.27.71.83:8087/api/crochetify',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async login(email: string, password: string) {
    try {
      const response = await this.instance.post('/login', { email, password });

      if (response.data.success && response.data.response.token) {
        const token = response.data.response.token;
        localStorage.setItem('authToken', token); 

        const decodedToken = this.decodeToken(token);
        if (decodedToken.role !== 'ADMIN') {
          throw new Error('Acceso denegado. El usuario no tiene rol de ADMIN.');
        }

        return response.data.message; 
      } else {
        throw new Error(response.data.message || 'Error en la autenticación');
      }
    } catch (error) {
      throw new Error('Error al intentar iniciar sesión: ' + error);
    }
  }

  private decodeToken(token: string) {
    const payload = token.split('.')[1];
    const decoded = atob(payload); 
    return JSON.parse(decoded); 
  }

  isAdmin() {
    const role = this.getRole();
    return role === 'ADMIN'; 
  }

  getRole() {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken.role; 
    }
    return null;
  }

  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return token ? true : false; 
  }

  logout() {
    localStorage.removeItem('authToken');
  }
}

export default new AuthService();
