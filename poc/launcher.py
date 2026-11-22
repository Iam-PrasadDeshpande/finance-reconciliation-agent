"""Local-only launcher with readiness check before opening the browser."""
import argparse
import threading
import time
import urllib.request
import webbrowser

import uvicorn

def open_when_ready(port:int):
    url=f"http://127.0.0.1:{port}/"
    for _ in range(60):
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{port}/api/health",timeout=1) as response:
                if response.status==200:
                    webbrowser.open(url)
                    return
        except Exception:
            time.sleep(.25)

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--port",type=int,default=8876)
    args=parser.parse_args()
    threading.Thread(target=open_when_ready,args=(args.port,),daemon=True).start()
    uvicorn.run("poc.app:app",host="127.0.0.1",port=args.port)

if __name__=="__main__": main()
