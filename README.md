# BitCoin-Visualization

This is a visualization for bitcoin transactions. The dashboard has three parts: the block visual angle on the left, the node visual angle on the right, and time slider under the above two part.

<center class="half">
    <img src="/images/mainView.png" width="280"/><img src="/images/mainViewWithNode.png" width="280"/>
</center>

## Time Slider
The slider can be used to choose the time point by dragging it to the point. You can also use the "Play" button to make it move automatically. And "Pause" it with the same button. All the updates of the visualization are controlled by this slider.  

## Block Visual Angle (Left Panel)
The left panel shows the transactions under block visual angle. It includes a block area, a transaction nodes area, and an information area in between.

The block area shows four most recent blocks that is created and the number of transactions that are recorded on this block. The transaction nodes area shows all the unrecorded transactions until this point, and the status of these transactions when a new valid block is added to the chain. When hover the nodes, the basic information of the transactions will be presented in the information area. The size of the node shows the amount of transaction while the color of the node shows the status.

<center class="half">
    <img src="/images/transNodeHover.png" width="400"/>
</center>

The transactions are unrecorded initially. When a valid block is created, the color of the nodes will change. The new block will be highlighted and added to the blockchain above. Users can always sort the transaction nodes by amount, status or time.

<center class="half">
    <img src="/images/byAmount.png" width="250"/><img src="/images/byStatus.png" width="270"/>
</center>

### Functions
1.  Use the slider to see the changes through time.
2.  Hover to see the detail information of a transaction.  
3.  The size of the circles demonstrates the transaction amount.  
4.  The color of the circles demonstrates the status of the transactions.  
5.  Sort or Group the circles with the buttons that offered.  

## Nodes Visual Angle (Right Panel)
The right panel shows all the bit coin addresses (nodes), which is similar to the concept of account or user in general cases, that in the system and the transactions were made by those addresses.  

Under this visual angle, if there is a transaction between two addresses, a link, which demonstrates a transaction, will be added between two nodes. The color of the link shows the status of the transaction, which is the same as the transaction nodes on the left panel.  

If hover the nodes in the graph, the information of this bit coin address will be presented.  

<center class="half">
    <img src="/images/nodeHover.png" width="400"/>
</center>

### Functions
1.  Use the slider to see the changes through time.
2.  Hover to see the detail information of a BitCoin address.  
3.  The color of the nodes demonstrates if it is active at the time.  
4.  The color of the links demonstrates the transaction status.  
5.  The link will connect to the nodes that are related to this transaction.

## Highlight to track
