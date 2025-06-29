// Sample comments data
const sampleComments = [
    {
        id: '1',
        text: 'Loved this vlog, especially the editing part! The transitions were smooth and kept me engaged throughout.',
        author: 'Sarah_Creates',
        timestamp: '2 hours ago',
        platform: 'youtube'
    },
    {
        id: '2',
        text: 'You\'re so dumb, stop making videos! Nobody wants to watch this garbage.',
        author: 'ToxicTroll123',
        timestamp: '3 hours ago',
        platform: 'youtube'
    },
    {
        id: '3',
        text: 'Follow me for free giveaways!! Link in bio 🎁🎁 #freebie #giveaway',
        author: 'SpamAccount99',
        timestamp: '1 hour ago',
        platform: 'instagram'
    },
    {
        id: '4',
        text: 'Nice bro, check out my channel plz 🙏 I make similar content, would appreciate the support!',
        author: 'NewCreator_Hindi',
        timestamp: '4 hours ago',
        platform: 'youtube'
    },
    {
        id: '5',
        text: 'This video helped me understand finance better! Thank you for explaining compound interest so clearly.',
        author: 'LearnerMike',
        timestamp: '5 hours ago',
        platform: 'youtube'
    },
    {
        id: '6',
        text: 'The video was okay, but audio quality was poor. Hard to hear you in some parts.',
        author: 'HonestViewer',
        timestamp: '6 hours ago',
        platform: 'youtube'
    },
    {
        id: '7',
        text: 'Try using a mic next time for better audio. Maybe consider the Blue Yeti or similar USB mics.',
        author: 'TechHelper',
        timestamp: '7 hours ago',
        platform: 'youtube'
    },
    {
        id: '8',
        text: 'Amazing content as always! Keep up the great work 💪',
        author: 'FaithfulFan',
        timestamp: '8 hours ago',
        platform: 'instagram'
    },
    {
        id: '9',
        text: 'First! 🥇',
        author: 'QuickCommenter',
        timestamp: '30 minutes ago',
        platform: 'youtube'
    },
    {
        id: '10',
        text: 'Could you make a video about investment strategies for beginners? Would be really helpful!',
        author: 'AspiringInvestor',
        timestamp: '2 days ago',
        platform: 'youtube'
    }
];

// Analysis steps configuration
const analysisSteps = [
    {
        id: 1,
        title: 'Toxic Comment Detection',
        description: 'Filtering harmful and abusive content',
        icon: 'fas fa-shield-alt',
        status: 'pending'
    },
    {
        id: 2,
        title: 'Spam Detection',
        description: 'Removing promotional and irrelevant comments',
        icon: 'fas fa-exclamation-triangle',
        status: 'pending'
    },
    {
        id: 3,
        title: 'Sentiment Analysis',
        description: 'Analyzing positive, negative, and neutral sentiment',
        icon: 'fas fa-heart',
        status: 'pending'
    },
    {
        id: 4,
        title: 'Type Classification',
        description: 'Categorizing feedback vs suggestions',
        icon: 'fas fa-lightbulb',
        status: 'pending'
    }
];

// Global state
let processedComments = [];
let isProcessing = false;
let currentSteps = [...analysisSteps];

// DOM elements
const tabButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');
const commentsInput = document.getElementById('comments-input');
const analyzeCustomBtn = document.getElementById('analyze-custom-btn');
const analyzeSampleBtn = document.getElementById('analyze-sample-btn');
const resetBtn = document.getElementById('reset-btn');
const processingSection = document.getElementById('processing-section');
const stepsList = document.getElementById('steps-list');
const commentsList = document.getElementById('comments-list');
const commentCount = document.getElementById('comment-count');
const processingIndicator = document.getElementById('processing-indicator');
const analyticsContent = document.getElementById('analytics-content');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    renderSteps();
    renderAnalytics();
});

function initializeEventListeners() {
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });

    // Button event listeners
    analyzeCustomBtn.addEventListener('click', handleAnalyzeCustom);
    analyzeSampleBtn.addEventListener('click', handleAnalyzeSample);
    resetBtn.addEventListener('click', handleReset);
}

