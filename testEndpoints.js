const http = require("http");

async function runTests() {
  const req = (options, postData) => {
    return new Promise((resolve, reject) => {
      const clientReq = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({ status: res.statusCode, body: data });
        });
      });
      clientReq.on("error", reject);
      if (postData) {
        clientReq.write(postData);
      }
      clientReq.end();
    });
  };

  try {
    console.log("--- 1. Testing GET /books/ ---");
    let res = await req({ hostname: "localhost", port: 3000, path: "/books/", method: "GET" });
    console.log("Status:", res.status);
    console.log("Body:", JSON.parse(res.body));

    console.log("\n--- 2. Testing GET /books/1/ ---");
    res = await req({ hostname: "localhost", port: 3000, path: "/books/1/", method: "GET" });
    console.log("Status:", res.status);
    console.log("Body:", JSON.parse(res.body));

    console.log("\n--- 3. Testing POST /books/ ---");
    const newBook = JSON.stringify({
      title: "Java Programming",
      author: "Herbert Schildt",
      price: 500,
      pages: 400,
    });
    res = await req(
      {
        hostname: "localhost",
        port: 3000,
        path: "/books/",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      newBook
    );
    console.log("Status:", res.status);
    console.log("Body:", JSON.parse(res.body));

    console.log("\n--- 4. Testing PUT /books/1/ ---");
    const updatedBook = JSON.stringify({
      title: "Atomic Habits Updated",
      author: "James Clear",
      price: 550,
      pages: 320,
    });
    res = await req(
      {
        hostname: "localhost",
        port: 3000,
        path: "/books/1/",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      },
      updatedBook
    );
    console.log("Status:", res.status);
    console.log("Body:", res.body);

    console.log("\n--- 5. Testing DELETE /books/8/ ---");
    res = await req({ hostname: "localhost", port: 3000, path: "/books/8/", method: "DELETE" });
    console.log("Status:", res.status);
    console.log("Body:", res.body);

    console.log("\n--- Final GET /books/ to verify DB state ---");
    res = await req({ hostname: "localhost", port: 3000, path: "/books/", method: "GET" });
    console.log("Status:", res.status);
    console.table(JSON.parse(res.body));
  } catch (err) {
    console.error("Test failed:", err);
  }
}

runTests();
