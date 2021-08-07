import win32clipboard
import win32con
import time


class Chat:

    RES = None
    CON = None
    SCB = None
    PAG = None


    safeCommands = [
        '#location', 
        '#listplayers', 
        '#listspawnedvehicles', 
        '#findsquadmember', 
        '#listsquads'
    ]
    
    currentScope = None
    clean = False

    def __init__(self, RES, CON, SCB, PAG):
        self.RES = RES
        self.CON = CON
        self.SCB = SCB
        self.PAG = PAG
        

    def goScope(self, scope, force = False):
        if(not force and self.currentScope == scope):
            return True
        scopeImg = 'chat_local.png'
        if(scope == 'global'):
            scopeImg = 'chat_global.png'
        self.RES.printer(scope)
        i = 0
        while(not self.CON.onScreen('img/' + scopeImg, region='chatScope')):
            self.PAG.press('tab')
            time.sleep(0.1)
            i = i + 1
            if(i > 10):
                raise Exception('Could not change scope')
                return False
        self.currentScope = scope
        return True


    def copyToClip(self, txt):
        win32clipboard.OpenClipboard()
        win32clipboard.EmptyClipboard()
        win32clipboard.SetClipboardText(txt, win32con.CF_UNICODETEXT)
        win32clipboard.CloseClipboard()


    def readFromClip(self):
        win32clipboard.OpenClipboard()
        data = win32clipboard.GetClipboardData()
        win32clipboard.CloseClipboard()
        return data


    def doClean(self):
        self.CON.isItReady()
        self.PAG.hotkey('ctrl','a')
        self.PAG.press('backspace')
        win32clipboard.OpenClipboard()
        win32clipboard.EmptyClipboard()
        win32clipboard.CloseClipboard()
        self.clean = True


    def read(self, message):
        command = message.split()[0].strip().lower()
        if(command in self.safeCommands):
            self.copyToClip(message + ' true')
            self.PAG.hotkey('ctrl','v')
            self.PAG.press('enter')
        else:
            self.copyToClip(message)
            chat = self.CON.onScreen('img/chat_stumm.png', region='chatStumm')
            self.PAG.moveTo(chat[0], chat[1]-30, 0.2, self.PAG.easeOutQuad)
            self.PAG.hotkey('ctrl','v')
            self.PAG.press('enter')
            self.PAG.click(chat[0], chat[1]-30)
            self.PAG.hotkey('ctrl','a')
            self.PAG.hotkey('ctrl', 'c')
            self.PAG.press('esc')
            self.PAG.press('t')
        return self.readFromClip().strip()


    def formLocation(self, telep):
        loc = telep.lower().replace('#teleport ', '')
        loc = loc.split(' ')
        return str(round(float(loc[0]))) + ' ' + str(round(float(loc[1]))) + ' ' + str(round(float(loc[2])))


    def getLocation(self):
        i = 0
        loc = self.send('#Location 76561199192438131', read = True)
        while(not loc.lower().startswith('scumfiction') and i < 10):
            loc = self.send('#Location 76561199192438131', read = True)
            i = i + 1
        if(not loc.lower().startswith('scumfiction')):
            self.RES.addError('Unable to catch location', '_process_chat: getLocation()')
            self.RES.send()
            return False
        loc = loc.split(': X=')[1]
        loc = loc.split(' ')
        return str(round(float(loc[0]))) + ' ' + str(round(float(loc[1][2:]))) + ' ' + str(round(float(loc[2][2:])))


    def send(self, message, read = False):
        message = message.strip()
        data = True
        teleport = False
        current = False
        if(message.lower().startswith('#teleport ') and 'scumfiction' in message.lower()):
            current = self.getLocation()
            teleport = self.formLocation(message.lower().replace('scumfiction', '').strip())
            if(current == teleport):
                return data
        self.RES.printer('SENDING MSG -> ' + message)
        if(read):
            data = self.read(message)
        else:
            self.copyToClip(message)
            self.PAG.hotkey('ctrl','v')
            self.PAG.press('enter')
            if(teleport):
                while(current == self.getLocation()):
                    time.sleep(0.15)
        return data
        self.RES.printer('SENDING MSG DONE')


    def sendMulti(self, messages):
        for message in messages:
            self.goScope(str(message['scope']))
            self.send(str(message['content']))
