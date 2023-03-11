export interface CreateVendorDTO{
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export interface loginVendorDTO{
    email: string;
    password: string;
}

export interface vendorPayload {
    _id: string;
    email: string;
    name: string;
}

export interface editVendorDTO{
    name: string;
    foodType: [string];
    phone: string;
    address: string;
}