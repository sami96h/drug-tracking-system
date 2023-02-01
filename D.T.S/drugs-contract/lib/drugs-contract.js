'use strict';

const { Contract } = require('fabric-contract-api');


class MyAssetContract extends Contract {




    async init(ctx){
        const drugs = [

            {
                Name: 'VOLTAMOL',
                Company: 'Megapharm',
                Packing: 'Voltamol® Caplet: Box of 10 Caplets',
                Description: 'Analgesic, Anti-inflammatory & Antipyretic',
                Composition: `Paracetamol 500mg
                Diclofenac Sodium 50mg`,
                Indications: 'Voltamol® is indicated for the fast symptomatic relief of: Pain, antipyretic, headache, toothache, and inflammation in various conditions: Musculoskeletal and joints disorders such as rheumatoid arthritis, osteoarthritis, and ankylosing spondylitis; peri-articular disorders such as bursitis and tendinitis; soft tissue disorders such as sprains and strains, and other painful conditions such as renal colic, acute gout, dysmenorrhoea, migraine and following some surgical operations.',
                Dosage:
                     'Treatment should be continued according to physician\'s directions Adults & Children over 12 years old\': \'1 Caplet three times daily after meals.'
                ,
                'Side Effects': 'Although rare, the following may occur: Gastro intestinal upset, nausea, skin eruption or hyperglycemia.',
                Contraindications: 'This medicine is contraindicated if you suffer from gastric ulcer.\nHypersensitivity to any of the component.\nDrinking alcohol and smoking should be avoided while taking this medicine.\nDont use this medicine when you are pregnant or breastfeeding.',
                Storage: 'Store in a cool and dry place, away from the reach of children.\nPlease note the expiry date.\nDont store different medications in the same package.',
                Warnings:`Inform your physician if you are using any other medicines or if you ever had any unusual reaction to the components of Mygesic® caplets, or any substance concomitantly used during treatment.Pregnant women should consult their treating physician before using Mygesic® caplets. Do not take Mygesic caplets with additional antipyretics, analgesics, cold medicines or other Paracetamol/Orphenadrine containing products without consulting the physician or pharmacist. Mygesic caplets should be used with caution by patients suffering from tachycardia, coronary insufficiency or cardiac arrhythmias. Mygesic should be used with caution in patients with hepatic or renal dysfunction. If Mygesic is prescribed for prolonged use, periodic monitoring of blood, urine and liver function is recommended.
Administration of Mygesic caplets may impair alertness, therefore caution is required during driving or operating dangerous machines.
Physician and pharmacist are experts in the useful and harmful effects of this medicine, so carefully follow up physician's prescription and pharmacist's directions because this medicine affects your life.
Do not stop course of treatment with yourself or repeat medicine without prescription.
In case of accidental overdose or usage of medicine by children, inform your physician or pharmacist or take the patient and the medicines package immediately to the nearest hospital emergency room. Do not induce vomiting unless clearly instructed by physician.
In case you missed a dose, take it as soon as you remembered. If it was almost the time for the next dose, skip the missed dose and take your next dose at its time. DO NOT "double- up" the dose to catch up.
Avoid Poisoning: Make sure to check the label and the dose every time before take the medication.  Store this medication in a closed place away from the reach of children.
Do not take this medication in a dark place & Note the expiry date on the package. 
Do not store different medications in the same package.`
            },{
                Name: 'Voltamol-K',
                Company: 'Megapharm',
                Packing: 'Box of one strip contains 10 caplets.',
                Description: `Voltamol-K® Caplets
                Anti-inflammatory = Analgesic = Antipyretic`,
                Composition: `Each Voltamol-K® caplet contains:
                Active Ingredients:
                Paracetamol 500 mg
                Diclofenac Potassium 50 mg
                Inactive Ingredients: Avicel pH101, Croscarmellose, PVP-K25 & Sunset Yellow`,
                Indications: `Voltamol-K® is indicated for the fast symptomatic relief of:
                Pain, headache, toothache and inflammation in various conditions: Musculoskeletal and joints disorders such
                as rheumatoid arthritis, osteoarthritis and ankylosing spondylitis; peri-articular disorders such as bursitis and tendinitis; soft tissue disorders such as sprains and strains and other painful conditions such as renal colic, acute gout, dysmenorrhoea, migraine attacks and following some surgical operations.`,
                Dosage: 'Adults & Children Over 14 years old: One caplet of Voltamol-K® three times daily after meals.',
                'Side Effects': 'Although rare, the following may occur: Gastro intestinal upset, nausea, skin eruption or hyperglycemia.',
                Contraindications: `Voltamol-K® should not be used in the following cases:
                Hypersensetivity to Paracetamol, Diclofenac or any of the ingredients used in this medication.
                Pregnant women in the third trimester of pregnancy and lactating mothers.
                Active gastric or duodenal ulceration or gastrointestinal bleeding.
                Sever hepatic dysfunction or renal impairment.
                Diclofenac may rarely increase the risk of heart attack or stroke, so this medication should not be used in patients with heart failure or before/after heart bypass surgery.
                Respiratory system disorders like asthma.`,
                Storage: 'Store in a cool and dry place, away of the reach of children.',
                Warnings: `If you are pregnant in first or second trimesters of pregnancy, do not take this medication unless advised by your doctor.
                Dangerous to use the medical product out of the instructions, it affects your life.
                Doctors and pharmacists are experts in the useful and harmful effects of the medicine, so follow up carefully doctor’s prescription, uses and pharmacists orders when administering the medication.
                Do not stop period of treatment or repeat the medicine with yourself without doctor consulting.
                In case of accidental overdose or usage of medicine by children, inform your doctor or pharmacist or take the patient and the medicines package immediately to the nearest hospital emergency room.
                In case you missed a dose, take it as soon as you remembered. If it was almost the time for the next dose, skip the missed dose and take your next dose at its time.`

            }

        ];
        for(const drug of drugs){
            await ctx.stub.putState(drug.Name,Buffer.from(JSON.stringify(drug)));
        }

    }
    async drugExist(ctx, drugName) {
        const buffer = await ctx.stub.getState(drugName);
        return (!!buffer && buffer.length > 0);
    }
    async getDrug(ctx, drugName) {
        const exists = await this.drugExist(ctx, drugName);
        if (!exists) {
            throw new Error(`${drugName} does not exist`);
        }

        const buffer = await ctx.stub.getState(drugName);
        const drug = JSON.parse(buffer.toString());
        return drug;
    }

    async GetAllDrugs(ctx) {
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

    async createDrug(ctx,drugName,data){
        if (ctx.clientIdentity.getMSPID() !== 'Org1MSP') {
            throw new Error('Unauthorized access: Only Manufacturer can perform this action !');
        }

        const exists = await this.drugExist(drugName);
        if(exists){
            throw new Error('Drug already exists !');
        }
        await ctx.stub.putState(drugName, Buffer.from(data));
        return 'Drug added successfully';
    }
    async deleteDrug(ctx,drugName){
        if (ctx.clientIdentity.getMSPID() !== 'Org1MSP') {
            throw new Error('Unauthorized access: Only Manufacturer can perform this action !');
        }
        const exists = await this.drugExist(drugName);
        if(!exists){
            throw new Error('Drug does not exists !');
        }
        await ctx.stub.deleteState(drugName);
        return 'Drug deleted successfully';
    }
}

module.exports = MyAssetContract;
