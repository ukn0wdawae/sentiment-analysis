from flask import Blueprint, request, jsonify
from .sentiment_analysis import analyze_sentiment
import logging
import json

logging.basicConfig(level=logging.DEBUG)

main = Blueprint('main', __name__)

@main.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        if not data or 'review' not in data:
            return jsonify({'error': 'No review text provided'}), 400

        review_text = data['review']
        # logging.debug(f"Received review: {review_text}")
        sentiment = analyze_sentiment(review_text)
        # logging.debug(f"Sentiment analysis result: {sentiment}")
        return jsonify({'sentiment': sentiment})
    except Exception as e:
        logging.error(f"Error processing request: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@main.route('/analyze-file', methods=['POST'])
def analyze_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and file.filename.endswith('.json'):
        reviews = json.load(file)
        results = [{'review': review, 'sentiment': analyze_sentiment(review)} for review in reviews]
        return jsonify(results)
    return jsonify({'error': 'Invalid file type'}), 400