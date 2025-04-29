'use client';

import { useState } from 'react';

// ✅ Shops + Items Data
const shops = [
  {
    id: 1,
    name: 'Rohit General Store',
    lat: 32.2726,
    lng: 76.3270,
    category: 'Grocery',
    items: [
      { id: '1a', name: 'Maggi', price: 15 },
      { id: '1b', name: 'Bread', price: 25 },
      { id: '1c', name: 'Milk', price: 30 },
    ],
  },
  {
    id: 2,
    name: 'Sharma Vegetable Mart',
    lat: 32.2700,
    lng: 76.3300,
    category: 'Fruits & Veggies',
    items: [
      { id: '2a', name: 'Tomatoes', price: 20 },
      { id: '2b', name: 'Onions', price: 25 },
      { id: '2c', name: 'Potatoes', price: 18 },
    ],
  },
];

// ✅ Distance Calculation Helper
const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

interface ShopItem {
  id: string;
  name: string;
  price: number;
}

interface Shop {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: string;
  items: ShopItem[];
}

export default function Home() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [orderSuccess, setOrderSuccess] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Location error:', error.message);
        alert(`Location Error: ${error.message}`);
      }
    );
  };

  const nearbyShops = location
    ? shops.filter((shop) => {
        const distance = getDistanceFromLatLonInKm(
          location.lat,
          location.lng,
          shop.lat,
          shop.lng
        );
        return distance <= 5;
      })
    : [];

  const handlePlaceOrder = () => {
    if (Object.keys(cart).length === 0) {
      alert('Your cart is empty! Please add items to your cart.');
      return;
    }
    setOrderSuccess(true);
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen py-8 px-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-[#F26522]">📍 Instant Essentials Delivery</h1>

      <button
        onClick={detectLocation}
        className="px-6 py-2 bg-[#F26522] text-white rounded-xl hover:bg-[#D45519] transition"
      >
        Detect My Location
      </button>

      {location && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">
            Latitude: {location.lat.toFixed(6)}
            <br />
            Longitude: {location.lng.toFixed(6)}
          </p>
        </div>
      )}

      {/* ✅ Nearby Shops List */}
      {location && (
        <div className="mt-8 w-full max-w-xl">
          <h2 className="text-xl font-semibold mb-4 text-[#F26522]">Nearby Shops (within 5 km):</h2>

          {nearbyShops.length === 0 ? (
            <p className="text-gray-500">No shops found near your location.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {nearbyShops.map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => setSelectedShop(shop)}
                  className="border rounded-xl p-4 bg-white shadow-sm cursor-pointer hover:shadow-md"
                >
                  <h3 className="text-lg font-bold text-[#333]">{shop.name}</h3>
                  <p className="text-sm text-gray-600">{shop.category}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ✅ Shop Items + Cart */}
      {selectedShop && (
        <div className="mt-10 w-full max-w-xl border-t pt-6">
          <h2 className="text-xl font-semibold mb-4 text-[#F26522]">
            🛍️ {selectedShop.name} - Items
          </h2>

          <div className="space-y-4">
            {selectedShop.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium text-[#333]">{item.name}</p>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCart((prev) => ({
                        ...prev,
                        [item.id]: Math.max((prev[item.id] || 0) - 1, 0),
                      }))
                    }
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    -
                  </button>
                  <span>{cart[item.id] || 0}</span>
                  <button
                    onClick={() =>
                      setCart((prev) => ({
                        ...prev,
                        [item.id]: (prev[item.id] || 0) + 1,
                      }))
                    }
                    className="px-2 py-1 bg-green-600 text-white rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Cart Summary */}
          <div className="mt-6 p-4 bg-gray-100 rounded-xl">
            <h3 className="font-semibold mb-2 text-[#F26522]">Cart Summary</h3>
            {Object.keys(cart).length === 0 ? (
              <p className="text-sm text-gray-500">No items in cart</p>
            ) : (
              <ul className="text-sm space-y-1">
                {selectedShop.items
                  .filter((item) => cart[item.id])
                  .map((item) => (
                    <li key={item.id}>
                      {item.name} × {cart[item.id]}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* ✅ Place Order Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handlePlaceOrder}
              className="px-6 py-3 bg-[#3BB54A] text-white rounded-xl hover:bg-[#2f9e3a] transition"
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      {/* ✅ Order Success Screen */}
      {orderSuccess && (
        <div className="mt-10 p-6 bg-white shadow-lg rounded-xl w-full max-w-xl text-center">
          <h2 className="text-3xl font-bold text-[#3BB54A]">🎉 Order Placed Successfully!</h2>
          <p className="mt-4 text-gray-700">Your order will be delivered shortly. Thank you for shopping with QuickBasket!</p>
        </div>
      )}
    </main>
  );
}
