import { Column, Entity, PrimaryColumn } from 'typeorm';

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
  @PrimaryColumn()
  id: number;

  @Column({ type: 'enum', enum: AssetClass, default: AssetClass.CAR })
  assetClass: AssetClass;

  @Column()
  mileage: number;

  @Column()
  location: string;

  @Column({ type: 'enum', enum: Province })
  registeredProvince: Province;

  @Column()
  enginePower: string;

  @Column({ type: 'enum', enum: Type })
  carType: Type;

  @Column({ type: 'date' })
  manufacturingDate: string;

  @Column({ type: 'enum', enum: FuelType, default: FuelType.PETROL })
  fuelType: FuelType;
}
