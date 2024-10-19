const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

app.post('/twitterthreads', async (req, res, next) => {
	try {
		let { content } = req.body
  
	let prompt = `Lav Twitter Threads som svare med relevant og kreativt indhold. Lav Twitter Threads fra TEXT:\n###\n`+ 
    `TEXT: 1/6 Autopilot: Den mest avancerede selvkørende teknologi på markedet, der gør det nemt og sikkert at køre. #Tesla #Autopilot\n 2/6 Supercharging: Oplad din Tesla hurtigt og effektivt med Supercharger-netværket, der dækker hele verden. #Tesla #Supercharging\n 3/6 Over the air software opdateringer: Hold din Tesla opdateret med de nyeste funktioner og forbedringer, uden at skulle besøge en serviceafdeling. #Tesla #OTA\n 4/6 Dækselsåbningsfunktion: Åbn og luk dækslerne til dit frunk, bagage- og laderydersæt med en enkelt berøring. #Tesla #Dækselsåbningsfunktion\n 5/6 Skærm: Tesla har en central 17-tommer skærm, der kontrollerer alt fra navigation til underholdning. #Tesla #Skærm\n 6/6 Energimanagement: Tesla har en avanceret energistyring, der giver dig mulighed for at styre og spare på strømforbruget i dit hjem. #Tesla #Energimanagement\n###\n` +
    `TEXT: 1/8 - AI er en menneskelig supermakker, der kan samarbejde med os og gøre os mere produktive.\n 2/8 - AI kan automatisere rutineopgaver, så dine medarbejdere kan fokusere på mere værdiskabende opgaver.\n 3/8 - AI kan analysere store mængder data hurtigere end mennesker, hvilket fører til bedre beslutninger.\n 4/8 - AI kan forbedre kundeservice ved at besvare spørgsmål og løse problemer hurtigere.\n 5/8 - AI kan hjælpe med at målrette markedsføring ved at identificere de mest effektive strategier.\n 6/8 - AI kan hjælpe med at forbedre sikkerheden ved at opdage og forhindre cyberangreb.\n 7/8 - AI kan øge produktiviteten ved at hjælpe med at planlægge og koordinere projekter.\n 8/8 - AI kan øge innovationen ved at identificere nye muligheder og opfinde bedre løsninger.\n###\n` +
	`TEXT: 1/9 - Crypto portfolio tracker: Værktøjet giver dig mulighed for at holde styr på dine crypto investeringer i realtid. Eksempel: CoinMarketCap, Delta.\n 2/9 - Crypto wallet: Værktøjet holder styr på dine private nøgler og giver dig mulighed for at modtage og sende crypto. Eksempel: Coinbase Wallet, MetaMask.\n 3/9 - Crypto exchange: Værktøjet giver dig mulighed for at købe, sælge og bytte crypto. Eksempel: Binance\n 4/9 - Crypto news aggregator: Værktøjet samler de nyeste crypto nyheder på et sted. Eksempel: CoinDesk, CryptoSlate.\n 5/9 - Crypto charting og analyseværktøjer: Værktøjet giver dig mulighed for at analysere prisudviklingen og teknisk analyse af crypto. Eksempel: TradingView, Coinigy.\n 6/9 - Crypto tax software: Værktøjet hjælper dig med at beregne og rapportere dine crypto skatter. Eksempel: TokenTax, CryptoTrader.Tax\n 7/9 - Crypto lending platform: Værktøjet giver dig mulighed for at låne eller investere i crypto på en p2p basis. Eksempel: Nexo.\n 8/9 - Crypto debit card: Værktøjet giver dig mulighed for at bruge crypto som betalingsmiddel på samme måde som en almindelig debitkort. Eksempel: Coinbase Card\n 9/9 - Crypto portfolio diversificering værktøj: Værktøjet hjælper dig med at diversificere din crypto portefølje. Eksempel: Shrimpy.\n###\n`
	let inputRaw = `TEXT: ${ content }` // here is where people enter stuff
	prompt += inputRaw

	const gptResponse = await openai.complete({
		engine: 'text-davinci-003',
		prompt,
		maxTokens: 2500,
		temperature: 0.75,
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