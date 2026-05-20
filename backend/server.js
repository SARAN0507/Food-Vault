require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app = express();

// ── MIDDLEWARE ────────────────────────────────
app.use(cors());
app.use(express.json());

// ── ROOT ROUTE ────────────────────────────────
app.get('/', (req, res) => {
  res.send('FoodVault Backend is Running!');
});

// ── DATABASE CONNECTION ───────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch(err => console.log('❌ MongoDB connection failed:', err));

// ── SCHEMA & MODEL ────────────────────────────
const foodSchema = new mongoose.Schema(
  {
    foodName:        { type: String, required: true, trim: true },
    foodDescription: { type: String, required: true, trim: true }
  },
  { timestamps: true }   // adds createdAt and updatedAt automatically
);

const Food = mongoose.model('Food', foodSchema);

// ── ROUTES ────────────────────────────────────

// GET all foods  (newest first)
app.get('/api/food', async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single food by ID
app.get('/api/food/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST  — add new food
app.post('/api/food', async (req, res) => {
  try {
    const { foodName, foodDescription } = req.body;

    if (!foodName || !foodDescription) {
      return res.status(400).json({ message: 'Both foodName and foodDescription are required.' });
    }

    const newFood = new Food({ foodName, foodDescription });
    await newFood.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT  — edit existing food
app.put('/api/food/:id', async (req, res) => {
  try {
    const { foodName, foodDescription } = req.body;

    if (!foodName || !foodDescription) {
      return res.status(400).json({ message: 'Both foodName and foodDescription are required.' });
    }

    const updated = await Food.findByIdAndUpdate(
      req.params.id,
      { foodName, foodDescription },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Food not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE  — remove a food
app.delete('/api/food/:id', async (req, res) => {
  try {
    const deleted = await Food.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Food not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── START SERVER ──────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});