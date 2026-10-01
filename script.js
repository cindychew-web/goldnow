document.querySelectorAll('[data-stepper]').forEach(function(stepper){
  var name = stepper.dataset.stepper;
  var panelStage = document.querySelector('[data-panels="' + name + '"]');
  var buttons = stepper.querySelectorAll('.step-btn');
  var panels = panelStage.querySelectorAll('[data-panel]');
  buttons.forEach(function(btn){
    btn.addEventListener('click', function(){
      var step = btn.dataset.step;
      buttons.forEach(function(b){ b.classList.toggle('active', b === btn); });
      panels.forEach(function(p){ p.hidden = (p.dataset.panel !== step); });
    });
  });
});
