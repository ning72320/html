 // memory_game.js - 记忆力游戏功能

// 记忆力游戏相关函数
function startMemoryGame() {
    window.showPanel('memory-game-panel');
    
    // 直接通过style属性设置显示和隐藏
    document.getElementById('memory-game-panel').style.display = 'block';
    document.getElementById('memory-intro-panel').style.display = 'none';
    
    // 重置游戏状态
    window.gameState.memory = {
        score: 0,
        level: 1,
        sequence: [],
        userSequence: [],
        isPlaying: true,
        isShowingSequence: false,
        timer: 90,
        interval: null
    };
    
    // 更新UI
    document.getElementById('memory-level').textContent = window.gameState.memory.level;
    document.getElementById('memory-status').textContent = '观察方块高亮顺序，然后重复点击';
    
    // 启动定时器
    startMemoryTimer();
    
    // 生成新序列
    generateNewSequence();
}

function startMemoryTimer() {
    // 更新定时器UI
    document.getElementById('memory-timer').textContent = window.gameState.memory.timer;
    
    // 更新进度条
    const progressBar = document.getElementById('memory-progress');
    progressBar.style.width = '100%';
    
    // 设置定时器
    window.gameState.memory.interval = setInterval(() => {
        window.gameState.memory.timer--;
        
        if (window.gameState.memory.timer <= 0) {
            // 时间到，结束游戏
            clearInterval(window.gameState.memory.interval);
            endMemoryGame();
        } else {
            // 更新UI
            document.getElementById('memory-timer').textContent = window.gameState.memory.timer;
            
            // 更新进度条
            const progressPercent = (window.gameState.memory.timer / 90) * 100;
            progressBar.style.width = progressPercent + '%';
        }
    }, 1000);
}

function generateNewSequence() {
    // 获取所有记忆卡片
    const cards = document.querySelectorAll('.memory-card');
    
    // 随机生成新序列
    window.gameState.memory.sequence = [];
    for (let i = 0; i < window.gameState.memory.level; i++) {
        const randomIndex = Math.floor(Math.random() * 9);
        window.gameState.memory.sequence.push(randomIndex);
    }
    
    // 显示序列
    window.gameState.memory.isShowingSequence = true;
    document.getElementById('memory-status').textContent = '请观察...';
    
    // 禁用卡片点击
    cards.forEach(card => {
        card.style.pointerEvents = 'none';
    });
    
    // 依次高亮显示序列
    let index = 0;
    const showSequence = setInterval(() => {
        // 清除所有高亮
        cards.forEach(card => card.classList.remove('highlight'));
        
        if (index < window.gameState.memory.sequence.length) {
            // 高亮当前卡片
            const cardIndex = window.gameState.memory.sequence[index];
            cards[cardIndex].classList.add('highlight');
            index++;
        } else {
            // 序列显示完毕
            clearInterval(showSequence);
            
            // 稍等片刻后清除高亮
            setTimeout(() => {
                cards.forEach(card => card.classList.remove('highlight'));
                
                // 允许用户点击
                window.gameState.memory.isShowingSequence = false;
                window.gameState.memory.userSequence = [];
                document.getElementById('memory-status').textContent = '请按顺序点击方块';
                
                // 启用卡片点击
                cards.forEach(card => {
                    card.style.pointerEvents = 'auto';
                });
            }, 500);
        }
    }, 800);
}

function handleMemoryCardClick(event) {
    if (window.gameState.memory.isShowingSequence) return;
    
    const cardIndex = parseInt(this.getAttribute('data-index'));
    
    // 高亮点击的卡片
    this.classList.add('highlight');
    setTimeout(() => this.classList.remove('highlight'), 300);
    
    // 记录用户点击
    window.gameState.memory.userSequence.push(cardIndex);
    
    // 检查是否正确
    const currentIndex = window.gameState.memory.userSequence.length - 1;
    if (window.gameState.memory.userSequence[currentIndex] !== window.gameState.memory.sequence[currentIndex]) {
        // 点击错误
        document.getElementById('memory-status').textContent = '顺序错误，尝试新的序列';
        
        // 减少得分
        window.gameState.memory.score = Math.max(0, window.gameState.memory.score - 5);
        
        // 禁用卡片点击
        document.querySelectorAll('.memory-card').forEach(card => {
            card.style.pointerEvents = 'none';
        });
        
        // 显示正确序列
        setTimeout(() => {
            // 生成新序列
            generateNewSequence();
        }, 1000);
        
        return;
    }
    
    // 检查是否完成当前序列
    if (window.gameState.memory.userSequence.length === window.gameState.memory.sequence.length) {
        // 完成当前序列
        document.getElementById('memory-status').textContent = '正确！进入下一关';
        
        // 增加得分
        window.gameState.memory.score += window.gameState.memory.level * 10;
        
        // 提升难度
        window.gameState.memory.level++;
        document.getElementById('memory-level').textContent = window.gameState.memory.level;
        
        // 禁用卡片点击
        document.querySelectorAll('.memory-card').forEach(card => {
            card.style.pointerEvents = 'none';
        });
        
        // 生成新序列
        setTimeout(() => {
            generateNewSequence();
        }, 1000);
    }
}

function endMemoryGame() {
    // 停止游戏
    window.gameState.memory.isPlaying = false;
    
    // 禁用卡片点击
    const cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => {
        card.style.pointerEvents = 'none';
    });
    
    // 显示结果面板
    window.showPanel('memory-result-panel');
    
    // 更新结果
    document.getElementById('memory-score').textContent = window.gameState.memory.score;
    
    // 根据分数生成评估
    let resultText = '';
    if (window.gameState.memory.score >= 200) {
        resultText = '您的短期记忆能力非常出色！您能够轻松记住长序列的信息，这说明您的工作记忆容量较大，大脑信息处理效率高。这种能力在学习新知识、解决复杂问题和多任务处理中非常有价值。';
    } else if (window.gameState.memory.score >= 100) {
        resultText = '您的短期记忆能力良好。您能够记住中等长度的信息序列，这表明您有一个健康的工作记忆系统。继续训练可以进一步提高这一能力，帮助您在日常生活中更高效地处理信息。';
    } else {
        resultText = '您的短期记忆能力有提升空间。短期记忆是可以通过训练提高的，建议您定期进行记忆力练习，如记忆卡片、数字序列或单词列表等活动，这将有助于增强您的认知功能。';
    }
    
    document.getElementById('memory-result-description').textContent = resultText;
}

// 初始化记忆卡片事件监听
document.addEventListener('DOMContentLoaded', function() {
    const memoryCards = document.querySelectorAll('.memory-card');
    memoryCards.forEach(card => {
        card.addEventListener('click', handleMemoryCardClick);
    });
});