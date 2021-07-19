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
            if(action['type'] == 'mapshot'):
                self.PRC_ACTION.mapshot()
            elif(action['type'] == 'sale'):
                self.PRC_ACTION.sale(action['properties'])
            elif(action['type'] == 'travel'):
                self.PRC_ACTION.travel(action['properties'])
            elif(action['type'] == 'transfer'):
                self.PRC_ACTION.transfer(action['properties'])


    testActions = {
        "type":"transfer",
        "properties": {
            'from': '76561198058320009',
            'to': 'ScumFiction',
            'amount': '1',
            'message': {
                'notEnough': ':[Transfer]: ・ @Test You don\'t have enough famepoints for this transaction.',
                'notFound': ':[Transfer]: ・ @Test I couldn\'t find the recipient with that name. Make sure to tell the name as it is spelled in chat.',
                'success': ':[Transfer]: ・ @Test Your transaction was successful.',
                'started': ':[Transfer]: ・ @Test Transaction started. Please wait...',
                'somethingWrong': ':[Transfer]: ・ Something went wrong. Please try again.'
            }
        }
    }

    testMessages = [
        {"scope":"local","message":"#listanimals"},
        {"scope":"global","message":"#Teleport -117159 -66722 37200"},
        {"scope":"local","message":"#Teleport -117159 -66722 37200"},
        {"scope":"local","message":"#Teleport -117159 -66722 100000"}
    ]