// parallax "falling" effect on hero background
const heroBg = document.getElementById('heroBg');

function onScroll(){
  const y = window.scrollY;
  if(heroBg){
    heroBg.style.transform = `translateY(${y*0.12}px)`;
  }
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

// show contact fab once the hero has been scrolled past
const fab = document.getElementById('contactFab');
const fabTrigger = document.querySelector('.hero');
const fabObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    fab.classList.toggle('show', !e.isIntersecting);
  });
},{threshold:0});
if(fabTrigger) fabObserver.observe(fabTrigger);

// reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
