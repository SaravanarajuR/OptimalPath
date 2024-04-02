const fs = require("fs");

async function handleMapData() {
  // waydata

  var wayData = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body:
      "data=" +
      encodeURIComponent(`
            [bbox:12.8426,79.8631,13.9000,80.9000]
            [out:json]
            [timeout:1000]
            ;
            (
                way
                    (
                    12.8426,79.8631,13.9000,80.9000
                     );
            );
            out geom;
        `),
  }).then((response) => response.text());

  fs.writeFile("../data/network/wayData.json", wayData, (err) => {
    if (err) {
      console.log("Error Writing File");
    } else {
      console.log("Write Successfull");
    }
  });

  //nodeData

  var nodeData = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body:
      "data=" +
      encodeURIComponent(`
            [bbox:12.8426,79.8631,13.9000,80.9000]
            [out:json]
            [timeout:1000]
            ;
            (
                node
                    (
                    12.8426,79.8631,13.9000,80.9000
                     );
            );
            out geom;
        `),
  }).then((response) => response.text());

  fs.writeFile("../data/network/nodeData.json", nodeData, (err) => {
    if (err) {
      console.log("Error Writing File");
    } else {
      console.log("Write Successfull");
    }
  });
}

handleMapData();
