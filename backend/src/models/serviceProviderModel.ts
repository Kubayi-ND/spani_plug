export interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  rating: number;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
}
