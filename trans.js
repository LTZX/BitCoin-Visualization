var transwith = document.getElementById('transArea').offsetWidth;
var transheight = document.getElementById('transArea').offsetHeight;
var transmargin = {top:0, bottom: transwith * 0.02, left: transwith * 0.1, right: transwith * 0.1}
transwith = transwith - transmargin.left - transmargin.right;
transwith = transwith - transmargin.top - transmargin.bottom;

var transs = d3.select("#transArea")
    .append("svg")
    .attr("width", transwith)
    .attr("height", transheight)
    .attr("transform", "translate(" + transmargin.left + "," + transmargin.top + ")")

var labelheight = 90;
var buttonheight = 40;
var boxWidth = transwith;
var boxHeight = transheight - labelheight - buttonheight - transmargin.bottom;
var sortDataBy = "By Time";
// r = 15, gap = 5, margin left = 30, right = 30
var counts = Math.round((boxWidth - 60) / 35);

var labelArea = transs.append("g")
    .attr("transform", "translate(0," + 0 + ")")
var buttonArea = transs.append("g")
    .attr("transform", "translate(0," + (labelheight + buttonheight/2 - 10) + ")")
var transArea = transs.append("g")
    .attr("transform", "translate(0," + (labelheight + buttonheight) + ")")

function sortData() {
    switch (sortDataBy) {
        case "By Status":
            links.sort(function(x, y){
               return d3.ascending(x.status, y.status);
            })
            break;
        case "By Amount":
            links.sort(function(x, y){
               return d3.ascending(x.amount, y.amount);
            })
            break;
        case "By Time":
            links.sort(function(x, y){
               return d3.ascending(x.time, y.time);
            })
            break;
        default:
            console.log("Should not appear.")
    }
}

function trans() {
  transArea.append("rect")
      .attr("width", boxWidth)
      .attr("height", boxHeight)
      .attr("fill", myGrey)
      .attr("opacity", 0.3)
      // .attr("transform", "translate(0," + 130 + ")")

  var tranInst = transArea.append("g")
  // .attr("transform", "translate(0," + 130 + ")")

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
}

function buttons() {
  var buttonWid = (boxWidth - 40) / 3;

  var oneButton = buttonArea.selectAll("g")
      .data(["By Status", "By Amount", "By Time"])
      .enter().append("g")
      .attr("transform", function(d, i) {
          return "translate(" + (i * buttonWid + 20) + ",0)";
      })

  oneButton.append("text")
      .text(d => d)
      .attr("transform", "translate(" + (buttonWid/2 - 30) + "," + 15 + ")")
      .attr("cursor", "pointer")
      .attr("font-weight", function(d) {
         if(d == sortDataBy) { return "bold"; }
         else { return "normal";}
       })

  oneButton.on("click", function(d){
          sortDataBy = d;
          sortData()
          links.map(function(d, i){ d.index = i; })
          transArea.selectAll(".transNode")
          .transition().duration(300)
          .attr("transform", function(d) {
              var row = Math.floor(d.index / counts);
              i = d.index % counts;
              return "translate(" + (30 + i * 35) + "," + ( 30 + row * 35) + ")"
          })
          oneButton.selectAll("text")
          .attr("font-weight", function(d) {
             if(d == sortDataBy) { return "bold"; }
             else { return "normal";}
           })
      })
}

function labels() {
    var llcover = labelArea.append("g")
    llcover.append("rect")
        .attr("width", boxWidth)
        .attr("height", labelheight)
        .attr("fill", myGrey)
        .attr("opacity", 0.3)

    llcover.append("text")
        .attr("class", "transinst")
        .text("Hover the circles below to see detail information.")
        .attr("transform", "translate(20,50)")
        .attr("font-size", 16)
        .attr("font-weight", "bold")
        .style("fill", myGrey)

    labelArea.append("text").attr("class", "transinfo").attr("id", "StatusLabel").attr("transform", "translate(20,20)")
    labelArea.append("text").attr("class", "transinfo").attr("id", "TransLabel").attr("transform", "translate(20,40)")
    labelArea.append("text").attr("class", "transinfo").attr("id", "TimeLabel").attr("transform", "translate(20,60)")
    labelArea.append("text").attr("class", "transinfo").attr("id", "BlockLabel").attr("transform", "translate(20,80)")
}

function updateTrans(index) {
  links = allLinkData[index];
  sortData();
  transArea.selectAll(".transNode").remove();
  transArea.selectAll("circle")
    .data(links)
    .enter().append("circle")
      .attr("class", "transNode")
      .attr("r", d => scaleDown(d.amount))
      .attr("fill", d => colorDict[d.status])
      .each(function(d, i){ d.index = i })
      .attr("transform", function(d) {
          var row = Math.floor(d.index / counts);
          i = d.index % counts;
          return "translate(" + (30 + i * 35) + "," + ( 30 + row * 35) + ")"
      })
      .on("mouseover",function(d){
        labelArea.select("#StatusLabel").text("Status: " + d.status)
        labelArea.select("#TransLabel").text("Trans: " + d.source.NickName + " to " + d.target.NickName + " with amount of " + d.amount)
        labelArea.select("#TimeLabel").text("Time: " + d.time)
        labelArea.select("#BlockLabel").text("Block: " + d.block)
        labelArea.selectAll(".transinfo").attr("visibility", "visible")
        labelArea.selectAll(".transinst").attr("visibility", "hidden")
      })
      .on("mouseout",function(d){
        labelArea.selectAll(".transinfo").attr("visibility", "hidden")
        labelArea.selectAll(".transinst").attr("visibility", "visible")
      })
}

labels()
buttons()
trans()
