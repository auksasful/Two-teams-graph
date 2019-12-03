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
						console.log("first component should be colored!");
						colorComponent(secondComp, 'team2');
						console.log("second component should be colored!");
						
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


function checkConnectivity(){
	
	
}




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
			/*if(counterinator <= (nodeCount / 2)){
				if(counterinator === 1){
					team1Nodes.push(parseInt(dst));
				}
				else{
					if(!team1Nodes.includes(parseInt(source))){
						team1Nodes.push(parseInt(source));
					}
					else{
						
						team1Nodes.push(parseInt(dst));
					}
				}
			}*/
			//vertices += 2
			console.log("component found");
			vertices = touched.reduce(function(a, b) { return a + b; }, 0);
            root[srcRoot] = dstRoot;
            --counterComponents;
			if(currentComp === 1)
				counterComp1Vertices = vertices;
			if(currentComp === 2)
				counterComp2Vertices = vertices;// - counterComp1Vertices;
			currentComp++;
			//vertices = 0;
        }
    }


	let visited = new Array(nodeCount+1);
	
	// Find all the reachable nodes for every element 
// in the arr 
function findReachableNodes(fromNode) 
{ 

  
    // Map to store list of reachable Nodes for a 
    // given node. 
    reachableNodes = new Array(); 
  
    // Initialize component Number with 0 
    let componentNum = 1; 
  
    // For each node in arr[] find reachable 
    // Nodes 
    //for (i = 0 ; i < n ; i++) 
    //{ 
        //let u = arr[i]; 
  
        // Visit all the nodes of the component 
            // Store the reachable Nodes corresponding to 
            // the node 'i' 
            reachableNodes = BFSSearch(fromNode); 
         
  
        // At this point, we have all reachable nodes 
        // from u, print them by doing a look up in map m. 
        console.log("Reachable Nodes from " + fromNode + " are\n"); 
        console.log(reachableNodes);
    //} 
} 


