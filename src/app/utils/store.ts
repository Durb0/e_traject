import {Subject, BehaviorSubject} from "rxjs";
import {Car} from "../model/car";

export var distanceSubject = new Subject<number>();
export var selectedCar = new Subject<Car>();
