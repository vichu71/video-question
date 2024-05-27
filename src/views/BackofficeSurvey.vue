
<template>
  <div style="width: 100%; height: 100%;">
    <v-snackbar
        v-model="snackbar"
        :timeout="snackbartimeout"
    >
      {{ snackbartext }}

      <template v-slot:action="{ attrs }">
        <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
<!--    <canvas id="plotting_canvas" width="500" height="500" style="cursor:crosshair;position: absolute"></canvas>-->
    <div v-if="started" style="display: flex;flex-direction: row">
      <v-spacer></v-spacer>
      <v-select
          v-show="false"
          style="width: fit-content; align-self: end;max-width: 200px"
          :items="langs"
          v-model="selectedLanguage"
          dense
          hide-details
          rounded
          return-object>
        <template v-slot:selection="{ item }">
          <v-img :src="item.icon" min-width="32" max-width="32" min-height="32" style="margin-right: 1rem"></v-img><span>{{item.name}}</span>
        </template>
        <template v-slot:item="{item}">
          <v-img :src="item.icon" min-width="32" max-width="32" min-height="32" style="margin-right: 1rem"></v-img><span>{{item.name}}</span>
        </template>
      </v-select>
    </div>
    <survey v-if="survey && started" :survey="survey"></survey>
    <div v-if="!started && !calibrating">
      <v-btn @click="startKopernica">Start Kopernica</v-btn>
      <v-btn @click="startGazer">Start Gazer</v-btn>
      <v-btn @click="startCalibration">Start Calibration</v-btn>
    </div>
    <div v-if="calibrating" style="width: 100%; height: 100%;display: flex;justify-content: center;align-items: center;">
      <div id="calibration-buttons-container">
        <v-btn color="red" class="calibration-button top left" :disabled="buttonDisabled['upper-left']" v-show="buttonShow['upper-left']" @click="onCalibrationClick('upper-left')"></v-btn>
        <v-btn color="red" class="calibration-button top middle-horizontal" :disabled="buttonDisabled['upper-middle']" v-show="buttonShow['upper-middle']" @click="onCalibrationClick('upper-middle')"></v-btn>
        <v-btn color="red" class="calibration-button top right" :disabled="buttonDisabled['upper-right']" v-show="buttonShow['upper-right']" @click="onCalibrationClick('upper-right')"></v-btn>
        <v-btn color="red" class="calibration-button middle-vertical left" :disabled="buttonDisabled['middle-left']" v-show="buttonShow['middle-left']" @click="onCalibrationClick('middle-left')"></v-btn>
        <v-btn color="red" class="calibration-button middle-vertical middle-horizontal" :loading="finishedCalibrating" :disabled="buttonDisabled['middle-middle']" v-show="buttonShow['middle-middle']" @click="onCalibrationClick('middle-middle')"></v-btn>
        <v-btn color="red" class="calibration-button middle-vertical right" :disabled="buttonDisabled['middle-right']" v-show="buttonShow['middle-right']" @click="onCalibrationClick('middle-right')"></v-btn>
        <v-btn color="red" class="calibration-button bottom left" :disabled="buttonDisabled['bottom-left']" v-show="buttonShow['bottom-left']" @click="onCalibrationClick('bottom-left')"></v-btn>
        <v-btn color="red" class="calibration-button bottom middle-horizontal" :disabled="buttonDisabled['bottom-middle']" v-show="buttonShow['bottom-middle']" @click="onCalibrationClick('bottom-middle')"></v-btn>
        <v-btn color="red" class="calibration-button bottom right" :disabled="buttonDisabled['bottom-right']" v-show="buttonShow['bottom-right']" @click="onCalibrationClick('bottom-right')"></v-btn>
      </div>
    </div>
  </div>
</template>

