import json
import sys

class Respond:
    
    sPrint = True

    data = {}
    status = None
    command = None
    inputData = {}
    errorType = None
    errorMessage = None


    def __init__(self, printToConsole=False):
        self.sPrint = printToConsole


    def printer(self, text):
        if(self.sPrint):
            print('RES:Printer -> ' + str(text))


    def clean(self):
        self.data = {}
        self.status = None
        self.command = None
        self.inputData = {}
        self.errorType = None
        self.errorMessage = None


    def start(self, command):
        self.clean()
        self.command = command
        self.status = 'success'
        if(self.sPrint):
            print('RES:Start -> ' + str(command))


    def add(self, data):
        self.data.update(data)
        if(self.sPrint):
            print('RES:Add -> ' + str(data))


    def addInput(self, data):
        self.inputData.update(data)
        if(self.sPrint):
            print('RES:AddInput -> ' + str(data))


    def addError(self, errorMessage, errorType = None):
        self.status = 'error'
        self.errorType = errorType
        self.errorMessage = errorMessage
        if(self.sPrint):
            print('RES:Error -> ' + str(errorType) + ' -> ' + str(errorMessage))


    def send(self):
        if(self.sPrint):
            print('\n')
        if(self.status == 'success'):
            print(json.dumps({
                'status': self.status,
                'command': self.command,
                'input': self.inputData,
                'data': self.data
            }))
        else:
            print(json.dumps({
                'status': self.status,
                'command': self.command,
                'message': self.errorMessage,
                'type': self.errorType,
                'data': self.data
            }))
        if(self.sPrint):
            print('\n')
        sys.stdout.flush()

