# 🎮 Catch the Square

A fast paced browser game where you click dynamic targets to earn points, activate power ups, and level up! Built to test your reflexes and reward combos, with a sleek UI and responsive gameplay.

🔗 https://che-kim.github.io/CatchTheSquare/

# 🛠 How It's Made
Tech used: HTML, CSS, JavaScript 

This project was built entirely with vanilla web technologies to show strong foundational skills in front-end development.

HTML creates the structure of the game interface : game board, score display, and control buttons.

CSS styles everything from layout to animations, with gradients, responsive scaling, and visual effects to create an exciting arcade feel.

JavaScript handles all game logic : state transitions (start, pause, resume, game over), event listeners for interaction, DOM manipulation for targets, power-up generation, combo calculation, and UI updates.

Core Features:
Multiple target types (normal, special, golden) with different behaviors and scoring

Combo & level progression system that increases difficulty and rewards

Power ups: speed boost, time freeze, and double points

Floating text animations, responsive controls, and audio effects

Full game loop: start, pause, resume, and restart

# ⚙️ Optimizations
DOM Efficiency: Used class toggling and minimized direct DOM changes to reduce rendering overhead.

Interval Management: Built a system to track and clear all timeouts/intervals precisely : no duplicate timers or memory leaks.

Responsive Gameplay: Media queries and flexible layout ensure the game scales across desktop and mobile.

Modular Code: Separated game logic, UI handling, and styling to keep code organized and maintainable.

# 📚 Lessons Learned
Managing Game State Matters: Creating reliable systems for pausing, resuming, and resetting the game taught me the importance of clean state transitions and variable resets.

UI Feedback is Everything: Adding visual cues like animations, score flashes, and particle effects significantly boosted engagement and polish.

Edge Case Handling: Unexpected interactions (like rapid clicks or pausing mid animation) helped me understand the need for error handling and careful interval cleanup.

Iterative Building Pays Off: I started with a basic square clicker and gradually added layers: power ups, scoring logic, animation, refining and optimizing at each step.

Cross browser Design: Vendor prefixes and testing on Chrome, Firefox, and Safari ensured consistent appearance and gameplay.
