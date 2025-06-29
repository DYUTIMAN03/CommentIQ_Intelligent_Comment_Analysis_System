#!/usr/bin/env python3
"""
Comment Analysis Backend
A Python backend for the Intelligent Comment Analysis System
"""

import re
import json
import time
from typing import Dict, List, Any, Tuple
from dataclasses import dataclass, asdict
from enum import Enum

class Platform(Enum):
    YOUTUBE = "youtube"
    INSTAGRAM = "instagram"
    FACEBOOK = "facebook"

class Sentiment(Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"

class CommentType(Enum):
    FEEDBACK = "feedback"
    SUGGESTION = "suggestion"

@dataclass
class Analysis:
    is_toxic: bool
    is_spam: bool
    sentiment: str
    comment_type: str
    confidence: float

@dataclass
class Comment:
    id: str
    text: str
    author: str
    timestamp: str
    platform: str
    is_processed: bool = False
    analysis: Analysis = None

class CommentAnalyzer:
    """
    Main class for analyzing comments through multiple ML pipeline steps
    """
    
    def __init__(self):
        # Keyword dictionaries for analysis
        self.toxic_keywords = [
            'dumb', 'stupid', 'garbage', 'hate', 'terrible', 
            'awful', 'worst', 'idiot', 'moron', 'pathetic'
        ]
        
        self.spam_keywords = [
            'follow me', 'check out my', 'link in bio', 'giveaway', 
            'free', 'subscribe', 'plz', 'first!', 'sub4sub', 'like4like'
        ]
        
        self.positive_keywords = [
            'love', 'great', 'amazing', 'awesome', 'good', 'nice', 
            'helped', 'thank', 'appreciate', 'excellent', 'fantastic', 'wonderful'
        ]
        
        self.negative_keywords = [
            'bad', 'poor', 'terrible', 'awful', 'hate', 'worst', 
            'boring', 'disappointing', 'useless', 'waste'
        ]
        
        self.suggestion_keywords = [
            'try', 'should', 'could', 'maybe', 'consider', 'suggest', 
            'recommend', 'next time', 'would be better', 'improvement'
        ]
        
        self.feedback_keywords = [
            'great', 'good', 'nice', 'love', 'like', 'keep up', 
            'amazing', 'awesome', 'enjoyed', 'loved'
        ]

    def analyze_toxicity(self, text: str) -> Tuple[bool, float]:
        """
        Analyze if a comment contains toxic content
        
        Args:
            text (str): Comment text to analyze
            
        Returns:
            Tuple[bool, float]: (is_toxic, confidence_score)
        """
        lower_text = text.lower()
        toxic_score = 0.0
        
        # Check for toxic keywords
        for keyword in self.toxic_keywords:
            if keyword in lower_text:
                toxic_score += 0.3
        
        # Check for excessive caps (shouting)
        caps_ratio = sum(1 for c in text if c.isupper()) / len(text) if text else 0
        if caps_ratio > 0.7:
            toxic_score += 0.2
        
        # Check for repeated characters (e.g., "sooooo")
        if re.search(r'(.)\1{3,}', text):
            toxic_score += 0.1
        
        is_toxic = toxic_score > 0.2
        confidence = min(0.95, 0.6 + toxic_score)
        
        return is_toxic, confidence

    def analyze_spam(self, text: str) -> Tuple[bool, float]:
        """
        Analyze if a comment is spam
        
        Args:
            text (str): Comment text to analyze
            
        Returns:
            Tuple[bool, float]: (is_spam, confidence_score)
        """
        lower_text = text.lower()
        spam_score = 0.0
        
        # Check for spam keywords
        for keyword in self.spam_keywords:
            if keyword in lower_text:
                spam_score += 0.25
        
        # Check for excessive emojis
        emoji_pattern = re.compile(
            "["
            "\U0001F600-\U0001F64F"  # emoticons
            "\U0001F300-\U0001F5FF"  # symbols & pictographs
            "\U0001F680-\U0001F6FF"  # transport & map symbols
            "\U0001F1E0-\U0001F1FF"  # flags (iOS)
            "]+", flags=re.UNICODE
        )
        emoji_count = len(emoji_pattern.findall(text))
        if emoji_count > 3:
            spam_score += 0.2
        
        # Check for excessive caps
        caps_ratio = sum(1 for c in text if c.isupper()) / len(text) if text else 0
        if caps_ratio > 0.5:
            spam_score += 0.15
        
        # Check for URLs or promotional patterns
        if re.search(r'http[s]?://|www\.|\b[a-zA-Z0-9]+\.(com|org|net)\b', lower_text):
            spam_score += 0.3
        
        # Check for repetitive patterns
        if re.search(r'(.{3,})\1{2,}', text):
            spam_score += 0.2
        
        is_spam = spam_score > 0.3
        confidence = min(0.95, 0.5 + spam_score)
        
        return is_spam, confidence

    def analyze_sentiment(self, text: str) -> Tuple[str, float]:
        """
        Analyze sentiment of a comment
        
        Args:
            text (str): Comment text to analyze
            
        Returns:
            Tuple[str, float]: (sentiment, confidence_score)
        """
        lower_text = text.lower()
        
        positive_score = sum(1 for keyword in self.positive_keywords if keyword in lower_text)
        negative_score = sum(1 for keyword in self.negative_keywords if keyword in lower_text)
        
        # Check for punctuation patterns
        if '!' in text:
            positive_score += 0.5
        if '?' in text and 'why' in lower_text:
            negative_score += 0.3
        
        sentiment = Sentiment.NEUTRAL.value
        confidence = 0.6
        
        if positive_score > negative_score:
            sentiment = Sentiment.POSITIVE.value
            confidence = min(0.95, 0.6 + (positive_score * 0.1))
        elif negative_score > positive_score:
            sentiment = Sentiment.NEGATIVE.value
            confidence = min(0.95, 0.6 + (negative_score * 0.1))
        
        return sentiment, confidence

    def analyze_type(self, text: str) -> Tuple[str, float]:
        """
        Classify comment as feedback or suggestion
        
        Args:
            text (str): Comment text to analyze
            
        Returns:
            Tuple[str, float]: (comment_type, confidence_score)
        """
        lower_text = text.lower()
        
        suggestion_score = sum(1 for keyword in self.suggestion_keywords if keyword in lower_text)
        feedback_score = sum(1 for keyword in self.feedback_keywords if keyword in lower_text)
        
        # Check for question patterns (often suggestions)
        if '?' in text:
            suggestion_score += 0.5
        
        # Check for imperative mood (suggestions)
        if re.search(r'\b(try|use|get|make|do)\b', lower_text):
            suggestion_score += 0.3
        
        comment_type = CommentType.SUGGESTION.value if suggestion_score > feedback_score else CommentType.FEEDBACK.value
        confidence = min(0.95, 0.6 + (max(suggestion_score, feedback_score) * 0.1))
        
        return comment_type, confidence

    def process_comment(self, comment_data: Dict[str, Any]) -> Comment:
        """
        Process a single comment through the entire analysis pipeline
        
        Args:
            comment_data (Dict): Raw comment data
            
        Returns:
            Comment: Processed comment with analysis results
        """
        comment = Comment(
            id=comment_data['id'],
            text=comment_data['text'],
            author=comment_data['author'],
            timestamp=comment_data['timestamp'],
            platform=comment_data['platform']
        )
        
        # Step 1: Toxicity Analysis
        is_toxic, toxic_confidence = self.analyze_toxicity(comment.text)
        
        if is_toxic:
            comment.analysis = Analysis(
                is_toxic=True,
                is_spam=False,
                sentiment=Sentiment.NEUTRAL.value,
                comment_type=CommentType.FEEDBACK.value,
                confidence=toxic_confidence
            )
            comment.is_processed = True
            return comment
        
        # Step 2: Spam Analysis
        is_spam, spam_confidence = self.analyze_spam(comment.text)
        
        if is_spam:
            comment.analysis = Analysis(
                is_toxic=False,
                is_spam=True,
                sentiment=Sentiment.NEUTRAL.value,
                comment_type=CommentType.FEEDBACK.value,
                confidence=spam_confidence
            )
            comment.is_processed = True
            return comment
        
        # Step 3: Sentiment Analysis
        sentiment, sentiment_confidence = self.analyze_sentiment(comment.text)
        
        # Step 4: Type Classification
        comment_type, type_confidence = self.analyze_type(comment.text)
        
        # Combine results
        final_confidence = min(sentiment_confidence, type_confidence)
        
        comment.analysis = Analysis(
            is_toxic=False,
            is_spam=False,
            sentiment=sentiment,
            comment_type=comment_type,
            confidence=final_confidence
        )
        comment.is_processed = True
        
        return comment

    def process_batch(self, comments: List[Dict[str, Any]]) -> List[Comment]:
        """
        Process multiple comments
        
        Args:
            comments (List[Dict]): List of raw comment data
            
        Returns:
            List[Comment]: List of processed comments
        """
        processed_comments = []
        
        for comment_data in comments:
            processed_comment = self.process_comment(comment_data)
            processed_comments.append(processed_comment)
            
            # Simulate processing time
            time.sleep(0.1)
        
        return processed_comments

    def get_analytics(self, comments: List[Comment]) -> Dict[str, Any]:
        """
        Generate analytics from processed comments
        
        Args:
            comments (List[Comment]): List of processed comments
            
        Returns:
            Dict: Analytics data
        """
        total_comments = len(comments)
        toxic_comments = sum(1 for c in comments if c.analysis and c.analysis.is_toxic)
        spam_comments = sum(1 for c in comments if c.analysis and c.analysis.is_spam)
        valid_comments = total_comments - toxic_comments - spam_comments
        
        # Sentiment breakdown for valid comments only
        valid_with_analysis = [c for c in comments if c.analysis and not c.analysis.is_toxic and not c.analysis.is_spam]
        
        sentiment_breakdown = {
            'positive': sum(1 for c in valid_with_analysis if c.analysis.sentiment == Sentiment.POSITIVE.value),
            'negative': sum(1 for c in valid_with_analysis if c.analysis.sentiment == Sentiment.NEGATIVE.value),
            'neutral': sum(1 for c in valid_with_analysis if c.analysis.sentiment == Sentiment.NEUTRAL.value)
        }
        
        type_breakdown = {
            'feedback': sum(1 for c in valid_with_analysis if c.analysis.comment_type == CommentType.FEEDBACK.value),
            'suggestions': sum(1 for c in valid_with_analysis if c.analysis.comment_type == CommentType.SUGGESTION.value)
        }
        
        return {
            'total_comments': total_comments,
            'toxic_comments': toxic_comments,
            'spam_comments': spam_comments,
            'valid_comments': valid_comments,
            'sentiment_breakdown': sentiment_breakdown,
            'type_breakdown': type_breakdown
        }

def main():
    """
    Example usage of the CommentAnalyzer
    """
    # Sample comments for testing
    sample_comments = [
        {
            'id': '1',
            'text': 'Loved this vlog, especially the editing part! The transitions were smooth and kept me engaged throughout.',
            'author': 'Sarah_Creates',
            'timestamp': '2 hours ago',
            'platform': 'youtube'
        },
        {
            'id': '2',
            'text': 'You\'re so dumb, stop making videos! Nobody wants to watch this garbage.',
            'author': 'ToxicTroll123',
            'timestamp': '3 hours ago',
            'platform': 'youtube'
        },
        {
            'id': '3',
            'text': 'Follow me for free giveaways!! Link in bio 🎁🎁 #freebie #giveaway',
            'author': 'SpamAccount99',
            'timestamp': '1 hour ago',
            'platform': 'instagram'
        },
        {
            'id': '4',
            'text': 'Try using a mic next time for better audio. Maybe consider the Blue Yeti or similar USB mics.',
            'author': 'TechHelper',
            'timestamp': '7 hours ago',
            'platform': 'youtube'
        }
    ]
    
    # Initialize analyzer
    analyzer = CommentAnalyzer()
    
    print("🧠 CommentIQ - Intelligent Comment Analysis System")
    print("=" * 50)
    
    # Process comments
    print("\n📝 Processing Comments...")
    processed_comments = analyzer.process_batch(sample_comments)
    
    # Display results
    print(f"\n✅ Processed {len(processed_comments)} comments:")
    print("-" * 50)
    
    for comment in processed_comments:
        print(f"\n👤 {comment.author} ({comment.platform}):")
        print(f"💬 \"{comment.text[:60]}{'...' if len(comment.text) > 60 else ''}\"")
        
        if comment.analysis.is_toxic:
            print("🚫 Status: TOXIC")
        elif comment.analysis.is_spam:
            print("⚠️  Status: SPAM")
        else:
            print(f"✅ Status: VALID")
            print(f"😊 Sentiment: {comment.analysis.sentiment.upper()}")
            print(f"💡 Type: {comment.analysis.comment_type.upper()}")
        
        print(f"🎯 Confidence: {comment.analysis.confidence:.1%}")
    
    # Generate analytics
    analytics = analyzer.get_analytics(processed_comments)
    
    print(f"\n📊 Analytics Summary:")
    print("-" * 30)
    print(f"Total Comments: {analytics['total_comments']}")
    print(f"Valid Comments: {analytics['valid_comments']}")
    print(f"Toxic Comments: {analytics['toxic_comments']}")
    print(f"Spam Comments: {analytics['spam_comments']}")
    print(f"Engagement Rate: {(analytics['valid_comments']/analytics['total_comments']*100):.1f}%")
    
    print(f"\n🎭 Sentiment Breakdown:")
    for sentiment, count in analytics['sentiment_breakdown'].items():
        print(f"  {sentiment.title()}: {count}")
    
    print(f"\n📋 Type Breakdown:")
    for comment_type, count in analytics['type_breakdown'].items():
        print(f"  {comment_type.title()}: {count}")

if __name__ == "__main__":
    main()