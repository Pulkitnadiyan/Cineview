import React, { useState, useEffect } from 'react';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { useGetNewMoviesQuery, useGetTopMoviesQuery, useGetRandomMoviesQuery, useGetMoviesByMoodQuery,useGetAllMoviesQuery, movieApislice } from '../redux/api/movies';

const Chatbot = ({ isOpen, toggleChatbot }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const { data: newMovies, isLoading: loadingNewMovies } = useGetNewMoviesQuery();
    const { data: topMovies, isLoading: loadingTopMovies } = useGetTopMoviesQuery();
    const { data: randomMovies, isLoading: loadingRandomMovies } = useGetRandomMoviesQuery();
    const { data: allMovies, isLoading: loadingAllMovies } = useGetAllMoviesQuery();

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ sender: 'bot', text: "Hello! I'm your movie assistant. How can I help you today? You can ask me about 'latest movies', 'top rated movies', or 'suggest a movie'." }]);
        }
    }, [isOpen, messages.length]);

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');

        let botResponse = { sender: 'bot', text: "I'm not sure how to respond to that. Please try asking about 'latest movies', 'top rated movies', or 'suggest a movie'." };

        const lowerCaseInput = input.toLowerCase();

        if (lowerCaseInput.includes('latest movies')) {
            if (loadingNewMovies) {
                botResponse.text = "Fetching the latest movies...";
            } else if (newMovies && newMovies.length > 0) {
                const movieTitles = newMovies.map(movie => movie.name).join(', ');
                botResponse.text = `Here are some of the latest movies: ${movieTitles}.`;
            } else {
                botResponse.text = "Sorry, I couldn't find any latest movies at the moment.";
            }
        } else if (lowerCaseInput.includes('top rated movies')) {
            if (loadingTopMovies) {
                botResponse.text = "Fetching top rated movies...";
            } else if (topMovies && topMovies.length > 0) {
                const movieTitles = topMovies.map(movie => movie.name).join(', ');
                botResponse.text = `Here are some top rated movies: ${movieTitles}.`;
            } else {
                botResponse.text = "Sorry, I couldn't find any top rated movies at the moment.";
            }
        } else if (lowerCaseInput.includes('suggest a movie') || lowerCaseInput.includes('random')) {
            if (loadingRandomMovies) {
                botResponse.text = "Thinking of a movie suggestion for you...";
            } else if (randomMovies && randomMovies.length > 0) {
                const movieTitles = randomMovies.map(movie => movie.name).join(', ');
                botResponse.text = `How about these movies: ${movieTitles}.`;
            } else {
                botResponse.text = "Sorry, I couldn't suggest any movies right now.";
            }
        } else if (lowerCaseInput.includes('movies for') && lowerCaseInput.includes('mood')) {
            const moodMatch = lowerCaseInput.match(/for a (.*) mood/);
            if (moodMatch && moodMatch[1]) {
                const moodName = moodMatch[1].trim();
                const { data: moodMovies, isLoading: loadingMoodMovies, error: moodError } = await movieApislice.endpoints.getMoviesByMood.initiate(moodName);

                if (loadingMoodMovies) {
                    botResponse.text = `Looking for movies for a ${moodName} mood...`;
                } else if (moodError) {
                    botResponse.text = `Sorry, I couldn't find any movies for a ${moodName} mood. Please try another mood.`;
                } else if (moodMovies && moodMovies.length > 0) {
                    const movieTitles = moodMovies.map(movie => movie.name).join(', ');
                    botResponse.text = `Here are some movies for a ${moodName} mood: ${movieTitles}.`;
                } else {
                    botResponse.text = `Sorry, I couldn't find any movies for a ${moodName} mood.`;
                }
            } else {
                botResponse.text = "Please specify the mood, e.g., 'movies for a happy mood'.";
            }

        }
        else if (lowerCaseInput.includes('movies')) {
            // Simple heuristic: if they ask for "[Genre] movies" (e.g. Action movies)
            const words = lowerCaseInput.split(' ');
            const genreIndex = words.indexOf('movies') - 1;
            
            if (genreIndex >= 0) {
                const genreName = words[genreIndex];
                // Skip keywords like "latest", "new", "top" to avoid conflicts
                if (!['latest', 'new', 'top', 'best', 'rated'].includes(genreName)) {
                     const { data: genreMovies, error: genreError } = await movieApislice.endpoints.getMoviesByGenre.initiate(genreName);
                     
                     if (genreMovies && genreMovies.length > 0) {
                         const movieTitles = genreMovies.map(movie => movie.name).join(', ');
                         botResponse.text = `Here are some ${genreName} movies: ${movieTitles}.`;
                     } else {
                         botResponse.text = `I couldn't find any movies in the '${genreName}' genre.`;
                     }
                }
            }
        
        // 6. Search specific movie (New Feature)
        } else if (lowerCaseInput.includes('search for') || lowerCaseInput.includes('find')) {
            const searchTerm = lowerCaseInput.replace('search for', '').replace('find', '').trim();
            
            if (searchTerm && allMovies) {
                const foundMovies = allMovies.filter(movie => 
                    movie.name.toLowerCase().includes(searchTerm)
                );

                if (foundMovies.length > 0) {
                    const movieTitles = foundMovies.map(movie => movie.name).join(', ');
                    botResponse.text = `I found these movies matching "${searchTerm}": ${movieTitles}.`;
                } else {
                    botResponse.text = `I couldn't find any movie named "${searchTerm}".`;
                }
            } else {
                botResponse.text = "Please provide a movie name to search.";
            }
        }

        setTimeout(() => {
            setMessages((prevMessages) => [...prevMessages, botResponse]);
        }, 500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chatbot Window */}
            {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-80 h-96 bg-gray-900 rounded-lg shadow-xl flex flex-col border border-gray-700 z-50">
                    <div className="flex justify-between items-center p-3 bg-gray-800 border-b border-gray-700 rounded-t-lg">
                        <h3 className="text-white text-lg font-semibold">Movie Bot</h3>
                        <button onClick={toggleChatbot} className="text-gray-400 hover:text-white">
                            &times;
                        </button>
                    </div>
                    <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
                        {messages.map((msg, index) => (
                            <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                <span className={`inline-block p-2 rounded-lg ${
                                    msg.sender === 'user' ? 'bg-teal-600 text-white' : 'bg-gray-700 text-white'
                                }`}>
                                    {msg.text}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t border-gray-700 flex">
                        <input
                            type="text"
                            className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-l-lg p-2 focus:outline-none focus:border-teal-500"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-teal-600 text-white rounded-r-lg px-4 py-2 hover:bg-teal-700 transition-colors duration-200"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
