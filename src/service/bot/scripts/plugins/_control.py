import webbrowser
import subprocess
import time


class Control:

    RES = None
    SCB = None
    FOC = None
    PAG = None

    def __init__(self, respond, scb, focus, pyautogui):
        self.RES = respond
        self.SCB = scb
        self.FOC = focus
        self.PAG = pyautogui
        self.FOC.doIt()
        time.sleep(0.05)


    path = './src/service/bot/scripts/'
    props = {
        'resolutionX': 1920,
        'resolutionY': 1080,
        'windowPosX': False,
        'windowPosY': False,
    }
    regions = {
        'window': (0, 0, 1920, 1080),
        'chatStumm': (35, 490, 65, 20),
        'chatScope': (515, 490, 60, 20),
        'mainDrone': (200, 70, 110, 90),
        'mainMenu': (155, 630, 160, 40),
        'menu': (820, 440, 250, 40),
        'mapi': (415, 655, 45, 30),
        'map': (420, 0, 1076, 1076)
    }


    def setWindow(self, windowPos):
        offsetY = windowPos['h'] - self.props['resolutionY']
        self.props['windowPosX'] = windowPos['x']
        self.props['windowPosY'] = windowPos['y'] + offsetY
        
        
    def getPoint(self, *point):
        pointX = point[0] + self.props['windowPosX'] - 2
        pointY = point[1] + self.props['windowPosY'] - 2
        if(pointX < 0):
            pointX = self.props['windowPosX']
        if(pointX > self.props['resolutionX']):
            pointX = self.props['resolutionX'] 
        if(pointY < 0):
            pointY = self.props['windowPosY']
        if(pointY > self.props['resolutionY']):
            pointY = self.props['resolutionY']
        return (pointX, pointY)


    def getRegion(self, region):
        reg = self.regions[region]
        x, y = self.getPoint(reg[0], reg[1])
        w = reg[2] + 4
        h = reg[3] + 4
        if((self.props['windowPosX'] + self.props['resolutionX']) < (x + w)):
            w = (self.props['windowPosX'] + self.props['resolutionX'])
        if((self.props['windowPosY'] + self.props['resolutionY']) < (y + h)):
            h = (self.props['windowPosY'] + self.props['resolutionY'])
        return (x, y, w, h)


    def onScreen(self, img, region=False, bw=True, sure=0.93):
        self.RES.printer('ONSCREEN: ' + str(img))
        #rName = region
        if(not region):
            region = self.getRegion('window')
        else:
            region = self.getRegion(region)
        #self.PAG.screenshot((rName + '_s.png'), region=region)
        return self.PAG.locateCenterOnScreen(
            self.path + img,
            grayscale=bw,
            confidence=sure,
            region=region
        )


    def restart(self):
        subprocess.call('shutdown /r /t 2')
        self.RES.printer('I WOULD RESTART NOW')


    def goDroneCheck(self):
        i = 0
        while(i < 20):
            inDrone = self.onScreen('img/main_drone.png')
            if(inDrone):
                return True
            time.sleep(0.001)
            i = i + 1
        return False


    def goDrone(self):
        self.FOC.doIt()
        i = 0
        self.PAG.keyDown('ctrl')
        self.PAG.press('d')
        self.PAG.keyUp('ctrl')
        time.sleep(0.01)
        inDrone = self.goDroneCheck()
        while(not inDrone):
            self.PAG.keyDown('ctrl')
            self.PAG.press('d')
            self.PAG.keyUp('ctrl')
            time.sleep(0.01)
            inDrone = self.goDroneCheck()
            i = i + 1
            if(i > 10):
                return False
        return True


    def onServer(self):
        self.FOC.doIt()
        i = 0
        while(not self.onScreen('img/menu_fortsetzen.png', region='menu')):
            self.PAG.press('esc')
            time.sleep(0.5)
            i = i + 1
            if(i > 5):
                return False
        self.PAG.press('esc')
        time.sleep(0.2)
        return True


    def inMain(self):
        self.FOC.doIt()
        if(self.onScreen('img/main_fortsetzen.png')):
            return True
        return False


    def join(self):
        i = 0
        fortsetzen = self.onScreen('img/main_fortsetzen.png')
        while(fortsetzen):
            self.SCB.safeClick(fortsetzen)
            time.sleep(0.2)
            fortsetzen = self.onScreen('img/main_fortsetzen.png')
            i = i + 1
            if(i > 10):
                return False

        i = 0
        time.sleep(10)
        while(not self.onServer()):
            time.sleep(1)
            i = i + 1
            if(i > 60):
                return False
        
        time.sleep(39)
        return True


    def openAll(self):
        i = 0
        onMapi = self.onScreen('img/mapi.png', region='mapi')
        while(not onMapi):
            time.sleep(0.2)
            self.PAG.press('esc')
            time.sleep(0.2)
            self.PAG.press('m')
            time.sleep(0.5)
            onMapi = self.onScreen('img/mapi.png', region='mapi')
            i = i + 1
            if(i > 10):
                return False
        i = 0
        onChat = self.onScreen('img/chat_stumm.png', region='chatStumm')
        while(not onChat):
            self.PAG.press('t')
            time.sleep(0.2)
            self.PAG.hotkey('ctrl','a')
            self.PAG.press('backspace')
            onChat = self.onScreen('img/chat_stumm.png', region='chatStumm')
            i = i + 1
            if(i > 20):
                return False
        return True


    def isItReady(self):
        self.FOC.doIt()
        if(self.onScreen('img/mapi.png', region='mapi')):
            if(self.onScreen('img/chat_stumm.png', region='chatStumm')):
                self.PAG.press('esc')
                time.sleep(0.05)
                self.PAG.press('t')
                time.sleep(0.05)
                return True
        return False


    def getReady(self):
        self.FOC.doIt()
        self.setWindow(self.FOC.getWindowProps())
        self.RES.printer('GETREADY')
        self.SCB.safeMoveTo(self.getPoint(1700,600))
        if(self.onServer()):
            return self.openAll()
        if(self.inMain()):
            needOK = self.onScreen('img/main_ok.png', region='window')
            if(needOK):
                self.SCB.safeClick(needOK)
            if(self.goDrone()):
                if(self.join()):
                    return self.openAll()    
        return False


    def startGame(self):
        webbrowser.open('steam://rungameid/513710')
        time.sleep(15)
        i = 0
        while(not self.FOC.doIt()):
            time.sleep(1)
            i = i + 1
            if(i > 90):
                return False
        
        time.sleep(10)
        self.setWindow(self.FOC.getWindowProps())
        i = 0
        while(not self.inMain()):
            time.sleep(1)
            i = i + 1
            if(i > 90):
                return False
        time.sleep(1)
        return self.getReady()

