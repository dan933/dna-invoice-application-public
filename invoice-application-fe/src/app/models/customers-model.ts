export interface Customer {
  firstName: string,
  lastName: string,
  companyName:string,
  phoneNumber: string,
  emailAddress:string,
  active:boolean
}

export interface EditCustomer {
  id:number
  firstName: string,
  lastName: string,
  companyName:string,
  phoneNumber: string,
  emailAddress:string,
  active:boolean
}
