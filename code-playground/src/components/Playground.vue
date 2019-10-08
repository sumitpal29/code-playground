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
          <div class="try-fusioncharts-tab ml-2">
            <button
              @click="showCategory = !showCategory"
              class="btn btn-sm btn-outline-primary"
            >Try FusionCharts</button>

            <select
              v-if="showCategory"
              @change="selectOpt(categoryTypes)"
              v-model="categoryTypes"
              class="select-css ml-1"
            >
              <option>Select Categories</option>
              <option
                :value="item"
                v-for="(item, index) in categories"
                :key="index"
              >{{item.display}}</option>
            </select>

            <select v-if="showInnerCategory" @change="setChartType(selectedChartType)"
              v-model="selectedChartType" class="select-css ml-1">
              <option>Selct Chart Type</option>
              <option :value="item.value" v-for="(item, index) in innerCategory" :key="index">{{item.display}}</option>
            </select>
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
      showCategory: false,
      showInnerCategory: false,
      selectedChartType: '',
      categoryTypes: [],
      innerCategory: [],
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
      },
      categories: {
        single_series: {
          display: "Single Series Charts",
          charts: [
            {
              display: "Column 2D",
              value: "column2d"
            },
            {
              display: "Column 3D",
              value: "column3d"
            },
            {
              display: "Line 2D",
              value: "line"
            },
            {
              display: "Area 2D",
              value: "area2d"
            },
            {
              display: "Bar 2D",
              value: "bar2d"
            },
            {
              display: "Bar 3D",
              value: "bar3d"
            },
            {
              display: "Pie 2D",
              value: "pie2d"
            },
            {
              display: "Pie 3D",
              value: "pie3d"
            },
            {
              display: "Doughnut 2D",
              value: "doughnut2d"
            },
            {
              display: "Doughnut 3D",
              value: "doughnut3d"
            },
            {
              display: "Pareto 2D",
              value: "pareto2d"
            },
            {
              display: "Pareto 3D",
              value: "pareto3d"
            },
            {
              display: "Funnel",
              value: "funnel"
            },
            {
              display: "Pyramid",
              value: "pyramid"
            },
            {
              display: "Single-Series Spline 2D",
              value: "spline"
            },
            {
              display: "Single-Series Spline Area 2D",
              value: "splinearea"
            },
            {
              display: "Waterfall / Cascade Chart",
              value: "waterfall2d"
            },
            {
              display: "Kagi Chart",
              value: "kagi"
            }
          ]
        },
        multi_series: {
          display: "Multi Series Charts",
          charts: [
            {
              display: "Multi-series Column 2D",
              value: "mscolumn2d"
            },
            {
              display: "Multi-series Column 3D",
              value: "mscolumn3d"
            },
            {
              display: "Multi-series Line 2D",
              value: "msline"
            },
            {
              display: "Multi-series Bar 2D",
              value: "msbar2d"
            },
            {
              display: "Multi-series Bar 3D",
              value: "msbar3d"
            },
            {
              display: "Multi-series Area 2D",
              value: "msarea"
            },
            {
              display: "Marimekko",
              value: "marimekko"
            },
            {
              display: "Stacked Column 2D",
              value: "stackedcolumn2d"
            },
            {
              display: "Stacked Column 3D",
              value: "stackedcolumn3d"
            },
            {
              display: "Stacked Bar 2D",
              value: "stackedbar2d"
            },
            {
              display: "Stacked Bar 3D",
              value: "stackedbar3d"
            },
            {
              display: "Stacked Area 2D",
              value: "stackedarea2d"
            },
            {
              name:
                "Multi-series 2D Single Y Combination Chart (Column + Line + Area)",
              value: "mscombi2d"
            },
            {
              name:
                "Multi-series 3D Single Y Combination Chart (Column + Line + Area)",
              value: "mscombi3d"
            },
            {
              display: "Multi-series Column 3D + Line - Single Y Axis",
              value: "mscolumnline3d"
            },
            {
              display: "Stacked Column2D + Line single Y Axis",
              value: "stackedcolumn2dline"
            },
            {
              display: "Stacked Column3D + Line single Y Axis",
              value: "stackedcolumn3dline"
            },
            {
              name:
                "Multi-series 2D Dual Y Combination Chart (Column + Line + Area)",
              value: "mscombidy2d"
            },
            {
              display: "Multi-series Column 3D + Line - Dual Y Axis",
              value: "mscolumn3dlinedy"
            },
            {
              display: "Stacked Column 3D + Line Dual Y Axis",
              value: "stackedcolumn3dlinedy"
            },
            {
              display: "Scroll Column 2D",
              value: "scrollcolumn2d"
            },
            {
              display: "Scroll Line 2D",
              value: "scrollline2d"
            },
            {
              display: "Scroll Area 2D",
              value: "scrollarea2d"
            },
            {
              display: "Scroll Stacked Column 2D",
              value: "scrollstackedcolumn2d"
            },
            {
              display: "Scroll Combination 2D (Single Y)",
              value: "scrollcombi2d"
            },
            {
              display: "Scroll Combination 2D (Dual Y)",
              value: "scrollcombidy2d"
            },
            {
              display: "Real-time Area",
              value: "realtimearea"
            },
            {
              display: "Real-time Column",
              value: "realtimecolumn"
            },
            {
              display: "Real-time Line",
              value: "realtimeline"
            },
            {
              display: "Real-time Stacked Area",
              value: "realtimestackedarea"
            },
            {
              display: "Real-time Stacked Column",
              value: "realtimestackedcolumn"
            },
            {
              display: "Real-time Line (Dual Y)",
              value: "realtimelinedy"
            },
            {
              display: "Spark Line",
              value: "sparkline"
            },
            {
              display: "Spark Column",
              value: "sparkcolumn"
            },
            {
              display: "Spark Win/Loss",
              value: "sparkwinloss"
            },
            {
              display: "Logarithmic Column 2D Chart",
              value: "logmscolumn2d"
            },
            {
              display: "Logarithmic Line 2D Chart",
              value: "logmsline"
            },
            {
              display: "Multi-Series Spline 2D",
              value: "msspline"
            },
            {
              display: "Multi-Series Spline Area 2D",
              value: "mssplinearea"
            },
            {
              display: "Error Bar Chart",
              value: "errorbar2d"
            },
            {
              display: "Error Line 2D Chart",
              value: "errorline"
            },
            {
              display: "Inverse y-Axis Area 2D Chart",
              value: "inversemsarea"
            },
            {
              display: "Inverse y-Axis Column 2D Chart",
              value: "inversemscolumn2d"
            },
            {
              display: "Inverse y-Axis Line 2D Chart",
              value: "inversemsline"
            },
            {
              display: "Drag-able Column 2D Chart",
              value: "dragcolumn2d"
            },
            {
              display: "Drag-able Line 2D Chart",
              value: "dragline"
            },
            {
              display: "Drag-able Area 2D Chart",
              value: "dragarea"
            },
            {
              display: "Radar Chart",
              value: "radar"
            },
            {
              display: "Box and Whisker Chart",
              value: "boxandwhisker2d"
            },
            {
              display: "Step Line Charts",
              value: "msstepLine"
            }
          ]
        },
        zoom_charts: {
          display: "Zoom Line Charts",
          charts: [
            {
              display: "Zoom Line",
              value: "zoomline"
            },
            {
              display: "Zoom Line DY",
              value: "zoomlinedy"
            }
          ]
        },
        multi_stacked_charts: {
          display: "Multi-Dataset Stacked Charts",
          charts: [
            {
              display: "Multi-series Stacked Column 2D",
              value: "msstackedcolumn2d"
            }
          ]
        },
        multi_dataseries_stacked_charts: {
          display: "Multi-DataSeries Stacked Charts",
          charts: [
            {
              display: "Multi-series Stacked Column 2D + Line Dual Y Axis",
              value: "msstackedcolumn2dlinedy"
            }
          ]
        },
        xy_charts: {
          display: "XY Charts",
          charts: [
            {
              display: "Scatter Chart",
              value: "scatter"
            },
            {
              display: "Zoom Scatter Chart",
              value: "zoomscatter"
            },
            {
              display: "Bubble Chart",
              value: "bubble"
            },
            {
              display: "Error Scatter Chart",
              value: "errorscatter"
            },
            {
              display: "Select-Scatter Chart",
              value: "selectscatter"
            }
          ]
        },
        gauges_charts: {
          display: "Gauges",
          charts: [
            {
              display: "Real-time Bulb",
              value: "bulb"
            },
            {
              display: "Real-time Cylinder",
              value: "cylinder"
            },
            {
              display: "Real-time Horizontal LED",
              value: "hled"
            },
            {
              display: "Real-time Thermometer",
              value: "thermometer"
            },
            {
              display: "Real-time Vertical LED",
              value: "vled"
            },
            {
              display: "Horizontal bullet graph",
              value: "hbullet"
            },
            {
              display: "Vertical bullet graph",
              value: "vbullet"
            }
          ]
        },
        lgauges_charts: {
          display: "Linear Gauges",
          charts: [
            {
              display: "Real-time Horizontal Linear",
              value: "hlineargauge"
            }
          ]
        },
        angulargauge_charts: {
          display: "Angular Gauge",
          charts: [
            {
              display: "Real-time Angular",
              value: "angulargauge"
            }
          ]
        },
        gantt_charts: {
          display: "Gantt Charts",
          charts: [
            {
              display: "Gantt Chart",
              value: "gantt"
            }
          ]
        },
        treemap_charts: {
          display: "Treemap Charts",
          charts: [
            {
              display: "Treemap Chart",
              value: "treemap"
            }
          ]
        },
        heatmap_charts: {
          display: "Heat Map Charts",
          charts: [
            {
              display: "Heat Map Chart",
              value: "heatmap"
            }
          ]
        },
        candlestick_charts: {
          display: "Candle-stick Charts",
          charts: [
            {
              display: "Candle-Stick Chart",
              value: "candlestick"
            }
          ]
        },
        dragnode_charts: {
          display: "Drag Node Charts",
          charts: [
            {
              display: "Drag Node Chart",
              value: "dragnode"
            }
          ]
        },
        multiaxisline_charts: {
          display: "Multi-axis Line Charts",
          charts: [
            {
              display: "Multi-axis Line Chart",
              value: "multiaxisline"
            }
          ]
        },
        multilevelpie_charts: {
          display: "Multi-level Pie Charts",
          charts: [
            {
              display: "Multi-level Pie Chart",
              value: "multilevelpie"
            }
          ]
        },
        maps: {
          display: "Maps",
          charts: [
            {
              display: "Maps"
            }
          ]
        },
        fusion_time: {
          display: "FusionTime",
          charts: [
            {
              display: "timeseries",
              value: "timeseries"
            }
          ]
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
      this.runIframe.style.borderRadius = "4px";
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
    },
    selectOpt(item) {
      console.log(item)
      this.showInnerCategory = true;
      this.innerCategory = item.charts;
      console.log(this.innerCategory.charts)
    },
    setChartType(type) {

    }
  }
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
    padding: .6em 1.4em .5em .8em;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    margin: 0;
    border: 1px solid #aaa;
    box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
    border-radius: .5em;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
      linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
    background-repeat: no-repeat, repeat;
    background-position: right .7em top 50%, 0 0;
    background-size: .65em auto, 100%;
}
.select-css::-ms-expand {
    display: none;
}
.select-css:hover {
    border-color: #888;
}
.select-css:focus {
    border-color: #aaa;
    box-shadow: 0 0 1px 3px rgba(59, 153, 252, .7);
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    color: #222;
    outline: none;
}
.select-css option {
    font-weight:normal;
}
</style>
