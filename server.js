const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data storage (in production, this would be a database)
let items = [
  {
    "_id": "1751991932030",
    "name": "Cap",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Cap.png?etag=f3dad389b22909cafa73cff9f9a3d591",
    "weather": "hot",
    "owner": "1",
    "likes": []
  },
  {
    "_id": "0",
    "name": "Beanie",
    "weather": "cold",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Beanie.png?etag=bc10497cc80fa557f036e94f9999f7b2",
    "owner": "1",
    "likes": []
  },
  {
    "_id": "3",
    "name": "Coat",
    "weather": "cold",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Coat.png?etag=298717ed89d5e40b1954a1831ae0bdd4",
    "owner": "1",
    "likes": []
  },
  {
    "_id": "5",
    "name": "Hoodie",
    "weather": "cold",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Hoodie.png?etag=5f52451d0958ccb1016c78a45603a4e8",
    "owner": "1",
    "likes": []
  },
  {
    "_id": "6",
    "name": "Jacket",
    "weather": "cold",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Jacket.png?etag=f4bb188deaa25ac84ce2338be2d404ad",
    "owner": "1",
    "likes": []
  },
  {
    "_id": "10",
    "name": "Scarf",
    "weather": "cold",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Scarf.png?etag=74efbee93810c926b5507e862c6cb76c",
    "owner": "1",
    "likes": []
  },
  {
    "_id": "16",
    "name": "T-Shirt",
    "weather": "hot",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/T-Shirt.png?etag=44ed1963c44ab19cd2f5011522c5fc09",
    "owner": "1",
    "likes": []
  },
  {
    "_id": "19",
    "name": "cap",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Cap.png?etag=f3dad389b22909cafa73cff9f9a3d591",
    "weather": "cold",
    "owner": "1",
    "likes": []
  },
  {
    "_id": "n76y",
    "name": "Sunglasses",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Sunglasses.png?etag=a1bced9e331d36cb278c45df51150432",
    "weather": "warm",
    "owner": "1",
    "likes": []
  }
];

let users = [
  {
    "_id": "1",
    "name": "Terrence Tegegne",
    "avatar": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/avatar.svg",
    "email": "terrence@example.com"
  }
];

// Authentication middleware (simplified for demo)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // For demo purposes, accept any token
  // In production, you would verify the JWT token
  req.user = { id: '1' };
  next();
};

// Routes

// Get all items
app.get('/items', (req, res) => {
  res.json(items);
});

// Get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// Add new item
app.post('/items', authenticateToken, (req, res) => {
  const { name, imageUrl, weather } = req.body;
  
  if (!name || !imageUrl || !weather) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newItem = {
    _id: Date.now().toString(),
    name,
    imageUrl,
    weather,
    owner: req.user.id,
    likes: []
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

// Delete item
app.delete('/items/:id', authenticateToken, (req, res) => {
  const itemId = req.params.id;
  const itemIndex = items.findIndex(item => item._id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  // Check if user owns the item
  if (items[itemIndex].owner !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to delete this item' });
  }

  items.splice(itemIndex, 1);
  res.status(200).json({ message: 'Item deleted successfully' });
});

// Like item
app.put('/items/:id/likes', authenticateToken, (req, res) => {
  const itemId = req.params.id;
  const item = items.find(item => item._id === itemId);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const userId = req.user.id;
  
  if (!item.likes.includes(userId)) {
    item.likes.push(userId);
  }

  res.json(item);
});

// Unlike item
app.delete('/items/:id/likes', authenticateToken, (req, res) => {
  const itemId = req.params.id;
  const item = items.find(item => item._id === itemId);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const userId = req.user.id;
  item.likes = item.likes.filter(id => id !== userId);

  res.json(item);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Items API: http://localhost:${PORT}/items`);
  console.log(`Users API: http://localhost:${PORT}/users`);
});

module.exports = app;
