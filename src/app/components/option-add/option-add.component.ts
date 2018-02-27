import { Component, OnInit } from '@angular/core';
import { CommonServices } from '../../services/common.services';
import { OptionServices } from '../../services/option.services';

@Component({
    selector: 'app-option-add',
    templateUrl: './option-add.component.html',
    styleUrls: ['./option-add.component.scss'],
    providers: [CommonServices, OptionServices]
})
export class OptionAddComponent implements OnInit {

    txtName: String = '';
    txtKey: String = '';
    txtValue: String = '';

    constructor(private commonServices: CommonServices, private optionServices: OptionServices) { }

    ngOnInit() {
    }

    onSubmit(formValue) {
        this.optionServices.createOption(formValue)
            .then(response => console.log(response));
        this.commonServices.toastMessage(this.txtName + ' has been added!');
        this.txtName = '';
        this.txtKey = '';
        this.txtValue = '';
    }

}
