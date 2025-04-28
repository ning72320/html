// math_game.js - 数学游戏功能

// 数学游戏模块
const MathGame = (function() {
    // 游戏状态
    let gameState = {
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        timer: 90,
        interval: null,
        difficulty: 1 // 1:简单, 2:中等, 3:困难
    };

    // 创建数学游戏面板
    function createMathIntroPanel() {
        // 如果面板已存在，则不再创建
        if (document.getElementById('math-intro-panel')) {
            // 确保开始游戏按钮添加事件监听器
            const startMathBtn = document.getElementById('start-math-btn');
            if (startMathBtn && !startMathBtn.hasEventListener) {
                startMathBtn.addEventListener('click', startMathGame);
                startMathBtn.hasEventListener = true;
            }
            return;
        }
        
        // 创建数学能力游戏介绍面板
        const mathIntroPanel = document.createElement('div');
        mathIntroPanel.className = 'game-container math-intro-panel';
        mathIntroPanel.id = 'math-intro-panel';
        mathIntroPanel.innerHTML = `
            <div class="game-header math-header">
                <h2>数学能力测试</h2>
                <p>测试您的计算能力和数学反应速度</p>
            </div>
            
            <div class="game-body">
                <div class="instruction-container">
                    <h3>快速计算</h3>
                    <p>在这个游戏中，您需要在限定时间内快速解答一系列数学问题。</p>
                    <p>问题会逐渐变得更具挑战性，计算速度和准确性都会影响您的最终得分。</p>
                </div>
                
                <div class="game-action">
                    <button class="action-btn math-btn" id="start-math-btn">
                        <i class="fas fa-play"></i> 开始游戏
                    </button>
                </div>
            </div>
        `;
        
        document.querySelector('.app-content').appendChild(mathIntroPanel);
        
        // 添加事件监听器
        const startMathBtn = document.getElementById('start-math-btn');
        if (startMathBtn) {
            startMathBtn.addEventListener('click', startMathGame);
            startMathBtn.hasEventListener = true;
        }
    }
    
    function createMathGamePanel() {
        // 如果面板已存在，则不再创建
        if (document.getElementById('math-game-panel')) return;
        
        // 创建数学能力游戏面板
        const mathGamePanel = document.createElement('div');
        mathGamePanel.className = 'game-container math-game-panel';
        mathGamePanel.id = 'math-game-panel';
        mathGamePanel.innerHTML = `
            <div class="game-header math-header">
                <h2>数学能力测试</h2>
                <p>快速计算问题并选择正确答案</p>
                <div class="timer-display">
                    <i class="fas fa-clock"></i>
                    <span id="math-timer">90</span>秒
                </div>
                <div class="game-progress">
                    <div class="progress-bar" id="math-progress"></div>
                </div>
            </div>
            
            <div class="game-body">
                <div class="instruction-container">
                    <h3>当前得分: <span id="math-current-score">0</span></h3>
                    <p id="math-problem-level">难度等级: 简单</p>
                </div>
                
                <div class="game-content">
                    <div class="math-problem" id="math-problem">6 + 7 = ?</div>
                    <div class="math-options" id="math-options">
                        <div class="math-option" data-value="11">11</div>
                        <div class="math-option" data-value="13">13</div>
                        <div class="math-option" data-value="14">14</div>
                        <div class="math-option" data-value="12">12</div>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.app-content').appendChild(mathGamePanel);
    }
    
    function createMathResultPanel() {
        // 如果面板已存在，则不再创建
        if (document.getElementById('math-result-panel')) return;
        
        // 创建数学能力游戏结果面板
        const mathResultPanel = document.createElement('div');
        mathResultPanel.className = 'game-container math-result-panel';
        mathResultPanel.id = 'math-result-panel';
        mathResultPanel.innerHTML = `
            <div class="game-header math-header">
                <h2>数学能力测试结果</h2>
                <p>您的计算能力表现</p>
            </div>
            
            <div class="game-body">
                <div class="result-container">
                    <div class="result-score" id="math-score">0</div>
                    <div class="result-text">您的数学能力得分</div>
                    <div class="result-description" id="math-result-description">
                        测试结果分析加载中...
                    </div>
                </div>
                
                <div class="game-action">
                    <button class="action-btn" id="goto-final-results-btn">
                        <i class="fas fa-arrow-right"></i> 查看总体测试结果
                    </button>
                </div>
            </div>
        `;
        
        document.querySelector('.app-content').appendChild(mathResultPanel);
        
        // 添加事件监听器
        document.getElementById('goto-final-results-btn').addEventListener('click', function() {
            createFinalResultsPanel();
            window.showPanel('final-results-panel');
        });
    }
    
    function createFinalResultsPanel() {
        // 如果面板已存在，则不再创建
        if (document.getElementById('final-results-panel')) return;
        
        // 创建最终测试结果面板
        const finalResultsPanel = document.createElement('div');
        finalResultsPanel.className = 'game-container final-results-panel';
        finalResultsPanel.id = 'final-results-panel';
        finalResultsPanel.innerHTML = `
            <div class="game-header">
                <h2>认知能力测试结果</h2>
                <p>您的综合认知能力表现</p>
            </div>
            
            <div class="game-body">
                <div class="result-container">
                    <div class="result-text">您的认知能力测试结果</div>
                    
                    <div class="result-chart">
                        <div class="result-bar result-bar-memory">
                            <div class="result-bar-label">记忆力</div>
                            <div class="result-bar-fill" id="memory-result-bar" style="width: 0%"></div>
                            <div class="result-bar-score" id="memory-result-value">0</div>
                        </div>
                        
                        <div class="result-bar result-bar-attention">
                            <div class="result-bar-label">注意力</div>
                            <div class="result-bar-fill" id="attention-result-bar" style="width: 0%"></div>
                            <div class="result-bar-score" id="attention-result-value">0</div>
                        </div>
                        
                        <div class="result-bar result-bar-math">
                            <div class="result-bar-label">数学能力</div>
                            <div class="result-bar-fill" id="math-result-bar" style="width: 0%"></div>
                            <div class="result-bar-score" id="math-result-value">0</div>
                        </div>
                    </div>
                    
                    <div class="result-description" id="final-result-description">
                        您的综合测试结果分析将根据三项测试的表现进行综合评估，提供个性化的认知能力分析和提升建议。
                    </div>
                </div>
                
                <div class="game-action">
                    <button class="action-btn" id="finish-test-btn">
                        <i class="fas fa-check"></i> 完成测试
                    </button>
                </div>
            </div>
        `;
        
        document.querySelector('.app-content').appendChild(finalResultsPanel);
        
        // 添加事件监听器
        document.getElementById('finish-test-btn').addEventListener('click', function() {
            window.location.href = 'cognitive_test.html';
        });
        
        // 填充结果数据
        updateFinalResults();
    }
    
    function updateFinalResults() {
        // 获取各项测试分数
        const memoryScore = window.gameState.memory.score;
        const attentionScore = window.gameState.attention.score;
        const mathScore = gameState.score;
        
        // 计算总分数和百分比
        const maxScore = 300; // 假设每项测试满分是300
        const memoryPercent = Math.min((memoryScore / maxScore) * 100, 100);
        const attentionPercent = Math.min((attentionScore / maxScore) * 100, 100);
        const mathPercent = Math.min((mathScore / maxScore) * 100, 100);
        
        // 更新UI
        document.getElementById('memory-result-bar').style.width = memoryPercent + '%';
        document.getElementById('memory-result-value').textContent = memoryScore;
        
        document.getElementById('attention-result-bar').style.width = attentionPercent + '%';
        document.getElementById('attention-result-value').textContent = attentionScore;
        
        document.getElementById('math-result-bar').style.width = mathPercent + '%';
        document.getElementById('math-result-value').textContent = mathScore;
        
        // 计算平均分
        const averageScore = Math.round((memoryScore + attentionScore + mathScore) / 3);
        
        // 生成综合评估
        let finalDescription = '';
        if (averageScore >= 200) {
            finalDescription = '您的整体认知能力表现优秀！您在记忆力、注意力和数学能力方面都表现出了较高水平。这些认知功能对于日常生活、学习和工作都至关重要。建议您通过定期的认知训练来保持和提升这些能力。';
        } else if (averageScore >= 100) {
            finalDescription = '您的整体认知能力处于中等水平。您的某些认知功能表现较好，而其他方面可能需要更多关注和训练。建议您针对较弱的认知能力进行有针对性的训练，以提升整体认知水平。';
        } else {
            finalDescription = '您的认知能力测试结果表明，您在某些认知功能方面可能需要更多的锻炼和训练。认知能力是可以通过持续的练习得到提升的，建议您采用科学的方法进行定期训练，以改善整体认知表现。';
        }
        
        document.getElementById('final-result-description').textContent = finalDescription;
    }
    
    // 数学游戏功能实现
    function startMathGame() {
        // 创建游戏面板
        createMathGamePanel();
        window.showPanel('math-game-panel');
        
        // 重置游戏状态
        gameState = {
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            timer: 90,
            interval: null,
            difficulty: 1 // 1:简单, 2:中等, 3:困难
        };
        
        // 更新UI
        document.getElementById('math-current-score').textContent = gameState.score;
        document.getElementById('math-problem-level').textContent = '难度等级: 简单';
        
        // 生成新问题
        generateMathProblem();
        
        // 启动定时器
        startMathTimer();
        
        // 绑定选项点击事件
        bindMathOptionEvents();
    }
    
    function bindMathOptionEvents() {
        const options = document.querySelectorAll('.math-option');
        options.forEach(option => {
            option.addEventListener('click', handleMathOptionClick);
        });
    }
    
    function handleMathOptionClick(event) {
        const selectedValue = parseInt(event.target.getAttribute('data-value'));
        const options = document.querySelectorAll('.math-option');
        
        // 禁用所有选项
        options.forEach(option => {
            option.removeEventListener('click', handleMathOptionClick);
            option.style.pointerEvents = 'none';
        });
        
        // 标记选中项
        event.target.classList.add('selected');
        
        // 获取正确答案
        const problem = document.getElementById('math-problem').textContent;
        const correctAnswer = calculateMathProblemAnswer(problem);
        
        if (selectedValue === correctAnswer) {
            // 回答正确
            event.target.style.backgroundColor = '#c8e6c9';
            
            // 增加得分
            const difficultyScore = gameState.difficulty * 10;
            gameState.score += difficultyScore;
            gameState.correctAnswers++;
            
            // 更新UI
            document.getElementById('math-current-score').textContent = gameState.score;
            
            // 可能增加难度
            if (gameState.correctAnswers % 5 === 0 && gameState.difficulty < 3) {
                gameState.difficulty++;
                updateMathDifficultyDisplay();
            }
        } else {
            // 回答错误
            event.target.style.backgroundColor = '#ffcdd2';
            
            // 显示正确答案
            options.forEach(option => {
                if (parseInt(option.getAttribute('data-value')) === correctAnswer) {
                    option.style.backgroundColor = '#c8e6c9';
                }
            });
            
            // 减少得分
            gameState.score = Math.max(0, gameState.score - 5);
            gameState.wrongAnswers++;
            
            // 更新UI
            document.getElementById('math-current-score').textContent = gameState.score;
            
            // 可能降低难度
            if (gameState.wrongAnswers % 3 === 0 && gameState.difficulty > 1) {
                gameState.difficulty--;
                updateMathDifficultyDisplay();
            }
        }
        
        // 延迟后生成新问题
        setTimeout(() => {
            generateMathProblem();
            
            // 重新绑定选项点击事件
            options.forEach(option => {
                option.classList.remove('selected');
                option.style.backgroundColor = '';
                option.style.pointerEvents = 'auto';
                option.addEventListener('click', handleMathOptionClick);
            });
        }, 1000);
    }
    
    function updateMathDifficultyDisplay() {
        let difficultyText = '';
        switch (gameState.difficulty) {
            case 1:
                difficultyText = '难度等级: 简单';
                break;
            case 2:
                difficultyText = '难度等级: 中等';
                break;
            case 3:
                difficultyText = '难度等级: 困难';
                break;
        }
        
        document.getElementById('math-problem-level').textContent = difficultyText;
    }
    
    function generateMathProblem() {
        let problem = '';
        let options = [];
        let correctAnswer = 0;
        
        switch (gameState.difficulty) {
            case 1: // 简单: 加减法，10-50范围
                const num1 = Math.floor(Math.random() * 40) + 10;
                const num2 = Math.floor(Math.random() * 40) + 10;
                const operation = Math.random() < 0.5 ? '+' : '-';
                
                problem = `${num1} ${operation} ${num2} = ?`;
                correctAnswer = operation === '+' ? num1 + num2 : num1 - num2;
                break;
                
            case 2: // 中等: 乘除法，个位数乘以两位数，或两位数除以个位数
                if (Math.random() < 0.5) {
                    // 乘法
                    const num1_2 = Math.floor(Math.random() * 9) + 2;
                    const num2_2 = Math.floor(Math.random() * 90) + 10;
                    
                    problem = `${num1_2} × ${num2_2} = ?`;
                    correctAnswer = num1_2 * num2_2;
                } else {
                    // 除法(确保能整除)
                    const divisor = Math.floor(Math.random() * 8) + 2;
                    const result = Math.floor(Math.random() * 20) + 5;
                    const dividend = divisor * result;
                    
                    problem = `${dividend} ÷ ${divisor} = ?`;
                    correctAnswer = result;
                }
                break;
                
            case 3: // 困难: 混合运算
                const num1_3 = Math.floor(Math.random() * 50) + 10;
                const num2_3 = Math.floor(Math.random() * 30) + 10;
                const num3_3 = Math.floor(Math.random() * 20) + 5;
                
                const operations = ['+', '-', '×'];
                const op1 = operations[Math.floor(Math.random() * 2)]; // 加或减
                const op2 = operations[Math.floor(Math.random() * 3)]; // 任意操作
                
                problem = `${num1_3} ${op1} ${num2_3} ${op2} ${num3_3} = ?`;
                
                // 计算答案
                if (op2 === '×') {
                    // 乘法优先
                    const step1 = num2_3 * num3_3;
                    correctAnswer = op1 === '+' ? num1_3 + step1 : num1_3 - step1;
                } else {
                    // 从左到右计算
                    const step1 = op1 === '+' ? num1_3 + num2_3 : num1_3 - num2_3;
                    correctAnswer = op2 === '+' ? step1 + num3_3 : (op2 === '-' ? step1 - num3_3 : step1 * num3_3);
                }
                break;
        }
        
        // 生成选项(包括正确答案)
        options.push(correctAnswer);
        
        // 生成3个不同的错误选项
        while (options.length < 4) {
            let wrongAnswer;
            if (gameState.difficulty === 1) {
                // 简单难度：答案上下浮动10以内
                const offset = Math.floor(Math.random() * 10) + 1;
                wrongAnswer = Math.random() < 0.5 ? correctAnswer + offset : correctAnswer - offset;
            } else if (gameState.difficulty === 2) {
                // 中等难度：答案上下浮动20以内
                const offset = Math.floor(Math.random() * 20) + 1;
                wrongAnswer = Math.random() < 0.5 ? correctAnswer + offset : correctAnswer - offset;
            } else {
                // 困难难度：答案上下浮动50以内
                const offset = Math.floor(Math.random() * 50) + 1;
                wrongAnswer = Math.random() < 0.5 ? correctAnswer + offset : correctAnswer - offset;
            }
            
            // 确保选项不重复
            if (!options.includes(wrongAnswer)) {
                options.push(wrongAnswer);
            }
        }
        
        // 打乱选项顺序
        shuffleArray(options);
        
        // 更新UI
        document.getElementById('math-problem').textContent = problem;
        
        const optionsContainer = document.getElementById('math-options');
        optionsContainer.innerHTML = '';
        
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'math-option';
            optionElement.textContent = option;
            optionElement.setAttribute('data-value', option);
            optionsContainer.appendChild(optionElement);
        });
    }
    
    function calculateMathProblemAnswer(problem) {
        // 从问题文本中提取计算式
        const expression = problem.split('=')[0].trim();
        
        // 替换乘号和除号为JavaScript可识别的操作符
        const jsExpression = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/');
        
        // 使用eval计算结果(在受控环境中安全使用)
        return eval(jsExpression);
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function startMathTimer() {
        // 更新定时器UI
        document.getElementById('math-timer').textContent = gameState.timer;
        
        // 更新进度条
        const progressBar = document.getElementById('math-progress');
        progressBar.style.width = '100%';
        
        // 设置定时器
        gameState.interval = setInterval(() => {
            gameState.timer--;
            
            if (gameState.timer <= 0) {
                // 时间到，结束游戏
                clearInterval(gameState.interval);
                endMathGame();
            } else {
                // 更新UI
                document.getElementById('math-timer').textContent = gameState.timer;
                
                // 更新进度条
                const progressPercent = (gameState.timer / 90) * 100;
                progressBar.style.width = progressPercent + '%';
            }
        }, 1000);
    }
    
    function endMathGame() {
        // 创建结果面板
        createMathResultPanel();
        
        // 禁用所有数学选项
        const options = document.querySelectorAll('.math-option');
        options.forEach(option => {
            option.removeEventListener('click', handleMathOptionClick);
            option.style.pointerEvents = 'none';
        });
        
        // 显示结果面板
        window.showPanel('math-result-panel');
        
        // 更新结果
        document.getElementById('math-score').textContent = gameState.score;
        
        // 计算正确率
        const totalAnswers = gameState.correctAnswers + gameState.wrongAnswers;
        const accuracy = totalAnswers > 0 ? (gameState.correctAnswers / totalAnswers * 100).toFixed(1) : 0;
        
        // 根据分数生成评估
        let resultText = '';
        if (gameState.score >= 200) {
            resultText = `您的数学能力表现非常出色！您正确回答了${gameState.correctAnswers}个问题，准确率为${accuracy}%。您展示了出色的计算速度和精确度，即使面对复杂的问题也能迅速给出正确答案。这种能力在日常生活和工作中非常有价值。`;
        } else if (gameState.score >= 100) {
            resultText = `您的数学能力表现良好。您正确回答了${gameState.correctAnswers}个问题，准确率为${accuracy}%。您表现出了不错的计算能力和数学思维，通过进一步练习，您的速度和准确性还可以得到提升。`;
        } else {
            resultText = `您的数学能力测试结果显示有提升空间。您正确回答了${gameState.correctAnswers}个问题，准确率为${accuracy}%。建议您通过规律练习来提高基本计算技能和数学思维，这将有助于提升您在日常生活中的问题解决能力。`;
        }
        
        document.getElementById('math-result-description').textContent = resultText;
        
        // 将数学游戏状态保存到window对象，以便最终结果可以访问
        window.mathGameState = gameState;
    }
    
    // 公开API
    return {
        createMathIntroPanel,
        createMathGamePanel,
        createMathResultPanel,
        createFinalResultsPanel,
        startMathGame,
        endMathGame,
        getState: function() {
            return gameState;
        }
    };
})();