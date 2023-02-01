/* eslint-disable no-prototype-builtins */

const validator = require('validator')
const { body,param } = require('express-validator')

const batchIdSchema = [
	param('Id', 'can contain only letters and numbers').isAlphanumeric(),
]

const addBatch = [
	body().isObject().withMessage('body must contain an asset object'),
	body('batchId', 'can contain only letters and numbers').isAlphanumeric(),
	body('medicineName', 'can not be empty').notEmpty(),
	body('pricePerBox', 'must be an integer').notEmpty().isInt(),
	body('productionDate', 'must be in YYYY/MM/DD format').notEmpty().isDate(),
	body('expiryDate', 'must be in YYYY/MM/DD format')
		.isDate()
		.notEmpty()
		.custom(
			(expiryDate, { req }) => {
                
				if (validator.isAfter(req.body.productionDate,expiryDate)) {

					throw new Error('expiry date must be after the production date')
				}
				return true

			}),
	body('amount', 'must be a number').notEmpty().isNumeric()
]

const updateBatch = [
	body().isObject().withMessage('body must contain an asset object'),
    
	body('data', 'must be in JSON format').isJSON().custom(
		(data) => {
			const jsonData = JSON.parse(data)
			if (Object.keys(jsonData).length !== 4) {
				throw new Error('Should have only four keys [\'vehicleId\',\'shipNo\',\'receiptDate\',\'deliveryDate\']')
			}
			const dataKeys = ['vehicleId', 'shipNo', 'receiptDate', 'deliveryDate']
			for (let key of dataKeys) {

				if (!jsonData.hasOwnProperty(key)) {
					throw new Error(`${key} is missing`)
				}
			}
			if (!validator.isDate(jsonData.receiptDate)) {
				throw new Error('\'receiptDate\' should be in YYYY/MM/DD format')
			}
			if (!validator.isDate(jsonData.deliveryDate)) {
				throw new Error('\'deliveryDate\' should be in YYYY/MM/DD format')
			}
			if (validator.isAfter(jsonData.receiptDate, jsonData.deliveryDate)) {
				throw new Error('\'deliveryDate\' should be after receiptDate')
			}

			return true

		}
	),

]


module.exports = {
	addBatch,
	updateBatch,
	batchIdSchema
}