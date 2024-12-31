import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, MapPin, Hotel, Bus, Plane, Train, Download, MessageCircle, Send, User, Bot, X } from 'lucide-react';

const IntegratedTravelPlatform = () => {
  // Shared state between main platform and chat
  const [activeSection, setActiveSection] = useState('transport');
  const [bookingDetails, setBookingDetails] = useState({
    transport: {
      type: '',
      from: '',
      to: '',
      date: '',
      passengers: ''
    },
    accommodation: {
      type: '',
      location: '',
      checkIn: '',
      checkOut: '',
      rooms: '',
      guests: ''
    },
    tourism: {
      attraction: '',
      date: '',
      tickets: ''
    }
  });

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! How can I help you with your travel plans today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enhanced response system with context awareness
  const getContextualResponse = (input, currentSection) => {
    const lowercaseInput = input.toLowerCase();
    
    // Section-specific responses
    const sectionResponses = {
      transport: {
        help: "I can help you book transport tickets. Would you like to search for trains, planes, or buses?",
        fillForm: `I notice you haven't filled in the ${getMissingTransportFields()}. Would you like help with that?`,
        suggest: "Based on popular routes, I can suggest some travel options. Would you like to see them?"
      },
      accommodation: {
        help: "I can help you find the perfect place to stay. Are you interested in hotels, lodges, or camps?",
        fillForm: `To complete your accommodation booking, I notice you need to fill in ${getMissingAccommodationFields()}`,
        suggest: "I can show you our top-rated accommodations in your desired location."
      },
      tourism: {
        help: "Looking to book tickets for tourist attractions? I can help you find the best spots!",
        suggest: "Would you like to see popular attractions at your destination?"
      },
      guide: {
        help: "Need travel guidance? I can provide tips about your destination.",
        suggest: "I can share local insights, safety tips, and cultural information."
      }
    };

    // Check for specific actions or questions
    if (lowercaseInput.includes('help')) {
      return sectionResponses[currentSection]?.help;
    } else if (lowercaseInput.includes('book')) {
      return sectionResponses[currentSection]?.fillForm;
    } else if (lowercaseInput.includes('suggest')) {
      return sectionResponses[currentSection]?.suggest;
    }

    // Default response based on current section
    return `I see you're in the ${currentSection} section. How can I assist you with ${currentSection}?`;
  };

  // Helper functions to check form completion
  const getMissingTransportFields = () => {
    const missing = [];
    if (!bookingDetails.transport.from) missing.push('departure location');
    if (!bookingDetails.transport.to) missing.push('destination');
    if (!bookingDetails.transport.date) missing.push('travel date');
    return missing.join(', ');
  };

  const getMissingAccommodationFields = () => {
    const missing = [];
    if (!bookingDetails.accommodation.location) missing.push('location');
    if (!bookingDetails.accommodation.checkIn) missing.push('check-in date');
    return missing.join(', ');
  };

  // Chat message handling
  const handleSend = () => {
    if (!inputText.trim()) return;

    setMessages(prev => [...prev, { type: 'user', text: inputText }]);
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const botResponse = getContextualResponse(inputText, activeSection);
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
      setIsLoading(false);
    }, 1000);

    setInputText('');
  };

  // Quick action handling
  const handleQuickAction = (action) => {
    switch (action) {
      case 'transport':
        setActiveSection('transport');
        break;
      case 'accommodation':
        setActiveSection('accommodation');
        break;
      case 'tourism':
        setActiveSection('tourism');
        break;
      default:
        break;
    }
  };

  // Chat component
  const ChatAssistant = () => (
    <div className="fixed bottom-4 right-4 w-96 z-50">
      {isChatOpen ? (
        <Card className="w-full shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Bot className="w-6 h-6" />
              Travel Assistant
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        <span className="text-xs font-semibold">{message.type === 'user' ? 'You' : 'Assistant'}</span>
                      </div>
                      {message.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 p-3 rounded-lg">Typing...</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleQuickAction('transport')}>
                  Book Transport
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickAction('accommodation')}>
                  Find Accommodation
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickAction('tourism')}>
                  Tourist Spots
                </Button>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button className="shadow-lg" onClick={() => setIsChatOpen(true)}>
          <MessageCircle className="h-6 w-6 mr-2" />
          Chat with Assistant
        </Button>
      )}
    </div>
  );

  // Main content components (Transport, Accommodation, etc.)
  const TransportBooking = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Transport Booking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setBookingDetails({
                ...bookingDetails,
                transport: { ...bookingDetails.transport, type: 'train' }
              })}
            >
              <Train className="h-5 w-5" /> Train
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setBookingDetails({
                ...bookingDetails,
                transport: { ...bookingDetails.transport, type: 'plane' }
              })}
            >
              <Plane className="h-5 w-5" /> Flight
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setBookingDetails({
                ...bookingDetails,
                transport: { ...bookingDetails.transport, type: 'bus' }
              })}
            >
              <Bus className="h-5 w-5" /> Bus
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="From"
              value={bookingDetails.transport.from}
              onChange={(e) => setBookingDetails({
                ...bookingDetails,
                transport: { ...bookingDetails.transport, from: e.target.value }
              })}
            />
            <Input
              placeholder="To"
              value={bookingDetails.transport.to}
              onChange={(e) => setBookingDetails({
                ...bookingDetails,
                transport: { ...bookingDetails.transport, to: e.target.value }
              })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              value={bookingDetails.transport.date}
              onChange={(e) => setBookingDetails({
                ...bookingDetails,
                transport: { ...bookingDetails.transport, date: e.target.value }
              })}
            />
            <Input
              type="number"
              placeholder="Number of passengers"
              value={bookingDetails.transport.passengers}
              onChange={(e) => setBookingDetails({
                ...bookingDetails,
                transport: { ...bookingDetails.transport, passengers: e.target.value }
              })}
            />
          </div>
          <Button className="w-full">Search Transport</Button>
        </div>
      </CardContent>
    </Card>
  );

  // Main layout
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-2">Travel Booking Platform</h1>
          <p className="text-gray-600">Your one-stop solution for all travel needs</p>
        </header>

        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
            <TabsTrigger value="transport">Transport</TabsTrigger>
            <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
            <TabsTrigger value="guide">Travel Guide</TabsTrigger>
            <TabsTrigger value="tourism">Tourism</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>

          <TabsContent value="transport">
            <TransportBooking />
          </TabsContent>
          {/* Add other TabsContent components similarly */}
        </Tabs>

        <ChatAssistant />
      </div>
    </div>
  );
};

export default IntegratedTravelPlatform;