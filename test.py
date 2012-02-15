import os, sys, re, json, shutil
from subprocess import Popen, PIPE, STDOUT, call

exec(open(os.path.expanduser('~/.emscripten'), 'r').read())


sys.path.append(EMSCRIPTEN_ROOT)
import tools.shared as emscripten

output = emscripten.run_js('test.js', emscripten.NODE_JS)