function switchTab(tabName) {
    // Update button states
    tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab content visibility
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });

    // Refresh analytics if switching to analytics tab
    if (tabName === 'analytics') {
        renderAnalytics();
    }
}

async function handleAnalyzeCustom() {
    const inputText = commentsInput.value.trim();
    if (!inputText) return;

    const customComments = inputText.split('\n')
        .filter(line => line.trim())
        .map((text, index) => ({
            id: `custom-${index}`,
            text: text.trim(),
            author: `User${index + 1}`,
            timestamp: 'Just now',
            platform: 'youtube'
        }));

    await analyzeComments(customComments);
}

async function handleAnalyzeSample() {
    await analyzeComments(sampleComments);
}

function handleReset() {
    processedComments = [];
    currentSteps = analysisSteps.map(step => ({ ...step, status: 'pending' }));
    isProcessing = false;
    
    commentsInput.value = '';
    processingSection.classList.add('hidden');
    
    renderSteps();
    renderComments();
    renderAnalytics();
    updateButtonStates();
}

async function analyzeComments(comments) {
    if (isProcessing) return;

    isProcessing = true;
    processedComments = [];
    currentSteps = analysisSteps.map(step => ({ ...step, status: 'pending' }));
    
    processingSection.classList.remove('hidden');
    updateButtonStates();
    showProcessingIndicator();

    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        const processedComment = await processComment(comment);
        processedComments.push(processedComment);
        
        renderComments();
        updateCommentCount();
    }

    isProcessing = false;
    hideProcessingIndicator();
    updateButtonStates();
    renderAnalytics();
}

async function processComment(comment) {
    // Step 1: Toxic Comment Detection
    updateStepStatus(1, 'processing');
    await sleep(300);
    
    const toxicAnalysis = analyzeToxicity(comment.text);
    updateStepStatus(1, 'completed');

    if (toxicAnalysis.isToxic) {
        updateStepStatus(2, 'skipped');
        updateStepStatus(3, 'skipped');
        updateStepStatus(4, 'skipped');
        
        return {
            ...comment,
            isProcessed: true,
            analysis: {
                isToxic: true,
                isSpam: false,
                sentiment: 'neutral',
                type: 'feedback',
                confidence: toxicAnalysis.confidence
            }
        };
    }

    // Step 2: Spam Detection
    updateStepStatus(2, 'processing');
    await sleep(300);
    
    const spamAnalysis = analyzeSpam(comment.text);
    updateStepStatus(2, 'completed');

    if (spamAnalysis.isSpam) {
        updateStepStatus(3, 'skipped');
        updateStepStatus(4, 'skipped');
        
        return {
            ...comment,
            isProcessed: true,
            analysis: {
                isToxic: false,
                isSpam: true,
                sentiment: 'neutral',
                type: 'feedback',
                confidence: spamAnalysis.confidence
            }
        };
    }

    // Step 3: Sentiment Analysis
    updateStepStatus(3, 'processing');
    await sleep(300);
    
    const sentimentAnalysis = analyzeSentiment(comment.text);
    updateStepStatus(3, 'completed');

    // Step 4: Type Classification
    updateStepStatus(4, 'processing');
    await sleep(300);
    
    const typeAnalysis = analyzeType(comment.text);
    updateStepStatus(4, 'completed');

    return {
        ...comment,
        isProcessed: true,
        analysis: {
            isToxic: false,
            isSpam: false,
            sentiment: sentimentAnalysis.sentiment,
            type: typeAnalysis.type,
            confidence: Math.min(sentimentAnalysis.confidence, typeAnalysis.confidence)
        }
    };
}

// Analysis functions (mock ML implementations)
function analyzeToxicity(text) {
    const toxicKeywords = ['dumb', 'stupid', 'garbage', 'hate', 'terrible', 'awful', 'worst'];
    const lowerText = text.toLowerCase();
    
    const toxicScore = toxicKeywords.reduce((score, keyword) => {
        return lowerText.includes(keyword) ? score + 0.3 : score;
    }, 0);
    
    return {
        isToxic: toxicScore > 0.2,
        confidence: Math.min(0.95, 0.6 + toxicScore)
    };
}

