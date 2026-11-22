// 放在 script.js 的第一段！
window.addEventListener('scroll', function() {
    const triangleRight = document.querySelector('.bg-triangle-right');
    const triangleLeft = document.querySelector('.bg-triangle-left');
    
    if (!triangleRight || !triangleLeft) return;

    if (window.scrollY > 50) {
        triangleRight.classList.add('active');
        triangleLeft.classList.add('active');
    } else {
        triangleRight.classList.remove('active');
        triangleLeft.classList.remove('active');
    }
});

// ==========================================
// 1. 线条滚动生长 + 颜色变化
// ==========================================
window.addEventListener('scroll', function() {
    const treeSvg = document.querySelector('.tree-svg');
    const treeLines = document.querySelectorAll('.tree-line');
    
    if (!treeSvg || treeLines.length === 0) return;

    const rect = treeSvg.getBoundingClientRect();
    const start = window.innerHeight - 50; 
    const end = window.innerHeight - 800;   
    
    let progress = (start - rect.top) / (start - end);
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

        treeLines.forEach(function(line, index) {
        const totalLength = 2000; 
        
        let lineProgress = progress;
        
        // index 0 是中间的主干线，index 1 是左线，index 2 是右线
        // 如果是左右两根线，我们让它们的进度减去 0.4
        if (index === 1 || index === 2) {
            // 只有当总进度超过 0.4 时，左右两根线才开始有进度
            lineProgress = (progress - 0.4) * 1.5; // 乘 1.5 是为了让它们起步后追赶得稍微快一点
        }
        
        if (lineProgress < 0) lineProgress = 0;
        if (lineProgress > 1) lineProgress = 1; // 限制不能超过 1

        // 应用长度
        line.style.strokeDashoffset = totalLength - (totalLength * lineProgress);
        
        // 颜色变化逻辑（保持不变）
        if (progress > 0.2) {
            line.style.stroke = '#0071e3';
            line.style.filter = 'drop-shadow(0 0 6px rgba(0, 113, 227, 0.6))';
        } else {
            line.style.stroke = 'rgba(0, 113, 227, 0.3)';
            line.style.filter = 'none';
        }
    });
});


// ==========================================
// 3. 鼠标手电筒光晕
// ==========================================
document.addEventListener('mousemove', function(e) {
    const glow = document.querySelector('.mouse-glow');
    if (!glow) return;
    glow.style.opacity = '1';
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

document.addEventListener('mouseleave', function() {
    const glow = document.querySelector('.mouse-glow');
    if (glow) glow.style.opacity = '0';
});

// ==========================================
// 4. 卡片 3D 倾斜 (丝滑防抖版)
// ==========================================
const wrappers = document.querySelectorAll('.card-wrapper');

wrappers.forEach(wrapper => {
    const card = wrapper.querySelector('.story-card');
    if (!card) return;

    let rafId = null; 

    wrapper.addEventListener('mousemove', function(e) {
        if (rafId) return;

        rafId = requestAnimationFrame(() => {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -20; 
            const rotateY = ((x - centerX) / centerX) * 20;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            rafId = null; 
        });
    });

    wrapper.addEventListener('mouseleave', function() {
        if (rafId) {
            cancelAnimationFrame(rafId); 
            rafId = null;
        }
        card.style.transform = `rotateX(0) rotateY(0) scale(1)`;
        card.style.transition = `transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)`; 
    });
    
    wrapper.addEventListener('mouseenter', function() {
        card.style.transition = `transform 0.1s ease`;
    });
});