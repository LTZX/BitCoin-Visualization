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

var startDate = new Date(2018, 11, 24, 10, 33, 30),
    endDate = new Date(2018, 11, 24, 11, 33, 30);;

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
    .attr("transform", "translate("+ margin.left + "," + ( margin.top + 25 ) +")")

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
          var gap = targetValue/50;
          if(Math.abs(d3.event.x - currentValue) > gap / 2) {
            if(d3.event.x < currentValue) {
              currentValue = currentValue - gap;
            } else {
              currentValue = currentValue + gap;
            }
            updateNodes(true);
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
    .text(timeFormat(startDate, true))
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
    timer = setInterval(step, 100);
    button.text("Pause");
  }
})

function updateNodes(remove) {

  if(remove) {
    var random = Math.floor(Math.random() * 10) + 1;
    for(var i = 0; i < random; i++) {
      var randomIndex = Math.floor(Math.random() * links.length);
      links.splice(randomIndex,1);
    }
  }

  var random = Math.floor(Math.random() * 5) + 1;
  for(var i = 0; i < random; i++) {
    var ids = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    var randomIndex = Math.floor(Math.random() * ids.length);
    var from = ids[randomIndex];
    randomIndex = Math.floor(Math.random() * ids.length);
    var to = ids[randomIndex];
    if(from === to) {
      continue;
    }
    var value = Math.floor(Math.random() * 10) + 1;
    links.push({"source": nodesmap[from], "target": nodesmap[to], "value": value})
  }

  var newlinks = network.select("g").selectAll(".link")
        .data(links)

  d3.selectAll(".node").attr("fill", "#b3b3b3");
  newlinks.enter().append("line")
          .attr("class", "link")
          .attr("stroke", "#66ccff")
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", d => Math.sqrt(d.value))
          .attr("transform", "translate("+ (nodewith/2) + "," + (nodeheight/2) +")")

  newlinks.exit().remove();
  network.select("g").selectAll(".link").each(function(d){
            d3.select("#"+d.source.id).attr("fill", "#ffa64d");
            d3.select("#"+d.target.id).attr("fill", "#ffa64d");
          })

  simulation.force("link", d3.forceLink(links).id(d => d.id));
  simulation.alpha(0.8).restart();
}

function step() {
  update(x.invert(currentValue));
  currentValue = currentValue + (targetValue/50);
  if (currentValue > targetValue) {
    moving = false;
    currentValue = 0;
    clearInterval(timer);
    playButton.text("Play");
    console.log("Slider moving: " + moving);
  }
}

function update(h) {
  var count = Math.round(x(h)/targetValue*50) % 5

  handle.attr("cx", x(h));
  label
    .attr("x", x(h))
    .text(timeFormat(h, true));

  if(count == "4") {
    updateNodes(true);
  } else {
    updateNodes(false);
  }
}
