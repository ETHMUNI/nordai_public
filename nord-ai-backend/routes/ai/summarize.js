
const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

app.post('/personal/summarize', async (req, res, next) => {
	try {
		let { content } = req.body
  
	let prompt = `List de vigtigste punkter i simpelt sprog, baseret på TEXT:\n###\n` +

	`TEXT: Programmerere, der ikke blogger, bør starte nu. Din fremtidige selv vil takke dig, når din blog hjælper dig med at få en bedre job, tjene mere penge og selvfølgelig, have det nemmere ved at lære nye koncepter.\n` +
	`KEY POINTS: 1. Programmerere bør starte med at blogge\n2. Blogging hjælper dig med at få en bedre job\n3. Du kan tjene flere penge ved at blogge\n4. Lær nye koncepter nemmere ved at blogge om dem\n###\n` +

	`TEXT: En tort er en handling eller undladelse, der fører til skade eller skade på en anden og udgør et civilt forhold, for hvilket domstolene pålægger ansvar. I denne sammenhæng beskriver "skade" invasionen af enhver retlig ret, mens "skade" beskriver en tab eller skade i virkeligheden, som en person lider.\n` +
	`KEY POINTS: 1. En tort er, når man skjuler information, der forårsager skade eller skade \n2. Skade i tort-sammenhæng kan være en invasion af retlige rettigheder \n3. Skade kan være måder, hvorpå en person lider et tab.\n###\n`

	let inputRaw = `TEXT: ${content}\nKEY POINTS: 1.`
	prompt += inputRaw

	const gptResponse = await openai.complete({
		engine: 'curie',
		prompt,
		maxTokens: 500,
		temperature: 0.2,
		topP: 1,
		frequencyPenalty: 1,
		presencePenalty: 0,
		bestOf: 1,
		n: 1,
		user: req.user._id,
		stream: false,
		stop: ["###", "<|endoftext|>", ],
	});

	let outputs = []

	if(gptResponse.data.choices[0].text){
		// Split break lines
		outputs = `1.${gptResponse.data.choices[0].text}`.split('\n')

		// remove entries with spaces or empty
		outputs = outputs.filter(function(output) {
			return (!(output === "" || output === " " || output === "\n"))
		})

		// remove numbers and spaces
		for (let i = 0; i < outputs.length; i++) {
			outputs[i] = outputs[i].substring(3)
			outputs[i] = outputs[i].replace(/^\s+|\s+$/g, '')
		}
		// remove duplicates
		outputs = outputs.filter((item, pos, self) => self.indexOf(item) === pos)
	}

	req.locals.input = prompt
	req.locals.inputRaw = inputRaw
	req.locals.outputs = outputs

	next()

	} catch (err){
		console.log(err.response)
		console.log(err.data)
		console.log(err.message)
	}
	
  })

module.exports = app