# Task Timer - Study Focus App

A productivity web application for tracking study tasks, exercise activities, and rewards. The app helps users manage their time effectively and stay motivated.

## Features

- Track study tasks with timer or stopwatch modes
- Log exercise activities
- Manage rewards
- Credit system for completed tasks
- Dark mode support
- Data export/import functionality
- Mobile-friendly design
- Local storage for data persistence

## Deployment

This app is configured for easy deployment to Netlify:

1. Connect your GitHub repository to Netlify
2. Configure the build settings:
   - Build command: (leave empty)
   - Publish directory: `.`
3. Deploy!

## Local Development

To run the app locally:

```bash
# If you have Node.js installed:
npx serve

# Or simply open index.html in your browser
```

## Data Persistence

The app uses localStorage for data persistence. This means:
- Data is stored in the browser and persists between sessions
- Data is tied to the specific domain and browser
- Different devices will have separate data stores
- Clearing browser data will remove stored information

To transfer data between devices, use the Export/Import functionality in the app.