function analyzeSpam(text) {
    const spamKeywords = ['follow me', 'check out my', 'link in bio', 'giveaway', 'free', 'subscribe', 'plz', 'first!'];
    const lowerText = text.toLowerCase();
    
    let spamScore = spamKeywords.reduce((score, keyword) => {
        return lowerText.includes(keyword) ? score + 0.25 : score;
    }, 0);
    
    // Check for excessive emojis or caps
    const emojiCount = (text.match(/[\u{1f300}-\u{1f6ff}]|[\u{2600}-\u{27bf}]/gu) || []).length;
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    
    if (emojiCount > 3) spamScore += 0.2;
    if (capsRatio > 0.5) spamScore += 0.15;
    
    return {
        isSpam: spamScore > 0.3,
        confidence: Math.min(0.95, 0.5 + spamScore)
    };
}

function analyzeSentiment(text) {
    const positiveKeywords = ['love', 'great', 'amazing', 'awesome', 'good', 'nice', 'helped', 'thank', 'appreciate', 'excellent'];
    const negativeKeywords = ['bad', 'poor', 'terrible', 'awful', 'hate', 'worst', 'boring', 'disappointing'];
    
    const lowerText = text.toLowerCase();
    
    const positiveScore = positiveKeywords.reduce((score, keyword) => {
        return lowerText.includes(keyword) ? score + 1 : score;
    }, 0);
    
    const negativeScore = negativeKeywords.reduce((score, keyword) => {
        return lowerText.includes(keyword) ? score + 1 : score;
    }, 0);
    
    let sentiment = 'neutral';
    let confidence = 0.6;
    
    if (positiveScore > negativeScore) {
        sentiment = 'positive';
        confidence = Math.min(0.95, 0.6 + (positiveScore * 0.1));
    } else if (negativeScore > positiveScore) {
        sentiment = 'negative';
        confidence = Math.min(0.95, 0.6 + (negativeScore * 0.1));
    }
    
    return { sentiment, confidence };
}

function analyzeType(text) {
    const suggestionKeywords = ['try', 'should', 'could', 'maybe', 'consider', 'suggest', 'recommend', 'next time', 'would be better'];
    const feedbackKeywords = ['great', 'good', 'nice', 'love', 'like', 'keep up', 'amazing', 'awesome'];
    
    const lowerText = text.toLowerCase();
    
    const suggestionScore = suggestionKeywords.reduce((score, keyword) => {
        return lowerText.includes(keyword) ? score + 1 : score;
    }, 0);
    
    const feedbackScore = feedbackKeywords.reduce((score, keyword) => {
        return lowerText.includes(keyword) ? score + 1 : score;
    }, 0);
    
    const type = suggestionScore > feedbackScore ? 'suggestion' : 'feedback';
    const confidence = Math.min(0.95, 0.6 + (Math.max(suggestionScore, feedbackScore) * 0.1));
    
    return { type, confidence };
}

// UI Rendering functions
function renderSteps() {
    stepsList.innerHTML = currentSteps.map(step => `
        <div class="step-item">
            <div class="step-icon ${step.status}">
                ${step.status === 'processing' ? 
                    '<div class="spinner"></div>' : 
                    `<i class="${step.icon}"></i>`
                }
            </div>
            <div class="step-content">
                <h4>${step.title}</h4>
                <p>${step.description}</p>
            </div>
            <div class="step-status">
                ${getStatusIcon(step.status)}
            </div>
        </div>
    `).join('');
}

