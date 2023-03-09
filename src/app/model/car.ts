export interface Car {
  id: number;
  naming: {
    make: string;
    model: string;
    version: string;
  };
  recharge_time:number;
  range: number;
  image_url: string;
  thumbnail_url: string;
}
