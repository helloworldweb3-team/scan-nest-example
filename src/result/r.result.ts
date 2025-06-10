
import {ApiProperty} from '@nestjs/swagger';


export class RResult {
  @ApiProperty()
  data: any;
  @ApiProperty()
  code: number;
  @ApiProperty()
  message: string;

  public constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }
  public  setMessage(message:string):RResult {
    this.message = message;
    return this
  }
  public setData(data:any):RResult {
    this.data = data;
    return this
  }
}

export class ResultStatus {



  SUCCESS = new RResult(2000, 'Success');



  FAIL = new RResult(4000, 'Fail');

  SIGN_FAIL = new RResult(4010, 'Sign Fail');

  UNAUTHORIZED = new RResult(4011, 'Unauthorized');

  WRONG_2FA = new RResult(4012, 'Wrong 2fa');

  BAN = new RResult(4013,"User Been Ban");
  NO_AUTH = new RResult(4014,"No Auth");

  SIGN_EXPIRED = new RResult(4019, 'Sign Expired');


  SIGN_TIME_LARGE = new RResult(4020, 'Sign Time Greater Than Current Time');

  TOKEN_EXPIRED = new RResult(4021,"Token Expired")


  NOT_FOUND = new RResult(4040, 'Not Found');
  INVALID_PARAMETER = new RResult(4020, 'Invalid Parameter');


  RESOURCE_NOT_FOUND = new RResult(4400, 'Resource Not Found');
  RESOURCE_EXIST = new RResult(4401,"Resource Exist")
  UPLOAD_FAIL = new RResult(4402,"Upload Fail, Retry")
  RESOURCE_BAN=new RResult(4403,"Resource Ban")
  DATABASE_ERROR = new RResult(4404,"Datasource Error")
  NETWORK_ERROR = new RResult(4405,"Network Error")

  NOT_NFT_CONTRACT = new RResult(4411,"Provide Contract Not Nft Contract")
  NOT_NFT_ERC721 = new RResult(4412,"Provide NFT Not ERC721")


  UNAUTHORIZED_TO_CONTRACT = new RResult(4501,"User Not Auth to Contract")
  NFT_CONTRACT_ERROR = new RResult(4502,"NFT Not Auth,Check Impl 721")
  SELL_ONLY_ONE = new RResult(4503,"User Only One Sell")
  BUY_ONLY_ONE = new RResult(4503,"User Only One Buy Pending Order, Cancel Before")
}
