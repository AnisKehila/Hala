interface Dress {
  id: number;
  name: string;
  image: string;
  rent?: Rent[] | null;
}

interface RentPeriod {
  start: string;
  end: string;
}
interface Rent extends RentPeriod {
  id: number;
  rentPrice?: string;
  payedAmount?: string;
  payed?: boolean;
  person?: Person;
}
interface Person {
  name: string;
  phone: string;
  address?: string;
}
