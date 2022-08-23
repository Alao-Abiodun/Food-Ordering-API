import { vendorPayload } from './vendor.dto';
import { customerPayload } from './customer.dto';

export type authPayload = vendorPayload | customerPayload;