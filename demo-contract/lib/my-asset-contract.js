/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class MyAssetContract extends Contract {


    async getTx(ctx, myAssetId) {


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
            throw new Error(`${batchId} already exists`);
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
        // const eventPayload = Buffer.from(`Created asset ${batchId}`);
        // ctx.stub.setEvent('myEvent', eventPayload);

    }

    async getBatch(ctx, batchId) {
        const exists = await this.batchExist(ctx, batchId);
        if (!exists) {
            throw new Error(`${batchId} does not exist`);
        }
        const buffer = await ctx.stub.getState(batchId);
        const batch = JSON.parse(buffer.toString());
        return batch;
    }
    async getBatchBoxes(ctx, batchId) {
        const exists = await this.batchExist(ctx, batchId);
        if (!exists) {
            throw new Error(`${batchId} does not exist`);
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
            throw new Error(`${batchId} does not exist`);
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

    async updateBatch(ctx, batchId, stage, data) {
        const exists = await this.batchExist(ctx, batchId);
        if (!exists) {
            throw new Error(`${batchId} does not exist`);
        }
        const batch = await this.getBatch(ctx, batchId)

        switch (stage) {
            case 'distributer': batch.distributerData = data;
                break;
            case 'retailer': batch.retailerData = data;
                break;
        }

        const buffer = Buffer.from(JSON.stringify(batch));
        await ctx.stub.putState(batchId, buffer);
    }

    async deleteBach(ctx, batchId) {
        const exists = await this.batchExist(ctx, batchId);
        if (!exists) {
            throw new Error(`${batchId} does not exist`);
        }
        await ctx.stub.deleteState(batchId);
    }

}

module.exports = MyAssetContract;
