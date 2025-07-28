import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSpinner, FaTrash, FaEye } from "react-icons/fa";
import { apiurl2 } from "../../../components/frontend/Http";
import Sidebar from "../../../components/backend/dashboard/Sidebar";
import Swal from "sweetalert2";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(apiurl2 + "bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This booking will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(apiurl2 + "bookings/" + id);
        setBookings((prev) => prev.filter((b) => b.id !== id));
        Swal.fire("Deleted!", "Booking has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete booking", "error");
      }
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  return (
    <main className="p-5">
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">All Bookings</h2>
          {loading ? (
            <div className="flex items-center gap-2">
              <FaSpinner className="animate-spin" />
              <span>Loading bookings...</span>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full table-auto border text-center text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">#</th>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Phone</th>
                    <th className="px-4 py-2 border">Address</th>
                    <th className="px-4 py-2 border">Service</th>
                    <th className="px-4 py-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No bookings found.
                      </td>
                    </tr>
                  )}
                  {bookings.map((booking, idx) => (
                    <tr key={booking.id}>
                      <td className="px-4 py-2 border">{idx + 1}</td>
                      <td className="px-4 py-2 border">{booking.name}</td>
                      <td className="px-4 py-2 border">{booking.phone}</td>
                      <td className="px-4 py-2 border">{booking.address}</td>
                      <td className="px-4 py-2 border">{booking.service_title || "N/A"}</td>
                      <td className="px-4 py-2 border">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openModal(booking)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                            title="Delete Booking"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal for booking details */}
          {showModal && selectedBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-red-500"
                >
                  ✖
                </button>
                <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
                <p><strong>Name:</strong> {selectedBooking.name}</p>
                <p><strong>Email:</strong> {selectedBooking.email}</p>
                <p><strong>Phone:</strong> {selectedBooking.phone}</p>
                <p><strong>Address:</strong> {selectedBooking.address}</p>
                <p><strong>Service:</strong> {selectedBooking.service_title || "N/A"}</p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedBooking.created_at).toLocaleString()}
                </p>
                {/* Add any other booking details here */}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Bookings;
