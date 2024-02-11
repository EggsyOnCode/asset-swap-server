import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum AssetClass {
  CAR = 'car',
  PROPERTY = 'land',
}

export enum Province {
  PUNJAB = 'punjab',
  KPK = 'kpk',
  SINDH = 'sindh',
  BALOUCHISTAN = 'balochistan',
}

export enum Type {
  MANUAL = 'manual',
  AUTO = 'automatic',
}

export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  GAS = 'gas',
}

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: AssetClass, default: AssetClass.CAR })
  assetClass: AssetClass;

  @Column({ nullable: false })
  model: string;

  @Column()
  mileage: number;

  @Column()
  location: string;

  @Column({ type: 'enum', enum: Province })
  registeredProvince: Province;

  @Column()
  enginePower: string;

  @Column({ type: 'enum', enum: Type, default: Type.MANUAL })
  carType: Type;

  @Column({ type: 'date' })
  manufacturingDate: string;

  @Column({ type: 'enum', enum: FuelType, default: FuelType.PETROL })
  fuelType: FuelType;

  @Column()
  price: string;

  @Column({ nullable: true })
  imgUrl: string;
}
