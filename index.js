//canvas initialization
var cy = cytoscape({

    container: $("#cy"), // container to render in

    style: [ // the stylesheet for the graph
        {
            selector: "node",
            style: {
                "background-color": "#666",
                "label": "data(id)"
            }
        },

        {
            selector: "edge",
            style: {
                "curve-style": "bezier",
                "width": "3",
                "line-color": "#ccc",
                "target-arrow-shape": "none",
                "arrow-scale": "1.5",
                "label": "data(label)"
            }
        },

        {
            selector: ".team1",
            style: {
                "background-color": "green",
                "line-color": "green",
                "border-width": "2"
            }
        },
		{
            selector: ".team2",
            style: {
                "background-color": "blue",
                "line-color": "blue",
                "border-width": "2",
				"shape": "heptagon"
            }
        }
    ],

    zoom: 1,
    pan: { x: 0, y: 0 }

});



//node add
var nodeCount = 0; //sequentially
let team1Nodes = new Array();
let team2Nodes = new Array();
//adds node when double-clicked
$("#cy").dblclick(function(e) {
    let offset = cy.pan();
    cy.add({
        data: { id: ++nodeCount },
        position: { x: e.pageX - offset.x, y: e.pageY - offset.y },
    });
});

//phone doesn"t have double-click so also adds node when tap-hold
cy.on("taphold", function(e) {
    cy.add({
        data: { id: ++nodeCount },
        position: { x: e.position.x, y: e.position.y }
    });
});
//--

//remove right-clicked element (on phones 2 finger tap)
cy.on("cxttap", "node, edge", function(e) {
    cy.remove(cy.$("#" + e.target.id()));
	nodeCount--;
	//console.log(nodeCount);
});

// create edge when 2 nodes are clicked
cy.on("tap", "node", function(e) { createEdge(e); });

{ //main button logic (3 states {enable node select}->{ask for second node}->{reset})
    let start = null;
    let state = false;
    let listener = null;

    function buttonClick(button) {
		
		if(nodeCount > 1){
		let adjStructure = getAdjacencyStructure();
		let firstNode = parseInt(adjStructure[0][0]);
		let compCount = countComponents(nodeCount, adjStructure);
		
		
		if(compCount !== 0 && compCount <= 2){
			if((nodeCount % 2) === 0){
				
				if(compCount === 2){
					firstComp = findConnectedNodes(firstNode, false);
					secondComp = findOtherComponentNodes(firstComp);
					firstCompLength = firstComp.length;
					secondCompLength = nodeCount - firstCompLength;
					if(firstCompLength === secondCompLength){
						colorComponent(firstComp, 'team1');
						colorComponent(secondComp, 'team2');						
					}
					else{
						alert("Dviejų komandų sudaryti negalima: nevienodas viršūnių skaičius pirmoje ir antroje komponentėse");
						
					}
				}
				else{

					team1Nodes = getFirstTeam();
					team2Nodes = getSecondTeam(team1Nodes);
					colorComponent(team1Nodes, 'team1');
					colorComponent(team2Nodes, 'team2');
				}
				
			}
			else{
				alert("Dviejų komandų sudaryti negalima: nelyginis viršūnių skaičius");
			}
			
		}
		else{	
			alert("Dviejų komandų sudaryti negalima: netinkamas komponenčių skaičius");
		}
		}
		else{
			alert("Dviejų komandų sudaryti negalima: yra tik viena viršūnė");
		}
		
        

    }
} //--





	let counterComponents;
	let counterComp1Vertices;
	let counterComp2Vertices;
	let currentComp;
	let vertices;
	let componentsCounter = new Array();
	let touched;
	
	//let team1Nodes = new Array();
	let counterinator = 0;
	
    function countComponents(n, edges) {
        counterComponents = n;
		counterComp1Vertices = 0;
		counterComp2Vertices = 0;
		vertices = 0;
		currentComp = 1;
		touched = new Array(n).fill(0)
		
        let root = new Array(n);
        for (i = 0; i < n; ++i) root[i] = i;
		edges.forEach(function(edge){
			if(edge[0] != undefined && edge[1] != undefined){
				//vertices++;
				console.log("source: " + edge[0] + " dst: " +  edge[1]);
				union(root, edge[0], edge[1]);
			}
			
		});
		
        return counterComponents;
    }

    function find(root, i) {
		touched[i] = 1;
		console.log(i);
        if (root[i] == i){ 
		return i;
		}
		console.log("extra search");
        return find(root, root[i]);
    }
	

    function union(root, source, dst) {
		//console.log("source: " + source + " dst: " + dst);
		touched[root] = 1;
		touched[source] = 1;
		touched[dst] = 1;
        let srcRoot = find(root, source);
		console.log("srcRoot: " + srcRoot);
        let dstRoot = find(root, dst);
		
		//vertices /= 2;
		
        if (srcRoot != dstRoot) {
			counterinator++;
			

			vertices = touched.reduce(function(a, b) { return a + b; }, 0);
            root[srcRoot] = dstRoot;
            --counterComponents;
			if(currentComp === 1)
				counterComp1Vertices = vertices;
			if(currentComp === 2)
				counterComp2Vertices = vertices;// - counterComp1Vertices;
			currentComp++;
        }
    }


	
	


	
	
