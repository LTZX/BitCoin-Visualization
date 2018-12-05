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
        .force("link", d3.forceLink(links).id(d => d.NickName))
        .force("charge", d3.forceManyBody())
        .force("x", d3.forceX())
        .force("y", d3.forceY());
}

var links = [], nodes = [];
var nodesmap = {};
var simulation;
var nodewith = document.getElementById('network').offsetWidth;
var nodeheight = document.getElementById('network').offsetHeight;
var network = d3.select("#network")
    .append("svg")
    .attr("width", nodewith)
    .attr("height", nodeheight)

var allLinkData, scaleDown = d3.scaleLinear();


d3.json("node_view.json", function(error, data) {
    if (error) throw error;
    nodes = data.nodes;
    links = [];
    nodes.map(function(d){ nodesmap[d.NickName] = d; });
    simulation = forceSimulation(nodes, links).on("tick", ticked);
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    // const link = network.append("g")
    //   .selectAll("line")
    //   .data(links)
    //   .enter().append("line")
    //     .attr("class", "link")
    //     .attr("stroke", "#66ccff")
    //     .attr("stroke-opacity", 0.6)
    //     .attr("stroke-width", function(d) {
    //         return scaleDown(d.value);
    //     })
    //     .attr("transform", "translate("+ (nodewith/2) + "," + (nodeheight/2) +")")

    const node = network.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
        .attr("class", "node")
        .attr("id", function(d) { return d.NickName; })
        .attr("r", 5)
        .attr("fill", "#b3b3b3")
        .attr("transform", "translate("+ (nodewith/2) + "," + (nodeheight/2) +")")
        .call(drag(simulation));

    node.append("title")
        .text(d => d.NickName);

    // link.each(function(d){
    //       d3.select("#"+d.source.NickName).attr("fill", "#ffa64d");
    //       d3.select("#"+d.target.NickName).attr("fill", "#ffa64d");
    //     })

    function ticked() {
      network.select("g").selectAll(".link")
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
    }
})

d3.json("data.json", function(error, data) {
    allLinkData = data.slice(0, data.length - 1);
    for(var i = 0; i < allLinkData.length; i++) {
        allLinkData[i] = allLinkData[i].map(function(d){
          let newTrans = {"source": nodesmap[d.source], "target": nodesmap[d.target], "value": d.value};
          return newTrans;
        })
    }
    maxAndMin = data[data.length - 1]
    scaleDown.range([1, 10]).domain([maxAndMin.min, maxAndMin.max]);
})
