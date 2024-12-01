# 📅 Todoist to Apple Reminders Migrator 🔄

## 🚀 Overview
This script helps you seamlessly migrate your Todoist tasks to Apple Reminders, making task management transitions smooth and easy!

## 🛠 Prerequisites
- Node.js (v14 or later) 💻
- Todoist account 📋
- macOS (for Apple Reminders integration) 🍎

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/cuongndc9/todoist_to_reminder.git
cd todoist_to_reminder
```

### 2. Install Dependencies
```bash
npm install
```

## 🔑 Getting Your Todoist API Token

1. Go to [Todoist Developer Console](https://developer.todoist.com/)
2. Create a new integration or personal access token
3. Ensure the token has read access to tasks 🕵️‍♀️

## 🔧 Configuration

### Create .env File
Create a file named `.env` in the project root:
```
TODOIST_API_TOKEN=your_todoist_api_token_here
```

## 🚦 Usage Options

### 1. Migrate All Tasks
```bash
npm start
```
This will migrate ALL tasks from your Todoist account to Apple Reminders.

### 2. Migrate Tasks from Specific Project
Edit the `main()` function in the script to specify a project ID:
```typescript
const results = await migrator.migrateTasks(YOUR_PROJECT_ID);
```

## 🚨 Important Notes
- This is a one-way migration 🔀
- Does not transfer:
  - Subtasks 
  - Labels
  - Priority details
- Requires manual verification of migrated tasks 🕵️‍♀️

## 🛡 Troubleshooting

### Common Issues
- **No tasks migrating?** 
  - Check your Todoist API token
  - Verify network connection
  - Ensure you have tasks in Todoist

### Error Handling
The script provides detailed console logs to help diagnose migration issues.

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## ⚖️ Limitations
- Requires macOS
- AppleScript dependency
- Limited task metadata transfer

## 📜 License
MIT License

## 🙌 Acknowledgments
- Todoist API
- Node.js Community
- Apple Reminders

---

**Happy Task Migration!** 🎉✨