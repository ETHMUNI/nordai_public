const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

app.post('/youtubetags', async (req, res, next) => {
	try {
		let { content } = req.body
  
	let prompt = `Lav Youtube tags som hjælper med at få seere til at finde brugerens videoer. Lav Youtube tags fra TEXT:\n###\n`+ 
    `TEXT: Nogle tags, du kan overveje at inkludere i din YouTube-video om DIY gaver, inkluderer:\n· DIY\n· Gaveideer\n· Hjemmelavet gave\n· Budgetvenlig\n· Kreativ gave\n· Personlig gave\n· Genbrug\n· Upcycling\n· Håndlavet\n Du kan også overveje at inkludere tags, der er specifikke for det emne, du dækker i din video, fx "DIY hjemmelavet parfume" eller "DIY billig fotramme". Det er vigtigt at tagge din video med relevante ord, da det hjælper med at gøre det nemmere for folk at finde din video, når de søger efter emner, der relaterer sig til DIY-gaveideer.\n###\n` +
    `TEXT: Her er nogle tags, du kan overveje at inkludere i din YouTube-video om investering i kryptovaluta:\n· Kryptovaluta\n· Bitcoin\n· Ethereum\n· Investering i kryptovaluta\n· Investering i Altcoins\n· Digital valuta\n· NFT investeringer\n· Kryptovaluta-markedet\n· Kryptovaluta-protefølje\n· Decentraliseret finans (DeFi)\nDu kan også overveje at inkludere tags, der er specifikke for det emne, du dækker i din video, fx "Bitcoin-investering" eller "Ethereum-mining". Det er vigtigt at tagge din video med relevante ord, da det hjælper med at gøre det nemmere for folk at finde din video, når de søger efter emner, der relaterer sig til investering i kryptovaluta.\n###\n` +
    `TEXT: her er nogle tags, du kan overveje at inkludere i din YouTube-video om hvordan man starter sin egen virksomhed:· Stiftelse af et social media marketing bureau\n· Opbygning af et kundeportefølje\n· Iværksætteri i en nichebranche\n· Markedsføring i en nichebranche\n· Danske SaaS\n· Lav din egen virksomhed\n· Løvenshule\n· danske iværksætter\nOverveje også at inkludere tags, der er mere specifikke for det emne, du dækker i din video, fx "Hvordan laver du din egen virksomhed" eller "Gode ideer til at blive selvstændig". Det er vigtigt at tagge din video med relevante ord, da det hjælper med at gøre det nemmere for folk at finde din video, når de søger efter emner.\n###\n`

	let inputRaw = `TEXT: ${ content }` // here is where people enter stuff
	prompt += inputRaw

	const gptResponse = await openai.complete({
		engine: 'text-davinci-003',
		prompt,
		maxTokens: 2500,
		temperature: 0.9,
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
	output = output.substring(1, output.length)

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