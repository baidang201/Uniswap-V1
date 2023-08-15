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

    it("should allow user to add liquidity", async function(){
        const amountOfToken = ethers.utils.parseEther("100");

        await token.connect(user1).approve(exchange.address, amountOfToken);
        await exchange.connect(user1).addLiquidity(amountOfToken, { value: ethers.utils.parseEther("1") });

        const userLPTokenBalance = await exchange.balanceOf(user1.address);
        expect(userLPTokenBalance).to.not.equal(0);
    });

    it("should allow users to remove liquidity", async function () {
        const amountOfToken = ethers.utils.parseEther("100");
        const ethValue = ethers.utils.parseEther("1");
    
        await token.connect(user1).approve(exchange.address, amountOfToken);
        await exchange.connect(user1).addLiquidity(amountOfToken, { value: ethValue });
    
        const userLPTokenBalanceBefore = await exchange.balanceOf(user1.address);
    
        await exchange.connect(user1).removeLiquidity(userLPTokenBalanceBefore);
    
        const userLPTokenBalanceAfter = await exchange.balanceOf(user1.address);
        expect(userLPTokenBalanceAfter).to.equal(0);
    });

    it("should allow users to swap tokens for ETH", async function () {
        const amountOfToken = ethers.utils.parseEther("100");
    
        await token.connect(user1).approve(exchange.address, amountOfToken);
        await exchange.connect(user1).addLiquidity(amountOfToken, { value: ethers.utils.parseEther("1") });
    
        const tokenReserveBefore = await exchange.getReserve();
        const userEthBalanceBefore = await user2.getBalance();
    
        await exchange.connect(user2).tokenToEthSwap(amountOfToken, 0);
    
        const tokenReserveAfter = await exchange.getReserve();
        const userEthBalanceAfter = await user2.getBalance();
    
        expect(userEthBalanceAfter).to.be.above(userEthBalanceBefore);
        expect(tokenReserveAfter).to.be.below(tokenReserveBefore);
    });
});
     