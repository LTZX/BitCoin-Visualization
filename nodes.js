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

var links = [], nodes = [];
var simulation;
var nodewith = document.getElementById('network').offsetWidth - 30;
var nodeheight = document.getElementById('network').offsetHeight - 5;
var selectCount = 0;

function forceSimulation(nodes, links) {

  var force = 0;
  if(window.innerHeight < 800) {
      force = -35
  } else {
      force = -65
  }
  return d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.NickName))
        .force("charge", d3.forceManyBody().strength(force))
        .force("x", d3.forceX())
        .force("y", d3.forceY());
}

var network = d3.select("#network")
    .append("svg")
    .attr("width", nodewith)
    .attr("height", nodeheight)

var allLinkData, scaleDown = d3.scaleLinear();
var blockData = [];

function highlightUpdate() {
    if(selectCount != 0) {
        d3.selectAll(".unselected")
            .each(function(d){
                if(d.active == true) {
                    d3.select(this)
                    .attr("fill", colorDict["NODE"])
                    .attr("r", 5)
                } else {
                    d3.select(this)
                    .attr("fill", colorDict["GREY"])
                    .attr("r", 5)
                }
            })
        d3.selectAll(".selected")
            .each(function(d){
                if(d.active == true) {
                    d3.select(this)
                    .attr("fill", highlightColor["NODE"])
                    .attr("r", 7)
                } else {
                    d3.select(this)
                    .attr("fill", highlightColor["GREY"])
                    .attr("r", 7)
                }
            })
        d3.selectAll(".link")
            .each(function(d){
                if(nodesmap[d.source.NickName].clicked || nodesmap[d.target.NickName].clicked) {
                    d3.select(this).attr("id", "linkSelected")
                } else {
                    d3.select(this).attr("id", "linkUnselected")
                }
            })
        d3.selectAll(".transNode")
            .each(function(d){
                if(nodesmap[d.source.NickName].clicked || nodesmap[d.target.NickName].clicked) {
                    d3.select(this).attr("id", "linkSelected")
                } else {
                    d3.select(this).attr("id", "linkUnselected")
                }
            })

        d3.selectAll("#linkUnselected")
            .attr("opacity", 0.3)
        d3.selectAll("#linkSelected")
            .attr("opacity", 1)
    } else {
        d3.selectAll(".link").attr("opacity", 1);
        d3.selectAll(".transNode").attr("opacity", 1);
        d3.selectAll(".node").each(function(d){
            if(d.active == true) {
                d3.select(this)
                .attr("fill", colorDict["NODE"])
                .attr("r", 5)
            } else {
                d3.select(this)
                .attr("fill", colorDict["GREY"])
                .attr("r", 5)
            }
        })
    }
}

d3.json("node_view.json", function(error, data) {
    if (error) throw error;
    nodes = data.nodes;
    links = [];
    nodes.map(function(d){ nodesmap[d.NickName] = d; });
    simulation = forceSimulation(nodes, links).on("tick", ticked);

    const link = network.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
        .attr("class", "link")

    var rightLabel = network.append("g")
      .attr("id", "rightLabel")
    network.append("text")
        .attr("class", "rightInst")
        .text("Hover the nodes to see the detail information.")
        .attr("transform", "translate(10,30)")
        .attr("font-size", 16)
        .attr("font-weight", "bold")
        .style("fill", myGrey)
    network.append("text")
        .attr("class", "rightInst")
        .text("Click to keep track of the nodes.")
        .attr("transform", "translate(10,50)")
        .attr("font-size", 16)
        .attr("font-weight", "bold")
        .style("fill", myGrey)

    const node = network.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
        .attr("class", "node unselected")
        .attr("id", function(d) { return d.NickName; })
        .attr("r", 5)
        .attr("fill", myGrey)
        .attr("transform", "translate("+ (nodewith/2) + "," + (nodeheight/2) +")")
        .call(drag(simulation))
        .on("mouseover",function(d){
            rightLabel.select("#AddressLabel").text("Address: " + d.Address)
            rightLabel.select("#NickNameLabel").text("NickName: " + d.NickName)
            rightLabel.select("#HashLabel").text("Hash: " + d.Hash)
            rightLabel.select("#BalanceLabel").text("Balance: " + d.Balance)

            rightLabel.attr("visibility", "visible")
            d3.selectAll(".rightInst").attr("visibility", "hidden")
        })
        .on("mouseout",function(d){
            rightLabel.attr("visibility", "hidden")
            d3.selectAll(".rightInst").attr("visibility", "visible")
        })
        .each(function(d) { d.clicked = false; })
        .on("click", function(d) {
            d.clicked = 1 - d.clicked
            if(d.clicked) {
                selectCount = selectCount + 1;
                nodesmap[d.NickName].clicked = true;
                d3.select(this).classed("selected", true).classed("unselected", false);
            } else {
                selectCount = selectCount - 1;
                nodesmap[d.NickName].clicked = false;
                d3.select(this).classed("unselected", true).classed("selected", false);
            }
            highlightUpdate();
        })

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

    rightLabel.append("text").attr("id", "AddressLabel").attr("transform", "translate(10,20)")
    rightLabel.append("text").attr("id", "HashLabel").attr("transform", "translate(10,40)")
    rightLabel.append("text").attr("id", "NickNameLabel").attr("transform", "translate(10,60)")
    rightLabel.append("text").attr("id", "BalanceLabel").attr("transform", "translate(10,80)")

    var colorData = [{"color": "#EF798A", "status": "Invalid"},
                     {"color": "#A0E8AF", "status": "Valid"},
                     {"color": "#6290C3", "status": "Unrecorded"}]

    var linkColor = network.append("g")
      .selectAll("g")
      .data(colorData)
      .enter().append("g")
      .attr("transform", function(d,i){
        i = i - 1;
        return "translate(" +  (nodewith - 120) + "," + (i * 20 + nodeheight - 50) + ")";
      })

    linkColor.append("rect")
    .attr("width", 20)
    .attr("height", 2)
    .attr("fill", d => d.color)

    linkColor.append("text")
    .text(d => d.status)
    .attr("transform", "translate(30, 5)")
})

d3.json("data.json", function(error, data) {
    allLinkData = data;
    var minData = Infinity, maxData = 0;
    var tmpBlockData = {};
    for(var i = 0; i < allLinkData.length; i++) {
        allLinkData[i] = allLinkData[i].map(function(d){
          // if(d.block && d.block != -1) {
          //     d.block = d.block / 20;
          // }
          let newTrans = {"source": nodesmap[d.from],
                          "target": nodesmap[d.to],
                          "amount": d.amount,
                          "status": d.status,
                          "time": d.time,
                          "block": d.block};
          if(newTrans["status"] == "VALID") {
              if(!tmpBlockData[newTrans.block]) {
                  tmpBlockData[newTrans.block] = 0;
              }
              tmpBlockData[newTrans.block] = tmpBlockData[newTrans.block] + 1
          }

          return newTrans;
        })
        if(d3.min(allLinkData[i], function(d) { return d.amount; }) < minData) {
          minData = d3.min(allLinkData[i], function(d) { return d.amount; })
        }
        if(d3.max(allLinkData[i], function(d) { return d.amount; }) > maxData) {
          maxData = d3.max(allLinkData[i], function(d) { return d.amount; })
        }
    }
    var total = 0;
    for(var each in tmpBlockData){
        var name = each, count = tmpBlockData[each];
        blockData.push({"name": String(name), "count": count})
    }
    scaleDown.range([5, 15]).domain([(minData), (maxData)]);
})
