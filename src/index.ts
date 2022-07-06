import "./styles.css";
import * as d3 from "d3";
import optionsi from "./data.json";
import { dataRoleHelper } from "powerbi-visuals-utils-dataviewutils";

import powerbi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import DataView = powerbi.DataView;

class Visual {
  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>; // diff from org.
  container: d3.Selection<SVGGElement, any, any, any>;

  constructor() {
    this.svg = d3.select("#app").append("svg");
    this.container = this.svg.append("g").classed("container", true);
  }

  public update() {
    this.svg.selectAll("polygon").remove();
    const options: VisualUpdateOptions = optionsi; //normally options are passed as a param
    let dataView: DataView = options.dataViews[0];
    let width: number = options.viewport.width; //normally via viewport size
    let height: number = options.viewport.height; //normally via viewport size
    let SVG_width2: number = 2800; //normally via the options
    let SVG_height2: number = 1800; //normally via the options
    this.svg.attr("width", width);
    this.svg.attr("height", height);
    //DRAW MAP
    for (
      let i = dataRoleHelper.getCategoryIndexOfRole(
        dataView.categorical.categories,
        "SVG"
      );
      i < dataView.categorical.categories.length;
      i++
    ) {
      let Z = dataView.categorical.categories[i].values;
      let data3 = Z.map(function (d) {
        if (isNaN(<number>d)) {
          var f;
          var x: number;
          var y: number;
          var result: string;
          f = String(d).split(",");
          x = <number>f[0];
          y = <number>f[1];
          x = x * (width / SVG_width2);
          y = y * (height / SVG_height2);
          result = String(x) + "," + String(y);
          return <string>result;
        }
      }).join(" ");
      //console.log(dataView);

      this.svg
        .append("polygon")
        .attr("points", data3)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill-opacity", 0.3);
    }
  }
}
const t = new Visual();
t.update();
//t.update();
// create button element to apply selection on click
const button = document.createElement("button") as HTMLButtonElement;
button.innerText = "Update";
button.addEventListener("click", () => {
  // handle click event to apply correspond selection

  t.update();
});
document.body.appendChild(button);
