from flask import Flask, render_template, redirect, jsonify
import chess
import io
import random
import json

app = Flask(__name__)

python_dict = {
	'a': 1
}

# Routes
@app.route('/')
def index():
	return redirect('/checkmate')

@app.route("/checkmate")
def checkmate():
	return render_template("checkmate_page.html")

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5003, debug=True)