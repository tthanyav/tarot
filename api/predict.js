// Vercel Serverless Function for AI Tarot Predictions
// This keeps the API key secure on the server

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Get API key from environment variable
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log('API Key exists:', OPENAI_API_KEY ? 'Yes' : 'No');

    // Call OpenAI API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25 second timeout

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "หมอดูไพ่ทาโรต์มืออาชีพ ให้คำทำนายภาษาไทยกระชับ อบอุ่น"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 800
      }),
      signal: controller.signal
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      return res.status(response.status).json({
        error: 'ไม่สามารถเชื่อมต่อกับหมอดู AI ได้ในขณะนี้'
      });
    }

    const data = await response.json();

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return res.status(200).json({
        prediction: data.choices[0].message.content
      });
    } else {
      return res.status(500).json({ error: 'Invalid response format' });
    }

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการประมวลผล'
    });
  }
}
