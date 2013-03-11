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
emscripten.Settings.OPTIMIZE = 2
emscripten.Settings.RELOOP = 1
emscripten.Settings.INIT_STACK = 0
emscripten.Settings.INVOKE_RUN = 0
emscripten.Settings.ASM_JS = 1

emscripten.Building.COMPILER_TEST_OPTS = ['-g']

# Build

print 'Build dcraw.js'
#'-s', 'ALLOW_MEMORY_GROWTH=1',
output = Popen([emscripten.EMCC, '-O2', '-s', 'ASM_JS=1', '-s', 'TOTAL_MEMORY=268435456','-g','-lm', '-o', 'build/dcraw.js','-DNODEPS','dcraw/dcraw.c'], stdout=PIPE, stderr=STDOUT).communicate()[0]
assert os.path.exists('build/dcraw.js'), 'Failed to build dcraw: ' + output

# re-introduced timezone bug in emscripten lib - 
# date.toString() doesn't contain timezone in Windows *urgh*
bad_timezone_js = [
    'winter.toString().match(/\(([A-Z]+)\)/)[1]',
    'summer.toString().match(/\(([A-Z]+)\)/)[1]',
    'date.toString().match(/\(([A-Z]+)\)/)[1]'
]


prepend_js =  """
(function() {
    var root;
    root = (typeof exports !== "undefined" && exports !== null) ? exports : this;
"""

append_js = """
    root.run = run;
    root.FS = FS;
}());
"""

f = open('build/dcraw.js', 'r')
contents = f.read()
# hard-code timezones to UTC
for snippet in bad_timezone_js:
    contents = contents.replace(snippet, '"UTC"');
f.close()

f = open('build/dcraw.js', 'w')
f.writelines([prepend_js,contents, append_js])

f.close()



Popen(['java', '-jar', emscripten.CLOSURE_COMPILER,
               '--js', 'build/dcraw.js', '--js_output_file', 'build/dcraw.min.js'], stdout=PIPE, stderr=STDOUT).communicate()


