# Veralogix Innovation Swipe 🚀

> AI-powered innovation decision platform for South African commercial real estate

## Overview

Veralogix Innovation Swipe is a Tinder-style decision-making platform that helps property management teams evaluate and prioritize innovation opportunities. Built with React, TypeScript, and Taskade's powerful backend.

## Key Features

### 🎯 Swipe Interface
- Intuitive card-based UI for quick decision making
- Swipe right to present, left to pass
- Detailed view with AI insights and analytics

### 🤖 AI Assistant
- Context-aware responses for each innovation
- Financial analysis and ROI projections
- Risk assessment and mitigation strategies
- Implementation guidance

### 📊 Data Visualization
- Cost breakdown charts
- Implementation timelines
- Risk distribution analysis
- Category-based insights

### 📝 Decision Tracking
- Full audit trail of all decisions
- User identification
- Management decision status
- Decision maker tracking
- Timestamp logging

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **UI Components:** Radix UI
- **Charts:** Recharts
- **State:** Zustand
- **Backend:** Taskade API
- **AI:** Custom webhook integration

## Project Structure

```
src/
├── components/          # React components
│   ├── SwipeCard.tsx   # Main swipe card
│   ├── DetailsModal.tsx # Detailed view
│   ├── AIAssistant.tsx # AI chat interface
│   ├── DataViz.tsx     # Charts and visualizations
│   └── ...
├── services/           # API integrations
│   └── api.ts         # Taskade API client
├── store/             # Zustand state management
│   └── useAppStore.ts
├── types/             # TypeScript definitions
│   └── index.ts
└── lib/               # Utilities
    └── utils.ts
```

## Data Flow

```
Innovation Cards → User Swipes → AI Analysis → Management Decision → Audit Log
       ↓                ↓              ↓               ↓                ↓
   Taskade DB      Decision Log   AI Webhook    Status Update    Full History
```

## Taskade Projects

### 1. Innovation Cards (T1aBbBCRWTJBw2td)
Stores all innovation opportunities with:
- Title, Description, Why
- Category (Tech, Sustainability, Operations, Tenant)

### 2. Swipe Decisions Log (pd17wJxuUmq9FDud)
Tracks all user decisions with:
- User name
- Innovation card
- Timestamp
- Notes
- Management decision status
- Decision maker

### 3. AI Chat History (xNs2NkixuopZFY1v)
Saves AI conversations with:
- User
- Innovation card
- Category
- Full conversation
- Timestamp

### 4. Management Summaries (Ld1Ks2NkixuopZFY1v)
Executive summaries with:
- Summary date
- Total swipes
- Executive summary
- Management response
- Action taken

## API Integration

All data operations use the Taskade API:

```typescript
// Get innovations
GET /api/taskade/projects/T1aBbBCRWTJBw2td/nodes

// Log swipe decision
POST /api/taskade/projects/pd17wJxuUmq9FDud/nodes

// Save AI chat
POST /api/taskade/projects/xNs2NkixuopZFY1v/nodes

// AI assistant
POST /api/taskade/webhooks/01K73ZNZ41HJN6PC905V828GCR/run
```

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment
No environment variables needed - all configuration is in the code.

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete deployment instructions.

### Quick Deploy
1. Build the application: `npm run build`
2. Deploy `dist/` folder to your hosting service
3. Ensure API routes are properly configured
4. Test all features in production

## User Guide

### For Presenters
1. Enter your name during onboarding
2. Swipe through innovation cards
3. Tap "Explore More" for detailed analysis
4. Use AI assistant for insights
5. Present innovations to management

### For Management
1. Open "Swipe Decisions Log" in Taskade
2. Review pending innovations
3. Update "Management Decision" status
4. Enter your name in "Decision Maker" field
5. Add notes if needed

## Features in Detail

### Swipe Mechanics
- **Right Swipe:** Present to management
- **Left Swipe:** Pass on innovation
- **Tap Card:** Open detailed view
- **Explore More:** AI-assisted analysis

### AI Assistant
- Ask questions about the innovation
- Get financial projections
- Understand risks
- Learn implementation steps
- Save chat history

### Analytics
- **Cost Breakdown:** Visual chart of expenses
- **Timeline:** Implementation phases
- **Risk Distribution:** Low/Medium/High analysis
- **Category Insights:** Tech, Sustainability, etc.

## Security

- ✅ No sensitive data in frontend code
- ✅ Secure Taskade API integration
- ✅ Private project data storage
- ✅ No external API keys exposed

## Performance

- ⚡ Optimized bundle size
- ⚡ Lazy loading for components
- ⚡ Efficient state management
- ⚡ Responsive design
- ⚡ Fast API responses

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Troubleshooting

### Common Issues

**Cards not loading:**
- Check network connection
- Verify Taskade API is accessible
- Check browser console for errors

**AI not responding:**
- Verify webhook is active
- Check network requests
- Ensure proper context is provided

**Swipes not saving:**
- Verify user name is set
- Check API permissions
- Review network logs

## Contributing

This is a production application. For changes:
1. Test thoroughly in development
2. Update documentation
3. Verify all features work
4. Deploy to staging first

## License

Proprietary - Veralogix

## Support

For technical support or questions:
- Check documentation first
- Review deployment guide
- Contact development team

---

**Version:** 1.1.0  
**Status:** Production Ready  
**Last Updated:** October 9, 2025
