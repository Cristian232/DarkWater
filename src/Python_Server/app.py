from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mock data for demonstration
domains = [
    {"id": 1, "name": "example.com"},
    {"id": 2, "name": "anotherdomain.net"}
]

@app.route('/do_login', methods=['POST'])
def do_login():
    # Assuming login logic is implemented here
    return jsonify({"message": "Login successful"}), 200

@app.route('/check_alive', methods=['GET'])
def check_alive():
    return jsonify({"message": "Server is alive"}), 200

@app.route('/get_domains', methods=['GET'])
def get_domains():
    return jsonify(domains), 200

@app.route('/delete_domain', methods=['POST'])
def delete_domain():
    domain_id = request.json.get('id')
    global domains
    domains = [domain for domain in domains if domain['id'] != domain_id]
    return jsonify({"message": "Domain deleted"}), 200

@app.route('/update_domain', methods=['POST'])
def update_domain():
    domain_id = request.json.get('id')
    new_name = request.json.get('name')
    for domain in domains:
        if domain['id'] == domain_id:
            domain['name'] = new_name
            return jsonify({"message": "Domain updated"}), 200
    return jsonify({"error": "Domain not found"}), 404

@app.route('/stop_server', methods=['GET'])
def stop_server():
    # Simulate stopping the server
    return jsonify({"message": "Server stopped"}), 200

@app.route('/start_server', methods=['GET'])
def start_server():
    # Simulate starting the server
    return jsonify({"message": "Server started"}), 200

@app.route('/restart_server', methods=['GET'])
def restart_server():
    # Simulate restarting the server
    return jsonify({"message": "Server restarted"}), 200

if __name__ == '__main__':
    app.run(debug=True)
