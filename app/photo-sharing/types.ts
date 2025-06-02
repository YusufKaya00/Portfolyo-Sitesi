export interface Photo {
  id: string;
  url: string;
  description: string;
  userId: string;
  eventId?: string;
  tags: string[];
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  photoId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  createdAt: string;
} 