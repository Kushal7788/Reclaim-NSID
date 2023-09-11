var express = require("express");
var router = express.Router();
var { Check } = require("../models/Check");
const { NSID } = require("../models/NSID");
const { reclaimprotocol } = require("@reclaimprotocol/reclaim-sdk");
const reclaim = new reclaimprotocol.Reclaim();
const allProviderParams = require("./utils.json")

router.get("/", (request, response) => {
  response.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get("/check/:nsId", async (req, res) => {
  try {
    const nsId = req.params.nsId;
    const nsIdConfig = await NSID.findOne({ nsId: nsId });
    if (!nsIdConfig) {
      return res.status(401).json({ message: "Invalid NS Id, please check." });
    }
    res.status(200).json({ message: "NS Id is valid." });
  } catch (err) {
    console.log(err);
  }
});

router.get("/fetch/:nsId", async (req, res) => {
  try {
    const nsId = req.params.nsId;
    const nsIdConfig = await NSID.findOne({ nsId: nsId });
    if (!nsIdConfig) {
      return res.status(401).json({ message: "Invalid NS Id, please check." });
    }
    res.status(200).json({ data: nsIdConfig.data });
  } catch (err) {
    console.log(err);
  }
});

router.get("/create/:nsId", async (req, res) => {
  try {
    const nsId = req.params.nsId;
    const nsIdConfig = await NSID.findOne({ nsId: nsId });
    if (nsIdConfig) {
      return res.status(401).json({ message: "Given Network State Id already exists." });
    }
    const newNsIdConfig = await new NSID();
    newNsIdConfig.nsId = nsId;
    await newNsIdConfig.save();
    res.status(200).json({ message: "Network State Id has been created." });
  } catch (err) {
    console.log(err);
  }
});

// Request Reclaim URL for a proof request

const createObj = async () => {
  try {
    const check = new Check();
    check.data = {};
    await check.save();
    return check.checkId;
  } catch (err) {
    console.log(`err: ${err}`);
  }
};

router.post("/reclaim-url", async (req, res) => {
  try {
    const providers = req.body.provider;
    const nsId = req.body.nsId;
    const nsIdConfig = await NSID.findOne({ nsId: nsId });
    if (!nsIdConfig) {
      return res.status(401).json({ message: "Invalid Network State Id, please check." });
    }
    const checkId = await createObj();
    const check = await Check.findOne({ checkId: checkId });
    check.data = { nsId: nsId, providerValue: req.body.provider };
    await check.save();
    var requestedProofsArr = [];
    for (let provider of providers) {
      requestedProofsArr.push(
        new reclaim.CustomProvider({
          provider: provider?.value,
          payload: {},
        }));
    }
    const request = reclaim.requestProofs({
      title: "Reclaim Protocol",
      baseCallbackUrl: process.env.BASE_URL + "/update/proof",
      callbackId: checkId,
      requestedProofs: requestedProofsArr,
    });
    const reclaimUrl = await request.getReclaimUrl();
    if (!reclaimUrl) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(201).json({ url: reclaimUrl, checkId: checkId });
    return reclaimUrl;
  } catch (err) {
    console.log(`error in getReclaimUrl: ${err}`);
  }
});

// Handle callback from Reclaim Proofs

router.post("/update/proof", async (req, res) => {
  try {
    const check = await Check.findOne({ checkId: req.query.id });
    if (!check) return res.status(401).send("<h1>Unable to update Proof</h1>");
    check.data = {
      ...check.data,
      proofs: JSON.parse(Object.keys(req.body)[0]).proofs,
    };
    await check.save();
    const nsId = await NSID.findOne({ nsId: check.data.nsId });
    // console.log('Check data is ', check.data);
    // console.log('Check proofs is ', check.data.proofs);
    if (!nsId) return res.status(401).send("<h1>Unable to update Proof</h1>");
    nsId.data = {
      proofs: check.data.proofs,
    };
    await nsId.save();
    const url = process.env.CLIENT_URL + "/view/" + check.data.nsId;
    const htmlPage = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Network State ID</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <div class="container">
        <header class="bg-light border mb-3 p-3">
            <div class="container d-flex justify-content-between align-items-center">
                <a class="d-flex align-items-center text-decoration-none" href="#">
                    <img src="https://assets.website-files.com/63f580596efa74629ceecdf5/646cd0d4bff811689094709c_Reclaim-Logo-Asterisk.jpg"
                        alt="Logo" class="rounded-circle" width="50" height="50">
                    <span class="ml-3 font-weight-bold text-xl">Network State ID</span>
                </a>
                <a href="https://www.reclaimprotocol.org/">
                    <button class="btn btn-light">
                        🔗 Reclaim Protocol
                    </button>
                </a>
            </div>
        </header>

        <section class="text-gray-600 body-font">
            <div class="container px-5 py-24 mx-auto">

                <!-- Credentials of NS.ID -->
                <div class="flex flex-col text-center w-full mb-12">
                    <h3 class="text-2xl font-medium title-font mb-4 text-gray-900">
                        Profile of ${check.data.nsId} is ready!
                    </h3>
                </div>

                <!-- Proof data -->
                <div class="flex flex-col text-center w-full mb-12">
                    <div class="flex justify-center">
                        <button onclick="copyToClipboard('${url}')"
                            class="btn btn-primary inline-flex text-white bg-purple-500 border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded text-lg">
                            Copy Profile link
                        </button>
                    </div>

                </div>
            </div>
        </section>
    </div>

    <!-- Add Bootstrap JS and Popper.js (required for Bootstrap) -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.3/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script>
        function copyToClipboard(link) {
            // Create a temporary input element
            const tempInput = document.createElement('input');

            // Set the input's value to the link you want to copy
            tempInput.value = link;

            // Append the input element to the document
            document.body.appendChild(tempInput);

            // Select the input's text
            tempInput.select();

            // Copy the selected text to the clipboard
            document.execCommand('copy');

            // Remove the temporary input element
            document.body.removeChild(tempInput);

            // Optionally, you can provide some user feedback
            alert('Link copied to clipboard: ' + link);
        }
    </script>

    <!-- JavaScript function to toggle card collapse -->
    <script>
        function toggleCollapse(index) {
            const card = document.querySelectorAll('.card')[index];
            card.querySelector('.collapse').classList.toggle('show');
        }
    </script>

</html>
    `
    res.status(201).send(htmlPage);
  } catch (err) {
    console.log(err);
  }
});

// Polling API to check if the member has been verified or not

router.get("/fetch-check/:checkId", async (req, res) => {
  const check = await Check.findOne({ checkId: req.params.checkId });
  if (!check)
    return res.status(401).json({ message: "Invalid URL, please check." });
  res.status(200).json({
    data: check.data,
  });
});

module.exports = router;