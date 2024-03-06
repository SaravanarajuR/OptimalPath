const fs = require("fs");

async function handleFetch() {
  try {
    const result = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body:
        "data=" +
        encodeURIComponent(`
                [bbox:12.9156, 80.0954, 13.1997, 80.3043]
                [out:json]
                [timeout:90]
                ;
                (
                    way
                        (
                            (
                                12.9156, 80.0954, 13.1997, 80.3043
                            );
                        );
                );
                out geom;
                `),
    }).then((data) => data.json());

    // Extract relevant information from the result
    const ways = result.elements.filter((element) => element.type === "way");

    // Write to CSV
    const csvData = ways.map((way) => {
      const id = way.id;
      const tags = JSON.stringify(way.tags);
      const geometry = JSON.stringify(way.geometry);
      return `${id},${tags},${geometry}`;
    });

    // Join all lines with newline character
    const csvContent = csvData.join("\n");

    // Write the CSV content to a file
    fs.writeFileSync("data.csv", csvContent);

    console.log("CSV file has been generated successfully.");
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

module.exports = handleFetch;
