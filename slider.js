function timeFormat(date, second) {
  var hh = date.getUTCHours();
  var mm = date.getUTCMinutes();
  var ss = date.getSeconds();
  if (hh < 10) {hh = "0"+hh;}
  if (mm < 10) {mm = "0"+mm;}
  if (ss < 10) {ss = "0"+ss;}
  var t = hh+":"+mm;
  if(second) {
    var t = t + ":"+ss;
  }
  return t;
}

var startDate = new Date(2018, 10, 24, 2, 30, 00),
    endDate = new Date(2018, 10, 24, 7, 30, 00);

var margin = {top:40, right:20, bottom:0, left:50},
    width = document.getElementById('sliderDiv').offsetWidth - margin.left - margin.right,
    height = document.getElementById('sliderDiv').offsetHeight - margin.top - margin.bottom;

var svg = d3.select("#sliderDiv")
    .append("svg")
    .attr("id","slider")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var moving = false;
var currentValue = 0;
var targetValue = width;

var playButton = d3.select("#play-button")

var x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, targetValue])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate("+ margin.left + "," + (height/2 + 18 ) +")")

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() {
          var gap = targetValue/60;
          if(Math.abs(d3.event.x - currentValue) > gap / 2) {
            if(d3.event.x < currentValue) {
              currentValue = currentValue - gap;
            } else {
              currentValue = currentValue + gap;
            }
            update(x.invert(currentValue));
          }
        })
    );

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
    .data(x.ticks(10))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) { return timeFormat(d, false); });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

var label = slider.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(timeFormat(startDate, false))
    .attr("transform", "translate(0," + (-25) + ")")

playButton
    .on("click", function() {
    var button = d3.select(this);
    if (button.text() == "Pause") {
        moving = false;
        clearInterval(timer);
        button.text("Play");
    } else {
        moving = true;
        timer = setInterval(step, 160);
        button.text("Pause");
    }
})

var colorDict = {"INVALID": "#EF798A", "VALID": "#A0E8AF", "UNRECORDED": "#6290C3"}

function updateLinks(index) {
  links = allLinkData[index];

  var newlinks = network.select("g").selectAll(".link")
        .data(links)
  d3.selectAll(".node").attr("fill", myGrey);
  newlinks.enter().append("line")
          .attr("class", "link")
          .attr("stroke", function(d) { return colorDict[d.status]; })
          .attr("stroke-width", 3)
          .attr("transform", "translate("+ (nodewith/2) + "," + (nodeheight/2) +")")
  d3.selectAll(".link").attr("stroke", function(d) { return colorDict[d.status]; })

  newlinks.exit().remove();
  network.select("g").selectAll(".link").each(function(d){
            d3.select("#"+d.source.NickName).attr("fill", "#FCDFA6");
            d3.select("#"+d.target.NickName).attr("fill", "#FCDFA6");
          })

  simulation.force("link", d3.forceLink(links).id(d => d.NickName));
  simulation.alpha(0.8).restart();
}

function step() {
  update(x.invert(currentValue));
  currentValue = currentValue + (targetValue/60);
  if (currentValue > targetValue) {
    moving = false;
    currentValue = 0;
    clearInterval(timer);
    playButton.text("Play");
    console.log("Slider moving: " + moving);
  }
}

function update(h) {
    var index = Math.floor(x(h)/targetValue*60);
    d3.selectAll(".transnodeinst").attr("visibility", "hidden");

    handle.attr("cx", x(h));
    label
      .attr("x", x(h))
      .text(timeFormat(h, false));

    if(index == 0) {
        d3.selectAll(".link").remove();
        d3.selectAll(".transNode").remove();
        d3.selectAll(".node").attr("fill", myGrey);
        d3.selectAll(".transnodeinst").attr("visibility", "visible");
    }
    else if(index <= 60){
        updateLinks(index-1);
        updateTrans(index-1);
    }
}
