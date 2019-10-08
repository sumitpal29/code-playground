<template>
  <div class="playground-container">
    <div class="playground-container-view">
      <div class="card shadow">
        <div class="card-body">
          <iframe ref="iframe" width="100%" height="500px" class="iframe" />
        </div>
      </div>
    </div>
    <div class="playground-container-code">
      <div class="card shadow">
        <div class="card-header text-right pb-0">
          <button @click="changeTab('HTML')" class="btn btn-sm btn-secondary-grad">HTML</button>
          <button @click="changeTab('JS')" class="btn btn-sm btn-secondary-grad">JS</button>
          <button @click="changeTab('CSS')" class="btn btn-sm btn-secondary-grad">CSS</button>
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
    this.editorData.js.model = monaco.editor.createModel('// Type your javascript code here',"javascript");
    this.editorData.css.model = monaco.editor.createModel('/* Type your CSS code here */', "css");
    this.editorData.html.model = monaco.editor.createModel('<!-- Type your HTML code here -->', "html");

    this.monacoJSEditor = monaco.editor.create(this.$refs.rootCodeContainer, {
      theme: "vs-dark",
      model: this.editorData.js.model,
      // minimap: {
      //   enabled: false
      // }
    });
  },
  methods: {
    run() {
      const scr = "script";
      const css = "style";
      const code = this.$refs.iframe.contentWindow.document;
      const jsVal = this.editorData.js.model.getValue();
      const cssVal = this.editorData.css.model.getValue();
      const htmlVal = this.editorData.html.model.getValue();

      code.open();
      code.writeln(`${htmlVal} \n <${css}>\n ${cssVal} \n </${css}> \n <${scr}> \n ${jsVal} \n </${scr}>`);
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

      this.monacoJSEditor.setModel(this.editorData[tab.toLowerCase()].model);
      this.monacoJSEditor.restoreViewState(this.editorData[tab.toLowerCase()].state);
      this.monacoJSEditor.focus();
    }
  }
};
</script>

<style lang="scss" scoped>
.playground-container {
  &-view {
    width: 80%;
  }
  &-code {
    width: 80%;
    height: 400px;
    &-editor {
      margin: 0;
      padding: 0;
      border: 0;
      width: 100%;
      height: 300px;
    }
  }
}
</style>
