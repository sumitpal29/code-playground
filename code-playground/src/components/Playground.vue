<template>
  <div class="playground-container text-left pt-6 pb-6">
    <div class="playground-container-view">
      <div class="card shadow top-card">
        <div class="card-header bold text-center pb-0">Code Playground</div>
        <div ref="iframeContainer" class="card-body pb-0" />
      </div>
    </div>
    <div class="playground-container-code">
      <div class="card shadow">
        <div class="card-header text-right pb-0">
          <div class="lanmg-tab">
            <button
              @click="changeTab('html')"
              :class="['btn btn-sm',activeTab === 'html' ? 'btn-secondary-grad' : 'btn-outline-secondary']"
            >HTML</button>
            <button
              @click="changeTab('js')"
              :class="['btn btn-sm',activeTab === 'js' ? 'btn-secondary-grad' : 'btn-outline-secondary']"
            >JS</button>
            <button
              @click="changeTab('css')"
              :class="['btn btn-sm',activeTab === 'css' ? 'btn-secondary-grad' : 'btn-outline-secondary']"
            >CSS</button>
          </div>
          <button @click="run" class="btn btn-sm btn-primary-grad">Run</button>
        </div>
        <div class="card-body">
          <div ref="rootCodeContainer" class="playground-container-code-editor"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export default {
  name: "Playground",
  data() {
    return {
      runIframe: null,
      runIframeHeight: 200,
      activeTab: "js",
      editorData: {
        js: {
          model: null,
          state: null
        },
        css: {
          model: null,
          state: null
        },
        html: {
          model: null,
          state: null
        }
      }
    };
  },
  mounted() {
    this.editorData.js.model = monaco.editor.createModel(
      "// Type your javascript code here",
      "javascript"
    );
    this.editorData.css.model = monaco.editor.createModel(
      "/* Type your CSS code here */",
      "css"
    );
    this.editorData.html.model = monaco.editor.createModel(
      "<!-- Type your HTML code here -->",
      "html"
    );

    this.monacoJSEditor = monaco.editor.create(this.$refs.rootCodeContainer, {
      theme: "vs-dark",
      model: this.editorData.js.model
      // minimap: {
      //   enabled: false
      // }
    });

    this.newIframe();
  },
  methods: {
    run() {
      const scr = "script";
      const css = "style";
      const code = this.runIframe.contentWindow.document;

      code.open();
      code.writeln(
        `${this.getLang("html")} \n <${css}>\n ${this.getLang(
          "css"
        )} \n </${css}> \n <${scr}> \n ${this.getLang("js")} \n </${scr}>`
      );
      code.close();

      fusionDesign.scroll.to(0);
    },
    changeTab(tab) {
      const currentState = this.monacoJSEditor.saveViewState();
      const currentModel = this.monacoJSEditor.getModel();

      if (currentModel === this.editorData.js.model) {
        this.editorData.js.state = currentState;
      } else if (currentModel === this.editorData.css.model) {
        this.editorData.css.state = currentState;
      } else if (currentModel === this.editorData.html.model) {
        this.editorData.html.state = currentState;
      }

      this.activeTab = tab;
      this.monacoJSEditor.setModel(this.editorData[tab].model);
      this.monacoJSEditor.restoreViewState(this.editorData[tab].state);
      this.monacoJSEditor.focus();
    },
    getLang(lang) {
      return this.editorData[lang].model.getValue();
    },
    newIframe() {
      if (this.runIframe) {
        // Unload old iframe
        this.$refs.iframeContainer.removeChild(runIframe);
      }

      // Load new iframe
      this.runIframe = document.createElement("iframe");
      this.runIframe.id = "runner";
      // this.runIframe.src = 'playground/playground-runner.html';
      this.runIframe.className = "run-iframe";
      this.runIframe.style.boxSizing = "border-box";
      this.runIframe.style.height = this.runIframeHeight + "px";
      this.runIframe.style.width = "100%";
      this.runIframe.style.border = "1px solid lightgrey";
      this.runIframe.frameborder = "0";
      this.$refs.iframeContainer.appendChild(this.runIframe);

      // const that = this;

      // this.$nextTick(() => {
      //   this.runIframe.addEventListener("load", function(e) {
      //     that.runIframe.contentWindow.load(
      //       that.getLang("js"),
      //       that.getLang("html"),
      //       that.getLang("css")
      //     );
      //   });
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.playground-container {
  &-view {
    width: 80%;
    margin: 0 auto;

    .top-card{
      margin-bottom: -7px;

      .card{
        &-header{
          font-size: 20px;
        }
      }
    }
  }
  &-code {
    width: 80%;
    margin: 0 auto;
    height: 400px;
    &-editor {
      margin: 0;
      padding: 0;
      border: 0;
      width: 100%;
      height: 300px;
    }

    .card{
      &-header{
        .lanmg-tab{
          float: left;
        }
      }
    }
  }
}
</style>
