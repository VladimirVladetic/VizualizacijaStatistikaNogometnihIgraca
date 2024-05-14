function makeRadarChart(data, features, playerNames){
    d3.select("svg").remove();
    // console.log(features);
    // console.log(playerNames);
    let width = 700;
    let height = 700;

    let graphWidth = 500;

    let svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    let maxValue = 100

    let radialScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, graphWidth / 2.8]);
    
    let ticksCount = 5; 
    let interval = Math.ceil(maxValue / ticksCount); 
    let ticks = Array.from({length: ticksCount + 1}, (_, i) => i * interval);

    svg.selectAll("circle")
        .data(ticks)
        .join(
            enter => enter.append("circle")
                .attr("cx", width / 2)
                .attr("cy", height / 2)
                .attr("fill", "none")
                .attr("stroke", "gray")
                .attr("r", d => radialScale(d))
        );

    svg.selectAll(".ticklabel")
        .data(ticks)
        .join(
            enter => enter.append("text")
                .attr("class", "ticklabel")
                .attr("x", width / 2 + 5)
                .attr("y", d => height / 2 - radialScale(d))
                .text(d => d.toString())
        );

    function angleToCoordinate(angle, value){
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
        return {"x": width / 2 + x, "y": height / 2 - y};
    }

    let featureData = features.map((f, i) => {
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        return {
            "name": f,
            "angle": angle,
            "line_coord": angleToCoordinate(angle, maxValue),
            "label_coord": angleToCoordinate(angle, (maxValue+8))
            };
    });

    data.forEach(player => {
        console.log(`Player: ${player.Player}`);
        features.forEach(feature => {
            console.log(`${feature}: ${player[feature]}`);
        });
    });

    svg.selectAll("line")
        .data(featureData)
        .join(
            enter => enter.append("line")
                .attr("x1", width / 2)
                .attr("y1", height / 2)
                .attr("x2", d => d.line_coord.x)
                .attr("y2", d => d.line_coord.y)
                .attr("stroke","black")
        );

        svg.selectAll(".axislabel")
    .data(featureData)
    .join(
        enter => enter.append("text")
            .attr("x", d => {
                let x = d.label_coord.x;
                if (x < width / 2) {
                    return x - 0.1; 
                } else {
                    return x + 0.1; 
                }
            })
            .attr("y", d => {
                let y = d.label_coord.y;
                if (y < height / 2) {
                    return y - 0.1;
                } else {
                    return y + 0.5;
                }
            })
            .attr("text-anchor", d => {
                let x = d.label_coord.x;
                if (x < width / 2) {
                    return "end"; 
                } else {
                    return "start";
                }
            })
            .text(d => d.name)
    );


    let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);
    let colors = ["darkorange", "gray", "navy"];

    function getPathCoordinates(data_point){
        let coordinates = [];
        for (var i = 0; i < features.length; i++){
            let ft_name = features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
        }
        return coordinates;
    }

    svg.selectAll("path")
        .data(data)
        .join(
            enter => enter.append("path")
                .datum(d => getPathCoordinates(d))
                .attr("d", line)
                .attr("stroke-width", 3)
                .attr("stroke", (_, i) => colors[i])
                .attr("fill", (_, i) => colors[i])
                .attr("stroke-opacity", 1)
                .attr("opacity", 0.5)
        );

    let legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(10,20)");
    
    legend.selectAll(".legend-item")
            .data(playerNames)
            .enter().append("text")
            .attr("class", "legend-item")
            .attr("x", 0)
            .attr("y", (d, i) => 20 * i)
            .text((d, i) => `${d}`)
            .style("fill", (d, i) => colors[i]);
}