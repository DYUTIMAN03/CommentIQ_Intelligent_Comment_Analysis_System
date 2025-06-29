import { Comment } from '../types';

export const sampleComments: Omit<Comment, 'isProcessed' | 'analysis'>[] = [
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