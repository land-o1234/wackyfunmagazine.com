// Wacky Widgets JavaScript
class WackyWidgets {
  constructor() {
    this.interactionCount = 0;
    this.init();
  }

  init() {
    this.setupInitialContent();
    this.updateStats();
  }

  setupInitialContent() {
    this.updateCurrentDate();
    this.getWackyEventForToday();
    this.getDailyWord();
  }

  // Utility Functions
  incrementInteraction() {
    this.interactionCount++;
    this.updateStats();
  }

  updateStats() {
    const widgetCount = document.querySelectorAll('.widget-card').length;
    const widgetCountEl = document.getElementById('widget-count');
    const interactionCountEl = document.getElementById('interaction-count');
    
    if (widgetCountEl) widgetCountEl.textContent = widgetCount;
    if (interactionCountEl) interactionCountEl.textContent = this.interactionCount;
  }

  // Date Functions
  updateCurrentDate() {
    const now = new Date();
    const dayEl = document.getElementById('current-day');
    const monthEl = document.getElementById('current-month');
    
    if (dayEl) dayEl.textContent = now.getDate();
    if (monthEl) monthEl.textContent = now.toLocaleDateString('en-US', { month: 'long' });
  }

  // Wacky Facts
  getRandomFact() {
    const facts = [
      "Bananas are berries, but strawberries aren't!",
      "A group of flamingos is called a 'flamboyance'!",
      "Octopuses have three hearts and blue blood!",
      "Honey never spoils - archaeologists have found edible honey in ancient Egyptian tombs!",
      "A shrimp's heart is in its head!",
      "Butterflies taste with their feet!",
      "The shortest war in history lasted only 38-45 minutes!",
      "A jiffy is an actual unit of time - 1/100th of a second!",
      "Bubble wrap was originally invented as wallpaper!",
      "The inventor of the Frisbee was turned into a Frisbee after he died!",
      "Wombat poop is cube-shaped!",
      "Sea otters hold hands while they sleep to keep from drifting apart!",
      "A group of pandas is called an 'embarrassment'!",
      "Cleopatra lived closer in time to the Moon landing than to the Great Pyramid!",
      "There are more possible games of chess than atoms in the observable universe!",
      "A single cloud can weigh more than a million pounds!",
      "The human brain uses about 20% of the body's total energy!",
      "Dolphins have names for each other!",
      "A group of owls is called a 'parliament'!",
      "The dot over a lowercase 'i' or 'j' is called a tittle!",
      "Rubber bands last longer when refrigerated!",
      "A sneeze travels at about 100 miles per hour!",
      "The average person walks the equivalent of 5 times around the world in their lifetime!",
      "Penguins can jump as high as 6 feet in the air!"
    ];
    
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    const factDisplay = document.getElementById('fact-display');
    
    if (factDisplay) {
      factDisplay.innerHTML = `<p>${randomFact}</p>`;
    }
    
    this.incrementInteraction();
  }

  // Wacky Events Calendar
  getWackyEventForToday() {
    const events = [
      "Today is National Bubble Wrap Appreciation Day!",
      "It's International Talk Like a Pirate Day! Arrr!",
      "Celebrate National Backwards Day - !yaD sdrawkcaB lanoitaN",
      "Today is World Penguin Day - waddle around!",
      "It's National Chocolate Chip Cookie Day!",
      "Celebrate International Joke Day - tell someone a joke!",
      "Today is National Hug Your Cat Day!",
      "It's International Left-Handers Day!",
      "Celebrate National Ice Cream Day!",
      "Today is World Emoji Day! 😄🎉",
      "It's National Pancake Day - stack 'em high!",
      "Celebrate International Dance Day!",
      "Today is National Superhero Day - be someone's hero!",
      "It's World Kindness Day - spread some kindness!",
      "Celebrate National Pizza Day!",
      "Today is International Museum Day!",
      "It's National Smile Day - smile at someone!",
      "Celebrate World Book Day - read something fun!",
      "Today is National High Five Day!",
      "It's International Day of Happiness!"
    ];
    
    const today = new Date();
    const eventIndex = today.getDate() % events.length;
    const todayEvent = events[eventIndex];
    
    const eventDisplay = document.getElementById('wacky-event');
    if (eventDisplay) {
      eventDisplay.innerHTML = `<p>${todayEvent}</p>`;
    }
  }

  getNextWackyEvent() {
    const events = [
      "Tomorrow: National Compliment Day - give someone a compliment!",
      "Coming up: International Creativity Month!",
      "Next week: World Laughter Day - spread some giggles!",
      "Soon: National Random Acts of Kindness Week!",
      "Upcoming: International Day of Friendship!",
      "Next month: World Music Day - sing along!",
      "Coming soon: National Science Fiction Day!",
      "Future fun: International Picnic Day!",
      "On the horizon: World Art Day!",
      "Next up: National Popcorn Day!"
    ];
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const eventDisplay = document.getElementById('wacky-event');
    
    if (eventDisplay) {
      eventDisplay.innerHTML = `<p>${randomEvent}</p>`;
    }
    
    this.incrementInteraction();
  }

