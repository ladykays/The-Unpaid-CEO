export const PORT = process.env.PORT || 3000;
export const POSTS_FILE = 'posts.json';
export const CONTACT_FILE = 'contact.json';
export const SUBSCRIPTION_FILE = 'subscriptions.json';
export const RESOURCES_FILE = 'resources.json';
export const WORDS_PER_MINUTE = 200; // Average reading speed
export const DEFAULT_POSTS = [
  {
    title: 'First Post',
    image: '../public/images/default.jpg',
    content: 'This is the content of the first post.',
    createdAt: new Date(),
  },
  {
    title: 'Second Post',
    content: 'This is the content of the second post.',
    createdAt: new Date(),
  },
];