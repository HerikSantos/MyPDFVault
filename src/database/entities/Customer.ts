import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Customer {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;
}

export { Customer };
