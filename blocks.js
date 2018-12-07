var blockwith = document.getElementById('transArea').offsetWidth - 30;
var blockheight = document.getElementById('transArea').offsetHeight - 5;

var blocks = d3.select("#transArea")
    .append("svg")
    .attr("width", blockwith)
    .attr("height", blockheight)

var transArea = blocks.append("g").attr("class", "trans")
var boxWidth = blockwith - 200;
var boxHeight = blockheight - 130;

transArea.append("rect")
    .attr("width", boxWidth + 100)
    .attr("height", boxHeight)
    .attr("fill", myGrey)
    .attr("opacity", 0.3)
    .attr("transform", "translate(50," + 130 + ")")

var tranInst = transArea.append("g")
.attr("transform", "translate(50," + 130 + ")")

tranInst.append("text")
    .attr("class", "transnodeinst")
    .text("Press the Play button or Drag on the slider.")
    .attr("transform", "translate(20," + (boxHeight / 2 - 10) + ")")
    .attr("font-size", 16)
    .attr("font-weight", "bold")
    .style("fill", myGrey)

tranInst.append("text")
    .attr("class", "transnodeinst")
    .text("The transactions will be presented here.")
    .attr("transform", "translate(20," + (boxHeight / 2 + 10) + ")")
    .attr("font-size", 16)
    .attr("font-weight", "bold")
    .style("fill", myGrey)

var counts = Math.floor(boxWidth / 30);
var buttonWid = (blockwith - 60) / 3;

var buttons = blocks.append("g").attr("transform", "translate(30,"+ 100 +")")
var oneButton = buttons.selectAll("g")
    .data(["By Status", "By Amount", "By Time"])
    .enter().append("g")
    .attr("transform", function(d, i) {
      return "translate(" + i * buttonWid + ",0)";
    })

oneButton.append("text")
    .text(d => d)
    .attr("transform", "translate(" + (buttonWid - 50)/2 + "," + 15 + ")")
    .attr("cursor", "pointer")
    .on("click", function(d){
        switch (d) {
          case "By Status":
            links.sort(x,y => d3.ascending(x.status, y.status))
            break;
          case "By Amount":
            links.sort(x,y => d3.ascending(x.amount, y.amount))
            break;
          case "By Time":
            links.sort(x,y => d3.ascending(x.time, y.time))
            break;
          default:
            console.log("Should not appear.")
        }
    })

var leftLabel = blocks.append("g")
    .attr("id", "leftLabel")
    .attr("transform", "translate(50," + 5 + ")")

var llcover = leftLabel.append("g")
llcover.append("rect")
    .attr("width", boxWidth + 100)
    .attr("height", 90)
    .attr("fill", myGrey)
    .attr("opacity", 0.3)

llcover.append("text")
    .attr("class", "transinst")
    .text("Hover the circles below to see detail information.")
    .attr("transform", "translate(20,50)")
    .attr("font-size", 16)
    .attr("font-weight", "bold")
    .style("fill", myGrey)

leftLabel.append("text").attr("class", "transinfo").attr("id", "StatusLabel").attr("transform", "translate(20,20)")
leftLabel.append("text").attr("class", "transinfo").attr("id", "TransLabel").attr("transform", "translate(20,40)")
leftLabel.append("text").attr("class", "transinfo").attr("id", "TimeLabel").attr("transform", "translate(20,60)")
leftLabel.append("text").attr("class", "transinfo").attr("id", "BlockLabel").attr("transform", "translate(20,80)")

function updateTrans(index) {
  links = allLinkData[index];

  transArea.selectAll(".transNode").remove();
  transArea.selectAll("circle")
    .data(links)
    .enter().append("circle")
      .attr("class", "transNode")
      .attr("r", d => scaleDown(d.amount))
      .attr("fill", d => colorDict[d.status])
      .attr("transform", function(d, i) {
          var row = Math.floor(i / counts);
          i = i % counts;
          return "translate(" + (i * 35 + 90) + "," + (160 + row * 35) + ")"
      })
      .on("mouseover",function(d){
        leftLabel.select("#StatusLabel").text("Status: " + d.status)
        leftLabel.select("#TransLabel").text("Trans: " + d.source.NickName + " to " + d.target.NickName + "with amount of " + d.amount)
        leftLabel.select("#TimeLabel").text("Time: " + d.time)
        leftLabel.select("#BlockLabel").text("Block: " + d.block)

        leftLabel.selectAll(".transinfo").attr("visibility", "visible")
        leftLabel.selectAll(".transinst").attr("visibility", "hidden")
      })
      .on("mouseout",function(d){
        leftLabel.selectAll(".transinfo").attr("visibility", "hidden")
        leftLabel.selectAll(".transinst").attr("visibility", "visible")
      })

}
