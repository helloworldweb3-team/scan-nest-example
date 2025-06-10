import {RResult} from '../result/r.result';
import {BusinessException} from '../exception/business.exception';

export function assertTrue(bool:any,result:RResult){
  if (!bool){
    throw new BusinessException(result);
  }
}