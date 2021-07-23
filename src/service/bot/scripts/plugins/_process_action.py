from datetime import datetime
from pathlib import Path
import subprocess
import time
import sys
import os


class Action:

    PRC_CHAT = None
    RES = None
    CON = None
    SCB = None
    PAG = None

    currentScope = None
    clean = False


    def __init__(self, RES, CON, SCB, PRC_CHAT, PAG):
        self.RES = RES
        self.CON = CON
        self.SCB = SCB
        self.PAG = PAG
        self.PRC_CHAT = PRC_CHAT


    def getPlayerList(self):
        playerList = {}
        pList = self.PRC_CHAT.send("#ListPlayers", read=True)
        pList = pList.split('\n')
        pList.pop(0)
        for el in pList:
            elProps = el.split('            ')
            pProps = []
            for prop in elProps:
                prop.strip()
                if(len(prop) >= 1):
                    pProps.append(prop)
            uid = pProps[0][3:].strip()
            playerList[uid] = {
                'userID': uid,
                'steamName': pProps[1].strip(),
                'charName': pProps[2].strip(),
                'fame': pProps[3].strip()
            }
        return playerList

    def reloadBot(self):
        scriptPath =  os.path.dirname(os.path.abspath(__file__)) + r'\reload.bat'
        p = subprocess.Popen([scriptPath])
        return True

    def mapShot(self, props):
        now = datetime.now()
        folderName = now.strftime('%Y_%m_%d')
        fileName = now.strftime('%Y_%m_%d.%H_%M_%S')+'.png'
        fullPath = props['path']+folderName+'/'+fileName
        Path(props['path']+folderName).mkdir(parents=True, exist_ok=True)
        self.PAG.press('esc')
        self.PAG.screenshot(fullPath, region=self.CON.getRegion('map'))
        time.sleep(0.05)
        self.PAG.press('t')
        self.CON.openAll()
        self.RES.add({'fileName': fileName, 'fullPath': fullPath})

    def playerReport(self):
        playerInfo = {}
        playerList = self.getPlayerList()
        for player in playerList:
            p = self.PRC_CHAT.send('#Location '+playerList[player]['userID'], read=True)
            playerLoc = (p[(p.find(':')+1):]).strip().split()
            playerInfo[player] = {
                'steamID': player,
                'charName': playerList[player]['charName'],
                'steamName': playerList[player]['steamName'],
                'fame': playerList[player]['fame'],
                'location': {
                    'x': playerLoc[0][2:],
                    'y': playerLoc[1][2:],
                    'z': playerLoc[2][2:]
                }
            }

        self.RES.add({'playerInfo': playerInfo})


    def transfer(self, props):
        try:
            self.PRC_CHAT.goScope('global')
            self.PRC_CHAT.send(props['messages']['started'])
            playerList = self.getPlayerList()

            recipient = False
            sender = playerList[props['from']]

            for el in playerList:
                if(props['to'].lower() in playerList[el]['charName'].lower()):
                    recipient = playerList[el]
                    break

            if(not recipient):
                self.PRC_CHAT.send(props['messages']['notFound'])
                return False

            if(int(sender['fame']) < int(props['amount'])):
                self.PRC_CHAT.send(props['messages']['notEnough'])
                return False

            withdraw = '#SetFamePoints ' + str(int(sender['fame']) - int(props['amount'])) + ' ' + props['from']
            deposit = '#SetFamePoints ' + str(int(recipient['fame']) + int(props['amount'])) + ' ' + recipient['userID']

            self.RES.add({
                "transactionInfo": {
                    "senderBefore": str(int(sender['fame'])),
                    "recipientBefore": str(int(recipient['fame'])),
                    "withdraw": withdraw,
                    "deposit": deposit
                }
            })

            self.PRC_CHAT.send(withdraw)
            self.PRC_CHAT.send(deposit)
            self.PRC_CHAT.send(props['messages']['success'])

        except Exception as e:
            exception_type, exception_object, exception_traceback = sys.exc_info()
            self.PRC_CHAT.send(props['messages']['somethingWrong'])
            self.RES.addError(str(e), str(exception_type))
            self.RES.send()


    def travel(self, props):
        try:
            self.PRC_CHAT.goScope('global')
            self.PRC_CHAT.send(props['messages']['start'])
            playerList = self.getPlayerList()
            user = playerList[props['steamID']]
            self.RES.add({'userInfo': user})
    
            if(not user):
                self.PRC_CHAT.send(props['messages']['somethingWrong'])
                return False

            if(int(user['fame']) < int(props['costs'])):
                self.PRC_CHAT.send(props['messages']['notEnough'])
                return False

            p = self.PRC_CHAT.send('#Location '+props['steamID'], read=True)
            playerLoc = (p[(p.find(':')+1):]).strip().split()
            nearStation = False
            for station in props['stations']:
                if(float(playerLoc[0][2:]) > (station[0] - station[2]) and float(playerLoc[0][2:]) < (station[0] + station[2])):
                    if(float(playerLoc[1][2:]) > (station[1] - station[3]) and float(playerLoc[1][2:]) < (station[1] + station[3])):
                        nearStation = True
            
            if(nearStation):
                self.PRC_CHAT.send('#SetFamePoints ' + str(int(user['fame']) - int(props['costs'])) + ' ' + props['steamID'])
                self.PRC_CHAT.send(props['target'])
            else:
                self.PRC_CHAT.send(props['messages']['noStation'])
                return False
            return True

        except Exception as e:
            exception_type, exception_object, exception_traceback = sys.exc_info()
            self.PRC_CHAT.send(props['messages']['somethingWrong'])
            self.RES.addError(str(e), str(exception_type))
            self.RES.send()  


    def spawn(self, command):
        i = 0
        resp = self.PRC_CHAT.send(command, read=True)
        while(not resp.lower().startswith('spawned') and i < 20):
            i = i + 1
            time.sleep(0.05)
            resp = self.PRC_CHAT.read()
        if(resp.lower().startswith('spawned')):
            return True
        return False


    def sale(self, props):
        try:
            self.PRC_CHAT.goScope('local')
            self.PRC_CHAT.send(props['messages']['startSale'])
            p = self.PRC_CHAT.send('#Location '+props['userID'], read=True)
            playerLoc = (p[(p.find(': ')+1):]).strip().split()
            nearShop = False
            if(float(playerLoc[0][2:]) > (props['shop'][0] - props['shop'][2]) and float(playerLoc[0][2:]) < (props['shop'][0] + props['shop'][2])):
                if(float(playerLoc[1][2:]) > (props['shop'][1] - props['shop'][3]) and float(playerLoc[1][2:]) < (props['shop'][1] + props['shop'][3])):
                    nearShop = True

            if(not nearShop):
                self.PRC_CHAT.goScope('global')
                self.PRC_CHAT.send(props['messages']['notNearShop'])
                return

            playerList = self.getPlayerList()
            player = playerList[props['userID']]
            
            if(int(player['fame']) < int(props['item']['price_fame'])):
                self.PRC_CHAT.goScope('local')
                self.PRC_CHAT.send(props['messages']['notEnoughMoney'])
                return

            famePointSetter = '#SetFamePoints '+ str(int(player['fame']) - int(props['item']['price_fame'])) + ' ' + props['userID']
            itemSpawner = props['item']['spawn_command']

            self.PRC_CHAT.goScope('local')
            self.PRC_CHAT.send(props['teleport'])
            self.PRC_CHAT.send(props['teleportUser'])
            self.PRC_CHAT.send(famePointSetter)
            self.PRC_CHAT.send(props['messages']['pleaseWait'])
            while(not self.spawn(itemSpawner) and i < 10):
                self.PRC_CHAT.send(props['messages']['pleaseWait'])
                time.sleep(2)
                i = i + 1
            self.PRC_CHAT.send(props['messages']['endSale'])

        except Exception as e:
            exception_type, exception_object, exception_traceback = sys.exc_info()
            self.PRC_CHAT.send(props['messages']['somethingWrong'])
            self.RES.addError(str(e), str(exception_type))
            self.RES.send()
            
        