function colorComponent(nodes, cssStyle){
	let edges = getAdjacencyStructure();
	
	let q = new Queue();
	
	for(i = 0; i < nodes.length; i++){
		q.enqueue(nodes[i]);
	}
	
	while(!q.isEmpty()){
		let currNode = q.dequeue();
      edges.forEach(edge => {
        console.log("checking edge: " + parseInt(edge[0]) + " " + parseInt(edge[1]));
	  if(nodes.includes(parseInt(edge[0])) && nodes.includes(parseInt(edge[1]))){
			cy.$id(parseInt(edge[0])).addClass(cssStyle);
			cy.$id(parseInt(edge[1])).addClass(cssStyle);
			cy.$id(parseInt(edge[0])).neighborhood('edge[target="' + (parseInt(edge[1])) + '"]')
			.forEach(e => e.addClass(cssStyle));
	  }
	  else if(nodes.includes(parseInt(edge[0])) && !nodes.includes(parseInt(edge[1]))){
		  if(nodeCount === 2){
			  cy.$id(parseInt(edge[0])).addClass(cssStyle);
		  }
	  }
	  else if(nodes.includes(parseInt(edge[1])) && !nodes.includes(parseInt(edge[0]))){
		  if(nodeCount === 2){
			  cy.$id(parseInt(edge[1])).addClass(cssStyle);
		  }
	  }
         
      });
		
	}
}	
	




function findOtherComponentNodes(firstComponentNodes){
	let otherComponentNodes = new Array();
	for(i = 1; i <= nodeCount; i++){
		if(!firstComponentNodes.includes(i)){
			otherComponentNodes.push(i);
		}
	}
	return otherComponentNodes;
}	
	





let connectedNodes = new Array();
function findConnectedNodes(startNode, recursiveCall) {
	let edges = getAdjacencyStructure();
	if(!recursiveCall){
		connectedNodes = new Array();
		connectedNodes.push(startNode);
	}
   // Stores the reference to previous nodes
	let q = new Queue(edges.length * edges.length);

   // Set distances to all nodes to be infinite except startNode
   //distances[startNode] = 0;
   q.enqueue(startNode);

   while (!q.isEmpty()) {
      let currNode = q.dequeue();
      edges.forEach(edge => {
        console.log("checking edge: " + parseInt(edge[0]) + " " + parseInt(edge[1]));
	  if(connectedNodes.includes(parseInt(edge[0])) && !connectedNodes.includes(parseInt(edge[1]))){
		  connectedNodes.push(parseInt(edge[1]));
		  findConnectedNodes(parseInt(edge[1]), true);
	  }
	  if(!connectedNodes.includes(parseInt(edge[0])) && connectedNodes.includes(parseInt(edge[1])))
	  {
		  connectedNodes.push(parseInt(edge[0]));
		  findConnectedNodes(parseInt(edge[0]), true);
	  }
         
      });
   }
   console.log(connectedNodes);
   return connectedNodes;
}






