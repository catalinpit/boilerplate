# Reddit Keyword Monitoring Tool

A powerful, automated Reddit keyword monitoring system built with Next.js 15, tRPC, and PostgreSQL. Monitor multiple subreddits for specific keywords and get real-time notifications when matching posts or comments are found.

## ✨ Features

### 🎯 Smart Monitoring
- **Keyword Tracking**: Monitor multiple keywords across various subreddits
- **Real-time Detection**: Automatically find posts and comments containing your keywords
- **Automated Scheduling**: Set custom intervals (5-60 minutes) for monitoring
- **Duplicate Prevention**: Smart filtering to avoid saving duplicate content

### 📊 Comprehensive Analytics
- **Dashboard Overview**: View all your monitors and their performance
- **Detailed Statistics**: Track posts found, comments found, and execution history
- **Monitor Performance**: See success rates and error logs
- **Historical Data**: Access complete history of found content

### 🔧 Advanced Configuration
- **Multiple Subreddits**: Monitor as many subreddits as needed per monitor
- **Flexible Keywords**: Support for multiple keywords with OR logic
- **Rate Limit Compliance**: Built-in respect for Reddit API rate limits
- **User-specific Monitoring**: Each user has their own isolated monitors

### 🎨 Modern UI
- **Beautiful Dashboard**: Clean, responsive interface built with Tailwind CSS
- **Real-time Updates**: Live status updates using tRPC and React Query
- **Mobile Friendly**: Fully responsive design for all devices
- **Intuitive Navigation**: Easy-to-use interface for managing monitors

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Reddit API credentials

### 1. Environment Setup

Copy `.env.local.example` to `.env.local` and configure:

```bash
cp .env.local.example .env.local
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push
```

### 3. Reddit API Configuration

1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Click "Create App" or "Create Another App"
3. Fill in the details:
   - **Name**: Your app name
   - **App type**: Select "script"
   - **Description**: Brief description
   - **Redirect URI**: `http://localhost:3000`
4. Note your Client ID and Client Secret
5. Update your `.env.local` file:

```env
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_USER_AGENT=YourApp:v1.0.0 (by /u/yourusername)
```

### 4. Start the Application

```bash
npm run dev
```

Visit `http://localhost:3000` and navigate to the Reddit Monitor section.

## 📖 Usage Guide

### Creating Your First Monitor

1. **Access the Monitor Dashboard**
   - Navigate to `/reddit-monitor` after logging in
   - Click "Create Monitor" or "Create Your First Monitor"

2. **Configure Monitor Settings**
   - **Name**: Give your monitor a descriptive name
   - **Description**: Optional description of what you're monitoring
   - **Subreddits**: List subreddits separated by commas (without r/)
   - **Keywords**: List keywords separated by commas
   - **Check Interval**: How often to check (5-60 minutes)

3. **Example Configuration**
   ```
   Name: Tech News Monitor
   Description: Monitor for AI and tech news
   Subreddits: technology, programming, MachineLearning, artificial
   Keywords: artificial intelligence, machine learning, neural network, AI breakthrough
   Check Interval: 15 minutes
   ```

### Managing Monitors

- **View Details**: Click on any monitor to see detailed results
- **Run Manually**: Use "Run Now" to execute monitoring immediately
- **Edit Settings**: Update keywords, subreddits, or intervals
- **Delete**: Remove monitors you no longer need

### Understanding Results

#### Posts Tab
- Shows Reddit posts that match your keywords
- Displays title, content preview, author, subreddit, and score
- Highlights which keywords were matched
- Direct links to original Reddit posts

#### Comments Tab
- Shows comments that match your keywords
- Displays comment content, author, subreddit, and score
- Links to original comment threads

#### Execution History
- View all monitor runs with timestamps
- See success/failure status and error messages
- Track performance over time

## 🏗️ Architecture

### Database Schema

The monitoring system uses four main tables:

- **`reddit_monitors`**: Monitor configurations and settings
- **`reddit_posts`**: Found posts matching keywords
- **`reddit_comments`**: Found comments matching keywords  
- **`monitor_runs`**: Execution history and logs

### Key Components

- **`RedditClient`**: Handles Reddit API interactions with rate limiting
- **`MonitoringService`**: Manages scheduled monitoring and execution
- **`tRPC Router`**: Type-safe API endpoints for all operations
- **Cron Jobs**: Automated scheduling using node-cron

## ⚙️ Configuration Options

### Monitor Settings

| Setting | Description | Range |
|---------|-------------|--------|
| Check Interval | How often to check for new content | 5-60 minutes |
| Subreddits | List of subreddits to monitor | Unlimited |
| Keywords | Keywords to search for | Unlimited |
| Active Status | Whether monitor is running | Boolean |

### Reddit API Settings

| Variable | Description | Required |
|----------|-------------|----------|
| `REDDIT_CLIENT_ID` | Reddit app client ID | Yes |
| `REDDIT_CLIENT_SECRET` | Reddit app client secret | Yes |
| `REDDIT_REFRESH_TOKEN` | OAuth refresh token | Optional* |
| `REDDIT_USER_AGENT` | User agent string | Yes |

*Required for automated monitoring; manual runs work without it.

## 🚨 Rate Limiting & Best Practices

### Reddit API Limits
- **100 requests/minute** with OAuth authentication
- **10 requests/minute** without OAuth
- **1 request/second** recommended to avoid issues

### Best Practices
1. **Start Small**: Begin with 1-2 subreddits and a few keywords
2. **Reasonable Intervals**: Use 10+ minute intervals for new setups
3. **Monitor Performance**: Check execution history for errors
4. **Keyword Optimization**: Use specific, relevant keywords to reduce noise

## 🛠️ Troubleshooting

### Common Issues

**"Reddit client not initialized"**
- Check your Reddit API credentials in `.env.local`
- Ensure `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET` are set
- Restart the application after updating environment variables

**"Monitor not finding results"**
- Verify subreddit names are correct (without r/ prefix)
- Check if keywords are too specific
- Try manual execution to test immediately

**Rate limit errors**
- Increase check intervals between monitors
- Reduce number of active monitors
- Check for multiple instances running

### Getting Help

1. **Setup Guide**: Visit `/reddit-monitor/setup` for detailed configuration steps
2. **API Documentation**: Check [Reddit API docs](https://www.reddit.com/dev/api/) for API-specific issues
3. **Community**: Visit [r/redditdev](https://www.reddit.com/r/redditdev) for Reddit API help

## 🔒 Security & Privacy

- **API Keys**: Never commit Reddit API credentials to version control
- **User Isolation**: Each user's monitors are completely isolated
- **Data Retention**: Configure data cleanup policies as needed
- **Rate Limiting**: Built-in protection against API abuse

## 🤝 Contributing

This Reddit monitoring tool is part of a larger Next.js boilerplate. Contributions are welcome!

### Development Setup

```bash
# Clone the repository
git clone <your-repo>
cd <your-project>

# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Configure your Reddit API credentials

# Set up database
npm run db:push

# Start development server
npm run dev
```

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [snoowrap](https://github.com/not-an-aardvark/snoowrap) for Reddit API integration
- Uses [node-cron](https://github.com/node-cron/node-cron) for scheduling
- Powered by the amazing Next.js, tRPC, and Drizzle ecosystem