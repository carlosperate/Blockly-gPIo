# -*- coding: utf-8 -*-
#
# Description.
#
# Licensed under the Apache License, Version 2.0 (the "License"):
#   http://www.apache.org/licenses/LICENSE-2.0
from __future__ import unicode_literals, absolute_import
import os
import json
import codecs
import subprocess
from server.SimpleWebSocketServer import WebSocket
from server.SimpleWebSocketServer import SimpleWebSocketServer


class SimpleEcho(WebSocket):
    """ Description. """

    def handleMessage(self):
        """ Description. """
        print(self.data)
        parsed_json = json.loads(self.data)
        if parsed_json['content'] == 'python_code':
            run_python_code(parsed_json['code'])
        #self.sendMessage(self.data)

    def handleConnected(self):
        """ Description. """
        print self.address, 'connected'

    def handleClose(self):
        """ Description. """
        print self.address, 'closed'


def run_server():
    """ Description. """
    server = SimpleWebSocketServer('', 8000, SimpleEcho)
    server.serveforever()


def run_python_code(code):
    """ Description. """
    file_location = create_python_file(code)
    run_python_file(file_location)


def create_python_file(code):
    """ Description. """
    file_path = os.path.join(os.getcwd(), 'gpio.py')
    try:
        python_file = codecs.open(file_path, 'wb+', encoding='utf-8')
        try:
            python_file.write(code)
        finally:
            python_file.close()
    except Exception as e:
        print(e)
        print('Python file could not be created !!!')
        return None

    return file_path


def run_python_file(location):
    """ Description. """
    cli_command = ['python', location]
    print('CLI command: %s' % ' '.join(cli_command))
    subprocess.Popen(cli_command, shell=False)