function adjToTree(){
	
	let edges = getAdjacencyStructure();
	let treeEdges = new Array();
	let checkedNodes = new Array();
	for(i = 0; i < edges.length; i++){
		if(!checkedNodes.includes(parseInt(edges[i][0])) &&
		!checkedNodes.includes(parseInt(edges[i][1]))){
			checkedNodes.push(parseInt(edges[i][0]));
			checkedNodes.push(parseInt(edges[i][1]));
			treeEdges.push(edges[i]);
		}
		else if(checkedNodes.includes(parseInt(edges[i][0])) &&
		!checkedNodes.includes(parseInt(edges[i][1]))){
			
			checkedNodes.push(parseInt(edges[i][1]));
			treeEdges.push(edges[i]);
		}
		
		else if(!checkedNodes.includes(parseInt(edges[i][0])) &&
		checkedNodes.includes(parseInt(edges[i][1]))){
			
			checkedNodes.push(parseInt(edges[i][0]));
			treeEdges.push(edges[i]);
		}
		
	}
	
	return treeEdges;
	
}



function getNeighborsEdges(tree, node){
	let neighborsEdges = new Array();
	
	for(i = 0; i < tree.length; i++){
		if(node === parseInt(tree[i][0]) ||
		node === parseInt(tree[i][1])){
			neighborsEdges.push(tree[i]);
		}
	}
	
	return neighborsEdges;
	
}


function getDepth(tree, vNod, node, depth){
	
	
	let nod = node;
	let nEdgesLength = getNeighborsEdges(tree, nod).length; 

	for(j = 0; j < tree.length; j++){
		if(parseInt(tree[j][0]) === node && !vNod.includes(parseInt(tree[j][1]))){
			depth += nEdgesLength;
			vNod.push(parseInt(tree[j][1]));
			return getDepth(tree, vNod, parseInt(tree[j][1]), depth);
		}
		else if(parseInt(tree[j][1]) === node && !vNod.includes(parseInt(tree[j][0]))){
			depth += nEdgesLength;
			vNod.push(parseInt(tree[j][0]));
			return getDepth(tree, vNod, parseInt(tree[j][0]), depth);
		}
	}
	return depth;
}

function getMinDepthNodeInTree(tree, visitedNodes, node){
	let depth;
	let minDepth = Infinity;
	let minDepthNode = null;
	let visitedFromNode = new Array();
	let neighEdges = getNeighborsEdges(tree, node);
	let vNodes = visitedNodes;
	let oldInd;
	for(i = 0; i < neighEdges.length; i++){
		oldInd = i;
		let newTree = new Array();
		tree.forEach(function(e){
			newTree.push(e);
		});
		
		depth = 0;
		if(parseInt(neighEdges[i][0]) === node &&
		!vNodes.includes(parseInt(neighEdges[i][1]))){
			depth++;
			vNodes.push(parseInt(neighEdges[i][1]));
			
			
			depth = getDepth(newTree, vNodes, parseInt(neighEdges[i][1]), depth);
			i = oldInd;
			if(depth < minDepth){
				minDepth = depth;
				minDepthNode = parseInt(neighEdges[i][1]);
				
			}
		
		}
		else if(parseInt(neighEdges[i][1]) === node &&
		!vNodes.includes(parseInt(neighEdges[i][0]))){
			depth++;
			vNodes.push(parseInt(neighEdges[i][0]));
			depth = getDepth(newTree, vNodes, parseInt(neighEdges[i][0]), depth);
			i = oldInd;
			if(depth < minDepth){
				console.log(neighEdges);
				minDepth = depth;
				minDepthNode = parseInt(neighEdges[i][0]);
				
			}
		}
		
		
	}
	vNodes = null;
	visitedNodes = null;
	return minDepthNode;
}


