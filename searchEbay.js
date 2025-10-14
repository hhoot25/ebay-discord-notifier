
import {SEARCH_TERM} from "./main.js";


const EBAY_SEARCH_URL = "https://api.ebay.com/buy/browse/v1/item_summary/search";

//keep track of already-seen item IDs
const seenItems = new Set();


//return json of all items found
async function searchEbayItems(token, query) {
   
  //creates ebay query with token access
  const url = `${EBAY_SEARCH_URL}?q=${encodeURIComponent(query)}&limit=5&sort=newlyListed`;


  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  const data = await res.json();
  return data.itemSummaries || [];
}



//main runs this one
//returns
export async function checkForNewListings(token) {
    try {
        const items = await searchEbayItems(token, SEARCH_TERM);

        const newOnes = items.filter(item => !seenItems.has(item.itemId));

        if (newOnes.length > 0) {
            //mark all new items as seen immediately
            newOnes.forEach(item => seenItems.add(item.itemId));
            
            //log locally and send the Discord notification
            console.log(`\n Found ${newOnes.length} new listing(s) for "${SEARCH_TERM}". Sending to discord module`);
            return newOnes;

        } else {
            //updated log message to reflect your timezone preference
            console.log(`\n No new listings found for "${SEARCH_TERM}" at ${new Date().toLocaleTimeString('en-US', { timeZone: 'America/Chicago' })}`);
            return [];
        }
    } catch (err) {
        console.error(" Error during listing check:", err.message);
    }
}