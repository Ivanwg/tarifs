export default function interval(cb, ms){
  const a = {
    clear : function() {
      clearTimeout(a.timer)
    }
  };
  (function run(){
    const timeLeft = cb();
    a.timer = setTimeout(run, ms);
    if (timeLeft <= 0) a.clear();
  })();

  return a;
}
