import { beforeEach, expect, mock, test } from 'bun:test';
let result: any, calls: any[];
const names = ['acceptFriendRequest','declineFriendRequest','cancelFriendRequest','removeFriend'];
mock.module('../src/services/friends', () => ({default:Object.fromEntries(names.map(name=>[name,async (...args: any[])=>{calls.push({name,args});return result;}]))}));
mock.module('../src/models', () => ({db:{}}));
const controller = (await import('../src/controllers/friends.js')).default;
const id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const response=()=>({code:200,body:null as any,status(n:number){this.code=n;return this;},json(b:any){this.body=b;return this;},end(){return this;}});
beforeEach(()=>{calls=[];result={};});
test('missing, unauthorized and failed actions cannot return success envelopes',async()=>{
  for(const name of names){
    const res=response();
    await (controller as any)[name]({userId:'actor',params:{requestId:id,friendId:id}},res);
    expect(res.code).not.toBe(200); expect(res.body.count).toBe(0);
  }
});
test('successful mutations use authenticated identity and preserve response IDs',async()=>{
  for(const name of names){
    result=name==='removeFriend'?{id}:{requestId:id,status:name==='acceptFriendRequest'?'accepted':'done'};
    const res=response();
    await (controller as any)[name]({userId:'actor',params:{requestId:id,friendId:id},body:{userId:'victim'}},res);
    expect(calls.at(-1).args).toEqual(['actor',id]); expect(res.code).toBe(200); expect(res.body.data).toEqual(result);
    if(name==='cancelFriendRequest') expect(res.body.message).toBe('Friend Request Cancelled');
  }
});
