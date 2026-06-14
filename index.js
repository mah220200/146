const container = document.getElementById('giftContainer');
const canvas = document.getElementById('fireworks');
const msg = document.getElementById('message');
const audio = document.getElementById('bg-music');
let running = false;

container.addEventListener('click', ()=>{
	if(container.classList.contains('open')) return;
	container.classList.add('open');
	msg.classList.remove('hidden');
	// play music (user gesture from click allows autoplay)
	if(audio){
		audio.currentTime = 0;
		const p = audio.play();
		if(p && p.catch){ p.catch(()=>{/* ignore */}); }
	}
	startFireworks();
});

// Simple fireworks animation
function startFireworks(){
	if(running) return; running = true;
	canvas.width = innerWidth; canvas.height = innerHeight;
	const ctx = canvas.getContext('2d');
	const particles = [];
	const confetti = [];

	function spawn(){
		const cx = Math.random()*canvas.width;
		const cy = Math.random()*canvas.height*0.6 + canvas.height*0.1;
		for(let i=0;i<60;i++){
			particles.push({type:'fire', x:cx,y:cy, vx:(Math.random()-0.5)*6, vy:(Math.random()-0.8)*6, life:Math.random()*80+50, color:`hsl(${Math.random()*360},80%,60%)`});
		}
		// spawn confetti
		for(let i=0;i<80;i++){
			confetti.push({x:Math.random()*canvas.width, y:-10, vx:(Math.random()-0.5)*2, vy:Math.random()*2+1, r:Math.random()*6+4, rot:Math.random()*360, vr:Math.random()*8-4, color:`hsl(${Math.random()*360},70%,55%)`, life:300});
		}
	}

	function loop(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		for(let i=particles.length-1;i>=0;i--){
			const p = particles[i];
			if(p.type==='fire'){
				p.vy += 0.06;
				p.x += p.vx; p.y += p.vy; p.life--;
				ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, p.life/120);
				ctx.beginPath(); ctx.arc(p.x,p.y,Math.max(1, p.life/12),0,Math.PI*2); ctx.fill();
				if(p.life<=0) particles.splice(i,1);
			}
		}
		// draw confetti
		for(let i=confetti.length-1;i>=0;i--){
			const c = confetti[i];
			c.vy += 0.01; c.x += c.vx; c.y += c.vy; c.rot += c.vr; c.life--;
			ctx.save(); ctx.translate(c.x,c.y); ctx.rotate(c.rot*Math.PI/180);
			ctx.fillStyle = c.color; ctx.globalAlpha = Math.max(0, Math.min(1, c.life/300));
			ctx.fillRect(-c.r/2, -c.r/2, c.r, c.r*0.6);
			ctx.restore();
			if(c.y>canvas.height+50 || c.life<=0) confetti.splice(i,1);
		}
		ctx.globalAlpha = 1;
		if(Math.random()<0.06) spawn();
		requestAnimationFrame(loop);
	}
	loop();
}

window.addEventListener('resize', ()=>{ if(canvas){canvas.width=innerWidth;canvas.height=innerHeight}});
