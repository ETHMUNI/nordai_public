const express = require('express');
const openai = require('../middlewares/openai');
 
let app = express.Router()

app.post('/youtubetitle', async (req, res, next) => {
	try {
		let { topic, tone } = req.body
  
	let prompt = `Lav Youtube titler som svare med relevant indhold udfra et emne og hvilken tone Youtube titlen skal have. Lav Youtube titel udfra YOUTUBE-TITEL:\n###\n`+ 
    `TOPIC: High-end mode\nTONE: Kreativ\nYOUTUBE-TITEL: Mix & Match: Sådan kombinerer du high-end og high-street for et unikt look\n###\n` +
    `TOPIC: Investering med indexfonde\nTONE: Fængende\nYOUTUBE-TITEL: Stop med at kaste dine penge væk - Sådan investerer du smart med indexfonde\n###\n` +
    `TOPIC: Fitness\nTONE: Kreativ\nYOUTUBE-TITEL: 1. Få den perfekte krop: De 5 mest effektive øvelser til at tone din krop\n 2. Sådan bliver du fit på 30 dage: En træningsplan der virker\n 3. Hjemmetræning: De bedste øvelser du kan lave uden udstyr\n 4. Fitness for begyndere: Sådan kommer du i gang med at træne\n 5. Sådan taber du mavefedt: En træningsplan der giver resultater\n###\n` +
	`TOPIC: Fransk mad\nTONE: Kulinarisk\nYOUTUBE-TITEL: "1. Fransk madlavning: Sådan laver du den perfekte ratatouille\n 2. Fransk gastronomi: Opskriften på en lækker bouillabaisse\n 3. Fransk madkultur: Sådan laves en traditionel quiche Lorraine\n 4. Fransk madkunst: Fremstillingen af en ægte tarte tatin\n 5. Fransk madinspiration: Sådan laver du en lækker coq au vin\n###\n`


	// if(currentPrompt === "Detailed Ad"){
	// 	prompt = `Opret en detaljeret jobannonce ud fra følgende detaljer:\n###` +
	//   `TITLE: Juniorudvikler\nSALARY: 40k\nSKILLS: HTML, CSS, React, WordPress, Frontend\nCOMPANY: Moshi\nCONTACT: Sam 0437789811\nJOB ANNONCE:\nMoshi søger en kandidat til at deltage i vores spændende Marketing Agency, der arbejder med programmering på frontend med en startløn på $ 40.000. Hvis du leder efter en programmeringsstilling, får du mulighed for at bygge hjemmesider designet af vores fantastiske team på platforme som WordPress, Shopify og mere.\n\nRollen:\n- Opret hjemmesider ved hjælp af de nyeste kodestandarder\n- Brug teknologistakke som React, Angular, Vue\n- Arbejde på små og store projekter med et team\n\nTekniske krav:\n- Forståelse af HTML, CSS, JS\n- Erfaring med biblioteker som React & TypeScript\n- Erfaring med Azure eller AWS\n\nSådan ansøger du:\nHvis du er interesseret, kan du ansøge ved at kontakte Sam på 0437789811 eller kontakte Moshi direkte.\n###\n` +
	//   `TITLE: Finansiel rådgiver\nSALARY: $ 100000 plus super god forsikring\nSKILLS: Arbejder for CFO, budgettering, prognose, arbejde med forretningsenheder, seniorfærdigheder, kan gennemgå, analyse, rapporter\nCOMPANY: Smiths & co\nCONTACT: james@s.com\nJOB AD:\nSmith & Co, der er veletableret i den australske finansbranche, har set betydelig intern bevægelse og omsætningsvækst i løbet af det sidste år, og søger at bringe på og udvikle top talent. Stillingen har en løn på $ 100.000 + Super & Insurance. Dette er en karrierebyggende mulighed for en erfaren kandidat, der søger fremskridt.\n\nRollen:\n- Rapportér direkte til finansdirektøren\n- Kør budgetterings- og prognoseprocessen\n- Samarbejd med forretningsenhedsledere for at drive processforbedringer\n- Arbejd sammen med ledergruppen for at udvikle en balanceret scorecard\n- Gennemgå eksisterende systemer og anbefale ændringer\n\nFærdigheder og erfaring:\n- Bevist erfaring i en senior finansiel rolle\n- Evnen til at udvikle meningsfuld FP & P-rapportering og detaljeret analyse\n- Erfaring i detailhandel branchen vil være en fordel\n\nSådan ansøger du:\nEr dette dig? Ansøg nu nedenfor ved at kontakte os hos Smiths & Co eller send en e-mail til james@s.com\n###\n`

	//   inputRaw = `TITLE: ${title}\nSALARY: ${salary}\nSKILLS: ${skills}\nCOMPANY: ${company}\nCONTACT: ${contact}\nJOB AD:\n`
	//   prompt += inputRaw
	// }

	let inputRaw = `TOPIC: ${topic}\n TONE: ${tone}\nYOUTUBE-TITEL:\n` // here is where people enter stuff
	prompt += inputRaw

	const gptResponse = await openai.complete({
		engine: 'text-davinci-003',
		prompt,
		maxTokens: 500,
		temperature: 0.82,
		topP: 1,
		frequencyPenalty: 1,
		presencePenalty: 0,
		bestOf: 1,
		n: 1,
		user: req.user._id,
		stream: false,
		stop: ["###", "<|endoftext|>", ],
	});

	let output = `${gptResponse.data.choices[0].text}`

	// remove the first character from output
	// output = output.substring(1, output.length)

	// If the output string ends with one or more hashtags, remove all of them
	if (output.endsWith('"')) {
		output = output.substring(0, output.length - 1)
	}

	// If the output string ends with one or more hashtags, remove all of them
	if (output.endsWith('"')) {
		output = output.substring(0, output.length - 1)
	}

	// remove a single new line at the end of output if there is one
	if (output.endsWith('\n')) {
		output = output.substring(0, output.length - 1)
	}

	req.locals.input = prompt
	req.locals.inputRaw = inputRaw
	req.locals.output = output

	next()

	} catch (err){
		console.log(err.response)
		console.log(err.data)
		console.log(err.message)
	}
	
  })

module.exports = app