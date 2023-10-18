const config = {
  yAxisHeight: 51,
  plotWidth: 500,
  barHeight: 40,
  barWidth: 7,
  margin: 15,
  step: 1000,
};

async function getData() {
  const data = new Map();
  const file = await fetch("data.csv");
  const text = await file.text();
  const rawData = Papa.parse(text).data;
  let maxValue = -1;
  for (let i = 6; i < 85; ) {
    const year = parseInt(rawData[i][0].substring(0, 4));
    const value = parseInt(rawData[i][2].replace(/ /g, ""));
    data.set(year, value);
    if (value > maxValue) {
      maxValue = value;
    }
    i += 4;
  }
  return { data, maxValue };
}

async function main() {
  const { data, maxValue } = await getData();
  const xEntryWidth = config.plotWidth / data.size;
  const graph = document.getElementById("graph");

  const numSteps = Math.ceil(maxValue / config.step);
  const stepHeight = config.yAxisHeight / numSteps;
  const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  yAxis.setAttribute("style", "stroke:white;stroke-width:1");
  yAxis.setAttribute("x1", 14);
  yAxis.setAttribute("y1", 5);
  yAxis.setAttribute("x2", 14);
  yAxis.setAttribute("y2", 5 + config.yAxisHeight);
  graph.appendChild(yAxis);

  for (let i = 0; i < numSteps; i++) {
    const axisIndicatorGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    axisIndicatorGroup.setAttribute("transform", "translate(3, 0)");
    const yAxisText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    yAxisText.setAttribute("text-anchor", "start");
    yAxisText.setAttribute("x", 0);
    yAxisText.setAttribute("y", 6 + stepHeight * i);
    yAxisText.setAttribute("fill", "blue");
    yAxisText.setAttribute("font-size", "4");
    yAxisText.setAttribute("alignment-baseline", "middle");
    yAxisText.innerHTML = config.step * (numSteps - i);
    axisIndicatorGroup.appendChild(yAxisText);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", 8);
    line.setAttribute("y1", 6 + stepHeight * i);
    line.setAttribute("x2", 11);
    line.setAttribute("y2", 6 + stepHeight * i);
    line.setAttribute("style", "stroke:white;stroke-width:1");
    axisIndicatorGroup.appendChild(line);

    graph.appendChild(axisIndicatorGroup);
  }

  const dataIter = data.entries();
  for (let i = 0; i < data.size; i++) {
    const [year, value] = dataIter.next().value;
    const newEntry = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    newEntry.setAttribute("transform", "translate(13,5)");
    // create rectangle
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    const barHeight = (config.barHeight * value) / maxValue;
    rect.setAttribute("height", barHeight);
    rect.setAttribute("x", 4 + config.margin * i);
    rect.setAttribute("y", 10 + config.barHeight - barHeight);
    rect.setAttribute("width", config.barWidth);
    rect.setAttribute("fill", "white");
    newEntry.appendChild(rect);

    // create text
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("text-anchor", "start");
    text.setAttribute("x", -47);
    text.setAttribute("y", 8 + config.margin * i);
    text.setAttribute("fill", "blue");
    text.setAttribute("font-size", "4");
    text.setAttribute("alignment-baseline", "middle");
    text.setAttribute("transform", "rotate(270)");
    text.innerHTML = value;
    newEntry.appendChild(text);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", 1 + config.margin * i);
    line.setAttribute("y1", 50);
    line.setAttribute("x2", 21 + config.margin * i);
    line.setAttribute("y2", 50);
    line.setAttribute("style", "stroke:white;stroke-width:1");
    newEntry.appendChild(line);

    if (i > 0) {
      const seperator = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      seperator.setAttribute("x1", config.margin * i);
      seperator.setAttribute("y1", 50);
      seperator.setAttribute("x2", config.margin * i);
      seperator.setAttribute("y2", 53);
      seperator.setAttribute("style", "stroke:white;stroke-width:0.5");
      newEntry.appendChild(seperator);
    }
    const xAxisLabel = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    xAxisLabel.setAttribute("text-anchor", "start");
    xAxisLabel.setAttribute("x", 3 + config.margin * i);
    xAxisLabel.setAttribute("y", 54);
    xAxisLabel.setAttribute("fill", "blue");
    xAxisLabel.setAttribute("font-size", "4");
    xAxisLabel.setAttribute("alignment-baseline", "middle");
    xAxisLabel.innerHTML = year;
    newEntry.appendChild(xAxisLabel);

    graph.appendChild(newEntry);
  }
}

main();
