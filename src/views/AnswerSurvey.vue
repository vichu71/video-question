
<template>
  <div>
    <div  style="display: flex; flex-direction: row; margin: 0.5rem">
      <v-spacer></v-spacer>
      <v-select v-show="false" style="width: fit-content; align-self: end; max-width: 200px" :items="langs"
        v-model="selectedLanguage" dense hide-details rounded return-object>
        <template v-slot:selection="{ item }">
          <v-img :src="item.icon" min-width="32" max-width="32" min-height="32"
            style="margin-right: 1rem"></v-img><span>{{ item.name }}</span>
        </template>
        <template v-slot:item="{ item }">
          <v-img :src="item.icon" min-width="32" max-width="32" min-height="32"
            style="margin-right: 1rem"></v-img><span>{{ item.name }}</span>
        </template>
      </v-select>
    </div>

    <alert-stack ref="alertStack"></alert-stack>

    <survey v-if="surveyJSmodel" :survey="surveyJSmodel" ></survey>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as SurveyVue from 'survey-vue';
import { languages } from '@/components/languages';
import AlertStack from '@/components/AlertStack.vue';
import alertService from '@/services/alert';
import * as showdown from 'showdown';
import 'survey-vue/modern.min.css';
import surveyData from '@/assets/survey.json';

const Survey: any = SurveyVue.Survey;
Survey.cssType = 'modern';

@Component({
  components: {
    AlertStack,
    Survey,
  },
})
export default class SurveyView extends Vue {
  survey: any = null; // Usar el JSON importado
  surveyData: any = surveyData;
  model: SurveyVue.Model | null = null;
  
  langs = languages;
  selectedLanguage: any = null;
 
  iframeURL = 'https://visercom.cestel.es/#/';
  completarEncuesta(survey) {
    console.log("acabar");
    this.$router.push({ name: 'alta' });
  }

  async mounted() {
    console.log('Mounted');
    this.selectedLanguage = this.langs[2];
    SurveyVue.surveyLocalization.defaultLocale = 'es';
    SurveyVue.surveyLocalization.currentLocale = 'es';
    alertService.setAppContainer(this.$refs.alertStack as AlertStack);
    this.initializeSurvey();
  }

  @Watch('selectedLanguage')
  onLanguageChange() {
    this.$i18n.locale = this.selectedLanguage.value;
  }

  generateIframeURL(name) {
    return `https://visercom.cestel.es/#/${name}`;
  }


  initializeSurvey() {
   
  this.survey = this.surveyData;
  

    this.model.onComplete.add((s, options) => {
      console.log("acabar");
        this.completarEncuesta(s);
      });

    this.model = new SurveyVue.Model(this.survey);

 
  }

 

  get surveyJSmodel() {
    if (this.survey && this.model === null) {
      this.model = new SurveyVue.Model(this.survey);

      const converter = new showdown.Converter();
      this.model.onTextMarkdown.add((survey, options) => {
        options.html = converter.makeHtml(options.text);
      });

        this.model.sendResultOnPageNext = true;
     // this.model.onPartialSend.add((s) => this.onSave(s, true, null));

        this.model.onComplete.add((s, options) => {
      console.log("acabar");
        this.completarEncuesta(s);
      });

      }

      return this.model;
  }
    }
</script>

<style>
/* Aquí puedes agregar estilos personalizados si es necesario */
</style>
