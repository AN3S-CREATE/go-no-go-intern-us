import axios from 'axios';
import type { InnovationCard, SwipeDecision } from '../types';

const api = axios.create({
  baseURL: '/api/taskade',
});

export const innovationApi = {
  async getAll(): Promise<InnovationCard[]> {
    const response = await api.get('/projects/WGtW77Vk9smeBUvE/nodes');
    return response.data.payload.nodes.map((node: any) => ({
      id: node.id,
      title: node.fieldValues['/text'] || '',
      what: node.fieldValues['/attributes/@desc1'] || '',
      why: node.fieldValues['/attributes/@why01'] || '',
      category: node.fieldValues['/attributes/@cat01'] || 'opt-tech',
    }));
  },
};

export const swipeApi = {
  async logSwipe(data: {
    user: string;
    innovationCard: string;
    notes: string;
  }): Promise<void> {
    const timestamp = new Date().toISOString();
    await api.post('/projects/yU6YnSwNGefJYKr9/nodes', {
      '/text': `Swipe: ${data.innovationCard}`,
      '/attributes/@user1': data.user,
      '/attributes/@card1': data.innovationCard,
      '/attributes/@time1': timestamp,
      '/attributes/@note1': data.notes,
      '/attributes/@stat2': 'opt-pending',
    });
  },

  async getAll(): Promise<SwipeDecision[]> {
    const response = await api.get('/projects/yU6YnSwNGefJYKr9/nodes');
    return response.data.payload.nodes.map((node: any) => ({
      id: node.id,
      user: node.fieldValues['/attributes/@user1'] || '',
      innovationCard: node.fieldValues['/attributes/@card1'] || '',
      timestamp: node.fieldValues['/attributes/@time1'] || '',
      notes: node.fieldValues['/attributes/@note1'] || '',
      managementDecision: node.fieldValues['/attributes/@stat2'] || 'opt-pending',
      decisionMaker: node.fieldValues['/attributes/@deci1'] || '',
    }));
  },

  async updateDecision(data: {
    nodeId: string;
    decision: string;
    decisionMaker: string;
  }): Promise<void> {
    await api.patch(`/projects/yU6YnSwNGefJYKr9/nodes/${data.nodeId}`, {
      '/attributes/@stat2': data.decision,
      '/attributes/@deci1': data.decisionMaker,
    });
  },
};

export const aiApi = {
  async askQuestion(question: string, context: string): Promise<string> {
    try {
      const response = await api.post('/webhooks/01KATTN6W2HR9H432S747FY9K1/run', {
        question,
        context,
      });
      
      return response.data.body.response || 'I apologize, but I encountered an issue processing your question. Please try again.';
    } catch (error) {
      console.error('AI API Error:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  },

  async saveChatHistory(data: {
    user: string;
    innovationCard: string;
    category: string;
    conversation: string;
  }): Promise<void> {
    const timestamp = new Date().toISOString();
    await api.post('/projects/CbwmNRW4vw22KUTo/nodes', {
      '/text': `Chat: ${data.innovationCard}`,
      '/attributes/@user2': data.user,
      '/attributes/@chat1': data.innovationCard,
      '/attributes/@cat02': data.category,
      '/attributes/@conv1': data.conversation,
      '/attributes/@time2': timestamp,
    });
  },
};
