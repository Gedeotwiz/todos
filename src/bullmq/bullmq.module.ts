import { Module,Global } from "@nestjs/common";
import { Queue } from "bullmq";
import { NotificationWork } from "./notification.work";


@Global()
@Module({
    providers:[
        {
            provide:'NOTIFICATION_QUEUE',
            useFactory:()=>{
                return new Queue('notification',{
                    connection:{
                        host:"127.0.0.1",
                        port:6379
                    }
                })
                
            }
        },
        NotificationWork
    ],
    exports:['NOTIFICATION_QUEUE']
})
export class BullmqModule{}
