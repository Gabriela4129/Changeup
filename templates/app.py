# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return  render_template("index.html")

app.run(debug = True)