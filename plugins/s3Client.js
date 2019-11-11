import S3 from 'aws-sdk/clients/s3';

export const endpoint = process.env.S3_ENDPOINT;
export const accessKeyId = process.env.S3_ACCESSKEY_ID;
export const secretAccessKey =  process.env.S3_SECRET_ACCESSKEY;
export const region = process.env.S3_REGION;
export const bucket = process.env.S3_BUCKET;

const param = {
  endpoint: endpoint,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region
};

// TODO: 鍵とかを渡す方法を考える
//       1. 環境変数に保存しておく(今の実装)
//       2. CKMSとかに保存しておいて、サーバーサイドで参照して取ってきた情報をcontextに入れておく
//          https://qiita.com/KanyeEast/items/35171e70ed49d225fadf
const client = new S3(param);

export default client;
