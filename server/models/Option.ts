import { Schema, model, Document } from 'mongoose';
import { MongoError } from 'mongodb';

export interface IOption extends Document {
    name: String;
    key: String;
    value: String;
}

const optionSchema = new Schema({
    name: { type: String, required: true, trim: true },
    key: { type: String, required: true, trim: true, index: { unique: true } },
    value: { type: String, trim: true }
});

const OptionModel = model<IOption>( 'option', optionSchema );

export class Option extends OptionModel {

    static createOption( newOption: IOption | IOption[] ): Promise<IOption | MongoError> {
        return OptionModel.create( newOption )
            .then( ( results: IOption ) => results )
            .catch( ( error: MongoError ) => error );
    }

    static getOption() : Promise<IOption | IOption[] | MongoError> {
        return OptionModel.find()
            .then( ( result: IOption[] ) => result )
            .catch( ( error: MongoError) => error );
    }

    static updateOption(id: string, data: object): Promise<IOption | MongoError> {
        return OptionModel.findByIdAndUpdate(id, data, { new: true} )
            .then( ( result: IOption ) => result )
            .catch( ( error: MongoError ) => error );
    }
}