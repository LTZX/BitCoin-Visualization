var blockwith = document.getElementById('blocks').offsetWidth - 30;
var blockheight = document.getElementById('blocks').offsetHeight - 5;

var blocks = d3.select("#blocks")
    .append("svg")
    .attr("width", blockwith)
    .attr("height", blockheight)



var transArea = blocks.append("g").attr("class", "trans")
var boxWidth = blockwith - 200;
transArea.append("rect")
    .attr("width", boxWidth + 100)
    .attr("height", (blockheight/2 * 0.85))
    .attr("fill", myGrey)
    .attr("opacity", 0.3)
    .attr("transform", "translate(50," + ((blockheight * 0.6) - 20) + ")")

var counts = Math.floor(boxWidth / 30);
var buttonWid = (blockwith - 60) / 3;

var buttons = blocks.append("g").attr("transform", "translate(30,"+ blockheight/2 +")")
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

    })

var leftLabel = blocks.append("g")
  .attr("id", "leftLabel")
  .attr("transform", "translate(50," + (blockheight/2 - 90 ) + ")")

leftLabel.append("text").attr("id", "StatusLabel").attr("transform", "translate(0,20)")
leftLabel.append("text").attr("id", "TransLabel").attr("transform", "translate(0,40)")
leftLabel.append("text").attr("id", "TimeLabel").attr("transform", "translate(0,60)")
leftLabel.append("text").attr("id", "BlockLabel").attr("transform", "translate(0,80)")

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
          return "translate(" + (i * 35 + 100) + "," + (blockheight * 0.6 + row * 35) + ")"
      })
      .on("mouseover",function(d){
        leftLabel.select("#StatusLabel").text("Status: " + d.status)
        leftLabel.select("#TransLabel").text("Trans: " + d.source.NickName + " to " + d.target.NickName + "with amount of " + d.amount)
        leftLabel.select("#TimeLabel").text("Time: " + d.time)
        leftLabel.select("#BlockLabel").text("Block: " + d.block)

        leftLabel.attr("visibility", "visible")
      })
      .on("mouseout",function(d){
        leftLabel.attr("visibility", "hidden")
      })

}
