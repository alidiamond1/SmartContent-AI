# Gemini Model Options

If you encounter model errors, try these models in order:

## ✅ Recommended (Try First)
```javascript
model: 'gemini-1.5-flash-latest'  // Currently set
```

## 🔄 Alternatives (If above doesn't work)

### Option 1: Explicit version
```javascript
model: 'models/gemini-1.5-flash'
```

### Option 2: Pro version (slower but more powerful)
```javascript
model: 'gemini-1.5-pro-latest'
```

### Option 3: Stable fallback
```javascript
model: 'gemini-pro'
```

## How to Change Model

Open `backend/controllers/blogController.js` and find these 3 lines:

**Line 40:**
```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
```

**Line 98:**
```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
```

**Line 282:**
```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
```

Replace `'gemini-1.5-flash-latest'` with any model name from the alternatives above.

## Check Available Models

You can list all available models by visiting:
```
https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY
```

Replace `YOUR_API_KEY` with your actual Gemini API key.

