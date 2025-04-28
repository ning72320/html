// cognitive_assessment.js - 认知能力测试的主要功能

document.addEventListener('DOMContentLoaded', function() {
    // 设置时间
    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        document.querySelector('.status-left').textContent = hours + ':' + minutes;
    }
    
    updateTime();
    setInterval(updateTime, 60000);
    
    // 游戏状态变量
    window.gameState = {
        memory: {
            score: 0,
            level: 1,
            sequence: [],
            userSequence: [],
            isPlaying: false,
            isShowingSequence: false,
            timer: 90,
            interval: null
        },
        attention: {
            score: 0,
            currentTarget: 1,
            correctClicks: 0,
            wrongClicks: 0,
            timer: 90,
            interval: null
        },
        math: {
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            timer: 90,
            interval: null
        }
    };
    
    // 显示面板函数
    window.showPanel = function(panelId) {
        // 隐藏所有面板
        document.querySelectorAll('.game-container').forEach(panel => {
            panel.classList.remove('active-panel');
            panel.style.display = 'none'; // 直接设置style
        });
        
        // 显示指定面板
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.classList.add('active-panel');
            panel.style.display = 'block'; // 直接设置style
        } else {
            console.error('找不到面板:', panelId);
        }
    };
    
    // 绑定按钮事件
    const startMemoryBtn = document.getElementById('start-memory-btn');
    if (startMemoryBtn) {
        startMemoryBtn.addEventListener('click', startMemoryGame);
    }
    
    const startAttentionBtn = document.getElementById('start-attention-btn');
    if (startAttentionBtn) {
        startAttentionBtn.addEventListener('click', startAttentionGame);
    }
    
    const gotoAttentionBtn = document.getElementById('goto-attention-btn');
    if (gotoAttentionBtn) {
        gotoAttentionBtn.addEventListener('click', function() {
            // 显示注意力游戏介绍面板
            showPanel('attention-intro-panel');
        });
    }
    
    const gotoMathBtn = document.getElementById('goto-math-btn');
    if (gotoMathBtn) {
        gotoMathBtn.addEventListener('click', function() {
            // 显示数学测试介绍面板
            if (typeof MathGame !== 'undefined') {
                MathGame.createMathIntroPanel();
                showPanel('math-intro-panel');
            } else {
                console.error('数学游戏模块未加载');
                // 直接显示内置的数学介绍面板
                showPanel('math-intro-panel');
            }
        });
    }
    
    // 辅助函数
    window.shuffleArray = function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
});