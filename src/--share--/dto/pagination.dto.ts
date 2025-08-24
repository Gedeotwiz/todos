import { IPage } from "../interface/paginatio.interface";
import { Pagination } from "nestjs-typeorm-paginate";
import { ApiProperty } from "@nestjs/swagger";
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';


export class PaginationDto {
  @IsOptional()
   @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;


   @ApiPropertyOptional({ description: 'User per page', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size: number = 10;
}

export class PageResponseDto<T> implements IPage<T> {
  @ApiProperty({ type: [Object] })
  items: T[];
  totalItems?: number;
  itemCount?: number;
  itemsPerPage?: number;
  totalPages?: number;
  currentPage?: number;

  constructor(paginatedResult: Pagination<T>) {
    this.items = paginatedResult.items;
    this.totalItems = paginatedResult.meta.totalItems || 0;
    this.itemCount = paginatedResult.meta.itemCount || 0;
    this.itemsPerPage = paginatedResult.meta.itemsPerPage || 0;
    this.totalPages = paginatedResult.meta.totalPages || 0;
    this.currentPage = paginatedResult.meta.currentPage || 0;
  }
}
