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
        
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy();
        await token.deploymentTransaction().wait();
        
        const Exchange = await ethers.getContractFactory("Exchange");
        exchange = await Exchange.deploy(token.target);
        await exchange.deploymentTransaction().wait();
        
        // 从owner向user1转移200个代币用于测试
        await token.connect(owner).transfer(user1.address, ethers.parseEther("200"));
        
        // 如果后续测试中user2也需要代币，也要转移给user2
        await token.connect(owner).transfer(user2.address, ethers.parseEther("200"));
    });

    it("should deploy with correct initializaton state", async function(){
        expect(await exchange.tokenAddress()).to.equal(token.target);
        expect(await exchange.name()).to.equal("ETH TOKEN LP Token");
        expect(await exchange.symbol()).to.equal("lpETHTOKEN");
    });

    it("should allow user to add liquidity", async function(){
        const amountOfToken = ethers.parseEther("100");

        await token.connect(user1).approve(exchange.target, amountOfToken);
        await exchange.connect(user1).addLiquidity(amountOfToken, { value: ethers.parseEther("1") });

        const userLPTokenBalance = await exchange.balanceOf(user1.address);
        expect(userLPTokenBalance).to.not.equal(0);
    });

    it("should allow users to remove liquidity", async function () {
        const amountOfToken = ethers.parseEther("100");
        const ethValue = ethers.parseEther("1");
    
        await token.connect(user1).approve(exchange.target, amountOfToken);
        await exchange.connect(user1).addLiquidity(amountOfToken, { value: ethValue });
    
        const userLPTokenBalanceBefore = await exchange.balanceOf(user1.address);
    
        await exchange.connect(user1).removeLiquidity(userLPTokenBalanceBefore);
    
        const userLPTokenBalanceAfter = await exchange.balanceOf(user1.address);
        expect(userLPTokenBalanceAfter).to.equal(0);
    });

    it("should allow users to swap tokens for ETH", async function () {
        const amountOfToken = ethers.parseEther("100");
    
        await token.connect(user1).approve(exchange.target, amountOfToken);
        await exchange.connect(user1).addLiquidity(amountOfToken, { value: ethers.parseEther("1") });
    
        const tokenReserveBefore = await exchange.getReserve();
        
        const userEthBalanceBefore = await ethers.provider.getBalance(user2.address);
        
        await token.connect(user2).approve(exchange.target, amountOfToken);
        await exchange.connect(user2).tokenToEthSwap(amountOfToken, 0);
    
        const tokenReserveAfter = await exchange.getReserve();
        
        const userEthBalanceAfter = await ethers.provider.getBalance(user2.address);
    
        expect(userEthBalanceAfter).to.be.above(userEthBalanceBefore);
        expect(tokenReserveAfter).to.be.above(tokenReserveBefore);
    });
});
     