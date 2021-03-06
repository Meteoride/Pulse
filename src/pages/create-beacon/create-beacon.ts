import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { HomePage } from '../home/home';
import { BeaconService } from './create-beacon.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var google;

@Component({
  selector: 'page-create-beacon',
  templateUrl: 'create-beacon.html',
  providers: [BeaconService]
})
export class CreateBeaconPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  public beaconForm: FormGroup;
  public categoryChoice;
  public currentLocation = true;
  public addressType = "Using Current Location";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: BeaconService, public formBuilder: FormBuilder) {
      this.beaconForm = formBuilder.group({
      title: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      details: ['', Validators.compose([Validators.maxLength(255), Validators.required])],
      address: ['', Validators.compose([Validators.maxLength(50), Validators.required])]
    })
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateBeaconPage');
    this.currentLocation = true;
    this.addressType = 'Using Current Location';
  }

  toggleLocationType() {
    if (this.currentLocation){
      this.addressType = "Input Address";
      this.currentLocation = false;
    } else if (!this.currentLocation) {
      this.addressType = "Using Current Location";
      this.currentLocation = true;
    };
    console.log(this.currentLocation)
  }

  createBeacon(beaconInfo){

    let categoryOptions = {
      Active: 1,
      Learn: 2,
      Community: 3,
      Music: 4,
      Eat: 5,
      Travel: 6,
      Art: 7,
      Games: 8,
      Featured: 9,
      Other: 10
    }



    console.log(this.categoryChoice)
    if (!this.categoryChoice) {
      this.categoryChoice = 'Other'
    }
    beaconInfo.categoryType = this.categoryChoice;

    
    //if using current address, set to current address
    //otherwise, beaconInfo.address = form specified address
    beaconInfo.usingCurrentLocation = this.currentLocation;
    
    if (beaconInfo.usingCurrentLocation){
      beaconInfo.address = localStorage.getItem('currentAddress');
      beaconInfo.position = localStorage.getItem('currentLocation');
    } 

    
    this.httpService.beaconPost(beaconInfo)
        .subscribe(data => {
          console.log("Beacons have categories now")
        })

    this.navCtrl.setRoot(HomePage); //switch this to load the page everytime if async happens

    }
}
