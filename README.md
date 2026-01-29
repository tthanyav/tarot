# TAROT - เปิดไพ่ค้นหาคำตอบ

A beautiful Thai Tarot card reading web application.

## Features

- Multiple spread types (1, 2, 3, 4, 10, and 12 card spreads)
- Interactive card selection with smooth animations
- Save reading results as images
- Reading counter with Firebase integration
- Fully responsive design for mobile and desktop
- Beautiful Thai typography and elegant UI

## Project Structure

```
hello-world-app/
├── index.html      # Main HTML file (8.6KB)
├── styles.css      # All CSS styles (14KB)
├── script.js       # JavaScript + Tarot card data (13MB with base64 images)
└── README.md       # This file
```

## GitHub Pages Deployment

### Option 1: Direct Upload

1. Create a new repository on GitHub
2. Upload all files: `index.html`, `styles.css`, and `script.js`
3. Go to repository Settings → Pages
4. Under "Source", select the branch (usually `main`)
5. Click Save
6. Your site will be available at: `https://yourusername.github.io/repository-name/`

### Option 2: Git Command Line

```bash
git init
git add .
git commit -m "Initial commit: Tarot reading app"
git branch -M main
git remote add origin https://github.com/yourusername/repository-name.git
git push -u origin main
```

Then enable GitHub Pages in repository settings.

## Local Development

Simply open `index.html` in a web browser. The application works entirely client-side.

## Technologies Used

- HTML5
- CSS3 (with responsive design)
- Vanilla JavaScript
- Firebase Realtime Database (for reading counter)
- html2canvas (for image saving)
- Google Fonts (Cormorant Garamond, Noto Sans Thai)

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Free to use and modify.
