//this will be the node app that will send info
import express from "express";
import fetch from "node-fetch"; //send and receive http requests
import querystring from "querystring"; //format url

import {getEbayToken} from "./acquireToken.js"
import {checkForNewListings} from "./searchEbay.js"
import {sendDiscordNotification} from "./discordNotification.js"


import dotenv from "dotenv"; //get env variables 
dotenv.config();


export const SEARCH_TERM = "pokemon";
const CHECK_INTERVAL_MINUTES = .288;

(async () => {

    console.log(`Starting...`);

    const token = await getEbayToken();
    console.log("Successfully aquired ebay token!")
    console.log(token);

    //first search 
    //newOnes is json of returned item of only new items
    //establishes only newest go in set to print
    let newOnes = await checkForNewListings(token);
    sendDiscordNotification(newOnes);



    //run every set amount of time
    setInterval(async () => {
    newOnes = await checkForNewListings(token);
    sendDiscordNotification(newOnes);

  }, CHECK_INTERVAL_MINUTES * 60 * 1000);

})();