const Imap = require("imap");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openInbox = (imap, cb) => {
  imap.openBox("INBOX", false, cb);
};

app.post("/emails", (req, res) => {
  const { email, password } = req.body;

  const imapConfig = {
    user: email,
    password: password,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false,
    },
  };

  const imap = new Imap(imapConfig);

  imap.once("ready", () => {
    openInbox(imap, (err, box) => {
      if (err) {
        console.error("Error opening inbox:", err);
        res.status(500).send("Error opening inbox");
        return;
      }
      res.json({ total: box.messages.total });
      imap.end();
    });
  });

  imap.once("error", (err) => {
    console.error("IMAP error:", err);
    if (!res.headersSent) {
      res.status(500).send("IMAP error: " + err.message);
    }
  });

  imap.once("end", () => {
    console.log("IMAP connection ended");
  });

  imap.connect();
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, async () => {
  console.log("Server is running on port 3000");

  // const url = await ngrok.connect(3000);
  // console.log(`Ngrok tunnel created at: ${url}`);
});

// const Imap = require("imap");
// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const openInbox = (imap, cb) => {
//   imap.openBox("INBOX", false, cb);
// };

// app.post("/emails", (req, res) => {
//   const { email, password } = req.body;

//   const imapConfig = {
//     user: email,
//     password: password,
//     host: "imap.gmail.com",
//     port: 993,
//     tls: true,
//     tlsOptions: {
//       rejectUnauthorized: false,
//     },
//   };

//   const imap = new Imap(imapConfig);

//   imap.once("ready", () => {
//     openInbox(imap, (err, box) => {
//       if (err) {
//         console.error("Error opening inbox:", err);
//         res.status(500).send("Error opening inbox");
//         return;
//       }
//       res.json({ total: box.messages.total });
//       imap.end();
//     });
//   });

//   imap.once("error", (err) => {
//     console.error("IMAP error:", err);
//     if (!res.headersSent) {
//       res.status(500).send("IMAP error: " + err.message);
//     }
//   });

//   imap.once("end", () => {
//     console.log("IMAP connection ended");
//   });

//   imap.connect();
// });

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

//
// const PORT = 3000;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server is running on port ${PORT}`);
// });
