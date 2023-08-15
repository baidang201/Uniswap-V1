const {expect} = require ("chai");
const {ethers} = require ("hardhat");

describe("Exchange", function (){
    let exchange;
    let token;
    let owner;
    let user1;
    let user2;

    beforeEach(async function(){
        [owner,user1,user2] = await ethers.getSigners();
        
        const ERC20Token = await ethers.getContractFactory("Token");
        token = await ERC20Token.deploy("Token", "TKN");
        await token.deploy();

        const Exchange = await ethers.getContractFactory("Exchange");
        exchange = await Exchange.deploy(token.address);
        await exchange.deploy();
    });

    it("should deploy with correct initializaton state", async function(){
        expect(await exchange.tokenAddress()).to.equal(token.address);
        expect(await exchange.name()).to.equal("Token");
        expect(await exchange.symbol()).to.equal("TKN");
    });
    
})