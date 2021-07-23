from urllib.parse import unquote
from threading import Thread
import time
import sys


busyWork = True
busyCheck = False


class Check(Thread):

    RES = None
    CON = None
    interval = None

    def __init__(self, respond, control, interval = 10):
        Thread.__init__(self)
        self.interval = interval
        self.RES = respond
        self.CON = control
        self.daemon = True
        self.start()

    def run(self):
        global busyWork
        global busyCheck
        while True:
            busyCheck = False
            time.sleep(self.interval)
            if(busyWork):
                continue
            else:
                busyCheck = True
                if(not self.CON.isItReady()):
                    if(not self.CON.getReady()):
                        self.RES.addError('Unable to get ready (GB_CHK)')
                        self.RES.send()
                        self.CON.restart()
                        time.sleep(120)
                busyCheck = False       


class RunBot(Thread):

    RES = None
    CON = None
    RDY = None
    PRC = None
    test = None

    def __init__(self, respond, control, ready, process, test = False):
        Thread.__init__(self)
        self.daemon = True
        self.RES = respond
        self.CON = control
        self.PRC = process
        self.RDY = ready
        self.test = test
        self.start()


    def run(self):
        global busyWork
        global busyCheck
        while (True):
            try:
                busyWork = False
                if(not self.test):
                    cmd = unquote(input()).strip()
                else:
                    cmd = 'ACTION'
                busyWork = True
                while (busyCheck):
                    time.sleep(0.0001)
                self.RES.start(cmd)
                if(cmd == 'MESSAGES'):
                    self.PRC.message()
                elif(cmd == 'ACTION'):
                    self.PRC.action()
                else:
                    self.RES.addError('Command not recognized')
                
            except Exception as e:
                exception_type, exception_object, exception_traceback = sys.exc_info()
                self.RES.addError(str(e), str(exception_type))
                self.RES.send()
                if(not self.RDY.doIt()):
                    self.CON.restart()
                    time.sleep(120)
                
            self.RES.send()
            if(self.test):
                break
