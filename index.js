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
        if (state) {
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
                calculatePath(start, node.target.id());
                start = null;
                state = true;
                $(button).text("Again");
            }
        });

    }
} //--



function getAdjacencyStructure() { //to use arrays instead of what is given
    let adjacencyNodes = [];

    for (let i = 0; i < nodeCount; i++) {
        let adjacentNodes = [];
        cy.$id(i + 1).neighbourhood(`edge[source="${i+1}"]`).forEach(
            n => {
                adjacentNodes.push(n.target().id()); //adjacent node
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
