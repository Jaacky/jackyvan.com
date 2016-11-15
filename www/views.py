from www import app
from flask import render_template

@app.route('/')
def home(name=None):
    return render_template('index.html')

@app.route('/bugSplat')
def bugSplat(name=None):
    return render_template('bugSplat.html', bugSplat='true')