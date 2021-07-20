from urllib.parse import unquote
import json

class Process:

    PRC_ACTION = None
    PRC_CHAT = None
    test = None
    RES = None
    CON = None
    PAG = None

    def __init__(self, respond, control, PRC_CHAT, PRC_ACTION, pyautogui, test = False):
        self.PRC_ACTION = PRC_ACTION
        self.PRC_CHAT = PRC_CHAT
        self.PAG = pyautogui
        self.RES = respond
        self.CON = control
        self.test = test


    def message(self):
        if(not self.test):
            messages = json.loads(unquote(input()).strip())
        else:
            messages = self.testMessages
            
        self.RES.addInput({'input': messages})
        self.PRC_CHAT.sendMulti(messages)


    def action(self):
        if(not self.test):
            actions = json.loads(unquote(input()).strip())
        else:
            actions = self.testActions

        self.RES.addInput({'input': actions})
        
        for action in actions:
            if(action['type'] == 'mapShot'):
                self.PRC_ACTION.mapShot(action['properties'])
            if(action['type'] == 'playerReport'):
                self.PRC_ACTION.playerReport()
            elif(action['type'] == 'sale'):
                self.PRC_ACTION.sale(action['properties'])
            elif(action['type'] == 'travel'):
                self.PRC_ACTION.travel(action['properties'])
            elif(action['type'] == 'transfer'):
                self.PRC_ACTION.transfer(action['properties'])


    testActions = [{
        "type":"playerReport"
    }]

    testMessages = [
        {"scope":"local","content":"1"},
        {"scope":"local","content":"2"},
        {"scope":"local","content":"3"},
        {"scope":"local","content":"4"},
        {"scope":"local","content":"5"},
        {"scope":"local","content":"6"},
        {"scope":"local","content":"7"},
        {"scope":"local","content":"8"},
    ]