function BFSSearch(source) 
{ 
    // Mark all the vertices as not visited 
    // Create a queue for BFS 
    let q = new Queue(nodeCount);
	
	let edges = getAdjacencyStructure();
  
    q.enqueue(source); 
  
    // Assign Component Number 
    visited[source] = true; 
  
    // Vector to store all the reachable nodes from 'src' 
   let reachableNodes = new Array(); 
  
    while(!q.isEmpty()) 
    { 
        // Dequeue a vertex from queue 
        let u = q.front(); 
        q.dequeue(); 
  
        reachableNodes.push(u); 
  
        // Get all adjacent vertices of the dequeued 
        // vertex u. If a adjacent has not been visited, 
        // then mark it visited nd enqueue it 
        for (i = 0; i < edges.length; i++) 
        { 
            if (!visited[parseInt(edges[i][1])]) 
            { 
                // Assign Component Number to all the 
                // reachable nodes 
                visited[parseInt(edges[i][1])] = true; 
                q.enqueue(parseInt(edges[i][1])); 
            } 
        } 
    } 
    return reachableNodes; 
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
	
	
	
	
	
	
	
	
	
	

function BFS(node, recursiveCall) {
	let bfsCounter = 0;
let connectedNodes = new Array();
	bfsCounter = 0;
	if(!recursiveCall){
		connectedNodes = new Array();
		connectedNodes.push(node);
		
	}
	let edges = getAdjacencyStructure();
	console.log("edges count: " + edges.length);
   // Create a Queue and add our initial node in it
   let q = new Queue();
   let explored = new Set();
   for(i = 0; i < edges.length; i++){
	q.enqueue(edges[i]);
   }

   // Mark the first node as explored explored.
   explored.add(node);
   if(edges.length === 1)
	bfsCounter++;
   // We'll continue till our queue gets empty
   while (!q.isEmpty()) {
      let t = q.dequeue();

      // Log every element that comes out of the Queue
      console.log(t);
	  if(edges.length < nodeCount)
		  bfsCounter++;
	  
	  console.log("checking edge: " + parseInt(t[0]) + " " + parseInt(t[1]));
	  if(connectedNodes.includes(parseInt(t[0])) && !connectedNodes.includes(parseInt(t[1]))){
		  connectedNodes.push(parseInt(t[1]));
		  BFS(parseInt(edges[t][1]), true);
	  }
	  if(!connectedNodes.includes(parseInt(t)) && connectedNodes.includes(parseInt(edges[t][1])))
	  {
		  connectedNodes.push(parseInt(edges[t][0]));
		  BFS(parseInt(edges[t][0]), true);
			
	  }
	  console.log("connected nodes: " + connectedNodes);
      // 1. In the edges object, we search for nodes this node is directly connected to.
      // 2. We filter out the nodes that have already been explored.
      // 3. Then we mark each unexplored node as explored and add it to the queue.
	  if(edges[t] != undefined){
		  if(edges.length >= nodeCount)
		  bfsCounter++;
		  edges[t]
		  .filter(n => !explored.has(n))
		  .forEach(n => {
			 explored.add(t);
			 console.log("explored length: " + explored.size);
			 q.enqueue(n);
		  });
	  }
   }
}
	



function numberOfConnectedComponents() 
{ 
	let nodes = getAdjacencyStructure();
    // Mark all the vertices as not visited 
    let visited = Array(nodes.length).fill(false);
  
    // To store the number of connected components 
    let count = 0; 
    for (v = 0; v < nodes.length; v++) 
        visited[v] = false; 
  
    for (v = 0; v < nodes.length; v++) { 
        if (visited[v] == false) { 
		console.log("visit" + count);
            DFS(v, visited); 
            count += 1; 
        } 
    } 
  
    return count; 
} 
  
  
  
  
  
  
function DFS(node, visited) {
   // Create a Stack and add our initial node in it
   let nodes = getAdjacencyStructure();
   let s = new Stack(nodes.length);
   let explored = new Set();
   s.push(node);
   
   visited[node] = true;

   // Mark the first node as explored
   explored.add(node);

   let i = 0;
   // We'll continue till our Stack gets empty
   while (!s.isEmpty()) {
      let t = s.pop();

      // Log every element that comes out of the Stack
      console.log(t);

      // 1. In the edges object, we search for nodes this node is directly connected to.
      // 2. We filter out the nodes that have already been explored.
      // 3. Then we mark each unexplored node as explored and push it to the Stack.
	  if(nodes[t] !== undefined && !visited[i]){
		  nodes[t]
		  .filter(n => !explored.has(n))
		  .forEach(n => {
			 explored.add(n);
			 s.push(n);
		  });
	  }
	  console.log(i);
	  i++;
   }
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




function findAllNeighborNodes(){
	let neighborNodes = new Array(nodeCount);
	let edges = getAdjacencyStructure();
	
   // Stores the reference to previous nodes
	//let q = new Queue(nodeCount * nodeCount);

   // Set distances to all nodes to be infinite except startNode
   //distances[startNode] = 0;
   for(i = 1; i <= nodeCount; i++){
	   let q = new Queue(nodeCount);
	   q.enqueue(i);
		neighborNodes[i - 1] = new Array();
	   while (!q.isEmpty()) {
		  let currNode = q.dequeue();
		  edges.forEach(edge => {
			console.log("checking edge: " + parseInt(edge[0]) + " " + parseInt(edge[1]));
		  if(i == parseInt(edge[0])){
			  neighborNodes[i - 1].push(parseInt(edge[1]));
		  }
		  if(i == parseInt(edge[1]))
		  {
			   neighborNodes[i - 1].push(parseInt(edge[0]));
		  }
			 
		  });
	   }
   }
   console.log(neighborNodes);
   return neighborNodes;
	
	
}


//let team1Nodes = new Array();
//let team2Nodes = new Array();

function findTeams(nodesNeighbors){
	let edges = getAdjacencyStructure();
	let usedNodes = new Array();
	let neighborCounts;
   // Stores the reference to previous nodes
	//let q = new Queue(nodeCount * nodeCount);
	let newNeighbors = nodesNeighbors;4
	let tmpArray = new Array();
   // Set distances to all nodes to be infinite except startNode
   //distances[startNode] = 0;
   for(i = 1; i <= nodeCount / 2; i++){
	 
	   if(i === 1){
		   team1Nodes.push(i);
		   usedNodes.push(i);
		   
	   }
	   else{
		   newNeighbors = updateNeighborhood(newNeighbors, team2Nodes);
		   neighborCounts = getNeighborCounts(newNeighbors, usedNodes);
		   
		   let selectedTheNode = false
		   let selectableNeighbors = newNeighbors;
		   let nNeighborCounts = neighborCounts;
		   
		   let countinger = 0;
		   
		   while(!selectedTheNode){
			   let nodeToPush = getMostSimilarNode(neighborCounts, team2Nodes[i - 1]);
			   console.log(team2Nodes[i - 1] + " most similar node: " + nodeToPush);
			   for(j = 0; j < team1Nodes.length; j++){
				   tmpArray = team1Nodes[j];
				   if(tmpArray.includes(nodeToPush)){
					   selectedTheNode = true;
				   }
			   }
			   
			   if(!selectedTheNode){
					selectableNeighbors.splice(j, 1);
					nNeighborCounts = getNeighborCounts(selectableNeighbors, usedNodes);
			   }
			   
			   countinger++;
			    console.log("n1: " + selectableNeighbors);
				if(countinger === 15){
					selectedTheNode = true;
					
				}
			   
		   }
		   
		   team1Nodes.push(nodeToPush);
			usedNodes.push(nodeToPush);
			colorComponent(team1Nodes, 'team1');
			   
		   }
	   
	   
	   
	   
		newNeighbors = updateNeighborhood(newNeighbors, team1Nodes);
		neighborCounts = getNeighborCounts(newNeighbors, usedNodes);
	
		if(i === 1){
			let nodeToPush = getMostSimilarNode(neighborCounts, team1Nodes[i - 1]);
			team2Nodes.push(nodeToPush);
			usedNodes.push(nodeToPush);
		}
		else{
			newNeighbors = updateNeighborhood(newNeighbors, team1Nodes);
		   neighborCounts = getNeighborCounts(newNeighbors, usedNodes);
		   
		   let selectedTheNode = false
		   let selectableNeighbors = newNeighbors;
		   let nNeighborCounts = neighborCounts;
		   let countinger = 0;
		   while(!selectedTheNode){
			   let nodeToPush = getMostSimilarNode(neighborCounts, team1Nodes[i - 1]);
			    console.log(team2Nodes[i - 1] + " most similar node: " + nodeToPush);
			   for(j = 0; j < team2Nodes.length; j++){
				   tmpArray = team2Nodes[j]
				   if(tmpArray.includes(nodeToPush)){
					   selectedTheNode = true;
				   }
			   }
			   console.log(selectableNeighbors);
			   if(!selectedTheNode){
					selectableNeighbors.splice(j, 1);
					nNeighborCounts = getNeighborCounts(selectableNeighbors, usedNodes);
			   }
			   countinger++;
			    console.log("n2: " + selectableNeighbors);
				if(countinger === 15){
					selectedTheNode = true;
					
				}
		   }
		   
			team2Nodes.push(nodeToPush);
			usedNodes.push(nodeToPush);
			colorComponent(team2Nodes, 'team2');
			
		}
		

   }
   console.log(neighborNodes);
   return neighborNodes;
	
	
}


function updateNeighborhood(neighborhood, otherTeam){
	let updatedN = neighborhood;
	for(i = 1; i <= neighborhood.length; i++){
		for(j = 1; j <= neighborhood[i - 1].length; j++){
			if(otherTeam.includes(neighborhood[i - 1][j - 1])){
				updatedN[i-1].splice(j-1, 1);
				
			}
			
		}
		
	}
	return updatedN;
}


function getNeighborCounts(neighbors, usedNodes){
	
	let neighborCounts = new Array();
	   for(j = 1; j <= neighbors.length; j++){
		   if(j != i && !usedNodes.includes(j)){
			   neighborCounts.push(neighbors[j - 1].length);
		   }
		   else{
			   neighborCounts.push(0);
			   
		   }
		   
	   }
	   return neighborCounts;
}


function getMostSimilarNode(counts, cmp){
	let minNum = Infinity;
	let similarNode = 1;
	for(i = 0; i < counts; i++){
		if(Math.abs(cmp - counts[i]) < minNum){
			similarNode = i + 1;
			
		}
		
	}
	return similarNode;
	
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
	console.log("tree " + tree);
	console.log("node " + node);
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
	console.log("num neigh edges: " + neighEdges.length);
	for(i = 0; i < neighEdges.length; i++){
		oldInd = i;
		let newTree = new Array();
		tree.forEach(function(e){
			newTree.push(e);
		});
		
		depth = 0;
		console.log("depth: " + depth + " i: " + i);
		if(parseInt(neighEdges[i][0]) === node &&
		!vNodes.includes(parseInt(neighEdges[i][1]))){
			depth++;
			vNodes.push(parseInt(neighEdges[i][1]));
			
			
			console.log("neighEdges before: " + neighEdges);
			depth = getDepth(newTree, vNodes, parseInt(neighEdges[i][1]), depth);
			console.log("neighEdges after: " + neighEdges);
			i = oldInd;
			if(depth < minDepth){
				minDepth = depth;
				minDepthNode = parseInt(neighEdges[i][1]);
				
			}
		console.log("depth: " + depth + " i: " + i);
		}
		else if(parseInt(neighEdges[i][1]) === node &&
		!vNodes.includes(parseInt(neighEdges[i][0]))){
			depth++;
			vNodes.push(parseInt(neighEdges[i][0]));
			console.log("neighEdges before: " + neighEdges);
			depth = getDepth(newTree, vNodes, parseInt(neighEdges[i][0]), depth);
			console.log("neighEdges after: " + neighEdges);
			i = oldInd;
			if(depth < minDepth){
				console.log(neighEdges);
				minDepth = depth;
				minDepthNode = parseInt(neighEdges[i][0]);
				
			}
		console.log("depth: " + depth + " i: " + i);
		}
		console.log("depth: " + depth + " i: " + i);
		
		
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
			console.log("neighbor count " + neighborCount);
		}
	}
	
	return minNeighborNode;
}




function getFirstTeam(){
	let teamNodes0 = new Array();
	let tree = adjToTree();
	let membersLeft = nodeCount / 2;
	let membersCount = membersLeft;
	let lastGoodNode = 
	teamNodes0.push(getMinNeighborNode(tree, teamNodes0));
	let nCount = getNeighborsEdges(tree,teamNodes0[0]);
	console.log("teamNodes " + teamNodes0);
	membersLeft--;
	let cnt = 1;
	for(i = 0; i < membersLeft; i++){
		let pastI = i;
		console.log(tree.length);
		console.log("teamNodes 0 " + teamNodes0);
		let useddNodes = new Array();
		teamNodes0.forEach(function(e){
			useddNodes.push(e);
		});
		let lastNode = teamNodes0[i];
		console.log("lastNode: " + lastNode + " i: " + i);
		console.log("teamNodes before nods " + teamNodes0);
		let nods = getMinDepthNodeInTree(tree, useddNodes, lastNode);
		if(nods !== null){
			console.log("teamNodes after nods " + teamNodes0);
			console.log("useddNodes " + useddNodes);
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
			console.log("nods was null");
		}
		
		console.log("nods: " + nods);
		console.log("teamNodes 1 " + teamNodes0);
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
































  
function DFSUtil(v, visited) 
{ 
	let adj = getAdjacencyStructure();
    // Mark the current node as visited 
    visited[v] = true; 
  
    // Recur for all the vertices 
    // adjacent to this vertex 
   // list<int>::iterator i; 
  
    for (i = 0; i < adj.length; ++i) {
        if (!visited[i]) 
            DFSUtil(i, visited); 
	}
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




