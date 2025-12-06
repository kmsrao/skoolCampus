import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    getUserByRoleAndId(role: number, userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        photo: string;
        branchId: number;
    } | {
        name: string;
        photo: any;
        branch_id: any;
        email: any;
    }>;
}
