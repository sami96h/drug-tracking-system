'use strict';

const { Contract } = require('fabric-contract-api');
const SmartContractError = require('./SmartContractError')

class MyAssetContract extends Contract {


    async getBatchHistory(ctx, batchId) {


        const iterator = await ctx.stub.getHistoryForKey(batchId);
        const results = await this.GetAllResults(ctx, iterator);

        return JSON.stringify(results);

    }

    async GetAllResults(ctx, iterator) {
        let allResults = [];
        let res = { done: false, value: null };

        while (true) {
            let jsonRes = {};


            res = await iterator.next();



            if (res.value && res.value.value.toString()) {

                jsonRes.TxId = res.value.txId;
                jsonRes.Timestamp = res.value.timestamp;
                jsonRes.Timestamp = new Date((res.value.timestamp.seconds.low * 1000));
                let ms = res.value.timestamp.nanos / 1000000;
                jsonRes.Timestamp.setMilliseconds(ms);
                if (res.value.is_delete) {
                    jsonRes.IsDelete = res.value.is_delete.toString();
                } else {
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));

                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                }

                allResults.push(jsonRes);
            }
            // check to see if we have reached the end
            if (res.done) {
                // explicitly close the iterator

                await iterator.close();
                return allResults;
            }

        }  // while true
    }


    async batchExist(ctx, batchId) {
        const buffer = await ctx.stub.getState(batchId);
        return (!!buffer && buffer.length > 0);
    }


    async createBatch(ctx, batchId,
        data) {

        const submitter = ctx.clientIdentity.getMSPID()
        if (submitter !== 'Org1MSP') {
            throw new Error(`Unauthorized access: Only Manufacturer can perform this action !`)
        }

        const exists = await this.batchExist(ctx, batchId);
        if (exists) {
            throw new Error(`${batchId} already exists`);
        }
        let mspid = ctx.clientIdentity.getMSPID();
        
        const {medicineName,
                pricePerBox,
                productionDate,
                expiryDate,
                amount,
                }= JSON.parse(data)
        const boxes = []
        for (let i = 0; i < amount; i++) {
            boxes.push({
                id: `${batchId}.box${i}`,
                sold: false
            })
        }

        const batch = {
            batchId,
            medicineName,
            pricePerBox,
            productionDate,
            expiryDate,
            companyId: mspid,
            boxes,
            owner: ctx.clientIdentity.getMSPID(),
        };
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));
        const eventPayload = Buffer.from(JSON.stringify(batch));

        ctx.stub.setEvent('myEvent', eventPayload);
        return `${batchId} added successfully`
    }


    async transfer(ctx, batchId, newOwner) {
        const batch = await this.getBatch(ctx, batchId)
        if (ctx.clientIdentity.getMSPID() !== batch.owner) {
            throw new Error('Batch is not owned by the current invoker')
        }
        const newBatch = { ...batch, owner: newOwner }
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(newBatch)));
        return `${batchId} transfered successfully to ${newOwner}`
    }

    async getBatch(ctx, batchId) {
        const exists = await this.batchExist(ctx, batchId);
        if (!exists) {
            throw new Error(`${batchId} does not exist`);
        }

        const buffer = await ctx.stub.getState(batchId);
        let batch = JSON.parse(buffer.toString());
        const {medicineName} = batch;
        let drug = await ctx.stub.invokeChaincode('drugs-contract',['getDrug',medicineName],'mychannel')
        drug = JSON.parse(Buffer.from(drug.payload).toString())

        batch = {...batch,...drug}
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
            throw new Error(`${batchId} does not exist`);
        }

        
        const batch = await this.getBatch(ctx,batchId);
        let box = batch.boxes.find((box)=>box.id===boxId)
        if (!box) {
            throw new Error(`${boxId} does not exist!`)
        }

        box = { ...box,...batch }
        delete box.boxes;
        delete box.companyId;
        box.price = box.pricePerBox
        delete box.pricePerBox;
        return box;
    }

    async sellBox(ctx, boxId) {


        if (ctx.clientIdentity.getMSPID() !== 'Org3MSP') {
            throw new Error('Unauthorized access: Only Retailer can perform this action !')

        }
        const batchId = boxId.slice(0, boxId.indexOf('.'))
        const batch = await this.getBatch(ctx, batchId)
        if (batch.owner !== 'Org3MSP') {
            throw new Error('Batch is not owned by the Retailer !')
        }
        // TO DO -> check if box exist!!
        let flag = false
        let boxes = [...batch.boxes]
        for (let box of boxes) {
            if (box.id === boxId) {
                flag = true
                box.sold = true
            }
        }
        if (!flag) {
            throw new Error(`Box doesn't exist`)
        }
        batch.boxes = boxes
        const buffer = Buffer.from(JSON.stringify(batch));
        await ctx.stub.putState(batchId, buffer);
    }

    async getBatchesByOwner(ctx) {
        if (ctx.clientIdentity.getMSPID() === 'Org1MSP') {
            return await this.GetAllBatches(ctx)
        }
        const queryString = {
            selector: {
                owner: ctx.clientIdentity.getMSPID()
            }
        };
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        const allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {



                try {
                    allResults.push(JSON.parse(res.value.value.toString('utf8')));
                } catch (err) {
                    allResults.push(res.value.value.toString('utf8'));
                }


            }
            res = await iterator.next();
        }
        iterator.close();
        return allResults;


    }

    async addDistributorData(ctx, batchId, data) {

        if (ctx.clientIdentity.getMSPID() !== 'Org2MSP') {
            throw new Error('Unauthorized access: Only Distributor can perform this action !')
        }

        const batch = await this.getBatch(ctx, batchId)
        if (batch.owner !== 'Org2MSP') {
            throw new Error('Batch is not owned by the distributor !')
        }
        const newBatch = { ...batch, DistributorData: JSON.parse(data) }

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(newBatch)));
        return `${batchId} Updated successfully with distributor data`


    }

    async updateBatch(ctx, batchId, newData) {

        if (ctx.clientIdentity.getMSPID() === 'Org3MSP') {
            throw new Error('Unauthorized access')
        }
        const batch = await this.getBatch(batchId)
        if (ctx.clientIdentity.getMSPID() !== batch.owner) {
            throw new Error('Batch is not owned by the current invoker')
        }
        Object.assign(batch, newData);
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(newBatch)));
        return `${batchId} Updated successfully updated`

    }

    async deleteBatch(ctx, batchId) {
        if (ctx.clientIdentity.getMSPID() !== 'Org1MSP') {
            throw new Error('Unauthorized access: Only Manufacturer can perform this action !')
        }

        const batch = await this.getBatch(ctx, batchId)
        if (batch.owner !== 'Org1MSP') {
            throw new Error('Batch is not owned by the current invoker')
        }
        await ctx.stub.deleteState(batchId);
        return `${batchId} deleted successfully`
    }
}

module.exports = MyAssetContract;
