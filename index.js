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
});

// create edge when 2 nodes are clicked
cy.on("tap", "node", function(e) { createEdge(e); });

{ //main button logic (3 states {enable node select}->{ask for second node}->{reset})
    let start = null;
    let state = false;
    let listener = null;

    function buttonClick(button) {
		
		
		//console.log(getAdjacencyStructure());
		alert("Jungiosios komponentės: " + countComponents(nodeCount, getAdjacencyStructure()));
		
		
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
    function countComponents(n, edges) {
        counterComponents = n;
        let root = new Array(n);
        for (i = 0; i < n; ++i) root[i] = i;
		edges.forEach(function(edge){
			union(root, edge[0], edge[1]);
		});
		
        return counterComponents;
    }

    function find(root, i) {
        if (root[i] == i) return i;
        return find(root, root[i]);
    }

    function union(root, source, dst) {
        let srcRoot = find(root, source);
        let dstRoot = find(root, dst);
        if (srcRoot != dstRoot) {
            root[srcRoot] = dstRoot;
            --counterComponents;
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
   
   visited[v] = true;

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
				//console.log("adj node" + n.target().id());
				if(n.source().id().length > 0 && n.target().id().length > 0){
					adjacentNodes.push(n.source().id());
					adjacentNodes.push(n.target().id()); //adjacent node
				}
            }
        );
        adjacencyNodes.push(adjacentNodes);
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
