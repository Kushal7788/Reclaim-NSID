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
    res.status(201).send("<h1>Proofs has been shared with the Requestor. \n You can exit the screen</h1>");
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