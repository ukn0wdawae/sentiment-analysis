import spacy
import logging

logging.basicConfig(level=logging.DEBUG)

nlp = spacy.load('en_core_web_sm')

# Example sentiment word lists
positive_words = set(["good", "great", "excellent", "amazing", "wonderful", "best", "fantastic", "positive", "love", "like", "happy", "joy", "awesome"])
negative_words = set(["bad", "terrible", "awful", "worst", "hate", "dislike", "sad", "angry", "negative", "horrible", "poor"])

def analyze_sentiment(text):
    try:
        doc = nlp(text)
        logging.debug(f"Processed doc: {doc}")

        # Count positive and negative words
        pos_count = 0
        neg_count = 0

        for token in doc:
            if token.lemma_.lower() in positive_words:
                pos_count += 1
            elif token.lemma_.lower() in negative_words:
                neg_count += 1

        logging.debug(f"Positive count: {pos_count}, Negative count: {neg_count}")

        if pos_count > neg_count:
            return 'positive'
        elif neg_count > pos_count:
            return 'negative'
        else:
            return 'neutral'
    except Exception as e:
        logging.error(f"Error in analyze_sentiment: {e}")
        raise e
