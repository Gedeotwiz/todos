import { Worker } from "bullmq";
import { OnModuleInit } from "@nestjs/common";


export class NotificationWork implements OnModuleInit{
    async onModuleInit() {
        const worker = new Worker(
            'notification',
            async (job)=>{
                if(job.name==='send_reminder'){
                    console.log(`Sending reminder for todo: ${job.data.todoId}`);
                }
            },
           {
             connection:{
                host:'127.0.0.1',
                port:6379
            }
           }
            
        );
       worker.on('completed',(job)=>{
          console.log(`Job ${job.id} completed`);
       });
       worker.on('failed',(job,err)=>{
         console.log(`job ${job.id} failed:${err.message}`)
       })
    }
}