from flask import Flask, jsonify, render_template, request
from nltk.chat.eliza import eliza_chatbot


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}

    message = data.get("message", "").strip()

    if not message:
        return jsonify({
            "error": "PLEASE ENTER A MESSAGE."
        }), 400

    if len(message) > 1000:
        return jsonify({
            "error": "INPUT EXCEEDS TERMINAL BUFFER."
        }), 400

    if message.lower() == "quit":
        return jsonify({
            "response": "Goodbye. It was nice talking to you."
        })

    response = eliza_chatbot.respond(message)

    if response is None:
        response = "Please go on."

    return jsonify({
        "response": response
    })


@app.route("/health")
def health():
    return jsonify({
        "status": "ok"
    })


@app.errorhandler(404)
def not_found(error):
    return render_template(
        "404.html",
        error=error
    ), 404


@app.errorhandler(500)
def internal_server_error(error):
    return render_template(
        "500.html",
        error=error
    ), 500


if __name__ == "__main__":
    app.run(debug=False)
