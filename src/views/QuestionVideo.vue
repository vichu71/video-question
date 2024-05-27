<template>
    <div>
      <!-- Div para el iframe -->
      <div class="iframe-container">
        <!-- Concatena el nombre a la URL del iframe -->
        <iframe width="600" height="400" :src="`${iframeURL}/${nombre}`" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; camera; microphone" allowfullscreen></iframe>
      </div>
  
      <!-- Div para cargar la página AnswerSurveyORIG.vue -->
      <div class="survey-container">
        <!-- Utiliza component y :is para cargar dinámicamente el componente -->
        <component :is="currentComponent"></component>
      </div>
    </div>
  </template>
  
  <script>
  import AnswerSurvey from './AnswerSurvey.vue'; // Importa el componente AnswerSurveyORIG.vue
  
  export default {
    components: {
      AnswerSurvey // Registra el componente AnswerSurveyORIG.vue
    },
    data() {
      return {
        iframeURL: 'https://visercom.cestel.es/#' ,
        currentComponent: 'AnswerSurvey' // Establece el componente inicial que se cargará
      };
    },
    computed: {
      nombre() {
        // Recupera el nombre de los parámetros de  la ruta
        return this.$route.params.nombre || '' ;
      }
    }
  };
  </script>
  
  <style scoped>
  .iframe-container {
    display: flex;
    justify-content: center; /* Centra horizon talmente */
    align-items: center; /* Centra verticalmente */
    height: 50vh; /* Ajusta la altura según sea necesario */
  }
  
  .survey-container {
    /* Estilos para e l contenedor de la encuesta */
  }
  </style>
  