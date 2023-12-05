# Fiction-bot

## THIS BOT IS PROBABLY EXTREMELY OUTDATED

It was used years ago and has not been updated since (because the Scum-Devs made too many unnecessairy but breaking patches, which was a way too big pain in the ass to keep up with).

## How to

You can either only use the Discord functionalities by starting the Script with the params "-discord" or install the whole thing on a exclusive computer running scum as your ingame-bot.

The code is kinda clean organized but there's basically no documentation. So a little bit of coding knowledge will be neccessairy.

Everything needed is stored into JSON files, so there's no need to have a database or anything. This doesn't harm the performance of the Bot tho, since everything is being loaded into your RAM on start. So the Bot can access everything he needs right away without the need of querys or smth like that. If you have many players and a lot of activity on your server, the Bot will require about 200MB of RAM.

### The main "modules" can be found under src/module:

- "actionHandler" is a simple Interface which redirects all kinds of happenings to the right controller/module.
- "dcHandler" will take care of everything coming from your Discord-Server (Inputs) like console-commands or other instructions you can use to control the bot remotely.
- "dcWriter" will do all the writing in your Discord-Server like the Ingame-Chat, No-Admin-Abuse and Kill-Log.
- "gamebot" is all about the stuff happening ingame like the shop, lottery, mapshots and tons of other features. There are so many that I kinda forgot about most of them myself lol.
- "logHandler" does the main "translation" from the PingPerfect logfiles into useable objects, which usually go right into the actionHandler to be forwarded to the correct controller.
- "statistics" make use of your server's state to build the ranking which will later be displayed in Discord. It's also responsible for giving your players their rank according to their total playtime on your server.

### The used Services can be found under src/services:

- "bot" contains all the Python-Scripts which will run your ingame-bot.
- "mapLocation" is a simple service turning coordinates into images with markers.
- "mineManager" will take track of all the mines being placed on the map. Over Discord you can then see if someone places a mine somewhere they shouldn't. (Is currently disabled everywhere in code since it caused errors when only using the discord-functions)
- "userManager" will track every little information about your players. Every single message they send and kill they make will be processed and later on saved into a JSON file by this service.

### I don't have a clue how this thing rly works anymore

Feel free to use this code for your own server
