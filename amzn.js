import got from 'got';
import HTMLParser from 'node-html-parser';

import { Webhook, MessageBuilder } from 'discord-webhook-node';



//https://www.amazon.com/HP-Micro-edge-Microsoft-14-dq0040nr-Snowflake/dp/B0947BJ67M/, https://www.amazon.com/Canon-18-55mm-3-5-5-6-Viewfinder-Impressive/dp/B0CDQZ4WJ6/;

const hook = new Webhook("https://discordapp.com/api/webhooks/1199504147544813679/Yd-l79H_Hbcjrq_obUlDU3FWFnDIhmFplkTCc5oJ3sv1UarQw-eM5zYgtYO8L9mxJaig");
 
const embed = new MessageBuilder()
.setTitle('Amazon Monitor')
.setColor('#90EE90')
.setTimestamp()

async function Monitor(productLink){
    var myheaders = {
        'connection': 'keep-alive',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Upgrade-Insecure-Requests': 1,
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-User': '?1',
        'Sec-Fetch-Dest': 'document',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Rtt': 50,
        'Ect': '4g',
        'Downlink': 10
    }

    const response = await got(productLink, {
        headers: myheaders
    });
   

    if (response && response.statusCode == 200){
        let root = HTMLParser.parse(response.body);
        let avalabiltiyDiv = root.querySelector('#availability');
        if(avalabiltiyDiv){
            let productImageURL = root.querySelector('#landingImage').getAttribute('src');
            let productName = productLink.substring(productLink.indexOf('com/') + 4, productLink.indexOf('/dp'));
            let stockTest = avalabiltiyDiv.childNodes[1].innerText.toLowerCase();
            if(stockTest == 'out of stock'){
                console.log(productName + 'OUT OF STOCK');
            }else{
                embed.setThumbnail(productImageURL);
                embed.addField(productName, productLink, true);
                embed.addField('Availability', 'IN STOCK', false);
                hook.send(embed);
                console.log(productName + 'IN STOCK');
            }
        }
    }
    await new Promise(r => setTimeout(r,8000));
    Monitor(productLink);
    return false;
    
}

async function Run(){
    const promptModule = await import('prompt-sync');
    const prompt = promptModule.default();
    var productLinks = prompt("Enter links to monitor (seperate by comma): ");
    var productLinksArr = productLinks.split(',');

    for(var i=0; i< productLinksArr.length; i++){
        productLinksArr[i] = productLinksArr[i].trim();
    }

    var monitors = []

    productLinksArr.forEach(link => {
        var p = new Promise((resolve, reject) => {
            resolve(Monitor(link));
        }).catch(err => console.log(err));

        monitors.push(p);
    });

    console.log('Now monitoring ' + productLinksArr.length + ' items');
    await Promise.allSettled(monitors);
}

Run();