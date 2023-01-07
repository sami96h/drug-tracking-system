/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const SmartContractError = require('./SmartContractError')

class MyAssetContract extends Contract {


    async getBatchHistory(ctx, myAssetId) {


        let iterator = await ctx.stub.getHistoryForKey(myAssetId);
        let result = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value) {
                const obj = {
                    TxId: res.value.txId,
                    value: JSON.parse(res.value.value.toString('utf8'))
                };
                result.push(obj);
            }
            res = await iterator.next();
        }
        await iterator.close();
        return result;


    }

    async batchExist(ctx, batchId) {
        const buffer = await ctx.stub.getState(batchId);
        return (!!buffer && buffer.length > 0);
    }


    async createBatch(ctx, batchId,
        medicineName,
        description,
        pricePerBox,
        productionDate,
        expiryDate,
        companyName,
        amount) {

        const exists = await this.batchExist(ctx, batchId);
        if (exists) {
            throw new SmartContractError(`${batchId} already exists`, 10);
        }
        let mspid = ctx.clientIdentity.getMSPID();
        const boxes = []
        for (let i = 0; i < amount; i++) {
            boxes.push({
                id: `${batchId}.box${i}`,
                sold: false
            })
        }

        const batch = {
            batchId,
            stage: 'Manufacturing',
            medicineName,
            description,
            pricePerBox,
            productionDate,
            expiryDate,
            companyName,
            companyId: mspid,
            boxes

        };
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));
        const eventPayload = Buffer.from(JSON.stringify(batch));

        ctx.stub.setEvent('myEvent', eventPayload);
        return `${batchId} added successfully`
    }

    async getBatch(ctx, batchId) {
        const exists = await this.batchExist(ctx, batchId);
        if (!exists) {
            throw new SmartContractError(`${batchId} does not exist`, 20);
        }

        const buffer = await ctx.stub.getState(batchId);
        const batch = JSON.parse(buffer.toString());
        return batch;
    }

    async getBatchBoxes(ctx, batchId) {
        const exists = await this.batchExist(ctx, batchId);
        if (!exists) {
            throw new SmartContractError(`${batchId} does not exist`, 20);
        }
        const buffer = await ctx.stub.getState(batchId);
        const batch = JSON.parse(buffer.toString());
        return batch.boxes;

    }

    async GetAllBatches(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    async readBox(ctx, boxId) {
        const batchId = boxId.slice(0, boxId.indexOf('.'))

        const exists = await this.batchExist(ctx, batchId);
        if (!exists) {
            throw new SmartContractError(`${batchId} does not exist`, 20);
        }
        const buffer = await ctx.stub.getState(batchId);
        const batch = JSON.parse(buffer.toString());


        const box = { ...batch }
        delete box.boxes;
        delete box.companyId;
        box.price = box.pricePerBox
        delete box.pricePerBox;
        return box;
    }

    sellBox(ctx, boxId, batch) {


        let boxes = [...batch.boxes]
        for (let box of boxes) {
            if (box.id === boxId) {
                box.sold = true
            }

        }

        return boxes;


    }

    async updateBatch(ctx, batchId, oldData, stage, data) {

        oldData = JSON.parse(oldData)
        data = JSON.parse(data)
        let newBatch

        switch (stage) {
            case 'distributer': newBatch = { ...oldData, stage: 'distributer', distributerData: data };
                break;
            case 'retailer':
                const newBoxes = this.sellBox(ctx, data.boxId, oldData)
                newBatch = { ...oldData, stage, boxes: newBoxes };
                break;
            default: newBatch = { ...oldData, data: 'none' };
        }

        const buffer = Buffer.from(JSON.stringify(newBatch));
        await ctx.stub.putState(batchId, buffer);
        return `${batchId} updated successfully`
    }

    async deleteBatch(ctx, batchId) {
        const exists = await this.batchExist(ctx, batchId);
        if (!exists) {
            throw new SmartContractError(`${batchId} does not exist`, 20);
        }
        await ctx.stub.deleteState(batchId);
        return `${batchId} deleted successfully`
    }


}

module.exports = MyAssetContract;