function getMinNeighborNode(tree, allVisitedNodes){
	let minNeighborNode = 0;
	let neighborCount = 0;
	let minNeighborCount = Infinity;
	for(i = 1; i <= nodeCount; i++){
		neighborCount = 0;
		for(j = 0; j < tree.length; j++){
			if(i === parseInt(tree[j][0]) && !allVisitedNodes.includes(tree[j][0])){
				neighborCount++;
			}
			else if(i === parseInt(tree[j][1]) && !allVisitedNodes.includes(tree[j][1])){
				neighborCount++;
			}
			
		}
		if(neighborCount < minNeighborCount){
			minNeighborCount = neighborCount;
			minNeighborNode = i;
		}
	}
	
	return minNeighborNode;
}




function getFirstTeam(){
	let teamNodes0 = new Array();
	let tree = adjToTree();
	let membersLeft = nodeCount / 2;
	let lastGoodNode = teamNodes0.push(getMinNeighborNode(tree, teamNodes0));
	membersLeft--;
	let cnt = 1;
	for(i = 0; i < membersLeft; i++){
		let pastI = i;
		let useddNodes = new Array();
		teamNodes0.forEach(function(e){
			useddNodes.push(e);
		});
		let lastNode = teamNodes0[i];
		let nods = getMinDepthNodeInTree(tree, useddNodes, lastNode);
		if(nods !== null){
			teamNodes0.push(nods);
		}
		else{
			let useddNodes = new Array();
		teamNodes0.forEach(function(e){
			useddNodes.push(e);
		});
			let lastNode = teamNodes0[pastI - 1];
			teamNodes0.push(teamNodes0[pastI - 1]);
			let nods = getMinDepthNodeInTree(tree, useddNodes, lastNode);
			teamNodes0.push(nods);
		}
		
		i = pastI;
	}
	return teamNodes0;
	
}



function getSecondTeam(firstTeamNodes){
	let secondTeam = new Array();
	for(i = 1; i <= nodeCount; i++){
		if(!firstTeamNodes.includes(i)){
			secondTeam.push(i);
		}
	}
	return secondTeam;
}


function checkTeamValidity(team){
	
}









function getAdjacencyStructure() { //to use arrays instead of what is given
    let adjacencyNodes = [];

    for (let i = 0; i < nodeCount; i++) {
        let adjacentNodes = [];
        cy.$id(i + 1).neighbourhood(`edge[source="${i+1}"]`).forEach(
			
            n => {
				console.log(n);
				console.log("adj node" + n.target().id());
				//if(n.source().id().length > 0 && n.target().id().length > 0){
					adjacentNodes.push(n.source().id());
					adjacentNodes.push(n.target().id()); //adjacent node
				//}
            }
        );
		if(adjacentNodes.length <= 2 && adjacentNodes.length !== 0){
			adjacencyNodes.push(adjacentNodes);
		}
		else if(adjacentNodes.length !== 0){
			var j,k,temparray,chunk = 2;
			for (j=0,k=adjacentNodes.length; j<k; j+=chunk) {
				temparray = adjacentNodes.slice(j,j+chunk);
				// do whatever
				adjacencyNodes.push(temparray);
				console.log("TEMP: " + temparray);
			
			}
			
		}
    }
    return adjacencyNodes;
}

