import * as process from 'node:process';

export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT, 10)
      : 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    password: process.env.REDIS_PASSWORD,
  },
  admin: {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    secret: process.env.TWO_FA,
  },
  eth: {
    httpUrl: process.env.ETH_RPC? process.env.ETH_RPC : 'https://rpc.juchain.org',
    wsUrl: process.env.ETH_WSS_RPC? process.env.ETH_WSS_RPC : 'https://rpc.juchain.org',
    wallet: process.env.WALLET,
    startBlock: process.env.START_BLOCK?Number(process.env.START_BLOCK):0,
    scanAddress: process.env.SCAN_ADDRESS?process.env.SCAN_ADDRESS.split(","):[]
  },
  server: {
    jwtSecret: process.env.JWT_SECRET?process.env.JWT_SECRET:"213jd9sjddjsapd",
    contractAddress:process.env.CONTRACT?process.env.CONTRACT:"0xEdE31Eee9388322865a35D32694830A09f603f58",
    // enableNftValidate:process.env.ENABLE_NFT_VALIDATE?Boolean(process.env.ENABLE_NFT_VALIDATE):false,
    enableNftValidate: false,
    exploreBaseUrl:process.env.EXPLORE_BASE_URL,
  },
  pinata:{
    gateway:process.env.PINATA_GATEWAY?process.env.PINATA_GATEWAY:"gateway.pinata.cloud",
    jwt: process.env.PINATA_JWT
  },
  cloudinary:{
    key:process.env.CLOUD_INARY_KEY,
    secret:process.env.CLOUD_INARY_SECRET
  }
});
