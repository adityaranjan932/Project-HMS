# MongoDB Connection Configuration Guide

## Current Configuration

The MongoDB connection is configured in `/backend/config/dataBase.js`:

```javascript
const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log("DB connected successfully"))
        .catch((error) => {
            console.log("DB connection failed");
            console.error(error);
            process.exit(1);
        });
};
```

## Required Environment Variables

Create a `.env` file in the `/backend` directory with the following variable:

```env
MONGODB_URL=mongodb://localhost:27017/project-hms
# OR for MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/project-hms?retryWrites=true&w=majority
```

## MongoDB Connection Troubleshooting

### Common Issues and Solutions

1. **Connection String Format**
   ```javascript
   // Local MongoDB
   MONGODB_URL=mongodb://localhost:27017/project-hms
   
   // MongoDB Atlas
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/project-hms?retryWrites=true&w=majority
   
   // MongoDB with authentication
   MONGODB_URL=mongodb://username:password@localhost:27017/project-hms
   ```

2. **Environment Variable Not Found**
   - Ensure `.env` file is in `/backend` directory
   - Verify the variable name is exactly `MONGODB_URL`
   - Restart the server after creating/modifying `.env`

3. **Network/Firewall Issues**
   - Check if MongoDB service is running
   - Verify port 27017 is accessible (for local MongoDB)
   - Check network connectivity for MongoDB Atlas

4. **Authentication Errors**
   - Verify username/password in connection string
   - Check database user permissions
   - Ensure user has read/write access to the database

### Testing Connection

Create a simple test script to verify MongoDB connection:

```javascript
// test-db-connection.js
require("dotenv").config();
const mongoose = require("mongoose");

const testConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("✅ MongoDB connection successful!");
        
        // Test basic operations
        const testCollection = mongoose.connection.db.collection('test');
        await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
        console.log("✅ Write operation successful!");
        
        const result = await testCollection.findOne({ test: 'connection' });
        console.log("✅ Read operation successful!", result);
        
        await testCollection.deleteOne({ test: 'connection' });
        console.log("✅ Delete operation successful!");
        
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("Connection closed");
    }
};

testConnection();
```

### Enhanced Error Handling

Consider updating the connection configuration for better error handling:

```javascript
const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    // Validate environment variable
    if (!process.env.MONGODB_URL) {
        console.error("❌ MONGODB_URL environment variable is not set");
        process.exit(1);
    }

    // Set mongoose options for better error handling
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferMaxEntries: 0 // Disable mongoose buffering
    };

    mongoose.connect(process.env.MONGODB_URL, options)
        .then(() => {
            console.log("✅ DB connected successfully");
            console.log(`📍 Connected to: ${mongoose.connection.host}:${mongoose.connection.port}`);
            console.log(`🗃️  Database: ${mongoose.connection.name}`);
        })
        .catch((error) => {
            console.log("❌ DB connection failed");
            console.error("Error details:", error.message);
            
            // Provide specific error guidance
            if (error.message.includes('ENOTFOUND')) {
                console.error("💡 Suggestion: Check your MongoDB host/URL");
            } else if (error.message.includes('authentication failed')) {
                console.error("💡 Suggestion: Check your username/password");
            } else if (error.message.includes('ECONNREFUSED')) {
                console.error("💡 Suggestion: Ensure MongoDB service is running");
            }
            
            process.exit(1);
        });

    // Handle connection events
    mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
    });
};
```

## Complete .env Template

Create `/backend/.env` with these variables:

```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017/project-hms

# Server Configuration
PORT=4000

# JWT Configuration (if used)
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d

# Other environment variables as needed
NODE_ENV=development
```

## MongoDB Setup Instructions

### Local MongoDB Setup

1. **Install MongoDB:**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install mongodb
   
   # macOS with Homebrew
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Windows - Download from MongoDB website
   ```

2. **Start MongoDB Service:**
   ```bash
   # Ubuntu/Debian
   sudo systemctl start mongodb
   sudo systemctl enable mongodb
   
   # macOS
   brew services start mongodb/brew/mongodb-community
   
   # Windows - Start as service or run mongod.exe
   ```

3. **Verify Installation:**
   ```bash
   # Connect to MongoDB shell
   mongosh
   # or older versions
   mongo
   ```

### MongoDB Atlas Setup (Cloud)

1. **Create Atlas Account:** Visit https://www.mongodb.com/atlas
2. **Create Cluster:** Follow Atlas setup wizard
3. **Create Database User:** Set username/password
4. **Configure Network Access:** Add your IP address
5. **Get Connection String:** Copy from Atlas dashboard

## Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` files to version control
   - Use different databases for development/production
   - Keep connection strings secure

2. **Database Security:**
   - Use strong passwords
   - Enable authentication
   - Restrict network access
   - Regular backups

3. **Application Security:**
   - Validate all inputs
   - Use parameterized queries
   - Implement proper error handling
   - Monitor database connections

## Production Considerations

1. **Connection Pooling:** Configure appropriate pool size
2. **Monitoring:** Set up database monitoring
3. **Backup Strategy:** Regular automated backups
4. **Performance:** Index optimization and query optimization
5. **Scaling:** Consider replica sets and sharding for large applications