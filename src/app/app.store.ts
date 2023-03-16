import {Subject, BehaviorSubject} from "rxjs";
import {CarModel} from "./modules/car/car.model";

export var distanceSubject = new Subject<number>();
export var selectedCar = new Subject<CarModel>();
