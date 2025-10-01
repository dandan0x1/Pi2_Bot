javascript:(function(){
  // Pi² 20 TPS Ultimate Auto-Clicker - Full Game Flow Automation
  console.log('🚀 Pi² 20 TPS Ultimate Auto-Clicker Starting...');
  
  let isActive = false;
  let clickCount = 0;
  let startTime = 0;
  let lastClickTime = 0;
  let sessionClicks = 0;
  let currentTPS = 0;
  let gameStarted = false;
  let targetTPS = 20;
  
  // Optimized for 20 TPS peak performance
  const config = {
    maxClicks: 220,           // Maximum clicks per session
    peakTPS: 20,              // Target peak TPS
    normalTPS: 18,            // Normal TPS after peak
    peakDuration: 50,         // Clicks at peak TPS
    minDelay: 49,             // 49ms = ~20.4 TPS (ensures 20+ TPS)
    normalDelay: 55,          // 55ms = ~18 TPS
    warningClicks: 200,       // Warning at 200 clicks
    pauseAfterLimit: 12000,   // 12 second pause after hitting limit
    gameStartDelay: 2000,     // 2 second delay after starting game
    restartDelay: 3000        // 3 second delay after game over
  };
  
  // Function to get target color
  function getTargetColor() {
    const targetImg = document.querySelector('img[alt*="Target Color"]');
    if (targetImg) {
      const altText = targetImg.getAttribute('alt');
      const match = altText.match(/Target Color:\s*(\w+)/i);
      if (match) {
        return match[1].toUpperCase();
      }
    }
    return null;
  }
  
  // Function to calculate optimal delay for 20 TPS peak
  function calculateDelay() {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime;
    
    // Calculate current TPS
    if (timeSinceLastClick > 0) {
      currentTPS = 1000 / timeSinceLastClick;
    }
    
    // Peak TPS phase (first 50 clicks)
    if (sessionClicks < config.peakDuration) {
      return config.minDelay; // 49ms = ~20.4 TPS (ensures 20+ TPS)
    }
    
    // Normal TPS phase (clicks 51-200)
    if (sessionClicks < config.warningClicks) {
      return config.normalDelay; // 55ms = ~18 TPS
    }
    
    // Slow down near limit (clicks 201-220)
    return 100; // 10 TPS when near limit
  }
  
  // Function to find and click the correct orb
  function clickCorrectOrb() {
    const targetColor = getTargetColor();
    if (!targetColor) {
      console.log('❌ Could not find target color');
      return false;
    }
    
    // Find all orb buttons
    const orbButtons = document.querySelectorAll('button');
    let targetOrb = null;
    
    for (let button of orbButtons) {
      const img = button.querySelector('img');
      if (img && img.alt) {
        const altText = img.alt.toUpperCase();
        if (altText.includes(targetColor) && altText.includes('ORB')) {
          targetOrb = button;
          break;
        }
      }
    }
    
    if (targetOrb && !targetOrb.disabled) {
      // Click the orb
      targetOrb.click();
      clickCount++;
      sessionClicks++;
      lastClickTime = Date.now();
      
      // Log progress with TPS info
      if (sessionClicks % 25 === 0) {
        const phase = sessionClicks < config.peakDuration ? 'PEAK' : 
                     sessionClicks < config.warningClicks ? 'NORMAL' : 'SLOW';
        console.log(`📊 ${phase}: ${sessionClicks}/${config.maxClicks} clicks (${currentTPS.toFixed(1)} TPS)`);
      }
      
      console.log(`✅ Click ${sessionClicks} (${targetColor}) - TPS: ${currentTPS.toFixed(1)}`);
      return true;
    } else {
      console.log(`❌ ${targetColor} orb not found or disabled`);
      return false;
    }
  }
  
  // Function to check if game is over
  function isGameOver() {
    const gameOverElements = document.querySelectorAll('h2, h3, div');
    for (let element of gameOverElements) {
      if (element.textContent && element.textContent.includes('Game Over')) {
        return true;
      }
    }
    
    const buttons = document.querySelectorAll('button');
    for (let button of buttons) {
      if (button.textContent && button.textContent.includes('Play Again')) {
        return true;
      }
    }
    
    return false;
  }
  
  // Function to start the game
  function startGame() {
    const buttons = document.querySelectorAll('button');
    for (let button of buttons) {
      if (button.textContent && button.textContent.includes('Play Reactor Mini-Game')) {
        button.click();
        console.log('🎮 Game started! Waiting for game to load...');
        gameStarted = true;
        return true;
      }
    }
    return false;
  }
  
  // Function to restart game
  function restartGame() {
    const buttons = document.querySelectorAll('button');
    for (let button of buttons) {
      if (button.textContent && button.textContent.includes('Play Again')) {
        button.click();
        console.log('🔄 Game restarted!');
        clickCount = 0;
        startTime = Date.now();
        sessionClicks = 0;
        gameStarted = true;
        return true;
      }
    }
    return false;
  }
  
  // Main clicking loop
  function clickLoop() {
    if (!isActive) return;
    
    // Check if we've hit the click limit
    if (sessionClicks >= config.maxClicks) {
      console.log(`🛑 Click limit reached (${config.maxClicks}), pausing for ${config.pauseAfterLimit/1000}s...`);
      setTimeout(() => {
        if (isGameOver()) {
          restartGame();
        }
        setTimeout(clickLoop, config.restartDelay);
      }, config.pauseAfterLimit);
      return;
    }
    
    // Check if game is over
    if (isGameOver()) {
      console.log('🏁 Game over detected, attempting restart...');
      if (restartGame()) {
        setTimeout(clickLoop, config.restartDelay);
        return;
      } else {
        console.log('❌ Could not restart game');
        setTimeout(clickLoop, config.restartDelay);
        return;
      }
    }
    
    // Try to click the correct orb
    const success = clickCorrectOrb();
    
    // Calculate optimal delay
    const delay = calculateDelay();
    setTimeout(clickLoop, delay);
  }
  
  // Toggle function
  function toggle() {
    if (isActive) {
      isActive = false;
      const duration = (Date.now() - startTime) / 1000;
      const avgTPS = clickCount / duration;
      
      alert(`🚀 Pi² 20 TPS Ultimate Auto-Clicker Stopped!
      
📊 Performance Stats:
• Total Clicks: ${clickCount}
• Session Clicks: ${sessionClicks}
• Duration: ${duration.toFixed(1)} seconds
• Average TPS: ${avgTPS.toFixed(1)}
• Peak TPS: ${currentTPS.toFixed(1)}

🎯 Strategy Used:
• Peak Phase: 20 TPS (first ${config.peakDuration} clicks)
• Normal Phase: 18 TPS (clicks ${config.peakDuration + 1}-${config.warningClicks})
• Slow Phase: 10 TPS (clicks ${config.warningClicks + 1}-${config.maxClicks})
• Max Clicks: ${config.maxClicks} (${sessionClicks >= config.maxClicks ? 'REACHED' : 'OK'})`);
      
      console.log('⏹️ 20 TPS Ultimate auto-clicker stopped');
    } else {
      isActive = true;
      clickCount = 0;
      startTime = Date.now();
      lastClickTime = 0;
      sessionClicks = 0;
      gameStarted = false;
      
      console.log('▶️ 20 TPS Ultimate auto-clicker started');
      console.log('🎯 Strategy: 20 TPS peak → 18 TPS normal → 10 TPS slow');
      
      // Start the game first
      if (startGame()) {
        setTimeout(clickLoop, config.gameStartDelay);
      } else {
        console.log('❌ Could not start game, trying to click anyway...');
        setTimeout(clickLoop, 1000);
      }
    }
  }
  
  // Check if we're on the right page
  const hasGameElements = document.querySelector('img[alt*="orb"]') || 
                         document.querySelector('img[alt*="Target"]') ||
                         document.querySelector('button')?.textContent?.includes('Play Reactor Mini-Game');
  
  if (hasGameElements) {
    console.log('✅ Pi² game detected, starting 20 TPS Ultimate auto-clicker...');
    console.log('🚀 Target: 20 TPS peak performance');
    console.log('🎮 Auto-starting game and handling full flow');
    toggle(); // Auto-start
  } else {
    console.log('❌ Pi² game not detected');
    alert('🚀 Pi² 20 TPS Ultimate Auto-Clicker\n\n❌ Pi² game not detected on this page.\n\nPlease make sure you are on the Pi² reactor game page.');
  }
})();
