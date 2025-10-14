import {SEARCH_TERM} from './main.js';

import dotenv from "dotenv"; //get env variables 
dotenv.config();



const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const DISCORD_USER_ID = process.env.DISCORD_USER_ID;





export async function sendDiscordNotification(newItems) {
    if (newItems.length === 0) return;
    
    //discord message template: one embed per new item
    const embeds = newItems.map(item => {
        //correct time zone conversion (e.g., to Dallas time)
        const localDate = new Date(item.itemCreationDate);
        const postedTime = localDate.toLocaleString('en-US', { 
            timeZone: 'America/Chicago', 
            timeZoneName: 'short',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return {
            title: item.title,
            url: item.itemWebUrl,
            description: `💰 **Price:** ${item.price?.value} ${item.price?.currency}`,
            color: 3447003, // A standard blue color (decimal value)
            fields: [
                {
                    name: "Posted",
                    value: postedTime,
                    inline: true
                }
            ],
            // Use the first image for the embed thumbnail
            thumbnail: {
                url: item.image?.imageUrl || "" 
            }
        };
    });

    const payload = {
        // General text alert, can mention a role with <@&ROLE_ID> if needed
        content: ` **${newItems.length} New Listing(s) Found for "${SEARCH_TERM}"!** <@${DISCORD_USER_ID}>`,
        embeds: embeds.slice(0, 10) // Discord limits one message to 10 embeds
    };

    try {
        const res = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            console.log(`\n📢 Successfully sent ${newItems.length} notification(s) to Discord.`);
        } else {
            console.error(`\n Failed to send Discord notification: ${res.status} ${res.statusText}`);
            const errorBody = await res.text();
            console.error("Discord response:", errorBody);
        }
    } catch (err) {
        console.error(" Network error sending to Discord:", err.message);
    }
}