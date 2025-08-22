import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

export default class JwtGuard extends AuthGuard("jwt"){
    constructor(){
        super()
    }
}