from ctypes.wintypes import HWND, RECT, DWORD
from pywinauto import Application
import ctypes.wintypes
from ctypes import *
import win32gui
import psutil
import ctypes
import time
import sys

class Focus:

    RES = None

    def __init__(self, respond):
        self.RES = respond

    def getWindowProps(self):
        return self.getWreckt(win32gui.GetForegroundWindow())


    def foregroundWindow(self):
        try:
            name = win32gui.GetWindowText(win32gui.GetForegroundWindow())
            name = name.strip().lower()
            return(name)
        except:
            pass

    def getTryFocus(self, proc):
        i = 0
        success = False
        while(not success):
            try:
                app = Application().connect(process=proc.pid)
                app.top_window().set_focus()
                success = True
            except Exception as e:
                exception_type, exception_object, exception_traceback = sys.exc_info()
                if('not responding' in str(e).lower()):
                    time.sleep(3)
                    continue
                else:
                    i = i + 1
                    time.sleep(3)
                    continue
                    if(i > 10):
                        raise Exception('Unable to focus game')


    def doIt(self):
        self.RES.printer('FOCUSING')
        if(self.foregroundWindow() == 'scum'):
            self.RES.printer('FOCUSED')
            return True
        for proc in psutil.process_iter():
            if 'SCUM.exe' in proc.name():
                self.getTryFocus(proc)
                self.RES.printer('FOCUSED')
                time.sleep(0.5)
                return True
        return False
                

    def check(self, processName):
        try:
            for proc in psutil.process_iter():
                if (processName in proc.name().lower()):
                    return True
            return False
        except:
            return False


    def getWreckt(self, hwnd):
        try:
            f = ctypes.windll.dwmapi.DwmGetWindowAttribute
        except WindowsError:
            f = None
        if f:
            rect = ctypes.wintypes.RECT()
            DWMWA_EXTENDED_FRAME_BOUNDS = 9
            f(
                ctypes.wintypes.HWND(hwnd),
                ctypes.wintypes.DWORD(DWMWA_EXTENDED_FRAME_BOUNDS),
                ctypes.byref(rect),
                ctypes.sizeof(rect)
            )
            x = rect.left
            y = rect.top
            w = rect.right - x
            h = rect.bottom - y
            return {
                'x': x,
                'y': y,
                'w': w,
                'h': h
            }
