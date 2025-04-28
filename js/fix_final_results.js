// fix_final_results.js - 专门用于修复总体测试结果按钮的点击事件

document.addEventListener('DOMContentLoaded', function() {
    // 获取"查看总体测试结果"按钮
    const gotoFinalResultsBtn = document.getElementById('goto-final-results-btn');
    
    if (gotoFinalResultsBtn) {
        // 清除所有现有的事件监听器
        const newGotoFinalResultsBtn = gotoFinalResultsBtn.cloneNode(true);
        gotoFinalResultsBtn.parentNode.replaceChild(newGotoFinalResultsBtn, gotoFinalResultsBtn);
        
        // 添加新的事件监听器
        newGotoFinalResultsBtn.addEventListener('click', function(event) {
            // 阻止可能的默认行为
            event.preventDefault();
            event.stopPropagation();
            
            console.log('点击了查看总体测试结果按钮，正在显示最终结果面板...');
            
            // 保存测试结果到本地存储，以便在新页面中获取
            const testResults = {
                memoryScore: parseInt(document.getElementById('memory-score').textContent) || 0,
                attentionScore: parseInt(document.getElementById('attention-score').textContent) || 0,
                mathScore: parseInt(document.getElementById('math-score').textContent) || 0
            };
            
            localStorage.setItem('cognitiveTestResults', JSON.stringify(testResults));
            
            // 跳转到结果页面
            window.location.href = '../pages/test_results.html';
        });
        
        console.log('成功重新绑定了goto-final-results-btn的点击事件');
    } else {
        console.error('找不到goto-final-results-btn按钮');
    }
}); 