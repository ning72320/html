// fix_math_options.js - 专门用于修复数学测试选项点击事件

document.addEventListener('DOMContentLoaded', function() {
    // 监控DOM变化，确保新生成的math-option元素始终有事件监听器
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 检查新添加的节点是否包含math-option
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // 元素节点
                        // 直接检查节点本身
                        if (node.classList && node.classList.contains('math-option')) {
                            bindOptionClickEvent(node);
                        }
                        
                        // 检查子节点
                        const options = node.querySelectorAll('.math-option');
                        if (options.length > 0) {
                            options.forEach(bindOptionClickEvent);
                        }
                    }
                });
            }
        });
    });
    
    // 启动观察器，观察整个文档
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 立即检查并绑定当前页面上的所有选项
    const allOptions = document.querySelectorAll('.math-option');
    allOptions.forEach(bindOptionClickEvent);
    
    // 选项点击事件处理函数
    function bindOptionClickEvent(option) {
        // 防止重复绑定
        if (option.hasEventListener) return;
        
        option.addEventListener('click', function(event) {
            handleMathOptionClick(event);
        });
        
        option.hasEventListener = true;
    }
    
    // 选项点击处理函数
    function handleMathOptionClick(event) {
        const target = event.currentTarget || event.target;
        const selectedValue = parseInt(target.getAttribute('data-value'));
        const options = document.querySelectorAll('.math-option');
        
        console.log('数学选项被点击:', selectedValue);
        
        // 禁用所有选项
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
        
        // 标记选中项
        target.classList.add('selected');
        
        // 获取正确答案
        const problem = document.getElementById('math-problem').textContent;
        const correctAnswer = calculateMathProblemAnswer(problem);
        
        if (selectedValue === correctAnswer) {
            // 回答正确
            target.style.backgroundColor = '#c8e6c9';
            
            // 如果MathGame可用，增加得分
            if (typeof MathGame !== 'undefined' && MathGame.getState) {
                const gameState = MathGame.getState();
                
                // 增加得分
                const difficultyScore = gameState.difficulty * 10;
                gameState.score += difficultyScore;
                gameState.correctAnswers++;
                
                // 更新UI
                document.getElementById('math-current-score').textContent = gameState.score;
                
                // 可能增加难度
                if (gameState.correctAnswers % 5 === 0 && gameState.difficulty < 3) {
                    gameState.difficulty++;
                    updateMathDifficultyDisplay(gameState.difficulty);
                }
            } else {
                // 更新window.mathGameState
                if (!window.mathGameState) {
                    window.mathGameState = {
                        score: 10,
                        correctAnswers: 1,
                        wrongAnswers: 0,
                        difficulty: 1
                    };
                } else {
                    window.mathGameState.score += 10;
                    window.mathGameState.correctAnswers++;
                }
                
                // 更新UI
                document.getElementById('math-current-score').textContent = window.mathGameState.score;
            }
        } else {
            // 回答错误
            target.style.backgroundColor = '#ffcdd2';
            
            // 显示正确答案
            options.forEach(option => {
                if (parseInt(option.getAttribute('data-value')) === correctAnswer) {
                    option.style.backgroundColor = '#c8e6c9';
                }
            });
            
            // 如果MathGame可用，减少得分
            if (typeof MathGame !== 'undefined' && MathGame.getState) {
                const gameState = MathGame.getState();
                
                // 减少得分
                gameState.score = Math.max(0, gameState.score - 5);
                gameState.wrongAnswers++;
                
                // 更新UI
                document.getElementById('math-current-score').textContent = gameState.score;
                
                // 可能降低难度
                if (gameState.wrongAnswers % 3 === 0 && gameState.difficulty > 1) {
                    gameState.difficulty--;
                    updateMathDifficultyDisplay(gameState.difficulty);
                }
            } else {
                // 更新window.mathGameState
                if (!window.mathGameState) {
                    window.mathGameState = {
                        score: 0,
                        correctAnswers: 0,
                        wrongAnswers: 1,
                        difficulty: 1
                    };
                } else {
                    window.mathGameState.score = Math.max(0, window.mathGameState.score - 5);
                    window.mathGameState.wrongAnswers++;
                }
                
                // 更新UI
                document.getElementById('math-current-score').textContent = window.mathGameState.score;
            }
        }
        
        // 延迟后生成新问题
        setTimeout(() => {
            if (typeof MathGame !== 'undefined' && typeof MathGame.generateMathProblem === 'function') {
                MathGame.generateMathProblem();
            } else {
                generateNewMathProblem();
            }
            
            // 重新启用选项点击
            const newOptions = document.querySelectorAll('.math-option');
            newOptions.forEach(option => {
                option.classList.remove('selected');
                option.style.backgroundColor = '';
                option.style.pointerEvents = 'auto';
            });
        }, 1000);
    }
    
    // 计算数学问题的答案
    function calculateMathProblemAnswer(problem) {
        // 从问题文本中提取计算式
        const expression = problem.split('=')[0].trim();
        
        // 替换乘号和除号为JavaScript可识别的操作符
        const jsExpression = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/');
        
        // 使用eval计算结果(在受控环境中安全使用)
        try {
            return eval(jsExpression);
        } catch (error) {
            console.error('计算表达式错误:', error);
            return 0;
        }
    }
    
    // 更新难度显示
    function updateMathDifficultyDisplay(difficulty) {
        let difficultyText = '';
        switch (difficulty) {
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
    
    // 生成新的数学问题
    function generateNewMathProblem() {
        const difficulty = window.mathGameState ? window.mathGameState.difficulty : 1;
        
        let problem = '';
        let options = [];
        let correctAnswer = 0;
        
        switch (difficulty) {
            case 1: // 简单: 加减法，10-50范围
                const num1 = Math.floor(Math.random() * 40) + 10;
                const num2 = Math.floor(Math.random() * 40) + 10;
                const operation = Math.random() < 0.5 ? '+' : '-';
                
                problem = `${num1} ${operation} ${num2} = ?`;
                correctAnswer = operation === '+' ? num1 + num2 : num1 - num2;
                break;
                
            case 2: // 中等: 乘除法
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
            if (difficulty === 1) {
                // 简单难度：答案上下浮动10以内
                const offset = Math.floor(Math.random() * 10) + 1;
                wrongAnswer = Math.random() < 0.5 ? correctAnswer + offset : correctAnswer - offset;
            } else if (difficulty === 2) {
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
    
    // 打乱数组顺序
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}); 