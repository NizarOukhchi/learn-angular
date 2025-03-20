export type Home = {
  id?: number; // Optional as it will be auto-generated for new homes
  title: string; // Title of the home listing
  description: string; // Detailed description of the property
  city: string; // City where the property is located
  rooms: number; // Number of rooms in the property
  bathrooms: number; // Number of bathrooms in the property
  hasPool: boolean; // Whether the property has a pool
  picture: string; // URL to the picture of the property
  isFavorite?: boolean; // Whether the home is marked as a favorite
};
