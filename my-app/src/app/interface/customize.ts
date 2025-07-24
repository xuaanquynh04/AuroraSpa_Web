export interface IOptions {
    value: string;
    name: string,
    addPrice: number
}

export interface ICustomize {
    _id: string;
    name: string;
    required: boolean;
    options: IOptions[];
    optionType: string;
    productTypeId: string;
    groupname: string
}

