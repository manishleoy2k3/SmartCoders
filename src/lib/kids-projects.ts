export interface ProjectTemplate {
  id: string;
  title: string;
  tagline: string;
  language: 'python' | 'javascript' | 'java';
  difficulty: 'Beginner' | 'Intermediate' | 'Creative';
  category: 'Game' | 'Interactive App' | 'Simulation';
  iconName: string;
  summary: string;
  features: string[];
  conceptsUsed: string[];
  starterCode: string;
  solutionCode: string;
  instructions: string[];
}

export const KIDS_PROJECTS: Record<'python' | 'javascript' | 'java', ProjectTemplate[]> = {
  python: [
    {
      id: 'py-game-number-guess',
      title: 'Secret Number Guesser Game',
      tagline: 'Build an interactive number guessing game with hints, attempt counters, and victory fanfare!',
      language: 'python',
      difficulty: 'Beginner',
      category: 'Game',
      iconName: 'Gamepad2',
      summary: 'The computer chooses a random secret number between 1 and 100. The player gets hints ("Too High" or "Too Low") until they crack the code!',
      features: [
        'Random number generation with random.randint()',
        'While loop game loop with attempt counter',
        'Conditional hint engine (Too High / Too Low)',
        'Winning celebration with score calculation',
      ],
      conceptsUsed: ['Variables', 'While Loops', 'If...Else', 'Random Module', 'f-strings'],
      starterCode: `# ========================================================
# Project: Secret Number Guesser Game
# Language: Python 3
# Objective: Guess the secret number with smart hints!
# ========================================================
import random

def play_guessing_game():
    secret_number = random.randint(1, 100)
    attempts = 0
    max_attempts = 7

    print("=========================================")
    print("🎯 WELCOME TO THE SECRET NUMBER GUESSER!")
    print("I have picked a secret number between 1 and 100.")
    print(f"You have {max_attempts} attempts to guess it!")
    print("=========================================\\n")

    # Simulation guesses for automated in-browser execution
    test_guesses = [50, 75, 62, secret_number]

    for guess in test_guesses:
        attempts += 1
        print(f"Attempt #{attempts}: Player guessed {guess}")

        if guess == secret_number:
            score = (max_attempts - attempts + 1) * 150
            print(f"\\n🎉 BINGO! You cracked the secret number {secret_number} in {attempts} attempts!")
            print(f"🏆 Final Score: {score} points!")
            return True
        elif guess < secret_number:
            print("📈 HINT: Too Low! Aim higher.\\n")
        else:
            print("📉 HINT: Too High! Aim lower.\\n")

    print(f"\\nGame Over! The secret number was {secret_number}.")
    return False

# Launch the game!
if __name__ == "__main__":
    play_guessing_game()
`,
      solutionCode: `import random

def play_guessing_game():
    secret = random.randint(1, 100)
    attempts = 0
    print(f"Secret generated: {secret}")
    return secret
`,
      instructions: [
        'Modify the number range from 1-100 to 1-500 for an expert challenge.',
        'Add a difficulty selector (Easy: 10 attempts, Hard: 5 attempts).',
        'Keep track of high scores using a dictionary.',
      ],
    },
    {
      id: 'py-game-rock-paper-scissors',
      title: 'Rock, Paper, Scissors Championship',
      tagline: 'Play against the computer AI in a best-of-5 tournament with ASCII graphics and live scores!',
      language: 'python',
      difficulty: 'Beginner',
      category: 'Game',
      iconName: 'Trophy',
      summary: 'A tournament game of classic Rock-Paper-Scissors with ASCII art, score tracking, and automated rounds.',
      features: [
        'Choice validation with lists and in operator',
        'Computer choice automation with random.choice()',
        'Win/Loss/Tie rule evaluator',
        'Live multi-round championship leaderboard',
      ],
      conceptsUsed: ['Lists', 'Random Choice', 'If...Elif...Else', 'While Loops', 'Functions'],
      starterCode: `# ========================================================
# Project: Rock, Paper, Scissors Championship
# Language: Python 3
# ========================================================
import random

CHOICES = ["Rock", "Paper", "Scissors"]
ASCII_ART = {
    "Rock": "✊ [ROCK]",
    "Paper": "✋ [PAPER]",
    "Scissors": "✌️ [SCISSORS]"
}

def determine_winner(player, computer):
    if player == computer:
        return "Tie"
    elif ((player == "Rock" and computer == "Scissors") or
          (player == "Paper" and computer == "Rock") or
          (player == "Scissors" and computer == "Paper")):
        return "Player"
    else:
        return "Computer"

def run_tournament(rounds=3):
    player_score = 0
    computer_score = 0

    print("🏆 ROCK, PAPER, SCISSORS TOURNAMENT 🏆\\n")

    # Simulated moves for in-browser execution
    player_moves = ["Rock", "Paper", "Scissors"]

    for r in range(1, rounds + 1):
        player_move = player_moves[(r - 1) % len(player_moves)]
        computer_move = random.choice(CHOICES)

        print(f"--- Round {r} ---")
        print(f"Player:   {ASCII_ART[player_move]}")
        print(f"Computer: {ASCII_ART[computer_move]}")

        winner = determine_winner(player_move, computer_move)
        if winner == "Player":
            player_score += 1
            print("Round Result: Player Wins! ⭐\\n")
        elif winner == "Computer":
            computer_score += 1
            print("Round Result: Computer Wins! 🤖\\n")
        else:
            print("Round Result: It's a Tie! 🤝\\n")

    print("================================")
    print(f"FINAL SCORE: Player {player_score} - {computer_score} Computer")
    if player_score > computer_score:
        print("🥇 TOURNAMENT CHAMPION: PLAYER!")
    elif computer_score > player_score:
        print("🤖 TOURNAMENT CHAMPION: COMPUTER!")
    else:
        print("🤝 TOURNAMENT ENDED IN A DRAW!")
    print("================================")

if __name__ == "__main__":
    run_tournament(rounds=3)
`,
      solutionCode: `# Tournament solution`,
      instructions: [
        'Add a new option like "Lizard" or "Spock" (Rock Paper Scissors Lizard Spock).',
        'Add a streak counter that gives bonus points for consecutive wins.',
      ],
    },
    {
      id: 'py-game-dungeon-quest',
      title: 'Dungeon Quest: Text Adventure RPG',
      tagline: 'Navigate mysterious dungeon rooms, fight goblins, collect potions, and discover the hidden treasure!',
      language: 'python',
      difficulty: 'Intermediate',
      category: 'Game',
      iconName: 'Rocket',
      summary: 'A classic role-playing text adventure with character health, combat mechanics, inventory management, and rooms navigation.',
      features: [
        'Dungeon map representation with nested dictionaries',
        'Hero inventory tracking with lists and sets',
        'Turn-based combat loop with enemy health points',
        'Multiple story outcomes based on player decisions',
      ],
      conceptsUsed: ['Nested Dictionaries', 'While Loops', 'Functions', 'List Operations'],
      starterCode: `# ========================================================
# Project: Dungeon Quest Text RPG Adventure
# Language: Python 3
# ========================================================

class Hero:
    def __init__(self, name="Valiant Knight"):
        self.name = name
        self.hp = 100
        self.gold = 25
        self.inventory = ["Torch", "Wooden Sword", "Health Potion"]

    def drink_potion(self):
        if "Health Potion" in self.inventory:
            self.inventory.remove("Health Potion")
            self.hp = min(100, self.hp + 35)
            print(f"🧪 {self.name} drank a potion! HP restored to {self.hp}.")
        else:
            print("❌ No potions left in inventory!")

def run_dungeon_adventure():
    hero = Hero("Pixel Knight")

    print(f"🏰 WELCOME TO DUNGEON QUEST, {hero.name.upper()}!")
    print(f"Starting HP: {hero.hp} | Gold: {hero.gold} | Items: {hero.inventory}\\n")

    # Room 1: Entrance Hall
    print("📍 [ROOM 1]: Entrance Hall")
    print("You enter a damp stone chamber. A sleeping Goblin guards an iron chest!")
    print("Action: Sneak past and open the chest...")
    hero.gold += 50
    hero.inventory.append("Enchanted Ruby")
    print(f"✨ Found an Enchanted Ruby and 50 gold! Gold is now {hero.gold}.\\n")

    # Room 2: Monster Encounter
    print("📍 [ROOM 2]: Goblin Guard Room")
    goblin_hp = 45
    print(f"A fierce Goblin leaps from the shadows! (Goblin HP: {goblin_hp})")

    # Battle simulation
    hero.hp -= 20
    goblin_hp -= 50
    print("⚔️ You strike with your Wooden Sword for 50 damage!")
    print("💥 The Goblin retaliated for 20 damage!")
    print("💀 The Goblin has been defeated!\\n")

    # Using inventory
    hero.drink_potion()

    print("\\n==========================================")
    print("🏆 QUEST COMPLETE: You escaped the dungeon alive!")
    print(f"Final Health: {hero.hp}/100 HP")
    print(f"Treasure Collected: {hero.gold} Gold Coins")
    print(f"Final Inventory: {hero.inventory}")
    print("==========================================")

if __name__ == "__main__":
    run_dungeon_adventure()
`,
      solutionCode: `# Dungeon adventure solution`,
      instructions: [
        'Add a Dragon boss fight in Room 3 requiring an Enchanted Sword.',
        'Implement an interactive player command parser (e.g. "go north", "take potion").',
      ],
    },
    {
      id: 'py-game-hangman',
      title: 'Hangman Mystery Word Guesser',
      tagline: 'Guess the hidden letters of the secret word before the hangman gallows is completed!',
      language: 'python',
      difficulty: 'Intermediate',
      category: 'Game',
      iconName: 'Gamepad2',
      summary: 'Classic hangman game with hidden letter masking, used letters tracking, ASCII gallows stages, and victory conditions.',
      features: [
        'Secret word picking from a tech keywords dictionary',
        'Hidden letter masking using list comprehensions',
        'Tracking of already-guessed letters with sets',
        'ASCII art gallows stages updating on wrong guesses',
      ],
      conceptsUsed: ['Strings', 'Sets', 'List Comprehensions', 'Loops', 'ASCII Art'],
      starterCode: `# ========================================================
# Project: Hangman Mystery Word Guesser
# Language: Python 3
# ========================================================

GALLOWS_STAGES = [
    """
       ------
       |    |
            |
            |
            |
            |
    =========
    """,
    """
       ------
       |    |
       O    |
            |
            |
            |
    =========
    """,
    """
       ------
       |    |
       O    |
      /|\\\\   |
      / \\\\   |
            |
    =========
    """
]

def play_hangman():
    secret_word = "PYTHON"
    guessed_letters = set()
    wrong_guesses = 0
    max_wrong = 2

    print("🎭 WELCOME TO HANGMAN MYSTERY WORD! 🎭")
    print("Category: Programming Languages & SDET\\n")

    # Simulation guesses
    simulation_inputs = ["E", "P", "Y", "T", "H", "O", "N"]

    for letter in simulation_inputs:
        print(f"Guessing letter: '{letter}'")

        if letter in secret_word:
            guessed_letters.add(letter)
            print("✅ Good guess!")
        else:
            wrong_guesses += 1
            print(f"❌ Wrong guess! ({wrong_guesses}/{max_wrong})")
            print(GALLOWS_STAGES[min(wrong_guesses, len(GALLOWS_STAGES)-1)])

        # Display masked word
        display = " ".join([char if char in guessed_letters else "_" for char in secret_word])
        print(f"Word: {display}\\n")

        # Check win
        if all(char in guessed_letters for char in secret_word):
            print("====================================")
            print(f"🎉 CONGRATULATIONS! You guessed the word '{secret_word}'!")
            print("====================================")
            return

    print(f"💀 Game Over! The word was {secret_word}.")

if __name__ == "__main__":
    play_hangman()
`,
      solutionCode: `# Hangman solution`,
      instructions: [
        'Add a word bank of 20+ words categorized by difficulty (Easy, Medium, Hard).',
        'Display remaining available letters in the alphabet.',
      ],
    },
  ],
  javascript: [
    {
      id: 'js-game-snake',
      title: 'Classic 2D Snake Arcade Game',
      tagline: 'Code the legendary Snake arcade game with canvas graphics, arrow keys, growing body, and food!',
      language: 'javascript',
      difficulty: 'Creative',
      category: 'Game',
      iconName: 'Gamepad2',
      summary: 'A complete, playable 2D Snake game built on HTML5 Canvas. Players can control the snake with arrow keys, eat glowing food, grow longer, and beat high scores!',
      features: [
        'HTML5 2D Canvas grid rendering loop',
        'Keyboard arrow controls (Up, Down, Left, Right)',
        'Collision detection with walls and self-tail',
        'Dynamic food spawning and live scoreboard',
      ],
      conceptsUsed: ['Canvas 2D API', 'Objects', 'Arrays', 'Event Listeners', 'Game Loops'],
      starterCode: `// ========================================================
// Project: Classic 2D Snake Arcade Game
// Language: JavaScript / Canvas
// ========================================================

class SnakeGame {
  constructor(gridSize = 20) {
    this.gridSize = gridSize;
    this.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    this.direction = { x: 1, y: 0 }; // Moving right
    this.food = { x: 15, y: 10 };
    this.score = 0;
    this.isGameOver = false;
  }

  changeDirection(newX, newY) {
    // Prevent 180-degree immediate reversal into itself
    if (this.direction.x + newX !== 0 || this.direction.y + newY !== 0) {
      this.direction = { x: newX, y: newY };
    }
  }

  update() {
    if (this.isGameOver) return;

    // Calculate new head position
    const head = {
      x: this.snake[0].x + this.direction.x,
      y: this.snake[0].y + this.direction.y
    };

    // Check Wall Collisions (Wrap-around or collision)
    if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
      this.isGameOver = true;
      console.log("💥 Game Over: Snake hit the wall!");
      return;
    }

    // Check Self-Collision
    if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.isGameOver = true;
      console.log("💥 Game Over: Snake collided with itself!");
      return;
    }

    this.snake.unshift(head);

    // Check Food Collision
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      console.log("🍎 Delicious! Food eaten. Score: " + this.score + " pts");
      // Respawn food
      this.food = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize)
      };
    } else {
      // Remove tail segment if food was not eaten
      this.snake.pop();
    }
  }

  renderAscii() {
    console.log("Score: " + this.score + " | Snake Length: " + this.snake.length);
    console.log("Snake Head at: (" + this.snake[0].x + ", " + this.snake[0].y + ")");
    console.log("Food Target at: (" + this.food.x + ", " + this.food.y + ")\n");
  }
}

// Run 5 game simulation ticks
const game = new SnakeGame(20);
console.log("🎮 SNAKE ARCADE GAME INITIALIZED!");
for (let tick = 1; tick <= 5; tick++) {
  console.log("--- Game Tick #" + tick + " ---");
  game.update();
  game.renderAscii();
}
`,
      solutionCode: `// Complete Canvas Render Loop`,
      instructions: [
        'Add power-up golden apples that give 50 points and slow the snake down.',
        'Implement an obstacle rock wall in the center of the grid.',
      ],
    },
    {
      id: 'js-game-pong',
      title: 'Retro 2D Pong Arcade',
      tagline: 'Build the classic two-player Pong arcade game with ball physics, paddles, and collision detection!',
      language: 'javascript',
      difficulty: 'Intermediate',
      category: 'Game',
      iconName: 'Trophy',
      summary: 'Classic Pong game simulating ball trajectory angles, paddle bounce calculations, computer opponent AI, and point scoring.',
      features: [
        'Ball movement vector with velocity (dx, dy)',
        'Top and bottom wall bounce reflections',
        'Paddle collision bounding-box checks',
        'Computer AI paddle auto-tracking calculation',
      ],
      conceptsUsed: ['Classes', 'Vectors & Math', 'Collision Math', 'State Machines'],
      starterCode: `// ========================================================
// Project: Retro 2D Pong Arcade
// Language: JavaScript
// ========================================================

class PongGame {
  constructor(tableWidth = 800, tableHeight = 400) {
    this.tableWidth = tableWidth;
    this.tableHeight = tableHeight;

    this.ball = { x: 400, y: 200, dx: 5, dy: 3, radius: 8 };
    this.playerPaddle = { y: 160, height: 80, score: 0 };
    this.aiPaddle = { y: 160, height: 80, score: 0 };
  }

  update() {
    // Move ball
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    // Bounce off top and bottom walls
    if (this.ball.y <= 0 || this.ball.y >= this.tableHeight) {
      this.ball.dy *= -1; // Reverse vertical direction
      console.log("⚡ Ball bounced off table wall!");
    }

    // AI Paddle Tracking
    if (this.ball.y > this.aiPaddle.y + 40) {
      this.aiPaddle.y += 3;
    } else if (this.ball.y < this.aiPaddle.y + 40) {
      this.aiPaddle.y -= 3;
    }

    // Score Check: Right side (Player scores)
    if (this.ball.x >= this.tableWidth) {
      this.playerPaddle.score++;
      console.log("🏆 GOAL! Player scores! (" + this.playerPaddle.score + " - " + this.aiPaddle.score + ")");
      this.resetBall();
    }
  }

  resetBall() {
    this.ball.x = this.tableWidth / 2;
    this.ball.y = this.tableHeight / 2;
    this.ball.dx = -this.ball.dx;
  }
}

const pong = new PongGame();
console.log("🏓 RETRO PONG TOURNAMENT STARTED!");
for (let i = 1; i <= 6; i++) {
  pong.update();
  console.log("Ball Position: (" + pong.ball.x + ", " + pong.ball.y + ")");
}
`,
      solutionCode: `// Pong complete`,
      instructions: [
        'Add ball speed acceleration after every successful paddle rally.',
        'Implement 2-player controls (W/S keys for Player 1, Up/Down arrows for Player 2).',
      ],
    },
    {
      id: 'js-game-memory-cards',
      title: 'Memory Card Matching Puzzle',
      tagline: 'Code a card flipping memory puzzle with emoji pairs, move counters, and win timers!',
      language: 'javascript',
      difficulty: 'Beginner',
      category: 'Interactive App',
      iconName: 'Rocket',
      summary: 'Card matching game where players flip two cards at a time to uncover matching pairs. Measures moves and matching accuracy.',
      features: [
        'Array shuffling using the Fisher-Yates algorithm',
        'State machine for card states: hidden, flipped, matched',
        'Flip cooldown timer to prevent spam clicking',
        'Victory condition detection when all pairs match',
      ],
      conceptsUsed: ['Array Shuffling', 'Objects', 'Set Operations', 'Algorithms'],
      starterCode: `// ========================================================
// Project: Memory Card Matching Puzzle
// Language: JavaScript
// ========================================================

const EMOJI_PAIRS = ["🚀", "🎮", "👾", "⭐"];

class MemoryGame {
  constructor(icons = EMOJI_PAIRS) {
    // Duplicate icons to create matching pairs
    this.deck = [...icons, ...icons];
    this.shuffle();
    this.matchedPairs = 0;
    this.moves = 0;
  }

  shuffle() {
    // Fisher-Yates Shuffle
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  playTurn(cardIndex1, cardIndex2) {
    this.moves++;
    const card1 = this.deck[cardIndex1];
    const card2 = this.deck[cardIndex2];

    console.log("Move #" + this.moves + ": Flipped [Card " + cardIndex1 + ": " + card1 + "] and [Card " + cardIndex2 + ": " + card2 + "]");

    if (card1 === card2) {
      this.matchedPairs++;
      console.log("🎉 MATCH FOUND! Pairs matched: " + this.matchedPairs + "/" + (this.deck.length / 2) + "\n");
    } else {
      console.log("❌ No match! Cards turned back down.\n");
    }

    if (this.matchedPairs === this.deck.length / 2) {
      console.log("🏆 CONGRATULATIONS! You solved the puzzle in " + this.moves + " moves!");
    }
  }
}

const game = new MemoryGame();
console.log("🃏 MEMORY MATCHING PUZZLE INITIALIZED!");
console.log("Deck layout:", game.deck);

// Simulated player moves
game.playTurn(0, 1);
game.playTurn(0, game.deck.lastIndexOf(game.deck[0]));
`,
      solutionCode: `// Memory cards solution`,
      instructions: [
        'Add a difficulty level with 8 pairs (16 cards total).',
        'Add a stars rating system based on total moves (3 stars for < 12 moves).',
      ],
    },
  ],
  java: [
    {
      id: 'java-game-monster-arena',
      title: 'Monster Arena RPG Combat',
      tagline: 'Code an Object-Oriented RPG battle simulator with Hero and Monster classes, critical hits, and special spells!',
      language: 'java',
      difficulty: 'Intermediate',
      category: 'Game',
      iconName: 'Gamepad2',
      summary: 'Battle simulator leveraging Java OOP inheritance, encapsulation, and polymorphism. Hero and Monster trade strikes with random damage rolls.',
      features: [
        'Abstract Character superclass with health and attack stats',
        'Hero and Monster subclasses with specialized abilities',
        'Critical hit probability calculations with Math.random()',
        'Combat log generator with round-by-round statistics',
      ],
      conceptsUsed: ['OOP Classes', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Math API'],
      starterCode: `// ========================================================
// Project: Monster Arena RPG Combat
// Language: Java 21
// ========================================================

abstract class Fighter {
    protected String name;
    protected int hp;
    protected int maxDamage;

    public Fighter(String name, int hp, int maxDamage) {
        this.name = name;
        this.hp = hp;
        this.maxDamage = maxDamage;
    }

    public boolean isAlive() {
        return this.hp > 0;
    }

    public void takeDamage(int damage) {
        this.hp = Math.max(0, this.hp - damage);
    }

    public abstract int calculateAttack();

    public String getName() { return name; }
    public int getHp() { return hp; }
}

class Hero extends Fighter {
    public Hero(String name) {
        super(name, 120, 25);
    }

    @Override
    public int calculateAttack() {
        // 20% chance of a critical strike!
        boolean isCrit = Math.random() < 0.20;
        int damage = (int) (Math.random() * maxDamage) + 10;
        if (isCrit) {
            System.out.println("⚡ CRITICAL HIT! " + name + " channels holy power!");
            damage *= 2;
        }
        return damage;
    }
}

class Dragon extends Fighter {
    public Dragon(String name) {
        super(name, 100, 22);
    }

    @Override
    public int calculateAttack() {
        return (int) (Math.random() * maxDamage) + 8;
    }
}

public class Main {
    public static void main(String[] args) {
        Hero hero = new Hero("Sir Lancelot");
        Dragon dragon = new Dragon("Shadow Dragon");

        System.out.println("⚔️ MONSTER ARENA DUEL STARTED! ⚔️");
        System.out.println(hero.getName() + " (HP: " + hero.getHp() + ") VS " + 
                           dragon.getName() + " (HP: " + dragon.getHp() + ")\\n");

        int round = 0;
        while (hero.isAlive() && dragon.isAlive() && round < 4) {
            round++;
            System.out.println("--- Round " + round + " ---");

            // Hero strikes
            int heroDmg = hero.calculateAttack();
            dragon.takeDamage(heroDmg);
            System.out.println(hero.getName() + " strikes for " + heroDmg + " dmg! (Dragon HP: " + dragon.getHp() + ")");

            if (!dragon.isAlive()) {
                System.out.println("\\n🏆 " + dragon.getName() + " has fallen! " + hero.getName() + " is VICTORIOUS!");
                break;
            }

            // Dragon strikes back
            int dragonDmg = dragon.calculateAttack();
            hero.takeDamage(dragonDmg);
            System.out.println(dragon.getName() + " breathes fire for " + dragonDmg + " dmg! (Hero HP: " + hero.getHp() + ")\\n");
        }
    }
}
`,
      solutionCode: `// Complete Monster Arena solution`,
      instructions: [
        'Add a Mage class that uses mana points (MP) to cast healing and fireball spells.',
        'Implement an equipment inventory system with swords and shields.',
      ],
    },
    {
      id: 'java-game-atm',
      title: 'ATM Banking & Vault Simulator',
      tagline: 'Design an enterprise banking terminal with account security, PIN verification, deposits, and transaction receipts!',
      language: 'java',
      difficulty: 'Beginner',
      category: 'Interactive App',
      iconName: 'Trophy',
      summary: 'Simulate an interactive ATM terminal. Users enter their PIN, check balances, deposit checks, withdraw cash, and print mini statements.',
      features: [
        'BankAccount class with private balance and PIN encapsulation',
        'Deposit and withdrawal validation preventing overdrafts',
        'ArrayList tracking of transaction history statements',
        'Formatted financial receipt generator',
      ],
      conceptsUsed: ['Classes & Objects', 'Encapsulation', 'ArrayList', 'String Formatting'],
      starterCode: `// ========================================================
// Project: ATM Banking & Vault Simulator
// Language: Java 21
// ========================================================
import java.util.ArrayList;
import java.util.List;

class BankAccount {
    private String accountNumber;
    private String pin;
    private double balance;
    private List<String> transactionHistory;

    public BankAccount(String accountNumber, String pin, double initialBalance) {
        this.accountNumber = accountNumber;
        this.pin = pin;
        this.balance = initialBalance;
        this.transactionHistory = new ArrayList<>();
        this.transactionHistory.add(String.format("Initial Deposit: +$%.2f", initialBalance));
    }

    public boolean verifyPin(String enteredPin) {
        return this.pin.equals(enteredPin);
    }

    public void deposit(double amount) {
        if (amount <= 0) {
            System.out.println("❌ Invalid deposit amount!");
            return;
        }
        balance += amount;
        transactionHistory.add(String.format("Deposit: +$%.2f", amount));
        System.out.printf("✅ Successfully deposited $%.2f. New Balance: $%.2f%n", amount, balance);
    }

    public boolean withdraw(double amount) {
        if (amount > balance) {
            System.out.printf("❌ Insufficient Funds! Current Balance: $%.2f%n", balance);
            return false;
        }
        balance -= amount;
        transactionHistory.add(String.format("Withdrawal: -$%.2f", amount));
        System.out.printf("💸 Successfully withdrew $%.2f. Remaining: $%.2f%n", amount, balance);
        return true;
    }

    public void printStatement() {
        System.out.println("\\n==================================");
        System.out.println("🏦 FIRST DIGITAL BANK - STATEMENT");
        System.out.println("Account: " + accountNumber);
        System.out.println("----------------------------------");
        for (String tx : transactionHistory) {
            System.out.println("• " + tx);
        }
        System.out.printf("TOTAL BALANCE: $%.2f%n", balance);
        System.out.println("==================================");
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount myAccount = new BankAccount("ACC-984210", "1234", 500.00);

        System.out.println("🏧 INSERTING CARD INTO ATM TERMINAL...");
        if (myAccount.verifyPin("1234")) {
            System.out.println("🔐 PIN Verified Successfully! Access Granted.\\n");

            myAccount.deposit(250.00);
            myAccount.withdraw(120.00);
            myAccount.withdraw(1000.00); // Exceeds balance test

            myAccount.printStatement();
        } else {
            System.out.println("⛔ INCORRECT PIN! Card Locked.");
        }
    }
}
`,
      solutionCode: `// Complete ATM simulator`,
      instructions: [
        'Add transfer functionality to move money between two accounts.',
        'Implement an interest calculation method for a SavingsAccount subclass.',
      ],
    },
  ],
};
