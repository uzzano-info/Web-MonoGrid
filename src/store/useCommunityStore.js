import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCommunityStore = create(
    persist(
        (set, get) => ({
            posts: [
                {
                    id: '1',
                    author: 'MonoGrid Team',
                    content: 'Welcome to the Community Board! Share your feedback, feature requests, or just say hi.',
                    likes: 10,
                    timestamp: Date.now(),
                    isOfficial: true,
                }
            ],

            addPost: (content) => set((state) => ({
                posts: [
                    {
                        id: Date.now().toString(),
                        author: 'User', // Placeholder for now
                        content,
                        likes: 0,
                        timestamp: Date.now(),
                        isOfficial: false,
                    },
                    ...state.posts
                ]
            })),

            likePost: (id) => set((state) => ({
                posts: state.posts.map(post =>
                    post.id === id ? { ...post, likes: post.likes + 1 } : post
                )
            })),

            deletePost: (id) => set((state) => ({
                posts: state.posts.filter(post => post.id !== id)
            }))
        }),
        {
            name: 'monogrid-community-storage',
        }
    )
);

export default useCommunityStore;
