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
          state: null,
        },
        css: {
          model: null,
          state: null,
        },
        html: {
          model: null,
          state: null,
        },
      },
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
      model: this.editorData.js.model,
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
      // eslint-disable-next-line
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
        this.$refs.iframeContainer.removeChild(this.runIframe);
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
      this.runIframe.style.borderRadius = "4px";
      this.runIframe.frameborder = "0";
      this.$refs.iframeContainer.appendChild(this.runIframe);
    },
  },
};
</script>

<style lang="scss" scoped>
.playground-container {
  &-view {
    width: 80%;
    margin: 0 auto;

    .top-card {
      margin-bottom: -7px;

      .card {
        &-header {
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
      border-radius: 4px;
      overflow: hidden;
    }

    .card {
      &-header {
        .lanmg-tab,
        .try-fusioncharts-tab {
          float: left;
        }
      }
    }
  }
}
._select-css {
  font-size: 16px;
  color: #444;
  line-height: 1.3;
  padding: 0.6em 1.4em 0.5em 0.8em;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: 1px solid #aaa;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
  border-radius: 0.5em;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"),
    linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%);
  background-repeat: no-repeat, repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 0.65em auto, 100%;
}
.select-css::-ms-expand {
  display: none;
}
.select-css:hover {
  border-color: #888;
}
.select-css:focus {
  border-color: #aaa;
  box-shadow: 0 0 1px 3px rgba(59, 153, 252, 0.7);
  box-shadow: 0 0 0 3px -moz-mac-focusring;
  color: #222;
  outline: none;
}
.select-css option {
  font-weight: normal;
}
</style>