  // Color Mood Generator
  generateMoodColor() {
    const colors = [
      { color: '#FF6B6B', mood: 'Energetic and Passionate!', description: 'You\'re full of fire and ready to take on the world!' },
      { color: '#4ECDC4', mood: 'Calm and Peaceful!', description: 'You radiate tranquility and bring zen to those around you.' },
      { color: '#45B7D1', mood: 'Creative and Inspiring!', description: 'Your imagination knows no bounds today!' },
      { color: '#96CEB4', mood: 'Balanced and Harmonious!', description: 'You\'re the perfect blend of energy and serenity.' },
      { color: '#FFEAA7', mood: 'Joyful and Optimistic!', description: 'Your sunny disposition brightens everyone\'s day!' },
      { color: '#DDA0DD', mood: 'Mysterious and Magical!', description: 'You have an enchanting aura that draws people in.' },
      { color: '#FF7675', mood: 'Adventurous and Bold!', description: 'You\'re ready to explore new territories and take risks!' },
      { color: '#74B9FF', mood: 'Thoughtful and Wise!', description: 'Your depth of understanding amazes those around you.' },
      { color: '#A29BFE', mood: 'Dreamy and Imaginative!', description: 'You see the world through a lens of wonder and possibility.' },
      { color: '#FD79A8', mood: 'Playful and Fun-loving!', description: 'You bring laughter and joy wherever you go!' }
    ];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const colorSwatch = document.getElementById('mood-color');
    const moodDescription = document.getElementById('mood-description');
    
    if (colorSwatch) {
      colorSwatch.style.background = `linear-gradient(135deg, ${randomColor.color}, ${randomColor.color}dd)`;
    }
    
    if (moodDescription) {
      moodDescription.innerHTML = `<strong>${randomColor.mood}</strong><br>${randomColor.description}`;
    }
    
    this.incrementInteraction();
  }

  // Word of the Day
  getDailyWord() {
    const words = [
      { word: 'Serendipity', definition: 'The occurrence of happy accidents or pleasant surprises' },
      { word: 'Whimsy', definition: 'Playful or fanciful behavior or humor' },
      { word: 'Effervescent', definition: 'Vivacious and enthusiastic, like bubbles in a drink' },
      { word: 'Petrichor', definition: 'The pleasant smell of earth after rain' },
      { word: 'Wanderlust', definition: 'A strong desire to travel and explore the world' },
      { word: 'Euphoria', definition: 'A feeling of intense happiness and excitement' },
      { word: 'Luminous', definition: 'Bright and shining, especially in the dark' },
      { word: 'Whimsical', definition: 'Playfully quaint or fanciful' },
      { word: 'Jubilant', definition: 'Feeling or expressing great happiness and triumph' },
      { word: 'Vivacious', definition: 'Attractively lively and animated' }
    ];
    
    const today = new Date();
    const wordIndex = today.getDate() % words.length;
    const todayWord = words[wordIndex];
    
    const wordDisplay = document.getElementById('daily-word');
    const definitionDisplay = document.getElementById('word-definition');
    
    if (wordDisplay) wordDisplay.textContent = todayWord.word;
    if (definitionDisplay) definitionDisplay.textContent = todayWord.definition;
  }

  getRandomWord() {
    const words = [
      { word: 'Flibbertigibbet', definition: 'A frivolous, flighty, or excessively talkative person' },
      { word: 'Brouhaha', definition: 'A noisy and overexcited reaction or response to something' },
      { word: 'Kerfuffle', definition: 'A commotion or fuss, especially one caused by conflicting views' },
      { word: 'Hullabaloo', definition: 'A loud noise or commotion; a fuss' },
      { word: 'Shenanigans', definition: 'Secret or dishonest activity or maneuvering' },
      { word: 'Bamboozle', definition: 'To fool or cheat someone' },
      { word: 'Discombobulate', definition: 'To confuse or disconcert someone' },
      { word: 'Flummox', definition: 'To perplex someone greatly' },
      { word: 'Gobbledygook', definition: 'Language that is meaningless or hard to understand' },
      { word: 'Balderdash', definition: 'Senseless talk or writing; nonsense' }
    ];
    
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const wordDisplay = document.getElementById('daily-word');
    const definitionDisplay = document.getElementById('word-definition');
    
    if (wordDisplay) wordDisplay.textContent = randomWord.word;
    if (definitionDisplay) definitionDisplay.textContent = randomWord.definition;
    
    this.incrementInteraction();
  }

  // Widget Management
  refreshWidget(widgetType) {
    switch(widgetType) {
      case 'fact-randomizer':
        this.getRandomFact();
        break;
      case 'wacky-calendar':
        this.getNextWackyEvent();
        break;
      case 'color-mood':
        this.generateMoodColor();
        break;
      case 'word-of-day':
        this.getRandomWord();
        break;
    }
  }

  refreshAllWidgets() {
    this.getRandomFact();
    this.getNextWackyEvent();
    this.generateMoodColor();
    this.getRandomWord();
    this.incrementInteraction();
  }
}

// Global widget instance
let wackyWidgets;

// Initialize widgets when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  wackyWidgets = new WackyWidgets();
});

// Global functions for HTML onclick handlers
function getRandomFact() {
  wackyWidgets.getRandomFact();
}

function getNextWackyEvent() {
  wackyWidgets.getNextWackyEvent();
}

function generateMoodColor() {
  wackyWidgets.generateMoodColor();
}

function getRandomWord() {
  wackyWidgets.getRandomWord();
}

function refreshWidget(type) {
  wackyWidgets.refreshWidget(type);
}

function refreshAllWidgets() {
  wackyWidgets.refreshAllWidgets();
}