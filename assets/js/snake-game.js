class SnakeGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.snake = [{x: 5, y: 5}];
        this.food = this.generateFood();
        this.direction = 'right';
        this.score = 0;
        this.gameOver = false;
        this.speed = 150;

        // Bind event listeners
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        
        // Start game loop
        this.gameLoop();
    }

    generateFood() {
        const maxX = Math.floor(this.canvas.width / this.gridSize);
        const maxY = Math.floor(this.canvas.height / this.gridSize);
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }

    handleKeyPress(event) {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };

        const newDirection = keyMap[event.key];
        if (!newDirection) return;

        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };

        if (opposites[newDirection] !== this.direction) {
            this.direction = newDirection;
        }
    }

    update() {
        if (this.gameOver) return;

        const head = {...this.snake[0]};
        
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check collision with walls
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            this.gameOver = true;
            return;
        }

        // Check collision with self
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver = true;
            return;
        }

        this.snake.unshift(head);

        // Check if food is eaten
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            this.food = this.generateFood();
            // Increase speed slightly
            this.speed = Math.max(50, this.speed - 5);
        } else {
            this.snake.pop();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.ctx.fillStyle = '#4CAF50';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        // Draw food
        this.ctx.fillStyle = '#FF5722';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 1,
            this.gridSize - 1
        );

        // Draw score
        this.ctx.fillStyle = '#000';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);

        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over!', this.canvas.width/2, this.canvas.height/2);
            this.ctx.font = '20px Arial';
            this.ctx.fillText('Press R to restart', this.canvas.width/2, this.canvas.height/2 + 40);
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        setTimeout(() => this.gameLoop(), this.speed);
    }

    restart() {
        this.snake = [{x: 5, y: 5}];
        this.direction = 'right';
        this.score = 0;
        this.gameOver = false;
        this.speed = 150;
        this.food = this.generateFood();
    }
}

// Initialize game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new SnakeGame('snakeCanvas');
    
    // Add restart functionality
    document.addEventListener('keydown', (event) => {
        if (event.key === 'r' && game.gameOver) {
            game.restart();
        }
    });
}); 