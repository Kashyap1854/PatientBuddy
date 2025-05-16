import { http } from 'msw';

// Define your API mocking handlers here
export const handlers = [
  // Example handler for authentication
  http.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        profilePicture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
      })
    );
  }),
  
  // Add more API mocks as needed
];