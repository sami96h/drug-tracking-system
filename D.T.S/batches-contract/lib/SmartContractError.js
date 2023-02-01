class SmartContractError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'Contract Error';
        this.status = status;
    }
}

module.exports = SmartContractError


/*

asset exists => 10
asset doesn't exist => 20





*/