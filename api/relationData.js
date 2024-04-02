const fs = require("fs");

//relationsData
async function getRelationData() {
  var relationsData = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body:
      "data=" +
      encodeURIComponent(`
            [bbox:12.8426,79.8631,13.9000,80.9000]
            [out:json]
            [timeout:1000]
            ;
            (
                relation
                    (
                    12.8426,79.8631,13.9000,80.9000
                     );
            );
            out geom;
        `),
  }).then((response) => response.text());

  fs.writeFile("../data/network/relationsData.json", relationsData, (err) => {
    if (err) {
      console.log("Error Writing File");
    } else {
      console.log("Write Successfull");
    }
  });
}

getRelationData();
