class SCB:
    RES = None
    PAG = None

    def __init__(self, respond, pyautogui):
        self.RES = respond
        self.PAG = pyautogui
        

    def safeMoveTo(self, coords, duration=0):
        self.PAG.moveTo(coords, duration=duration)
        self.PAG.move(-5, -2, duration=0)
        self.PAG.move(5, 2, duration=0)
        self.PAG.moveTo(coords, duration=duration)


    def safeClick(self, coords, double=False, button='left'):
        #self.safeMoveTo(coords)
        self.PAG.click(coords, button=button)
        if(double):
            self.PAG.click(coords, button=button)