<style>
  #calibration-buttons-container {
    position: relative;
    width: 98%;
    height: 98%;
  }
  .calibration-button {
    position: absolute;
    width: 20px;
    height: 20px;
  }

  .top {
    top: 0;
  }
  .right {
    right: 0;
  }
  .bottom {
    bottom: 0;
  }
  .left {
    left: 0;
  }
  .middle-vertical{
    bottom:50%;
  }
  .middle-horizontal{
    right:50%;
  }
</style>

<script lang="ts">
  //@ts-nocheck
  import {Component, Vue, Watch} from 'vue-property-decorator'
  import http from "@/plugins/http";
  import * as SurveyVue from "survey-vue";
  // Modern theme
  import 'survey-vue/modern.min.css';
  import {languages} from "@/components/languages";
  import * as showdown from "showdown";
  // import webgazer from 'webgazer'

  const Survey: any = SurveyVue.Survey;
  Survey.cssType = "modern";
  SurveyVue.Serializer.addProperty("question", "tag:number");
  var widgetVideo = {
    name: "video",

    title: "Video Neurologyca",

    iconName: "icon-preview",

    //category: "file",

    widgetIsLoaded: function () {
      return true;
    },

    isFit: function (question) {
      return question.getType() === "video";
    },


    activatedByChanged: function (question) {
      SurveyVue.Serializer.addClass("video", [], null, "empty");

      SurveyVue.Serializer.addProperties("video", [
        {
          id: "filecustom",
          name: "src",
          type: "file",
          category: "general"
        },
        {
          name: "url",
          type: "input",
          // default:"https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
          category: "general",
          // categoryIndex: 1
        },
        {
          name: "Duration (milliseconds)",
          type: "input",
          category: "general",
        },
        {
          name: "id",
          type: "input",
          //default:"",
          category: "general",
        },
        {
          name: "databcode",
          type: "input",
          // default: "BVOOOOPP",
          category: "general"
        },
        {
          name: "style",
          type: "input",
          default: "stylereplace",
          category: "general",
        },
        {
          name: "type",
          type: "input",
          default: "video/mp4",
          category: "general"
        },


      ]);
    },

    isDefaultRender: false,
    //https://static.videezy.com/system/resources/previews/000/054/410/original/trun01238246.mp4
    //https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4
    //https://static.videezy.com/system/resources/previews/000/038/090/original/guitar_string4.mp4
    htmlTemplate: "<br>",
    afterRender: function (question, el) {
      const objs = JSON.parse(JSON.stringify(question));

      /*  if (objs.url != undefined) {
            console.log("url-> " + objs.url);
        }
        if (objs.src != undefined) {
            console.log("src-> " + objs.src[0].content);
        }*/
      var mainDiv = document.createElement("div");
      var videoEl = document.createElement("video");

      videoEl.autoplay = true;
      videoEl.controls = true;
      videoEl.load();

      videoEl.setAttribute("id", question.id);

      if (objs.url != undefined) {
        videoEl.setAttribute("src", objs.url);
      } else {
        if (objs.src != undefined)
          videoEl.setAttribute("src", objs.src[0].content);
      }

      var style = 'z-index:1000;position: fixed;bottom: 0;right: 0;left: 0;top: 0;width:100vw'
      videoEl.style.cssText = style;
      videoEl.onended = (event) => {
        onEnded(question.databcode)
        console.log(`Debug: ${question.databcode}: Ended, running the next action.`);
      }
      videoEl.setAttribute("data-bcode", question.databcode);
      videoEl.setAttribute("type", question.type);


      question.registerFunctionOnPropertyValueChanged("data-bcode", function (
        value
      ) {
        videoEl.setAttribute("data-bcode", value);
      });

      question.registerFunctionOnPropertyValueChanged("src", function (value) {



        if (value[0] != undefined) {

          videoEl.setAttribute("src", value[0].content);
          console.log(" value[0].content" + JSON.stringify(value[0].content));
        } else {
          videoEl.setAttribute("src", "");
        }



        if(!isNaN(videoEl.duration)) {

          question.setPropertyValue("Duration (milliseconds)", formatNumberES(videoEl.duration * 1000));
        }
        else {

          question.setPropertyValue("Duration (milliseconds)", 0);
        }
        videoEl.addEventListener('timeupdate', function (e) {

          if (!isNaN(videoEl.duration)) {

            question.setPropertyValue("Duration (milliseconds)", formatNumberES(videoEl.duration * 1000));
          }
          else {

            question.setPropertyValue("Duration (milliseconds)", 0);
          }

        });
        question.setPropertyValue("url", "");
      });
      question.registerFunctionOnPropertyValueChanged("url", function (value) {
        if (value == null || value == "") {

          if (question.getPropertyValue("src")[0] != undefined) {

            videoEl.setAttribute("src", question.getPropertyValue("src")[0].content);

          }
          else
            videoEl.setAttribute("src", "");
        }
        else
          videoEl.setAttribute("src", value);

        videoEl.addEventListener('timeupdate', function (e) {
          if (!isNaN(videoEl.duration))
            question.setPropertyValue("Duration (milliseconds)", formatNumberES( videoEl.duration * 1000));
          else
            question.setPropertyValue("Duration (milliseconds)", 0);
        });
      });
      question.registerFunctionOnPropertyValueChanged("id", function (value) {
        videoEl.setAttribute("id", value);
      });
      question.registerFunctionOnPropertyValueChanged("type", function (value) {

        videoEl.setAttribute("type", value);

      });

      mainDiv.appendChild(videoEl);
      el.parentElement.insertBefore(mainDiv, el);
      const formatNumberES = (n, d = 0) => {
        n = new Intl.NumberFormat("es-ES").format(parseFloat(n).toFixed(d))
        if (d > 0) {
          const decimals = n.indexOf(",") > -1 ? n.length - 1 - n.indexOf(",") : 0;
          n = (decimals == 0) ? n + "," + "0".repeat(d) : n + "0".repeat(d - decimals);
        }
        return n;
      }
    }


  };
  SurveyVue.CustomWidgetCollection.Instance.addCustomWidget(widgetVideo, "customtype");


  @Component({
    components: {
      Survey
    }
  })
  export default class SurveyViewBackoffice extends Vue {

    snackbar = false
    snackbartext = 'My timeout is set to 2000.'
    snackbartimeout = 2000


    json: any = null;
    model: any = null;
    started=false;
    calibrating=false;
    title='';

    langs = languages
    selectedLanguage = this.langs[2]
    finishedCalibrating = false;
    mode = {
      'survey': { route: 'survey/{0}/body',},
      'library': { route: 'library/{0}/body',},
      'intro': { route: 'instance/{0}/intro',},
      'ending': { route: 'instance/{0}/ending',}
    } as any

    buttonDisabled = {
      'upper-left': false,
      'upper-middle': false,
      'upper-right': false,
      'middle-left': false,
      'middle-middle': false,
      'middle-right': false,
      'bottom-left': false,
      'bottom-middle': false,
      'bottom-right': false,
    }

    buttonShow = {
      'upper-left': true,
      'upper-middle': false,
      'upper-right': true,
      'middle-left': false,
      'middle-middle': true,
      'middle-right': false,
      'bottom-left': true,
      'bottom-middle': false,
      'bottom-right': true,
    }

    buttonRemainingCounts = {
      'upper-left': 3,
      'upper-middle': 3,
      'upper-right': 3,
      'middle-left': 3,
      'middle-middle': 3,
      'middle-right': 3,
      'bottom-left': 3,
      'bottom-middle': 3,
      'bottom-right': 3,
    }

    @Watch('selectedLanguage')
    onLanguageChange() {
      this.$i18n.locale = this.selectedLanguage.value
    }

    async mounted() {
      this.selectedLanguage = this.langs[2]
      SurveyVue.surveyLocalization.defaultLocale = 'es'
      SurveyVue.surveyLocalization.currentLocale = 'es'
      await this.requestSurvey(
          this.$route.params.id as string,
          this.$route.query.mode as string,
          this.$route.query.auth as string,
      )
      document.addEventListener("video-ended", this.onEnded, false);
    }

    uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }

    @Watch('typeOfSurvey')
    onTypeOfSurveyDetermined() {
      console.log('Type of survey defined:', this.typeOfSurvey)
      switch (this.typeOfSurvey) {
        case "emo":
          //Start kopernica

          var eventPayload =  {'detail': {'title':this.title, 'user': this.uuidv4()}}
          console.log('Starting Kopernica',eventPayload)
          document.dispatchEvent(new CustomEvent("start-kopernica",eventPayload));
          this.started= true
          break;
        case "full":
          //Start kopernica + calibration

          var eventPayload =  {'detail': {'title':this.title, 'user': this.uuidv4()}}
          console.log('Starting Kopernica',eventPayload)
          document.dispatchEvent(new CustomEvent("start-kopernica",eventPayload));
          console.log('Starting Gazer')
          document.dispatchEvent(new CustomEvent("start-gazer"));
          this.calibrating=true;
          break;
        case "normal":
          this.started= true
          break;
        case null:
          console.log("Do Nothing")
          return

      }
    }


    get typeOfSurvey() {
      if(this.title === '') return null;
      if(this.title.includes('full')) return 'full';
      if(this.title.includes('emo')) return 'emo';
      return 'normal';
    } // 'normal'  'emo' 'full


    async onCalibrationClick(position: string) {
      console.log('Button clicked: ', position)
      this.buttonRemainingCounts[position]--

      if(this.buttonRemainingCounts[position] === 0 ){
        this.buttonDisabled[position]=true
      } else {
        this.buttonDisabled[position]=true
        setTimeout(() => this.buttonDisabled[position]=false,2000)
      }

      let keepGoing = false;
      for (const [key, value] of Object.entries(this.buttonShow)) {
        if(value) {
          if(this.buttonRemainingCounts[key] !== 0) {
            keepGoing = true;
          }
        }
      }
      if(!keepGoing) {
        this.finishedCalibrating = true;
        this.snackbartext = 'Has completado la calibración con exito!'
        this.snackbar = true;
        this.snackbartimeout = 3000;
        setTimeout(() => {
          this.started = true;
          this.calibrating = false;
        },3000)

      }
    }

    async requestSurvey(id: string, mode: string, authToken: string) {
      console.log(id,mode,authToken)
      this.json = (await http.get(this.mode[mode].route.format(id), {
        headers: {
          Authorization: authToken
        }
      })).data
    }

    onEnded() {
      this.model.currentPageNo += 1;
    }

    aboutToStartVideo(databcode) {
      document.dispatchEvent(new CustomEvent("start-video-block",{'detail':{'bcode':databcode}}));
    }

    startKopernica() {
      document.dispatchEvent(new CustomEvent("start-kopernica"));
    }

    startGazer() {
      document.dispatchEvent(new CustomEvent("start-gazer"));
    }

    startCalibration() {
      // this.calibrating=true;
      // document.dispatchEvent(new CustomEvent("start-calibration"));
      this.started = true;
      // setTimeout(() => this.started = true,5000)
    }

    get survey() {
      if(this.json) {
        if(this.model === null) {
          //@ts-ignore
          this.title = this.json.title;
          this.model = new SurveyVue.Model(this.json);
          const converter = new showdown.Converter();
          this.model.onTextMarkdown.add((survey, options) => options.html = converter.makeHtml(options.text));

          this.model.onAfterRenderQuestion.add( (s,o,html) => {
            if(o.question.getType() === 'video') {
              console.log('Starting video bloc',o.question)
              this.aboutToStartVideo(o.question.databcode)
            } else {
              console.log('Dispatching start question bloq with code', o.question.name)
              document.dispatchEvent(new CustomEvent("start-question-block",{'detail':{'bcode':o.question.name}}));
            }
            console.log('After render',o.question.name);
          })
        }
        return this.model;
      } else {
        return null;
      }
    }
  }


</script>
