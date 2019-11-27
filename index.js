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
            selector: ".path",
            style: {
                "background-color": "green",
                "line-color": "green",
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
		
		
		let compCount = countComponents(nodeCount, getAdjacencyStructure());
		
		
		if(compCount !== 0 && compCount <= 2){
			if((nodeCount % 2) == 0){
				
				
			}
			else{
				alert("Dviejų komandų sudaryti negalima: nelyginis viršūnių skaičius");
			}
			
		}
		else{	
			alert("Dviejų komandų sudaryti negalima: netinkamas komponenčių skaičius");
		}
		
        /*if (state) {
            state = false;
            $(button).text("Click me");
            cy.$("node, edge").removeClass("path");
            cy.removeListener("tap", "node");
            cy.on("tap", "node", function(e) { createEdge(e); });
            return;
        }

        $(button).text("Select START node");

        cy.removeListener("tap", "node");

        cy.on("tap", "node", function(node) {
            node.target.addClass("path");

            if (start == null) {
                start = node.target.id();
                $(button).text("Select END node");
            } else {
				alert(numberOfConnectedComponents());
               // calculatePath(start, node.target.id());
                start = null;
                state = true;
                $(button).text("Again");
            }
        });*/

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


	
	
	
let bfsCounter = 0;
	
function BFS(node) {
	bfsCounter = 0;
	let edges = getAdjacencyStructure();
	console.log("edges count: " + edges.length);
   // Create a Queue and add our initial node in it
   let q = new Queue(nodeCount);
   let explored = new Set();
   q.enqueue(node);

   // Mark the first node as explored explored.
   explored.add(node);
   if(edges.length === 1)
	bfsCounter+=2;
   // We'll continue till our queue gets empty
   while (!q.isEmpty()) {
      let t = q.dequeue();

      // Log every element that comes out of the Queue
      console.log(t);
	  

      // 1. In the edges object, we search for nodes this node is directly connected to.
      // 2. We filter out the nodes that have already been explored.
      // 3. Then we mark each unexplored node as explored and add it to the queue.
	  if(edges[t] != undefined){
		  bfsCounter++;
		  edges[t]
		  .filter(n => !explored.has(n))
		  .forEach(n => {
			 explored.add(n);
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
		alert(graphData);
		
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
