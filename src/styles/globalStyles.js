export const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #0a0a0a;
    --surface: #141414;
    --surface2: #1e1e1e;
    --border: #2a2a2a;
    --green: #39FF14;
    --blue: #007BFF;
    --text: #ffffff;
    --muted: #888;
    --red: #ff4444;
    --font: 'Space Grotesk', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  body { 
    background: var(--bg); 
    color: var(--text); 
    font-family: var(--font); 
    overflow-x: hidden; 
  }

  /* Nav Style */
  .nav { position: sticky; top: 0; z-index: 100; padding: 14px 24px; }
  .nav-inner {
    background: rgba(20,20,20,0.85);
    backdrop-filter: blur(16px);
    border: 1px solid var(--border);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 28px;
  }
  .logo { 
    font-size: 24px; 
    font-weight: 800; 
    color: var(--green); 
    text-decoration: none;
    font-family: var(--mono);
    cursor: pointer;
  }

  /* Buttons */
  .btn { 
    border: none; 
    cursor: pointer; 
    font-family: var(--font); 
    font-weight: 700; 
    border-radius: 10px; 
    transition: 0.2s; 
    padding: 10px 20px;
    text-decoration: none;
    display: inline-block;
  }
  .btn-primary { background: var(--blue); color: #fff; }
  .btn-green { background: var(--green); color: #000; }
  .btn-danger { background: var(--red); color: #fff; }
  .btn:hover { opacity: 0.8; transform: translateY(-2px); }

  /* Grid & Cards */
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    padding: 40px 0;
  }
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 30px;
    border-radius: 20px;
    transition: 0.3s;
  }
  .card:hover {
    border-color: var(--green);
    background: var(--surface2);
  }

  /* Inputs */
  .form-input {
    width: 100%;
    padding: 12px 16px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: white;
    margin-bottom: 15px;
    font-family: var(--font);
  }
  .form-input:focus {
    outline: none;
    border-color: var(--green);
  }

  /* Footer */
  footer {
    text-align: center;
    padding: 60px 0;
    border-top: 1px solid var(--border);
    margin-top: 60px;
  }
`;