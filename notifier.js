//this will be the node app that will send info
import express from "express";
import fetch from "node-fetch"; //send and receive http requests
import querystring from "querystring"; //format url

import {getEbayToken} from "./acquireToken.js"
import {checkForNewListings} from "./searchEbay.js"

import dotenv from "dotenv"; //get env variables 
dotenv.config();


export const SEARCH_TERM = "greninja_gold_star_sealed";
const CHECK_INTERVAL_MINUTES = .288;

(async () => {

    console.log(`Starting...`);

    const token = await getEbayToken();
    console.log("Successfully aquired ebay token!")
    console.log(token);

    //first search 
    await checkForNewListings(token);




    //run every set amount of time
    setInterval(async () => {
    await checkForNewListings(token);
  }, CHECK_INTERVAL_MINUTES * 60 * 1000);

})();