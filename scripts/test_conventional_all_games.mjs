/** Exact 242-case conventional matrix; optional bounded two-process execution. */
import {readFile,writeFile} from 'node:fs/promises';
import {runSuite,mergeReports} from './conventional-game-suite.mjs';
const args=process.argv.slice(2),output=args.find(a=>a.startsWith('--output='))?.slice(9);
for(const arg of args)if(arg.startsWith('--')&&!/^(--merge|--output=.+|--shard=\d+\/[12])$/.test(arg))throw Error(`Unsupported argument: ${arg}`);
const merging=args.includes('--merge');let result;
if(merging){const files=args.filter(a=>!a.startsWith('--'));result=mergeReports(await Promise.all(files.map(async path=>JSON.parse(await readFile(path,'utf8')))),{kind:'all',requireComplete:true});}
else{const shard=args.find(a=>a.startsWith('--shard='))?.slice(8)??'0/1';if(!/^\d+\/[12]$/.test(shard))throw Error('Use --shard=0/2 or --shard=1/2');const [shardIndex,shardCount]=shard.split('/').map(Number);result=await runSuite({kind:'all',shardIndex,shardCount});}
if(output)await writeFile(output,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
