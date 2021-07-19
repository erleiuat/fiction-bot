require('../plugins/globalLog')
const bot = require('./gamebot')

function timer(seconds) {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000)
    })
}

async function testIt() {
    console.time('startBot')
    resp = await bot.start()
    if (resp.status == 'error') {
        global.log.debug('Gambot status in error!')
        if (resp.data) global.log.debug('Status checked. Chat = ' + resp.data.chat + ', Inventory = ' + resp.data.inventory)
        return false
    }
    console.timeEnd('startBot')
    global.log.debug(JSON.stringify(resp))
    resp = await bot.messages([
        {
            scope: 'local',
            message: '#listanimals'
        }
    ])

    await timer(5)

    console.time('sendMsgs')
    let msgs = []
    for (let index = 0; index < 20; index++) {
        msgs.push({
            scope: 'local',
            message: index + 1
        })
    }
    resp = await bot.messages(msgs)
    global.log.debug(JSON.stringify(resp))
    console.timeEnd('sendMsgs')

    return

    resp = await bot.messages([
        {
            scope: 'local',
            message: '#Teleport -111482.9523 -66490.3773 0'
        },
        {
            scope: 'global',
            message: '2'
        },
        {
            scope: 'local',
            message: '3'
        }
    ])
    global.log.debug(resp)

    resp = await bot.messages([
        {
            scope: 'local',
            message: '#Teleport -118302 -67347 38549'
        }
    ])
    global.log.debug(resp)

    resp = await bot.actions([
        {
            type: 'mapshot',
            properties: null
        }
    ])
    global.log.debug(resp)

    /*
    resp = await bot.actions([
        {
            type: 'light',
            properties: [
                //'#Teleport -112656 -71595 37542', //Turm 1.1
                //'#Teleport -111670 -71516 37535', //Turm 1.2
                '#Teleport -112387 -71937 36626', //Einfahrt 1.1
                '#Teleport -111760 -71896 36634', //Einfahrt 1.2
                '#Teleport -112427 -71106 36729', //Einfahrt 1.3
                '#Teleport -111833 -71113 36741', //Einfahrt 1.4
                '#Teleport -111795 -68849 36999', //Tanke 1
                '#Teleport -111646 -67682 36999', //Tanke 2
                '#Teleport -111520 -66718 36999', //Tanke 3
                '#Teleport -112476 -66705 36997', //Tanke 4
                '#Teleport -113510 -66588 36997', //Tanke 5
                '#Teleport -113655 -67707 36997', //Tanke 6
                '#Teleport -112593 -67862 36997', //Tanke 7
                '#Teleport -110138 -66370 37031', //Tanke 8
                //'#Teleport -112095 -63900 38061', //Turm 2.1
                //'#Teleport -111026 -64267 38056', //Turm 2.2
                '#Teleport -111708 -63749 37264', //Einfahrt 2.1
                '#Teleport -111199 -63872 37276', //Einfahrt 2.2
                '#Teleport -111898 -64515 37156', //Einfahrt 2.3
                '#Teleport -111306 -64654 37146', //Einfahrt 2.4
                '#Teleport -116818 -65894 37065', //Haus 1
                '#Teleport -117260 -66462 37065', //Haus 2
                '#Teleport -117259 -67017 37065', //Haus 3
                '#Teleport -116793 -66869 37065', //Haus 4
                '#Teleport -116077 -65691 37065', //VorHaus 1
                '#Teleport -116077 -66253 37065', //VorHaus 2
                '#Teleport -116077 -66665 37065', //VorHaus 3
                '#Teleport -116077 -67096 37065', //VorHaus 4
                '#Teleport -116658 -63151 37273', //Aussen 1
                '#Teleport -118116 -69254 36806', //Aussen 2
                '#Teleport -115002 -69334 36825', //Aussen 3
                '#Teleport -113327 -70297 36840', //Aussen 4
                '#Teleport -118151 -65352 37089', //Aussen 5
                '#Teleport -114378 -63300 37302' //Aussen 6
            ]
        }
    ])
    global.log.debug(JSON.stringify(resp))

    
    console.time('sendMsg')
    resp = await bot.messages([
        {
            scope: 'local',
            message: '1'
        }
    ])
    console.timeEnd('sendMsg')
    global.log.debug(JSON.stringify(resp))

    await timer(3)

    console.time('sendMsg')
    resp = await bot.messages([
        {
            scope: 'local',
            message: '2'
        }
    ])
    console.timeEnd('sendMsg')
    global.log.debug(JSON.stringify(resp))

    await timer(2)

    console.time('sendMsg')
    resp = await bot.messages([
        {
            scope: 'local',
            message: '3'
        }
    ])
    console.timeEnd('sendMsg')
    global.log.debug(JSON.stringify(resp))

    
    resp = await bot.actions([{
        type: 'travel',
        properties: {
            steamID: '76561198058320009',
            target: '#Teleport -669327 387796 72675',
            costs: 10,
            stations: [
                [-669327, 387796, 500, 500],
                [-111659, -61028, 500, 500],
                [-829491, -837658, 500, 500],
                [101034, -492350, 500, 500],
                [430079, 477843, 500, 500]
            ],
            message: {
                notEnough: ':[Travel]: ・ @Test: You need to have 10 famepoints for this trip.',
                noStation: ':[Travel]: ・ @Test: You aren\'t near any Fasttravel station.',
                good: ':[Travel]: ・ @Test: Your trip will start shortly. It will cost you 10 famepoints.',
                smthWrong: ':[Travel]: ・ @Test: Something went wrong. Please try again.'
            }
        }
    }])
    */

    /*
    resp = await bot.messages([{
        scope: 'local',
        message: '・'
    },{
        scope: 'local',
        message: ' ・ '
    },{
        scope: 'local',
        message: 'ä'
    },{
        scope: 'local',
        message: 'ü'
    },{
        scope: 'local',
        message: 'ö'
    },{
        scope: 'local',
        message: 'Test'
    },{
        scope: 'local',
        message: '1'
    },{
        scope: 'local',
        message: '2'
    },{
        scope: 'local',
        message: '3'
    },{
        scope: 'local',
        message: '3'
    },{
        scope: 'local',
        message: '2'
    },{
        scope: 'local',
        message: '1'
    }])
    
    global.log.debug(resp)
    /*
    
    resp = await bot.actions([{
        type: 'dress',
        properties: null
    }])
    global.log.debug(resp)
    
    
    resp = await bot.actions([{
        type: 'light',
        properties: [
            "#Teleport -112656 -71595 37542", //Turm 1.1        
            "#Teleport -111670 -71516 37535", //Turm 1.2        
            "#Teleport -112387 -71937 36626", //Einfahrt 1.1    
            "#Teleport -111760 -71896 36634", //Einfahrt 1.2    
            "#Teleport -112427 -71106 36729", //Einfahrt 1.3    
            "#Teleport -111833 -71113 36741", //Einfahrt 1.4
            "#Teleport -112095 -63900 38061", //Turm 2.1
            "#Teleport -111026 -64267 38056", //Turm 2.2
            "#Teleport -111708 -63749 37264", //Einfahrt 2.1
            "#Teleport -111199 -63872 37276", //Einfahrt 2.2
            "#Teleport -111898 -64515 37156", //Einfahrt 2.3
            "#Teleport -111306 -64654 37146", //Einfahrt 2.4
            "#Teleport -111795 -68849 36999", //Tanke 1
            "#Teleport -111646 -67682 36999", //Tanke 2
            "#Teleport -111520 -66718 36999", //Tanke 3
            "#Teleport -112476 -66705 36997", //Tanke 4
            "#Teleport -113510 -66588 36997", //Tanke 5
            "#Teleport -113655 -67707 36997", //Tanke 6
            "#Teleport -112593 -67862 36997", //Tanke 7
            "#Teleport -110138 -66370 37031", //Tanke 8
            "#Teleport -116818 -65894 37065", //Haus 1
            "#Teleport -117260 -66462 37065", //Haus 2
            "#Teleport -117259 -67017 37065", //Haus 3
            "#Teleport -116793 -66869 37065", //Haus 4
            "#Teleport -116077 -65691 37065", //VorHaus 1
            "#Teleport -116077 -66253 37065", //VorHaus 2
            "#Teleport -116077 -66665 37065", //VorHaus 3
            "#Teleport -116077 -67096 37065", //VorHaus 4
            "#Teleport -116658 -63151 37273", //Aussen 1
            "#Teleport -118116 -69254 36806", //Aussen 2
            "#Teleport -115002 -69334 36825", //Aussen 3
            "#Teleport -113327 -70297 36840", //Aussen 4
            "#Teleport -118151 -65352 37089", //Aussen 5
            "#Teleport -114378 -63300 37302" //Aussen 6
        ]
    }])
    */
    /*
    
    resp = await bot.messages([{
        scope: 'local',
        message: '1'
    },{
        scope: 'local',
        message: '2'
    },{
        scope: 'local',
        message: '3'
    },{
        scope: 'local',
        message: '3'
    },{
        scope: 'local',
        message: '2'
    },{
        scope: 'local',
        message: '1'
    }])
    
    global.log.debug(resp)
    
    resp = await bot.actions([{
        type: 'awake',
        properties: null
    }])

    global.log.debug(resp)
    global.log.debug('Status checked. Chat = ' + resp.data.chat + ', Inventory = ' + resp.data.inventory)
    
    resp = await bot.actions([{
        type: 'dress',
        properties: null
    }])

    global.log.debug(resp)
    */
}

testIt()
