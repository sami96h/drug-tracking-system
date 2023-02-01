
const { param, body } = require('express-validator')


const validateId = (id) => {
	const regex = /^[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/
	if (!regex.test(id)) {
		throw new Error('The id should be in batchId.boxId format')
	}
}

const paramValidation = [
	param('Id', 'can contain only letters and numbers').custom(
		(id) => {
			validateId(id)
			return true
		}
	),
]

const bodyValidation = [
	body('Id', 'can contain only letters and numbers').custom(
		(id) => {
			validateId(id)
			return true
		}
	),

]


module.exports = {
	paramValidation,
	bodyValidation
}