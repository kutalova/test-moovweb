import {Component, OnInit} from '@angular/core';
import {Validators, FormGroup, FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

export class City {
    constructor(public post_code, public country, public state_abbreviation, public place_name) {
        this.post_code = post_code;
        this.country = country;
        this.state_abbreviation = state_abbreviation;
        this.place_name = place_name;
    }

}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    zipForm: FormGroup;
    cities = [];
    city;
    errMessage;
    selected: Array<boolean> = [];

    constructor(private httpClient: HttpClient) {
    }

    ngOnInit() {
        this.zipForm = new FormGroup({
            zipCode: new FormControl('', [Validators.required, Validators.pattern('\\d{5}')])
        });
    }

    public onSelect(i) {
            const active = this.selected[i];
        this.selected.fill(false);
        this.selected[i] = !active;
        this.zipForm.patchValue({
            zipCode: this.cities[i]['post_code'],

        });
    }

    public onSubmit() {
        if (this.zipForm.valid) {
            this.errMessage = '';
            this.httpClient.get<City>(
                'http://api.zippopotam.us/us/' + this.zipForm.value['zipCode'])
                .subscribe((data: any) => {
                        this.zipForm.reset();
                        if (!this.cities.find(city => city.post_code === data['post code']) &&
                            !this.cities.find(city => city.place_name === data['places'][0]['place name'])) {
                            this.city = new City(
                                data['post code'],
                                data['country'],
                                data['places'][0]['state abbreviation'],
                                data['places'][0]['place name'],
                            );
                            this.cities.push(this.city);
                            this.selected.fill(false);
                            this.errMessage = '';
                        } else {
                            this.selected.fill(false);
                            this.errMessage = 'Sorry, this zip code is already listed';
                        }


                    },
                    error => this.errMessage = 'Sorry, this zip code is not found',
                );
        } else {
            this.errMessage = 'Invalid data. Please make sure that your code consists of 5 digits.';
        }
    }

}

