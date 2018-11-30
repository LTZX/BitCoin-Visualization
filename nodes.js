function drag(simulation) {
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

function forceSimulation(nodes, links) {
    return d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("x", d3.forceX())
        .force("y", d3.forceY());
}

d3.json("data.json", function(error, data) {
    if (error) throw error;

    const links = data.links//.map(d => Object.create(d));
    const nodes = data.nodes//.map(d => Object.create(d));
    const simulation = forceSimulation(nodes, links).on("tick", ticked);
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var nodewith = document.getElementById('network').offsetWidth;
    var nodeheight = document.getElementById('network').offsetHeight;

    var network = d3.select("#network")
        .append("svg")
        .attr("width", nodewith)
        .attr("height", nodeheight)

    const link = network.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .enter().append("line")
        .attr("stroke-width", d => Math.sqrt(d.value))
        .attr("transform", "translate("+ (nodewith/2) + "," + (nodeheight/2) +")");

    const node = network.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d){ return color(d.group); })
        .attr("transform", "translate("+ (nodewith/2) + "," + (nodeheight/2) +")")
        .call(drag(simulation));

    node.append("title")
        .text(d => d.id);

    function ticked() {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
    }
})