{
    let previous = null; //to remember begining
    function createEdge(e) {
        if (previous == null) {
            previous = e.target.id();
            return;
        }

        /*do { //input edge weight
            var weight = parseInt(window.prompt("Enter the weight for this edge", "1"), 10);
        } while (isNaN(weight));*/

        cy.add({ //add new edge with specified weight
		group: 'edges',
            data: {
                id: previous + "e" + e.target.id(),
                source: previous,
                target: e.target.id(),
                //label: weight
            }
        });
        previous = null;
    }
	
	
	
    function createEdge(startID, endID) {

        /*do { //input edge weight
            var weight = parseInt(window.prompt("Enter the weight for this edge", "1"), 10);
        } while (isNaN(weight));*/

        cy.add({ //add new edge with specified weight
		group: 'edges',
            data: {
                id: startID + "e" + endID,
                source: startID,
                target: endID,
                //label: weight
            }
        });
        previous = null;
    }
	
	function parseVertData(data){
		let nodes = new Array();
		let arr = data.split(/,|;/);
		for(i = 0; i < arr.length; i+=2){
			let valueToPush = new Array();
			valueToPush.push(arr[i]);
			valueToPush.push(arr[i + 1]);
			
			nodes.push(valueToPush);
		}
		return nodes;
	}
	
	function generateGraph(){
		let vertices = document.getElementById("vertText").value.split(/,|;/);
		vertices = [...new Set(vertices)];
		alert(vertices.length);
		let graphData = parseVertData(document.getElementById("vertText").value);
		//alert(graphData);
		
		for(i = 0; i < vertices.length; i++){
			cy.add({
			data: { id: vertices[i] },
			position: { x: cy.pan().x, y: cy.pan().y }
			});
			nodeCount++;
		}
		
		for(i = 0; i < graphData.length; i++){
			if(graphData[i][0]!== undefined && graphData[i][1] !== undefined){
				createEdge(graphData[i][0], graphData[i][1]);
			}
			
		}
		sort('cose');
	}
	
	function generatePoints(count){
		for(i = 0; i < count; i++){
			cy.add({
			data: { id: ++nodeCount },
			position: { x: cy.pan().x, y: cy.pan().y }
			});
		}
		sort('breadthfirst');
	}
	
	
	function sort(layout) {
		cy.layout({
			name: layout,
			animate: true,
			zoom: 1
		}).run();
	}
}


// Queue class 
class Queue 
{ 
    // Array is used to implement a Queue 
    constructor() 
    { 
        this.items = []; 
    } 
                  
    // Functions to be implemented 
    // enqueue function 
	enqueue(element) 
	{     
		// adding element to the queue 
		this.items.push(element); 
	} 
    // dequeue function 
	dequeue() 
	{ 
		// removing element from the queue 
		// returns underflow when called  
		// on empty queue 
		if(this.isEmpty()) 
			return "Underflow"; 
		return this.items.shift(); 
	} 
    // front function 
	front() 
	{ 
		// returns the Front element of  
		// the queue without removing it. 
		if(this.isEmpty()) 
			return "No elements in Queue"; 
		return this.items[0]; 
	} 

	// isEmpty function 
	isEmpty() 
	{ 
		// return true if the queue is empty. 
		return this.items.length == 0; 
	} 
    // printQueue function 
	printQueue() 
	{ 
		var str = ""; 
		for(var i = 0; i < this.items.length; i++) 
			str += this.items[i] +" "; 
		return str; 
	} 
} 





// Stack class 
class Stack { 
  
    // Array is used to implement stack 
    constructor() 
    { 
        this.items = []; 
    } 
  
		// Functions to be implemented 
		// push function 
	push(element) 
	{ 
		// push element into the items 
		this.items.push(element); 
	} 


		// pop function 
	pop() 
	{ 
		// return top most element in the stack 
		// and removes it from the stack 
		// Underflow if stack is empty 
		if (this.items.length == 0) 
			return "Underflow"; 
		return this.items.pop(); 
	} 
		// peek function 
	peek() 
	{ 
		// return the top most element from the stack 
		// but does'nt delete it. 
		return this.items[this.items.length - 1]; 
	}

	 
		// isEmpty function 
	isEmpty() 
	{ 
		// return true if stack is empty 
		return this.items.length == 0; 
	} 

	 
		// printStack function 
	printStack() 
	{ 
		var str = ""; 
		for (var i = 0; i < this.items.length; i++) 
			str += this.items[i] + " "; 
		return str; 
	}  
}




