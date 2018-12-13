// var blockwith = document.getElementById('blocksArea').offsetWidth;
var blockheight = document.getElementById('blocksArea').offsetHeight - 20;

var blocks = d3.select("#blocksArea")
    .append("svg")
    .attr("width", transwith)
    .attr("height", blockheight)
    .attr("transform", "translate(" + (transmargin.left) + ",20)")

var boxh = blockheight * 0.6;
var boxw = (boxh / 3) * 2;
var boxgap = (transwith - boxw * 4 - 20 * 2) / 3;

blocks.append("text")
    .attr("class", "blockinst")
    .text("The blocks will be presented here.")
    .attr("transform", "translate(20," + (blockheight / 2 + 10) + ")")
    .attr("font-size", 16)
    .attr("font-weight", "bold")
    .style("fill", myGrey)

function updateBlocks(index) {
    if(index < 3) {
        d3.selectAll(".blockinst").attr("visibility", "visible");
    } else {
        d3.selectAll(".blockinst").attr("visibility", "hidden");
    }
    if(index % 4 == 3 && right) {
        var to = Math.floor(index / 4) + 1;
        updateBlocksGraph(to, right)
    }

    if(index % 4 == 2 && !right) {
        var to = Math.floor(index / 4);
        updateBlocksGraph(to, right)
    }
}

function updateBlocksGraph(to, right) {

    var oneData = blockData.slice(0, to).reverse()
    oneData.map(function(d,i){ d.index = i; })

    d3.selectAll(".block").remove();
    var newblocks = blocks.selectAll("g").data(oneData)

    if(right) {
        var oneBlock = newblocks.enter().append("g")
        .attr("class", "block")
        .attr("transform", function(d){
            return "translate(" + ((d.index-1) * (boxw + boxgap) + 20) + "," + (d.index-1) * 5 + ")";
        })
    } else {
        var oneBlock = newblocks.enter().append("g")
        .attr("class", "block")
        .attr("transform", function(d){
            return "translate(" + ((d.index+1) * (boxw + boxgap) + 20) + "," + (d.index+1) * 5 + ")";
        })
    }

    oneBlock.append("rect")
    .attr("width", boxw)
    .attr("height", boxh)
    .attr("fill", myGrey)

    oneBlock.append("text")
    .attr("class", "blockName")
    .text(function(d){ return "Block " + d.name; })
    .attr("transform", "translate(" + 5 + "," + (boxh * 0.3) + ")")

    oneBlock.append("text")
    .attr("class", "blockName")
    .text(function(d){ return "Size: " + d.count; })
    .attr("transform", "translate(" + 5 + "," + (boxh * 0.6) + ")")

    blocks.selectAll(".block")
    .transition().duration(600)
    .attr("transform", function(d){
        return "translate(" + ((d.index) * (boxw + boxgap) + 20) + "," + d.index * 5 + ")";
    })

}
