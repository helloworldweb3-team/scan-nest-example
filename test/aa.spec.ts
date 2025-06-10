
import {Web3} from "web3";
class UserLoginDto {
    time:number;
    address:string;
    sign:string
}


describe("adfs",()=>{
    it("fdsfsd",async ()=>{
        const web3= new Web3(new Web3.providers.HttpProvider("https://bsc-mainnet.core.chainstack.com/9542db0e3adc573f6992e21a955903fc"));
        const seller = web3.eth.accounts.privateKeyToAccount('0x41a11e68be07f2b81dbb3413804d57c2051d700ed1a8d669b65ca0f26c16b57a');
        const loginDto = new UserLoginDto();
        loginDto.time = new Date().getTime();
        loginDto.address = seller.address;
        // "You are login Evo. wallet:%s,\n Timestamp:%s"
        const res = seller.sign(
            `You are login Evo. wallet:${loginDto.address},\n Timestamp:${loginDto.time}`);
        loginDto.sign = res.signature;
        console.log(loginDto);
        // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOjEsInJuU3RyIjoiVzBUVmQzY3l5aHhlelo2UEM4Y1Z0amlPTkpwOTZMVncifQ.W5xRfkKlH4CvbJl39jnQaGS7WjxuA-dF3cW7MTej-do
        // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOjEsInJuU3RyIjoidFR0Wmx3Z1pUMGhCN3ZIVVFvTGVVTFM1SGZuY0FTcXUifQ.xCBi2xQEzHfFX7IFmCP7x9JLYN4MZfqw3tc5R7VsPBA
        // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOjMsInJuU3RyIjoiWU11aEhjcDZ1N3hvWGJtMW9CVEd4NU9Fc3RQbXdrZVAifQ.SZHI97UBEaPcvJn7Vwr7h1tBMXjYRdHokFDe2l4tpcY
        // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOjQsInJuU3RyIjoiUkJOa3VoaHo1S3ZMd2ZzWEFNRmFuTHE1QWYzcTVKNjUifQ.VHLg08J_RI1384EVXx-oGBq8p16na_750Pu49lnuQpw
    })
    it('should fdsfsd', () => {
        const web3= new Web3(new Web3.providers.HttpProvider("https://bsc-mainnet.core.chainstack.com/9542db0e3adc573f6992e21a955903fc"));
        const seller = web3.eth.accounts.create();
        const loginDto = new UserLoginDto();
        loginDto.time = new Date().getTime();
        loginDto.address = seller.address;
        // "You are login Evo. wallet:%s,\n Timestamp:%s"
        const res = seller.sign(
            `You are login Evo. wallet:${loginDto.address},\n Timestamp:${loginDto.time}`);
        loginDto.sign = res.signature;
        console.log(loginDto);
    });
})