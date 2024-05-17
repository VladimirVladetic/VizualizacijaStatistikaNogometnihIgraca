function createScatterPlot(xColumn, yColumn, team) {
    const width = 600;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    d3.select("#scatter-chart-container").selectAll("svg").remove();
    d3.select("#radar-chart-container").selectAll("svg").remove();

    const svg = d3.select("#scatter-chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
        .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
        .range([height - margin.top - margin.bottom, 0]);

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.csv("FullData_augmented.csv").then(data => {
        data.forEach(d => {
            d[xColumn] = +d[xColumn];
            d[yColumn] = +d[yColumn];
            d.combinedScore = d[xColumn] + d[yColumn];
        });

        const filteredData = data.filter(d => d.Club === team || d.Nationality === team);

        xScale.domain([0, d3.max(filteredData, d => d[xColumn])]);
        yScale.domain([0, d3.max(filteredData, d => d[yColumn])]);

        const sortedData = filteredData.sort((a, b) => b.combinedScore - a.combinedScore);
        const colorScale = d3.scaleQuantile()
            .domain([0, sortedData.length])
            .range(["green", "yellow", "red"]);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("x", (width - margin.left - margin.right) / 2)
            .attr("y", 35)
            .attr("fill", "black")
            .style("text-anchor", "middle")
            .text(xColumn);

        svg.append("g")
            .call(d3.axisLeft(yScale))
            .append("text")
            .attr("x", -(height - margin.top - margin.bottom) / 2)
            .attr("y", -35)
            .attr("transform", "rotate(-90)")
            .attr("fill", "black")
            .style("text-anchor", "middle")
            .text(yColumn);

        svg.selectAll("dot")
            .data(sortedData)
            .enter().append("circle")
            .attr("cx", d => xScale(d[xColumn]))
            .attr("cy", d => yScale(d[yColumn]))
            .attr("r", 5)
            .attr("fill", (d, i) => colorScale(i))
            .on("mouseover", (event, d) => {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Name: ${d.Name}<br>Club: ${d.Club}<br>Country: ${d.Nationality}<br>Position: ${d.Club_Position}`)
                    .style("left", (event.pageX + 8) + "px")
                    .style("top", (event.pageY - 35) + "px");
            })
            .on("mouseout", () => {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // svg.selectAll(".player-name")
        //     .data(sortedData)
        //     .enter().append("text")
        //     .attr("class", "player-name")
        //     .attr("x", d => xScale(d[xColumn]))
        //     .attr("y", d => yScale(d[yColumn]) - 10)
        //     .attr("text-anchor", "middle")
        //     .text(d => d.Name)
        //     .style("font-size", "10px")
        //     .style("fill", "black");

    }).catch(error => {
        console.error('Error loading or processing data:', error);
    });
}
