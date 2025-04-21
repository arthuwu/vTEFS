from flask import Flask, request
import socket
import json

app = Flask(__name__)


def send_to_ES(request):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect(('localhost', 9000))
        s.sendall(request.encode())
        response = s.recv(4096)
        return response.decode()


def set_ground_status(callsign, state):
    return json.dumps(
        {
            "type": "SET",  # THERE IS NO VALIDATION!!!!!!!
            "callsign": callsign,
            "request": f"STATUS: {state}",
            "contents": "B7 B8 B #"
        }
    )


def get_fp_data(callsign):
    return json.dumps(
        {
            "type": "GET",
            "callsign": callsign,
        }
    )


@app.route('/api/set-ground-status')
def setGS():
    callsign = request.args.get("callsign")
    state = request.args.get("state")
    print(f"setting ground status of {callsign} to {state}")
    result = send_to_ES(set_ground_status(callsign, state))
    return result


@app.route('/api/get-fp-data')
def getFPD():
    callsign = request.args.get("callsign")
    result = send_to_ES(get_fp_data(callsign))
    return result
