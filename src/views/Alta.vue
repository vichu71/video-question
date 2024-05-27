<template>
    <div class="center-container">
      <div class="alta-container">
        <input type="text" v-model="nombre" placeholder="Introduce tu nombre" class="input-nombre">
        <button @click="irAQuestionVideo" class="button-ir">Ir a Question Video</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        nombre: ''
      };
    },
    methods: {
      irAQuestionVideo() {
        // Redirige a la ruta '/question-video' y pasa el parámetro 'nombre'
        this.$router.push({ name: 'question-video', params: { nombre: this.nombre } });
      }
    }
  };
  </script>
  
  <style scoped>
  .center-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Ajusta la altura al 100% del viewport */
  }
  
  .alta-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .input-nombre {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 300px;
  }
  
  .button-ir {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .button-ir:hover {
    background-color: #0056b3;
  }
  </style>
  