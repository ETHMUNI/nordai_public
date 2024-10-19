
const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

app.post('/business/jobad', async (req, res, next) => {
	let { content, currentPrompt, title, salary, skills, company, contact } = req.body
  
	let prompt = ""
	let inputRaw = ""

	if(currentPrompt === "Basic Ad"){
		prompt = `Opret en detaljeret jobannonce fra TEXT::\n###\n` +
	  `TEXT: Moshi Marketing Agency stilling $40k webudvikler kender mange frontend, html, react, etc kan arbejde alene\nJOB AD:\nMoshi søger efter en kandidat til at tilslutte sig vores spændende Marketing Agency, der arbejder med programmering på frontend. Hvis du søger en stilling som Front End, vil du få mulighed for at bygge hjemmesider designet af vores fantastiske team på platforme som WordPress, Shopify og mere.\n\nRollen:\n- Skab hjemmesider ved hjælp af de nyeste kodestandarder\n- Brug teknologistak som React, Angular, Vue \n- Arbejd på små og store projekter med et team\n\nTeksniske krav:\n- Forståelse i HTML, CSS, JS\n- Erfaring i biblioteker som React & TypeScript\n- Erfaring i Azure eller AWS\n\nSådan ansøger du:\nHvis du er interesseret, kan du ansøge ved at kontakte os direkte på Moshi.\n###\n` +
	  `TEXT: smiths & co lederstilling for en finansiel planlægningschef, der hjælper med budgetter, samarbejder med ledere, hjælper CEO'en og er lokal i Australien. Kontakt er james@s.com\nJOB AD:\nGodt etableret i den australske finansbranche har Smith & Co haft betydelig internt bevægelse og omsætningsvækst i det seneste år og søger at tiltrække og udvikle top talent. Dette er en karrierebyggende mulighed for en erfaren kandidat, der søger fremskridt.\n\nRollen:\n- Rapportér direkte til den administrerende direktør for finanser\n- Kør budget- og prognoseprocessen\n- Samarbejd med Business Unit Managers for at fremme processer\n- Arbejd sammen med ledergruppen for at udvikle en balanceret scorecard\n- Gennemgå eksisterende systemer og anbefale ændringer\n\nFærdigheder og erfaring:\n- Bevist erfaring i en senior finansiel stilling\n- Evne til at udvikle betydningsfulde FP & P-rapportering og detaljeret analyse\n- Erfaring i detailbranchen vil være en fordel\n\nSådan ansøger du:\nLigner dette dig? Ansøg nu ved at kontakte os hos Smiths & Co eller send en e-mail til james@s.com\n###\n`

	  inputRaw = `TEXT: ${content}\nJOB AD:\n`
	  prompt += inputRaw
	  
	}
  
	if(currentPrompt === "Detailed Ad"){
		prompt = `Opret en detaljeret jobannonce ud fra følgende detaljer:\n###` +
	  `TITLE: Juniorudvikler\nSALARY: 40k\nSKILLS: HTML, CSS, React, WordPress, Frontend\nCOMPANY: Moshi\nCONTACT: Sam 0437789811\nJOB ANNONCE:\nMoshi søger en kandidat til at deltage i vores spændende Marketing Agency, der arbejder med programmering på frontend med en startløn på $ 40.000. Hvis du leder efter en programmeringsstilling, får du mulighed for at bygge hjemmesider designet af vores fantastiske team på platforme som WordPress, Shopify og mere.\n\nRollen:\n- Opret hjemmesider ved hjælp af de nyeste kodestandarder\n- Brug teknologistakke som React, Angular, Vue\n- Arbejde på små og store projekter med et team\n\nTekniske krav:\n- Forståelse af HTML, CSS, JS\n- Erfaring med biblioteker som React & TypeScript\n- Erfaring med Azure eller AWS\n\nSådan ansøger du:\nHvis du er interesseret, kan du ansøge ved at kontakte Sam på 0437789811 eller kontakte Moshi direkte.\n###\n` +
	  `TITLE: Finansiel rådgiver\nSALARY: $ 100000 plus super god forsikring\nSKILLS: Arbejder for CFO, budgettering, prognose, arbejde med forretningsenheder, seniorfærdigheder, kan gennemgå, analyse, rapporter\nCOMPANY: Smiths & co\nCONTACT: james@s.com\nJOB AD:\nSmith & Co, der er veletableret i den australske finansbranche, har set betydelig intern bevægelse og omsætningsvækst i løbet af det sidste år, og søger at bringe på og udvikle top talent. Stillingen har en løn på $ 100.000 + Super & Insurance. Dette er en karrierebyggende mulighed for en erfaren kandidat, der søger fremskridt.\n\nRollen:\n- Rapportér direkte til finansdirektøren\n- Kør budgetterings- og prognoseprocessen\n- Samarbejd med forretningsenhedsledere for at drive processforbedringer\n- Arbejd sammen med ledergruppen for at udvikle en balanceret scorecard\n- Gennemgå eksisterende systemer og anbefale ændringer\n\nFærdigheder og erfaring:\n- Bevist erfaring i en senior finansiel rolle\n- Evnen til at udvikle meningsfuld FP & P-rapportering og detaljeret analyse\n- Erfaring i detailhandel branchen vil være en fordel\n\nSådan ansøger du:\nEr dette dig? Ansøg nu nedenfor ved at kontakte os hos Smiths & Co eller send en e-mail til james@s.com\n###\n`

	  inputRaw = `TITLE: ${title}\nSALARY: ${salary}\nSKILLS: ${skills}\nCOMPANY: ${company}\nCONTACT: ${contact}\nJOB AD:\n`
	  prompt += inputRaw
	}
  
	
  
	const gptResponse = await openai.complete({
		engine: 'text-davinci-003',
		prompt,
		maxTokens: 2000,
		temperature: 0.5,
		topP: 1,
		frequencyPenalty: 0.2,
		presencePenalty: 0,
		bestOf: 1,
		n: 1,
		user: req.user._id,
		stream: false,
		stop: ["###", "<|endoftext|>","JOB AD","TEXT" ],
	});
  
	let output = `${gptResponse.data.choices[0].text}`

	req.locals.input = prompt
	req.locals.inputRaw = inputRaw
	req.locals.output = output

	next()
	
  })

  module.exports = app