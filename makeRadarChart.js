function makeRadarChart(data, features, playerNames) {
    const width = 700;
    const height = 700;
    const graphWidth = 500;
    const maxValue = 100;
    const ticksCount = 5; 
    const interval = Math.ceil(maxValue / ticksCount); 
    const ticks = Array.from({ length: ticksCount + 1 }, (_, i) => i * interval);
    const colors = ["darkorange", "gray", "navy"];
    
    const svg = d3.select("#radar-chart-container").selectAll("svg").data([null]).join("svg")
        .attr("width", width)
        .attr("height", height);

    const radialScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, graphWidth / 2.8]);

    const angleToCoordinate = (angle, value) => {
        const x = Math.cos(angle) * radialScale(value);
        const y = Math.sin(angle) * radialScale(value);
        return { x: width / 2 + x, y: height / 2 - y };
    };

    const featureData = features.map((f, i) => {
        const angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        return {
            name: f,
            angle: angle,
            line_coord: angleToCoordinate(angle, maxValue),
            label_coord: angleToCoordinate(angle, maxValue + 8)
        };
    });

    svg.selectAll("circle")
        .data(ticks)
        .join(
            enter => enter.append("circle")
                .attr("cx", width / 2)
                .attr("cy", height / 2)
                .attr("fill", "none")
                .attr("stroke", "gray")
                .attr("r", d => radialScale(d)),
            update => update
                .transition().duration(750)
                .attr("r", d => radialScale(d))
        );

    svg.selectAll(".ticklabel")
        .data(ticks)
        .join(
            enter => enter.append("text")
                .attr("class", "ticklabel")
                .attr("x", width / 2 + 5)
                .attr("y", d => height / 2 - radialScale(d))
                .text(d => d.toString()),
            update => update
                .transition().duration(750)
                .attr("y", d => height / 2 - radialScale(d))
                .text(d => d.toString())
        );

    svg.selectAll("line")
        .data(featureData)
        .join(
            enter => enter.append("line")
                .attr("x1", width / 2)
                .attr("y1", height / 2)
                .attr("x2", d => d.line_coord.x)
                .attr("y2", d => d.line_coord.y)
                .attr("stroke", "black"),
            update => update
                .transition().duration(750)
                .attr("x2", d => d.line_coord.x)
                .attr("y2", d => d.line_coord.y)
        );

    svg.selectAll(".axislabel")
        .data(featureData)
        .join(
            enter => enter.append("text")
                .attr("class", "axislabel")
                .attr("x", d => {
                    const x = d.label_coord.x;
                    return x < width / 2 ? x - 0.1 : x + 0.1;
                })
                .attr("y", d => {
                    const y = d.label_coord.y;
                    return y < height / 2 ? y - 0.1 : y + 0.5;
                })
                .attr("text-anchor", d => {
                    const x = d.label_coord.x;
                    return x < width / 2 ? "end" : "start";
                })
                .text(d => d.name),
            update => update
                .transition().duration(750)
                .attr("x", d => {
                    const x = d.label_coord.x;
                    return x < width / 2 ? x - 0.1 : x + 0.1;
                })
                .attr("y", d => {
                    const y = d.label_coord.y;
                    return y < height / 2 ? y - 0.1 : y + 0.5;
                })
                .text(d => d.name)
        );

    const line = d3.line()
        .x(d => d.x)
        .y(d => d.y);

    const getPathCoordinates = data_point => {
        return features.map((ft_name, i) => {
            const angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            return angleToCoordinate(angle, data_point[ft_name]);
        });
    };

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
                .attr("opacity", 0.5),
            update => update
                .datum(d => getPathCoordinates(d))
                .transition().duration(750)
                .attr("d", line)
        );

    const legend = svg.selectAll(".legend").data([null]).join("g")
        .attr("class", "legend")
        .attr("transform", "translate(10,20)");
    
    legend.selectAll(".legend-item")
        .data(playerNames)
        .join(
            enter => enter.append("text")
                .attr("class", "legend-item")
                .attr("x", 0)
                .attr("y", (d, i) => 20 * i)
                .text((d, i) => `${d}`)
                .style("fill", (d, i) => colors[i]),
            update => update
                .transition().duration(750)
                .attr("y", (d, i) => 20 * i)
                .text((d, i) => `${d}`)
                .style("fill", (d, i) => colors[i])
        );
}
