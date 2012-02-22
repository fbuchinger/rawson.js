#!/usr/bin/python

import os, sys, re, json, shutil
from subprocess import Popen, PIPE, STDOUT

exec(open(os.path.expanduser('~/.emscripten'), 'r').read())

sys.path.append(EMSCRIPTEN_ROOT)
import tools.shared as emscripten


# Config

emscripten.Settings.USE_TYPED_ARRAYS = 2
emscripten.Settings.CORRECT_OVERFLOWS = 0
emscripten.Settings.CORRECT_ROUNDINGS = 0
emscripten.Settings.CORRECT_SIGNS = 1
emscripten.Settings.OPTIMIZE = 1
emscripten.Settings.RELOOP = 1
emscripten.Settings.INIT_STACK = 0
emscripten.Settings.INVOKE_RUN = 0

emscripten.Building.COMPILER_TEST_OPTS = ['-g']

# Build

print 'Build dcraw.js'

output = Popen([emscripten.EMCC, '-g','-lm', '-o', 'build/dcraw.js','-DNODEPS','dcraw/dcraw.c'], stdout=PIPE, stderr=STDOUT).communicate()[0]
assert os.path.exists('build/dcraw.js'), 'Failed to build dcraw: ' + output


prepend_js =  """
var root;
root = (typeof exports !== "undefined" && exports !== null) ? exports : this;
"""

append_js = """
root.run = run;
root.FS = FS;
"""

f = open('build/dcraw.js', 'r')
contents = f.read()
f.close()

f = open('build/dcraw.js', 'w')
f.writelines([prepend_js,contents, append_js])

f.close()


"""
Popen(['java', '-jar', emscripten.CLOSURE_COMPILER,
               '--compilation_level', 'ADVANCED_OPTIMIZATIONS',
               '--js', 'openjpeg.elim.js', '--js_output_file', 'openjpeg.js'], stdout=PIPE, stderr=STDOUT).communicate()
"""

