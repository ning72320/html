// fix_goto_math.js - 专门用于修复数学测试按钮的点击事件

document.addEventListener('DOMContentLoaded', function() {
    // 获取"继续下一个测试"按钮
    const gotoMathBtn = document.getElementById('goto-math-btn');
    
    if (gotoMathBtn) {
        // 清除所有现有的事件监听器
        const newGotoMathBtn = gotoMathBtn.cloneNode(true);
        gotoMathBtn.parentNode.replaceChild(newGotoMathBtn, gotoMathBtn);
        
        // 添加新的事件监听器
        newGotoMathBtn.addEventListener('click', function(event) {
            // 阻止可能的默认行为
            event.preventDefault();
            event.stopPropagation();
            
            console.log('点击了继续下一个测试按钮，正在加载数学测试...');
            
            // 确保数学游戏模块已加载
            if (typeof MathGame !== 'undefined') {
                // 创建并显示数学游戏介绍面板
                MathGame.createMathIntroPanel();
                window.showPanel('math-intro-panel');
            } else {
                // 直接显示内置的数学介绍面板
                window.showPanel('math-intro-panel');
                console.error('MathGame模块未加载，但我们尝试直接显示面板');
            }
            
            return false;
        });
        
        console.log('成功重新绑定了goto-math-btn的点击事件');
    } else {
        console.error('找不到goto-math-btn按钮');
    }
}); 