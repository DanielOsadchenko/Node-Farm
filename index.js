const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
////////////////////////////////
//Filesystem
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const TextOut = `This is what we know about the avocalo: ${textIn}.\nCreted at: ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", TextOut, "utf-8");
// console.log("File written");

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.error(err);
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         return err ? console.error(err) : console.log("File written");
//       });
//     });
//   });
// });
// console.log("Will read from file");
////////////////////////////////
//SERVER

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW
  if (pathname === "/" || pathname === "/overview") {
    const cardsHtml = productData
      .map((product) => replaceTemplate(templateCard, product))
      .join("");
    const output = templateOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(output);
  }
  //PRODUCTS
  else if (pathname === "/product") {
    const product = productData[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(output);
  }
  //API
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  }
  //NOT FOUND
  else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>404! Page not found:(</h1>");
  }
});
server.listen(3000, "127.0.0.1", () => {
  console.log("Server is running on port 3000");
});