function renderComments() {
    if (processedComments.length === 0) {
        commentsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-comment-slash"></i>
                <p>No comments processed yet. Upload some comments to get started!</p>
            </div>
        `;
        return;
    }

    commentsList.innerHTML = processedComments.map(comment => `
        <div class="comment-card">
            <div class="comment-header">
                <div class="comment-author">
                    <strong>${comment.author}</strong>
                    <i class="platform-icon ${comment.platform} ${getPlatformIcon(comment.platform)}"></i>
                </div>
                <div class="comment-meta">
                    <span class="comment-timestamp">${comment.timestamp}</span>
                    <div class="status-badge ${getStatusClass(comment.analysis)}">
                        <i class="${getStatusIcon(comment.analysis)}"></i>
                        <span>${getStatusLabel(comment.analysis)}</span>
                    </div>
                </div>
            </div>
            <div class="comment-text">${comment.text}</div>
            ${renderCommentAnalysis(comment.analysis)}
        </div>
    `).join('');
}

function renderCommentAnalysis(analysis) {
    if (!analysis || analysis.isToxic || analysis.isSpam) {
        return '';
    }

    return `
        <div class="comment-analysis">
            <div class="analysis-tags">
                <div class="analysis-tag">
                    <i class="${getSentimentIcon(analysis.sentiment)}"></i>
                    <span>${analysis.sentiment}</span>
                </div>
                <div class="analysis-tag">
                    <i class="${getTypeIcon(analysis.type)}"></i>
                    <span>${analysis.type}</span>
                </div>
            </div>
            <div class="confidence">
                ${Math.round(analysis.confidence * 100)}% confidence
            </div>
        </div>
    `;
}

function renderAnalytics() {
    const analytics = getAnalytics();
    
    analyticsContent.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-card-content">
                    <div class="stat-info">
                        <h3>Total Comments</h3>
                        <div class="value">${analytics.totalComments}</div>
                        <div class="subtitle">Comments processed</div>
                    </div>
                    <div class="stat-icon blue">
                        <i class="fas fa-comment"></i>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-card-content">
                    <div class="stat-info">
                        <h3>Engagement Rate</h3>
                        <div class="value">${getEngagementRate(analytics)}%</div>
                        <div class="subtitle">Valid vs total comments</div>
                    </div>
                    <div class="stat-icon green">
                        <i class="fas fa-chart-line"></i>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-card-content">
                    <div class="stat-info">
                        <h3>Toxic Comments</h3>
                        <div class="value">${analytics.toxicComments}</div>
                        <div class="subtitle">Harmful content filtered</div>
                    </div>
                    <div class="stat-icon red">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-card-content">
                    <div class="stat-info">
                        <h3>Spam Filtered</h3>
                        <div class="value">${analytics.spamComments}</div>
                        <div class="subtitle">Irrelevant content removed</div>
                    </div>
                    <div class="stat-icon orange">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="analytics-details">
            <div class="detail-card">
                <div class="detail-header">
                    <i class="fas fa-heart" style="color: #ec4899;"></i>
                    <h3>Sentiment Analysis</h3>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-label">
                        <div class="color-dot green"></div>
                        <span>Positive</span>
                    </div>
                    <div class="breakdown-value">
                        ${analytics.sentimentBreakdown.positive} (${getPositivityRate(analytics)}%)
                    </div>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-label">
                        <div class="color-dot red"></div>
                        <span>Negative</span>
                    </div>
                    <div class="breakdown-value">${analytics.sentimentBreakdown.negative}</div>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-label">
                        <div class="color-dot gray"></div>
                        <span>Neutral</span>
                    </div>
                    <div class="breakdown-value">${analytics.sentimentBreakdown.neutral}</div>
                </div>
            </div>
            
            <div class="detail-card">
                <div class="detail-header">
                    <i class="fas fa-lightbulb" style="color: #7c3aed;"></i>
                    <h3>Comment Types</h3>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-label">
                        <i class="fas fa-comment" style="color: #3b82f6;"></i>
                        <span>Feedback</span>
                    </div>
                    <div class="breakdown-value">${analytics.typeBreakdown.feedback}</div>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-label">
                        <i class="fas fa-lightbulb" style="color: #7c3aed;"></i>
                        <span>Suggestions</span>
                    </div>
                    <div class="breakdown-value">${analytics.typeBreakdown.suggestions}</div>
                </div>
                ${analytics.typeBreakdown.suggestions > 0 ? `
                    <div class="insight-box">
                        <p>💡 You have ${analytics.typeBreakdown.suggestions} actionable suggestions from your audience!</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Utility functions
function updateStepStatus(stepId, status) {
    currentSteps = currentSteps.map(step => 
        step.id === stepId ? { ...step, status } : step
    );
    renderSteps();
}

function updateCommentCount() {
    commentCount.textContent = processedComments.length;
}

function showProcessingIndicator() {
    processingIndicator.classList.remove('hidden');
}

function hideProcessingIndicator() {
    processingIndicator.classList.add('hidden');
}

function updateButtonStates() {
    const buttons = [analyzeCustomBtn, analyzeSampleBtn, resetBtn];
    buttons.forEach(btn => {
        btn.disabled = isProcessing;
    });
}

function getAnalytics() {
    const totalComments = processedComments.length;
    const toxicComments = processedComments.filter(c => c.analysis?.isToxic).length;
    const spamComments = processedComments.filter(c => c.analysis?.isSpam).length;
    const validComments = processedComments.filter(c => !c.analysis?.isToxic && !c.analysis?.isSpam).length;
    
    const validCommentsWithAnalysis = processedComments.filter(c => 
        !c.analysis?.isToxic && !c.analysis?.isSpam && c.analysis
    );
    
    const sentimentBreakdown = {
        positive: validCommentsWithAnalysis.filter(c => c.analysis?.sentiment === 'positive').length,
        negative: validCommentsWithAnalysis.filter(c => c.analysis?.sentiment === 'negative').length,
        neutral: validCommentsWithAnalysis.filter(c => c.analysis?.sentiment === 'neutral').length,
    };
    
    const typeBreakdown = {
        feedback: validCommentsWithAnalysis.filter(c => c.analysis?.type === 'feedback').length,
        suggestions: validCommentsWithAnalysis.filter(c => c.analysis?.type === 'suggestion').length,
    };
    
    return {
        totalComments,
        toxicComments,
        spamComments,
        validComments,
        sentimentBreakdown,
        typeBreakdown
    };
}

function getEngagementRate(analytics) {
    if (analytics.totalComments === 0) return 0;
    return Math.round((analytics.validComments / analytics.totalComments) * 100);
}

function getPositivityRate(analytics) {
    const validComments = analytics.sentimentBreakdown.positive + 
                         analytics.sentimentBreakdown.negative + 
                         analytics.sentimentBreakdown.neutral;
    if (validComments === 0) return 0;
    return Math.round((analytics.sentimentBreakdown.positive / validComments) * 100);
}

function getPlatformIcon(platform) {
    switch (platform) {
        case 'youtube': return 'fab fa-youtube';
        case 'instagram': return 'fab fa-instagram';
        case 'facebook': return 'fab fa-facebook';
        default: return 'fas fa-comment';
    }
}

function getStatusClass(analysis) {
    if (!analysis) return 'pending';
    if (analysis.isToxic) return 'toxic';
    if (analysis.isSpam) return 'spam';
    return 'valid';
}

function getStatusLabel(analysis) {
    if (!analysis) return 'Pending';
    if (analysis.isToxic) return 'Toxic';
    if (analysis.isSpam) return 'Spam';
    return 'Valid';
}

function getStatusIcon(status) {
    if (typeof status === 'string') {
        switch (status) {
            case 'completed': return '<i class="fas fa-check-circle" style="color: #10b981;"></i>';
            case 'processing': return '<div class="spinner"></div>';
            case 'skipped': return '<i class="fas fa-circle" style="color: #9ca3af;"></i>';
            default: return '<i class="fas fa-circle" style="color: #e5e7eb;"></i>';
        }
    } else {
        // Analysis object
        if (!status) return 'fas fa-clock';
        if (status.isToxic) return 'fas fa-shield-alt';
        if (status.isSpam) return 'fas fa-exclamation-triangle';
        return 'fas fa-heart';
    }
}

function getSentimentIcon(sentiment) {
    switch (sentiment) {
        case 'positive': return 'fas fa-smile';
        case 'negative': return 'fas fa-frown';
        default: return 'fas fa-meh';
    }
}

function getTypeIcon(type) {
    return type === 'suggestion' ? 'fas fa-lightbulb' : 'fas fa-comment';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}