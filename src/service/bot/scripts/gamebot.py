from plugins import _process_action
from plugins import _process_chat
from plugins import _respond
from plugins import _control
from plugins import _focus
from plugins import _scb
import _process
import _gamebot
import _ready


import pyautogui as PAG
PAG.PAUSE = 0.12
test = False


RES = _respond.Respond(test)
FOC = _focus.Focus(RES)
SCB = _scb.SCB(RES, PAG)
CON = _control.Control(RES, SCB, FOC, PAG)

PRC_CHAT = _process_chat.Chat(RES, CON, SCB, PAG)
PRC_ACTION = _process_action.Action(RES, CON, SCB, PRC_CHAT, PAG)
PRC = _process.Process(RES, CON, PRC_CHAT, PRC_ACTION, PAG, test)
RDY = _ready.Ready(RES, FOC, CON, PRC_CHAT)


RES.start('START')
if(not RDY.doIt()):
    RES.addError('Unable to get ready (MAIN)')
RES.send()

if(test):
    GB_RUN = _gamebot.RunBot(RES, CON, RDY, PRC, test)
else:
    GB_CHK = _gamebot.Check(RES, CON, 30)
    GB_RUN = _gamebot.RunBot(RES, CON, RDY, PRC)

while(True):
    pass