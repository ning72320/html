 // attention_game.js - 注意力游戏功能

// 注意力游戏相关函数
function startAttentionGame() {
    window.showPanel('attention-game-panel');
    
    // 直接通过style属性设置显示和隐藏
    document.getElementById('attention-game-panel').style.display = 'block';
    document.getElementById('attention-intro-panel').style.display = 'none';
    
    // 重置游戏状态
    window.gameState.attention = {
        score: 0,
        currentTarget: 1,
        correctClicks: 0,
        wrongClicks: 0,
        timer: 90,
        interval: null
    };
    
    // 更新UI
    document.getElementById('attention-target').textContent = window.gameState.attention.currentTarget;
    document.getElementById('attention-current-score').textContent = window.gameState.attention.score;
    document.getElementById('attention-status').textContent = `尽快找出并点击数字 ${window.gameState.attention.currentTarget}`;
    
    // 生成游戏网格
    generateAttentionGrid();
    
    // 启动定时器
    startAttentionTimer();
}

function generateAttentionGrid() {
    const gridContainer = document.getElementById('attention-game-grid');
    gridContainer.innerHTML = '';
    
    // 生成25个数字(5x5网格)
    const numbers = [];
    const totalNumbers = 25;
    
    // 确保包含目标数字
    numbers.push(window.gameState.attention.currentTarget);
    
    // 生成其他随机数字
    for (let i = 1; i < totalNumbers; i++) {
        let num;
        do {
            // 生成1-30之间的随机数
            num = Math.floor(Math.random() * 30) + 1;
        } while (numbers.includes(num));
        
        numbers.push(num);
    }
    
    // 打乱数组
    window.shuffleArray(numbers);
    
    // 创建网格
    for (let i = 0; i < numbers.length; i++) {
        const item = document.createElement('div');
        item.className = 'attention-item';
        item.textContent = numbers[i];
        item.setAttribute('data-number', numbers[i]);
        
        // 添加点击事件
        item.addEventListener('click', handleAttentionItemClick);
        
        gridContainer.appendChild(item);
    }
}

function handleAttentionItemClick(event) {
    const clickedNumber = parseInt(event.target.getAttribute('data-number'));
    
    if (clickedNumber === window.gameState.attention.currentTarget) {
        // 点击正确
        event.target.classList.add('target');
        
        // 增加得分和正确点击次数
        window.gameState.attention.score += 10;
        window.gameState.attention.correctClicks++;
        
        // 更新目标
        window.gameState.attention.currentTarget++;
        
        // 更新UI
        document.getElementById('attention-target').textContent = window.gameState.attention.currentTarget;
        document.getElementById('attention-current-score').textContent = window.gameState.attention.score;
        document.getElementById('attention-status').textContent = `尽快找出并点击数字 ${window.gameState.attention.currentTarget}`;
        
        // 生成新网格
        setTimeout(() => {
            generateAttentionGrid();
        }, 300);
    } else {
        // 点击错误
        event.target.style.backgroundColor = '#ffcccc';
        setTimeout(() => {
            event.target.style.backgroundColor = '';
        }, 300);
        
        // 减少得分并记录错误点击
        window.gameState.attention.score = Math.max(0, window.gameState.attention.score - 5);
        window.gameState.attention.wrongClicks++;
        
        // 更新UI
        document.getElementById('attention-current-score').textContent = window.gameState.attention.score;
    }
}

function startAttentionTimer() {
    // 更新定时器UI
    document.getElementById('attention-timer').textContent = window.gameState.attention.timer;
    
    // 更新进度条
    const progressBar = document.getElementById('attention-progress');
    progressBar.style.width = '100%';
    
    // 设置定时器
    window.gameState.attention.interval = setInterval(() => {
        window.gameState.attention.timer--;
        
        if (window.gameState.attention.timer <= 0) {
            // 时间到，结束游戏
            clearInterval(window.gameState.attention.interval);
            endAttentionGame();
        } else {
            // 更新UI
            document.getElementById('attention-timer').textContent = window.gameState.attention.timer;
            
            // 更新进度条
            const progressPercent = (window.gameState.attention.timer / 90) * 100;
            progressBar.style.width = progressPercent + '%';
        }
    }, 1000);
}

function endAttentionGame() {
    // 禁用所有注意力项目点击
    const attentionItems = document.querySelectorAll('.attention-item');
    attentionItems.forEach(item => {
        item.removeEventListener('click', handleAttentionItemClick);
        item.style.pointerEvents = 'none';
    });
    
    // 显示结果面板
    window.showPanel('attention-result-panel');
    
    // 直接通过style属性设置显示和隐藏
    document.getElementById('attention-result-panel').style.display = 'block';
    document.getElementById('attention-game-panel').style.display = 'none';
    
    // 更新结果
    document.getElementById('attention-score').textContent = window.gameState.attention.score;
    
    // 计算准确率
    const totalClicks = window.gameState.attention.correctClicks + window.gameState.attention.wrongClicks;
    const accuracy = totalClicks > 0 ? (window.gameState.attention.correctClicks / totalClicks * 100).toFixed(1) : 0;
    
    // 根据分数生成评估
    let resultText = '';
    if (window.gameState.attention.score >= 200) {
        resultText = `您的注意力和反应速度非常出色！您成功找到了${window.gameState.attention.correctClicks}个目标，准确率为${accuracy}%。这表明您具有高度集中的注意力和快速的视觉搜索能力，这在需要快速处理信息和做出决策的情境中非常有价值。`;
    } else if (window.gameState.attention.score >= 100) {
        resultText = `您的注意力和反应速度良好。您成功找到了${window.gameState.attention.correctClicks}个目标，准确率为${accuracy}%。这表明您有稳定的注意力和不错的视觉搜索速度，通过有针对性的训练，这些能力还可以进一步提高。`;
    } else {
        resultText = `您的注意力和反应速度有提升空间。您成功找到了${window.gameState.attention.correctClicks}个目标，准确率为${accuracy}%。建议增加专注力训练，如阅读、冥想或视觉搜索游戏，这些活动可以帮助提高您的注意力集中能力和处理速度。`;
    }
    
    document.getElementById('attention-result-description').textContent = resultText;
}