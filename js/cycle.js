// Função auxiliar para somar dias a uma data
function addDays(date, days) {
	let result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
  }
  
  // Função para formatar a data no padrão YYYY-MM-DD
  function formatDate(date) {
	let d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();
	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	return [year, month, day].join('-');
  }
  
  // Resumos das fases (usados para tooltips e banner)
  const phaseSummaries = {
	'Fase Menstrual': "Período de limpeza e renovação. Cuide do seu conforto e hidratação.",
	'Fase Folicular': "Energia crescente e preparação. Ótimo para iniciar novos projetos.",
	'Fase Ovulatória': "Pico de fertilidade e disposição. Momento de socializar e se conectar.",
	'Fase Lútea': "Período de introspecção e autocuidado. Ideal para relaxar e se reconectar consigo mesma."
  };
  
  // Mapeamento de cores para cada fase
  const phaseColors = {
	'Fase Menstrual': "#e74c3c",
	'Fase Folicular': "#3498db",
	'Fase Ovulatória': "#2ecc71",
	'Fase Lútea': "#9b59b6"
  };
  
  document.getElementById('cycleForm').addEventListener('submit', function(e) {
	e.preventDefault();
	
	// Obter valores do formulário
	const lastPeriodInput = document.getElementById('lastPeriod').value;
	const menstruationDuration = parseInt(document.getElementById('menstruationDuration').value);
	
	if (!lastPeriodInput || isNaN(menstruationDuration) || menstruationDuration < 1) {
	  alert("Por favor, preencha todos os campos corretamente.");
	  return;
	}
	
	const lastPeriodDate = new Date(lastPeriodInput);
	const today = new Date();
	
	if (today < lastPeriodDate) {
	  alert("A data da última menstruação não pode ser futura.");
	  return;
	}
	
	// Parâmetros fixos do ciclo (pode ser customizado futuramente)
	const cycleLength = 28;
	const ovulationWindowStart = 13; // Dia 13 do ciclo
	const ovulationWindowEnd = 15;   // Dia 15 do ciclo
	
	// Calcular o dia atual do ciclo para definir a fase atual
	const diffDays = Math.floor((today - lastPeriodDate) / (1000 * 60 * 60 * 24));
	const currentCycleDay = (diffDays % cycleLength) + 1;
	let currentPhase = "";
	
	if (currentCycleDay <= menstruationDuration) {
	  currentPhase = "Fase Menstrual";
	} else if (currentCycleDay < ovulationWindowStart) {
	  currentPhase = "Fase Folicular";
	} else if (currentCycleDay >= ovulationWindowStart && currentCycleDay <= ovulationWindowEnd) {
	  currentPhase = "Fase Ovulatória";
	} else {
	  currentPhase = "Fase Lútea";
	}
	
	// Atualizar o banner da fase atual
	const bannerDiv = document.getElementById('currentPhaseBanner');
	bannerDiv.innerHTML = `<div class="phase-banner" style="background-color: ${phaseColors[currentPhase]}">
	  <i class="fas fa-heart"></i> Hoje você está na <strong>${currentPhase}</strong>
	  <p class="mb-0">${phaseSummaries[currentPhase]}</p>
	</div>`;
	
	// Gerar eventos para ciclos passados e futuros
	const events = [];
	const cyclesBefore = 6;  // ciclos retroativos
	const cyclesAfter = 6;   // ciclos futuros
	
	for (let i = -cyclesBefore; i < cyclesAfter; i++) {
	  let cycleStart = addDays(lastPeriodDate, i * cycleLength);
	  
	  // Fase Menstrual: do dia 1 até o término da menstruação
	  let menstrualStart = cycleStart;
	  let menstrualEnd = addDays(cycleStart, menstruationDuration - 1);
	  events.push({
		title: 'Fase Menstrual',
		start: formatDate(menstrualStart),
		end: formatDate(addDays(menstrualEnd, 1)),
		color: phaseColors['Fase Menstrual'],
		extendedProps: { summary: phaseSummaries['Fase Menstrual'] }
	  });
	  
	  // Fase Folicular: do dia seguinte ao fim da menstruação até o dia anterior à ovulação
	  let follicularStart = addDays(cycleStart, menstruationDuration);
	  let follicularEnd = addDays(cycleStart, ovulationWindowStart - 1);
	  if (follicularStart <= follicularEnd) {
		events.push({
		  title: 'Fase Folicular',
		  start: formatDate(follicularStart),
		  end: formatDate(addDays(follicularEnd, 1)),
		  color: phaseColors['Fase Folicular'],
		  extendedProps: { summary: phaseSummaries['Fase Folicular'] }
		});
	  }
	  
	  // Fase Ovulatória: janela de 3 dias (dias 13 a 15)
	  let ovulatoryStart = addDays(cycleStart, ovulationWindowStart - 1);
	  let ovulatoryEnd = addDays(cycleStart, ovulationWindowEnd - 1);
	  events.push({
		title: 'Fase Ovulatória',
		start: formatDate(ovulatoryStart),
		end: formatDate(addDays(ovulatoryEnd, 1)),
		color: phaseColors['Fase Ovulatória'],
		extendedProps: { summary: phaseSummaries['Fase Ovulatória'] }
	  });
	  
	  // Fase Lútea: do dia após a ovulação até o final do ciclo
	  let lutealStart = addDays(cycleStart, ovulationWindowEnd);
	  let lutealEnd = addDays(cycleStart, cycleLength - 1);
	  if (lutealStart <= lutealEnd) {
		events.push({
		  title: 'Fase Lútea',
		  start: formatDate(lutealStart),
		  end: formatDate(addDays(lutealEnd, 1)),
		  color: phaseColors['Fase Lútea'],
		  extendedProps: { summary: phaseSummaries['Fase Lútea'] }
		});
	  }
	}
	
	// Renderizar o calendário com os eventos
	var calendarEl = document.getElementById('calendar');
	calendarEl.innerHTML = "";
	
	var calendar = new FullCalendar.Calendar(calendarEl, {
	  themeSystem: 'bootstrap5',
	  locale: 'pt-br',
	  initialView: 'dayGridMonth',
	  events: events,
	  height: 670,
	  eventDidMount: function(info) {
		// Ativar tooltips do Bootstrap para exibir o resumo da fase
		new bootstrap.Tooltip(info.el, {
		  title: info.event.extendedProps.summary,
		  placement: 'top',
		  trigger: 'hover',
		  container: 'body'
		});
	  }
	});
	
	calendar.render();
  });
  
  function enviarEmail() {
	const email = document.getElementById('s-email').value;
	const xhr = new XMLHttpRequest();

	xhr.open('GET', `mail.php?email=${encodeURIComponent(email)}`, true);

	xhr.onload = function() {
		if (xhr.status >= 200 && xhr.status < 300) {
			alert("Obrigada pela sua participação")
		} 
	};
	xhr.send();
}