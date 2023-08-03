from flask import Flask

app = Flask(__name__, static_folder="./static", template_folder="./template")

@app.get("/")
def index():
  return "Hello! Flask"

if __name__ == "__main__":
  app.run(host = "0.0.0.0", port = 5000, debug = True)
